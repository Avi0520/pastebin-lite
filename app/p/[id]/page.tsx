export const dynamic = "force-dynamic";

import kv from "@/lib/kv";
import { notFound } from "next/navigation";

export default async function PastePage({ params }: any) {
  const key = `paste:${params.id}`;
  const paste = await kv.get<any>(key);

  if (!paste) notFound();
  if (paste.expires_at && Date.now() >= paste.expires_at) notFound();
  if (paste.max_views !== null && paste.views >= paste.max_views) notFound();

  await kv.hincrby(key, "views", 1);

  return (
    <pre style={{ whiteSpace: "pre-wrap", padding: "16px" }}>
      {paste.content}
    </pre>
  );
}
