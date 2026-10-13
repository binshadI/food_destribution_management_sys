import type {
  FoodRequest,
  RequestCategory,
  RequestStatus,
  Urgency,
} from "@/components/receiver/types";
import { formatNeededByDate } from "@/components/receiver/types";
import { query } from "@/lib/db";

type FoodRequestRow = {
  request_id: number;
  title: string;
  category: "cooked" | "raw" | "packaged";
  quantity_servings: number;
  needed_by_datetime: string | Date;
  urgency: "low" | "normal" | "high";
  delivery_area: string;
  notes: string | null;
  status: "pending" | "matched" | "ready" | "received";
  donor_name: string | null;
};

type InsertResult = { insertId: number; affectedRows: number };

const CATEGORY_FROM_DB: Record<FoodRequestRow["category"], RequestCategory> = {
  cooked: "Cooked",
  raw: "Raw",
  packaged: "Packaged",
};

const CATEGORY_TO_DB: Record<RequestCategory, FoodRequestRow["category"]> = {
  Cooked: "cooked",
  Raw: "raw",
  Packaged: "packaged",
};

const URGENCY_FROM_DB: Record<FoodRequestRow["urgency"], Urgency> = {
  low: "Low",
  normal: "Normal",
  high: "High",
};

const URGENCY_TO_DB: Record<Urgency, FoodRequestRow["urgency"]> = {
  Low: "low",
  Normal: "normal",
  High: "high",
};

const STATUS_FROM_DB: Record<FoodRequestRow["status"], RequestStatus> = {
  pending: "Pending",
  matched: "Matched",
  ready: "Ready",
  received: "Received",
};

function toFoodRequest(row: FoodRequestRow): FoodRequest {
  return {
    id: `SS-RQ-${String(row.request_id).padStart(4, "0")}`,
    food: row.title,
    category: CATEGORY_FROM_DB[row.category] ?? "Cooked",
    servings: row.quantity_servings,
    neededBy: formatNeededByDate(row.needed_by_datetime),
    urgency: URGENCY_FROM_DB[row.urgency] ?? "Normal",
    area: row.delivery_area,
    status: STATUS_FROM_DB[row.status] ?? "Pending",
    donor: row.donor_name ?? "Awaiting match",
    note: row.notes ?? undefined,
  };
}

export async function GET(request: Request) {
  const userId = Number(new URL(request.url).searchParams.get("userId"));

  if (!Number.isInteger(userId) || userId <= 0) {
    return Response.json({ error: "A valid userId is required." }, { status: 400 });
  }

  try {
    const rows = await query<FoodRequestRow[]>(
      `SELECT r.request_id, r.title, r.category, r.quantity_servings,
              r.needed_by_datetime, r.urgency, r.delivery_area, r.notes,
              r.status, u.name AS donor_name
         FROM food_requests r
         JOIN receivers rc ON rc.receiver_id = r.receiver_id
         LEFT JOIN donors d ON d.donor_id = r.donor_id
         LEFT JOIN users u ON u.user_id = d.user_id
        WHERE rc.user_id = ?
        ORDER BY r.created_at DESC, r.request_id DESC`,
      [userId],
    );

    return Response.json({ requests: rows.map(toFoodRequest) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: `Could not load requests: ${message}` },
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
  const category = CATEGORY_TO_DB[categoryValue as RequestCategory];
  const servings = Math.round(Number(payload.quantityServings));
  const urgencyValue =
    typeof payload.urgency === "string" ? payload.urgency : "";
  const urgency = URGENCY_TO_DB[urgencyValue as Urgency];
  const deliveryArea =
    typeof payload.deliveryArea === "string" ? payload.deliveryArea.trim() : "";
  const notes =
    typeof payload.notes === "string" ? payload.notes.trim() : "";
  const neededDate =
    typeof payload.neededByDate === "string" ? payload.neededByDate : "";
  const neededTime =
    typeof payload.neededByTime === "string" ? payload.neededByTime : "";

  if (!Number.isInteger(userId) || userId <= 0) {
    return Response.json({ error: "A valid userId is required." }, { status: 400 });
  }
  if (!title) {
    return Response.json({ error: "Food request name is required." }, { status: 400 });
  }
  if (!category) {
    return Response.json(
      { error: "Category must be one of Cooked, Raw or Packaged." },
      { status: 400 },
    );
  }
  if (!Number.isFinite(servings) || servings <= 0) {
    return Response.json(
      { error: "Servings must be greater than 0." },
      { status: 400 },
    );
  }
  if (!deliveryArea) {
    return Response.json(
      { error: "Delivery area is required." },
      { status: 400 },
    );
  }

  const neededBy = new Date(`${neededDate}T${neededTime || "00:00"}:00`);
  if (Number.isNaN(neededBy.getTime())) {
    return Response.json(
      { error: "A valid needed-by date is required." },
      { status: 400 },
    );
  }

  try {
    const users = await query<{ user_id: number; name: string; role: string }[]>(
      "SELECT user_id, name, role FROM users WHERE user_id = ? LIMIT 1",
      [userId],
    );
    const user = users[0];

    if (!user) {
      return Response.json({ error: "Account not found." }, { status: 404 });
    }
    if (user.role !== "receiver") {
      return Response.json(
        { error: "Only receiver accounts can post food requests." },
        { status: 403 },
      );
    }

    const existing = await query<{ receiver_id: number }[]>(
      "SELECT receiver_id FROM receivers WHERE user_id = ? LIMIT 1",
      [userId],
    );
    const receiverId =
      existing[0]?.receiver_id ??
      (
        await query<InsertResult>(
          "INSERT INTO receivers (user_id, organization_name) VALUES (?, ?)",
          [userId, user.name],
        )
      ).insertId;

    const result = await query<InsertResult>(
      `INSERT INTO food_requests
         (receiver_id, title, category, quantity_servings, needed_by_datetime,
          urgency, delivery_area, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        receiverId,
        title,
        category,
        servings,
        neededBy,
        urgency || "normal",
        deliveryArea,
        notes || null,
      ],
    );

    const created = await query<FoodRequestRow[]>(
      `SELECT r.request_id, r.title, r.category, r.quantity_servings,
              r.needed_by_datetime, r.urgency, r.delivery_area, r.notes,
              r.status, NULL AS donor_name
         FROM food_requests r
        WHERE r.request_id = ? LIMIT 1`,
      [result.insertId],
    );

    return Response.json({ request: toFoodRequest(created[0]) }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: `Could not save request: ${message}` },
      { status: 500 },
    );
  }
}
