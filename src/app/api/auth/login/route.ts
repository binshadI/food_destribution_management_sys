import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

type UserRow = {
  user_id: number;
  name: string;
  email: string;
  password_hash: string;
  role: "donor" | "receiver" | "volunteer" | "admin";
  approval_status: "pending" | "approved" | "rejected" | null;
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const role = typeof payload.role === "string" ? payload.role : "";

  if (!email || !password) {
    return Response.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  try {
    const rows = await query<UserRow[]>(
      "SELECT user_id, name, email, password_hash, role, approval_status FROM users WHERE email = ? LIMIT 1",
      [email],
    );
    const user = rows[0];

    if (!user) {
      return Response.json(
        { error: "No account found with that email address." },
        { status: 401 },
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return Response.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 },
      );
    }

    if (user.approval_status && user.approval_status !== "approved") {
      return Response.json(
        {
          error: `Your account is ${user.approval_status}. An administrator must approve it before you can sign in.`,
        },
        { status: 403 },
      );
    }

    if (role && role !== user.role) {
      return Response.json(
        {
          error: `This account is registered as a ${user.role}. Switch to the ${user.role} tab to continue.`,
        },
        { status: 403 },
      );
    }

    return Response.json({
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: `Sign in failed: ${message}` },
      { status: 500 },
    );
  }
}
