import { query } from "@/lib/db";

export async function GET() {
  try {
    const users = await query("SELECT user_id, name, role FROM users");
    return Response.json(users);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}