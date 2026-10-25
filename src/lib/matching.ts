import { query } from "@/lib/db";

type PendingRequestRow = {
  request_id: number;
  category: "cooked" | "raw" | "packaged";
  quantity_servings: number;
  needed_by_datetime: string | Date;
  urgency: "low" | "normal" | "high";
};

type CandidateItemRow = {
  food_id: number;
  donor_id: number;
  category: "cooked" | "raw" | "packaged";
  quantity_servings: number;
  expiry_datetime: string | Date;
};

type InsertResult = { insertId: number; affectedRows: number };

function time(value: string | Date): number {
  const parsed = value instanceof Date ? value : new Date(value);
  return parsed.getTime();
}

/**
 * Pairs every pending food request with the best available food item:
 * same category, enough servings, not expired and not already promised.
 * Creates an open pickup task and marks the request + food item as matched.
 */
export async function runMatches(): Promise<{ matched: number }> {
  await query(
    `UPDATE food_items
        SET status = 'expired'
      WHERE status = 'available'
        AND expiry_datetime < NOW()`,
  );

  const requests = await query<PendingRequestRow[]>(
    `SELECT request_id, category, quantity_servings, needed_by_datetime, urgency
       FROM food_requests
      WHERE status = 'pending'
      ORDER BY FIELD(urgency, 'high', 'normal', 'low'), needed_by_datetime, request_id`,
  );

  if (requests.length === 0) return { matched: 0 };

  const items = await query<CandidateItemRow[]>(
    `SELECT f.food_id, f.donor_id, f.category, f.quantity_servings, f.expiry_datetime
       FROM food_items f
      WHERE f.status = 'available'
        AND f.expiry_datetime > NOW()
        AND NOT EXISTS (
          SELECT 1
            FROM pickup_deliveries p
           WHERE p.food_id = f.food_id
             AND p.status IN ('open', 'accepted', 'picked_up')
        )
      ORDER BY f.expiry_datetime, f.food_id`,
  );

  const used = new Set<number>();
  let matched = 0;

  for (const request of requests) {
    const needed = request.quantity_servings;

    const candidates = items.filter(
      (item) =>
        !used.has(item.food_id) &&
        item.category === request.category &&
        item.quantity_servings >= needed,
    );

    if (candidates.length === 0) continue;

    candidates.sort(
      (a, b) =>
        a.quantity_servings - needed - (b.quantity_servings - needed) ||
        time(a.expiry_datetime) - time(b.expiry_datetime),
    );

    const item = candidates[0];
    used.add(item.food_id);

    try {
      await query<InsertResult>(
        `INSERT INTO pickup_deliveries (food_id, request_id, status, scheduled_time)
         VALUES (?, ?, 'open', ?)`,
        [item.food_id, request.request_id, request.needed_by_datetime],
      );
    } catch {
      continue;
    }

    const requestMarked = await query<InsertResult>(
      `UPDATE food_requests
          SET status = 'matched', donor_id = ?
        WHERE request_id = ? AND status = 'pending'`,
      [item.donor_id, request.request_id],
    );
    const itemMarked = await query<InsertResult>(
      `UPDATE food_items
          SET status = 'matched'
        WHERE food_id = ? AND status = 'available'`,
      [item.food_id],
    );

    if (requestMarked.affectedRows > 0 && itemMarked.affectedRows > 0) {
      matched += 1;
    }
  }

  return { matched };
}
