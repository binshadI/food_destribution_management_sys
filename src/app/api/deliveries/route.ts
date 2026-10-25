import { formatNeededBy } from "@/components/receiver/types";
import type { DeliveryTask } from "@/components/volunteer/types";
import { query } from "@/lib/db";
import { ensureVolunteer } from "@/lib/roles";

type DeliveryRow = {
  task_id: number;
  status: "open" | "accepted" | "picked_up" | "delivered" | "cancelled";
  title: string;
  quantity_servings: number;
  pickup_address: string;
  expiry_datetime: string | Date;
  needed_by_datetime: string | Date;
  urgency: "low" | "normal" | "high";
  delivery_area: string;
  donor_name: string;
  receiver_name: string;
  volunteer_user_id: number | null;
};

const TASK_STATUS: Record<DeliveryRow["status"], DeliveryTask["status"]> = {
  open: "Open",
  accepted: "Claimed",
  picked_up: "In transit",
  delivered: "Completed",
  cancelled: "Completed",
};

function localParts(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

function toTask(row: DeliveryRow, userId: number): DeliveryTask {
  const { date, time } = localParts(row.needed_by_datetime);
  const expiry = row.expiry_datetime instanceof Date
    ? row.expiry_datetime
    : new Date(row.expiry_datetime);
  const hoursUntilExpiry = (expiry.getTime() - Date.now()) / 36e5;

  return {
    id: `SS-TK-${String(row.task_id).padStart(4, "0")}`,
    pickup: row.donor_name,
    dropoff: row.receiver_name,
    pickupAddress: row.pickup_address,
    dropoffArea: row.delivery_area,
    distance: "",
    window: formatNeededBy(date, time),
    items: `${row.title} · ${row.quantity_servings} servings`,
    status: TASK_STATUS[row.status] ?? "Open",
    urgent:
      row.urgency === "high" || (hoursUntilExpiry > 0 && hoursUntilExpiry <= 24),
    mine: row.volunteer_user_id === userId,
  };
}

export async function GET(request: Request) {
  const userId = Number(new URL(request.url).searchParams.get("userId"));

  if (!Number.isInteger(userId) || userId <= 0) {
    return Response.json({ error: "A valid userId is required." }, { status: 400 });
  }

  try {
    await ensureVolunteer(userId);

    const rows = await query<DeliveryRow[]>(
      `SELECT p.task_id, p.status,
              f.title, f.quantity_servings, f.pickup_address, f.expiry_datetime,
              r.needed_by_datetime, r.urgency, r.delivery_area,
              COALESCE(d.organization_name, du.name) AS donor_name,
              COALESCE(rc.organization_name, ru.name) AS receiver_name,
              v.user_id AS volunteer_user_id
         FROM pickup_deliveries p
         JOIN food_items f ON f.food_id = p.food_id
         JOIN food_requests r ON r.request_id = p.request_id
         JOIN donors d ON d.donor_id = f.donor_id
         JOIN users du ON du.user_id = d.user_id
         JOIN receivers rc ON rc.receiver_id = r.receiver_id
         JOIN users ru ON ru.user_id = rc.user_id
         LEFT JOIN volunteers v ON v.volunteer_id = p.volunteer_id
         WHERE p.status <> 'cancelled'
         ORDER BY FIELD(p.status, 'open', 'accepted', 'picked_up', 'delivered'),
                  r.needed_by_datetime ASC, p.task_id ASC`,
    );

    return Response.json({ tasks: rows.map((row) => toTask(row, userId)) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: `Could not load tasks: ${message}` },
      { status: 500 },
    );
  }
}
