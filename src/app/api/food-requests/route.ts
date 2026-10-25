import { formatNeededBy } from "@/components/receiver/types";
import { query } from "@/lib/db";
import { runMatches } from "@/lib/matching";
import { ensureReceiver, getRole } from "@/lib/roles";

type RequestStatusDb = "pending" | "matched" | "ready" | "received";
type TaskStatusDb = "open" | "accepted" | "picked_up" | "delivered" | "cancelled";

type RequestListRow = {
  request_id: number;
  title: string;
  category: "cooked" | "raw" | "packaged";
  quantity_servings: number;
  needed_by_datetime: string | Date;
  urgency: "low" | "normal" | "high";
  delivery_area: string;
  notes: string | null;
  status: RequestStatusDb;
  donor_name: string | null;
  volunteer_name: string | null;
  task_status: TaskStatusDb | null;
};

type InsertResult = { insertId: number; affectedRows: number };

const CATEGORY_LABEL: Record<RequestListRow["category"], string> = {
  cooked: "Cooked",
  raw: "Raw",
  packaged: "Packaged",
};

const CATEGORY_TO_DB: Record<string, RequestListRow["category"]> = {
  Cooked: "cooked",
  Raw: "raw",
  Packaged: "packaged",
};

const URGENCY_LABEL: Record<RequestListRow["urgency"], string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
};

const URGENCY_TO_DB: Record<string, RequestListRow["urgency"]> = {
  Low: "low",
  Normal: "normal",
  High: "high",
};

const STATUS_LABEL: Record<RequestStatusDb, string> = {
  pending: "Pending",
  matched: "Matched",
  ready: "Ready",
  received: "Received",
};

function localParts(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

function toRequest(row: RequestListRow) {
  const { date, time } = localParts(row.needed_by_datetime);
  const volunteerAssigned =
    row.task_status === "accepted" ||
    row.task_status === "picked_up" ||
    row.task_status === "delivered";

  return {
    id: `SS-RQ-${String(row.request_id).padStart(4, "0")}`,
    food: row.title,
    category: CATEGORY_LABEL[row.category] ?? "Cooked",
    servings: row.quantity_servings,
    neededBy: formatNeededBy(date, time),
    urgency: URGENCY_LABEL[row.urgency] ?? "Normal",
    area: row.delivery_area,
    status: STATUS_LABEL[row.status] ?? "Pending",
    donor: row.donor_name ?? "Awaiting match",
    volunteer: volunteerAssigned ? row.volunteer_name : null,
    note: row.notes ?? undefined,
  };
}

const SELECT_REQUESTS = `
  SELECT r.request_id, r.title, r.category, r.quantity_servings,
         r.needed_by_datetime, r.urgency, r.delivery_area, r.notes, r.status,
         COALESCE(d.organization_name, du.name) AS donor_name,
         vu.name AS volunteer_name,
         p.status AS task_status
    FROM food_requests r
    JOIN receivers rc ON rc.receiver_id = r.receiver_id
    LEFT JOIN donors d ON d.donor_id = r.donor_id
    LEFT JOIN users du ON du.user_id = d.user_id
    LEFT JOIN pickup_deliveries p
           ON p.request_id = r.request_id AND p.status <> 'cancelled'
    LEFT JOIN volunteers v ON v.volunteer_id = p.volunteer_id
    LEFT JOIN users vu ON vu.user_id = v.user_id`;

export async function GET(request: Request) {
  const userId = Number(new URL(request.url).searchParams.get("userId"));

  if (!Number.isInteger(userId) || userId <= 0) {
    return Response.json({ error: "A valid userId is required." }, { status: 400 });
  }

  try {
    const rows = await query<RequestListRow[]>(
      `${SELECT_REQUESTS}
       WHERE rc.user_id = ?
       ORDER BY r.created_at DESC, r.request_id DESC`,
      [userId],
    );

    return Response.json({ requests: rows.map(toRequest) });
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
  const category = CATEGORY_TO_DB[categoryValue];
  const servings = Math.round(Number(payload.quantityServings));
  const urgencyValue =
    typeof payload.urgency === "string" ? payload.urgency : "Normal";
  const urgency = URGENCY_TO_DB[urgencyValue] ?? "normal";
  const deliveryArea =
    typeof payload.deliveryArea === "string" ? payload.deliveryArea.trim() : "";
  const notes =
    typeof payload.notes === "string" ? payload.notes.trim() : "";
  const neededByDate =
    typeof payload.neededByDate === "string" ? payload.neededByDate : "";
  const neededByTime =
    typeof payload.neededByTime === "string" ? payload.neededByTime : "";

  if (!Number.isInteger(userId) || userId <= 0) {
    return Response.json({ error: "A valid userId is required." }, { status: 400 });
  }
  if (!title) {
    return Response.json(
      { error: "Please describe the food you need." },
      { status: 400 },
    );
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
      { error: "A delivery area is required." },
      { status: 400 },
    );
  }

  const neededBy = new Date(`${neededByDate}T${neededByTime || "23:59"}:00`);
  if (Number.isNaN(neededBy.getTime())) {
    return Response.json(
      { error: "A valid needed-by date is required." },
      { status: 400 },
    );
  }

  try {
    const user = await getRole(userId);
    if (!user) {
      return Response.json({ error: "Account not found." }, { status: 404 });
    }
    if (user.role !== "receiver") {
      return Response.json(
        { error: "Only receiver accounts can post food requests." },
        { status: 403 },
      );
    }

    const receiverId = await ensureReceiver(userId, user.name);

    const inserted = await query<InsertResult>(
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
        urgency,
        deliveryArea,
        notes || null,
      ],
    );

    const { matched } = await runMatches();

    const rows = await query<RequestListRow[]>(
      `${SELECT_REQUESTS} WHERE r.request_id = ? LIMIT 1`,
      [inserted.insertId],
    );
    const created = rows[0] ? toRequest(rows[0]) : null;

    return Response.json(
      {
        request: created,
        matched: created?.status !== "Pending",
        matchesCreated: matched,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: `Could not save request: ${message}` },
      { status: 500 },
    );
  }
}
