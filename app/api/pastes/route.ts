import kv from "@/lib/kv";
import { nanoid } from "nanoid";
import { validateCreatePaste } from "@/lib/validation";
import { nowMs } from "@/lib/time";

export async function POST(req: Request) {
  const body = await req.json();
  const error = validateCreatePaste(body);

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }

  const id = nanoid(10);
  const now = nowMs(req);

  const expires_at = body.ttl_seconds
    ? now + body.ttl_seconds * 1000
    : null;

  await kv.set(`paste:${id}`, {
    content: body.content,
    created_at: now,
    expires_at,
    max_views: body.max_views ?? null,
    views: 0
  });

  return Response.json({
    id,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`
  });
}
