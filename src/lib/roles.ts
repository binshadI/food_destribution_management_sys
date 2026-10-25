import { query } from "@/lib/db";

type InsertResult = { insertId: number; affectedRows: number };

export async function ensureReceiver(userId: number, name: string) {
  const existing = await query<{ receiver_id: number }[]>(
    "SELECT receiver_id FROM receivers WHERE user_id = ? LIMIT 1",
    [userId],
  );
  if (existing[0]) return existing[0].receiver_id;

  const inserted = await query<InsertResult>(
    "INSERT INTO receivers (user_id, organization_name) VALUES (?, ?)",
    [userId, name],
  );
  return inserted.insertId;
}

export async function ensureVolunteer(userId: number) {
  const existing = await query<{ volunteer_id: number }[]>(
    "SELECT volunteer_id FROM volunteers WHERE user_id = ? LIMIT 1",
    [userId],
  );
  if (existing[0]) return existing[0].volunteer_id;

  const inserted = await query<InsertResult>(
    "INSERT INTO volunteers (user_id, vehicle_type) VALUES (?, 'bike')",
    [userId],
  );
  return inserted.insertId;
}

export async function getRole(userId: number) {
  const rows = await query<{ user_id: number; name: string; role: string }[]>(
    "SELECT user_id, name, role FROM users WHERE user_id = ? LIMIT 1",
    [userId],
  );
  return rows[0] ?? null;
}
