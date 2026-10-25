import { query } from "@/lib/db";
import { ensureVolunteer, getRole } from "@/lib/roles";

type InsertResult = { insertId: number; affectedRows: number };

type Transition = "accepted" | "picked_up" | "delivered";

const TRANSITIONS: Transition[] = ["accepted", "picked_up", "delivered"];

type DeliveryStateRow = {
  task_id: number;
  status: "open" | "accepted" | "picked_up" | "delivered" | "cancelled";
  request_id: number;
  food_id: number;
  request_status: "pending" | "matched" | "ready" | "received";
  volunteer_id: number | null;
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const taskId = Number(id);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  const userId = Number(payload.userId);
  const status = typeof payload.status === "string" ? payload.status : "";

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return Response.json({ error: "A valid task id is required." }, { status: 400 });
  }
  if (!Number.isInteger(userId) || userId <= 0) {
    return Response.json({ error: "A valid userId is required." }, { status: 400 });
  }
  if (!TRANSITIONS.includes(status as Transition)) {
    return Response.json(
      { error: "Status must be accepted, picked_up or delivered." },
      { status: 400 },
    );
  }
  const transition = status as Transition;

  try {
    const user = await getRole(userId);
    if (!user) {
      return Response.json({ error: "Account not found." }, { status: 404 });
    }
    if (user.role !== "volunteer") {
      return Response.json(
        { error: "Only volunteer accounts can update deliveries." },
        { status: 403 },
      );
    }

    const volunteerId = await ensureVolunteer(userId);

    const rows = await query<DeliveryStateRow[]>(
      `SELECT p.task_id, p.status, p.request_id, p.food_id, p.volunteer_id,
              r.status AS request_status
         FROM pickup_deliveries p
         JOIN food_requests r ON r.request_id = p.request_id
        WHERE p.task_id = ? AND p.status <> 'cancelled'
        LIMIT 1`,
      [taskId],
    );
    const delivery = rows[0];
    if (!delivery) {
      return Response.json({ error: "Delivery task not found." }, { status: 404 });
    }

    if (transition === "accepted") {
      if (delivery.status !== "open") {
        return Response.json(
          { error: "This task has already been claimed." },
          { status: 409 },
        );
      }

      const claimed = await query<InsertResult>(
        `UPDATE pickup_deliveries
            SET status = 'accepted', volunteer_id = ?
          WHERE task_id = ? AND status = 'open'`,
        [volunteerId, taskId],
      );
      if (claimed.affectedRows === 0) {
        return Response.json(
          { error: "This task has already been claimed." },
          { status: 409 },
        );
      }

      await query(
        `UPDATE food_requests
            SET status = 'ready'
          WHERE request_id = ? AND status = 'matched'`,
        [delivery.request_id],
      );
      await query("UPDATE volunteers SET status = 'busy' WHERE volunteer_id = ?", [
        volunteerId,
      ]);
    } else {
      if (delivery.volunteer_id !== volunteerId) {
        return Response.json(
          { error: "Only the assigned volunteer can update this task." },
          { status: 403 },
        );
      }

      if (transition === "picked_up") {
        const updated = await query<InsertResult>(
          `UPDATE pickup_deliveries
              SET status = 'picked_up', pickup_time = NOW()
            WHERE task_id = ? AND status = 'accepted' AND volunteer_id = ?`,
          [taskId, volunteerId],
        );
        if (updated.affectedRows === 0) {
          return Response.json(
            { error: "Task is not awaiting pickup." },
            { status: 409 },
          );
        }
      }

      if (transition === "delivered") {
        const updated = await query<InsertResult>(
          `UPDATE pickup_deliveries
              SET status = 'delivered', delivery_time = NOW()
            WHERE task_id = ?
              AND status IN ('accepted', 'picked_up')
              AND volunteer_id = ?`,
          [taskId, volunteerId],
        );
        if (updated.affectedRows === 0) {
          return Response.json(
            { error: "Task cannot be completed from its current state." },
            { status: 409 },
          );
        }

        await query(
          `UPDATE food_requests SET status = 'received'
            WHERE request_id = ? AND status IN ('matched', 'ready')`,
          [delivery.request_id],
        );
        await query(
          `UPDATE food_items SET status = 'completed'
            WHERE food_id = ? AND status = 'matched'`,
          [delivery.food_id],
        );
        await query(
          "UPDATE volunteers SET status = 'available' WHERE volunteer_id = ?",
          [volunteerId],
        );
      }
    }

    return Response.json({ task: `SS-TK-${String(taskId).padStart(4, "0")}`, status: transition });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: `Could not update task: ${message}` },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return PATCH(request, context);
}
