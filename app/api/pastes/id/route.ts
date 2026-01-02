import kv from "@/lib/kv";
import { nowMs } from "@/lib/time";

export async function GET(req: Request, { params }: any) {
  const key = `paste:${params.id}`;
  const paste = await kv.get<any>(key);

  if (!paste) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }

  const now = nowMs(req);

  if (paste.expires_at && now >= paste.expires_at) {
    return new Response(JSON.stringify({ error: "Expired" }), { status: 404 });
  }

  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return new Response(JSON.stringify({ error: "View limit exceeded" }), { status: 404 });
  }

  await kv.hincrby(key, "views", 1);

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null ? null : Math.max(paste.max_views - paste.views - 1, 0),
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null
  });
}
