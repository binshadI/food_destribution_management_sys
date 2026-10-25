import type { Listing, ListingStatus } from "@/components/donor/types";
import { formatExpiry } from "@/components/donor/types";
import { query } from "@/lib/db";
import { runMatches } from "@/lib/matching";

type FoodItemRow = {
  food_id: number;
  title: string;
  category: "cooked" | "raw" | "packaged";
  quantity_servings: number;
  quantity_kg: string | number | null;
  expiry_datetime: string | Date;
  status: "available" | "matched" | "completed" | "expired";
  pickup_address: string;
  receiver_name: string | null;
  volunteer_name: string | null;
  task_status: "open" | "accepted" | "picked_up" | "delivered" | "cancelled" | null;
};

type InsertResult = { insertId: number; affectedRows: number };

const STATUS_FROM_DB: Record<FoodItemRow["status"], ListingStatus> = {
  available: "Available",
  matched: "Matched",
  completed: "Delivered",
  expired: "Expired",
};

const CATEGORY_FROM_DB: Record<FoodItemRow["category"], string> = {
  cooked: "Cooked",
  raw: "Raw",
  packaged: "Packaged",
};

const CATEGORY_TO_DB: Record<string, FoodItemRow["category"]> = {
  Cooked: "cooked",
  Raw: "raw",
  Packaged: "packaged",
};

function formatQuantity(
  servings: number,
  kg: string | number | null,
): string {
  const weight = kg === null ? 0 : Number(kg);
  if (weight > 0) return `${weight} kg`;
  return `${servings} servings`;
}

function toListing(row: FoodItemRow): Listing {
  const volunteerAccepted =
    row.task_status === "accepted" ||
    row.task_status === "picked_up" ||
    row.task_status === "delivered";

  return {
    id: `SS-${String(row.food_id).padStart(4, "0")}`,
    food: row.title,
    quantity: formatQuantity(row.quantity_servings, row.quantity_kg),
    expiry: formatExpiry(row.expiry_datetime),
    receiver: row.receiver_name ?? "Awaiting matching",
    volunteer: volunteerAccepted ? row.volunteer_name : null,
    status: STATUS_FROM_DB[row.status] ?? "Available",
    category: CATEGORY_FROM_DB[row.category] ?? "Cooked",
  };
}

const SELECT_ITEM = `
  SELECT f.food_id, f.title, f.category, f.quantity_servings, f.quantity_kg,
         f.expiry_datetime, f.status, f.pickup_address,
         COALESCE(rc.organization_name, ru.name) AS receiver_name,
         vu.name AS volunteer_name,
         p.status AS task_status
    FROM food_items f
    LEFT JOIN pickup_deliveries p
           ON p.food_id = f.food_id AND p.status <> 'cancelled'
    LEFT JOIN food_requests r ON r.request_id = p.request_id
    LEFT JOIN receivers rc ON rc.receiver_id = r.receiver_id
    LEFT JOIN users ru ON ru.user_id = rc.user_id
    LEFT JOIN volunteers v ON v.volunteer_id = p.volunteer_id
    LEFT JOIN users vu ON vu.user_id = v.user_id`;

export async function GET(request: Request) {
  const userId = Number(new URL(request.url).searchParams.get("userId"));

  if (!Number.isInteger(userId) || userId <= 0) {
    return Response.json({ error: "A valid userId is required." }, { status: 400 });
  }

  try {
    const rows = await query<FoodItemRow[]>(
      `${SELECT_ITEM}
       JOIN donors d ON d.donor_id = f.donor_id
       WHERE d.user_id = ?
       ORDER BY f.created_at DESC, f.food_id DESC`,
      [userId],
    );

    return Response.json({ listings: rows.map(toListing) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: `Could not load listings: ${message}` },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  const userId = Number(payload.userId);
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const categoryValue =
    typeof payload.category === "string" ? payload.category : "";
  const category = CATEGORY_TO_DB[categoryValue];
  const servings = Math.round(Number(payload.quantityServings));
  const kgValue =
    payload.quantityKg === null || payload.quantityKg === undefined
      ? null
      : Number(payload.quantityKg);
  const expiryDate =
    typeof payload.expiryDate === "string" ? payload.expiryDate : "";
  const expiryTime =
    typeof payload.expiryTime === "string" ? payload.expiryTime : "";
  const pickupAddress =
    typeof payload.pickupAddress === "string" ? payload.pickupAddress.trim() : "";
  const instructions =
    typeof payload.specialInstructions === "string"
      ? payload.specialInstructions.trim()
      : "";

  if (!Number.isInteger(userId) || userId <= 0) {
    return Response.json({ error: "A valid userId is required." }, { status: 400 });
  }
  if (!title) {
    return Response.json({ error: "Food item name is required." }, { status: 400 });
  }
  if (!category) {
    return Response.json(
      { error: "Category must be one of Cooked, Raw or Packaged." },
      { status: 400 },
    );
  }
  if (!Number.isFinite(servings) || servings <= 0) {
    return Response.json(
      { error: "Quantity must be greater than 0." },
      { status: 400 },
    );
  }
  if (!pickupAddress) {
    return Response.json(
      { error: "Pickup address is required." },
      { status: 400 },
    );
  }

  const expiry = new Date(`${expiryDate}T${expiryTime || "00:00"}:00`);
  if (Number.isNaN(expiry.getTime())) {
    return Response.json(
      { error: "A valid expiry date and time are required." },
      { status: 400 },
    );
  }

  try {
    const users = await query<
      { user_id: number; name: string; role: string }[]
    >("SELECT user_id, name, role FROM users WHERE user_id = ? LIMIT 1", [userId]);
    const user = users[0];

    if (!user) {
      return Response.json({ error: "Account not found." }, { status: 404 });
    }
    if (user.role !== "donor") {
      return Response.json(
        { error: "Only donor accounts can list surplus food." },
        { status: 403 },
      );
    }

    const existing = await query<{ donor_id: number }[]>(
      "SELECT donor_id FROM donors WHERE user_id = ? LIMIT 1",
      [userId],
    );
    const donorId =
      existing[0]?.donor_id ??
      (
        await query<InsertResult>(
          "INSERT INTO donors (user_id, organization_name) VALUES (?, ?)",
          [userId, user.name],
        )
      ).insertId;

    const quantityKg =
      kgValue !== null && Number.isFinite(kgValue) && kgValue > 0
        ? kgValue
        : null;

    const result = await query<InsertResult>(
      `INSERT INTO food_items
         (donor_id, title, category, quantity_servings, quantity_kg,
          expiry_datetime, pickup_address, special_instructions, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'available')`,
      [
        donorId,
        title,
        category,
        servings,
        quantityKg,
        expiry,
        pickupAddress,
        instructions || null,
      ],
    );

    await runMatches();

    const created = await query<FoodItemRow[]>(
      `${SELECT_ITEM} WHERE f.food_id = ? LIMIT 1`,
      [result.insertId],
    );

    return Response.json({ listing: toListing(created[0]) }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: `Could not save listing: ${message}` },
      { status: 500 },
    );
  }
}
