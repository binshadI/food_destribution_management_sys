import { runMatches } from "@/lib/matching";

export async function POST() {
  try {
    const { matched } = await runMatches();
    return Response.json({ matched });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: `Could not run matching: ${message}` },
      { status: 500 },
    );
  }
}

export async function GET() {
  return POST();
}
