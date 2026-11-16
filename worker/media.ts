/**
 * Byte-range video for /video/* (Iury's AutomIA motion piece). Cloudflare's static
 * assets answer a Range request with the whole file (200), and Safari (iOS and
 * macOS) will not play an MP4 that way: it needs 206 Partial Content. So the
 * Worker runs first for /video/* only (wrangler.jsonc), reads the file from the
 * assets binding and answers the range itself. Everything else stays static.
 */
interface Assets {
  fetch(request: Request): Promise<Response>;
}

export async function video(request: Request, assets: Assets): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") return new Response(null, { status: 405, headers: { Allow: "GET, HEAD" } });
  // Ask the assets for the whole file (no Range), then cut it here.
  const file = await assets.fetch(new Request(request.url, { method: "GET" }));
  if (!file.ok) return file;
  const body = await file.arrayBuffer();
  const size = body.byteLength;
  const headers = new Headers(file.headers);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", "public, max-age=604800");
  const range = request.headers.get("Range");
  const m = range ? /^bytes=(\d*)-(\d*)$/.exec(range.trim()) : null;
  if (!range) {
    headers.set("Content-Length", String(size));
    return new Response(request.method === "HEAD" ? null : body, { status: 200, headers });
  }
  if (!m || (m[1] === "" && m[2] === "")) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}`, "Accept-Ranges": "bytes" } });
  }
  // "bytes=a-b", "bytes=a-" or the suffix form "bytes=-n" (the last n bytes).
  const start = m[1] === "" ? Math.max(0, size - Number(m[2])) : Number(m[1]);
  const end = m[1] === "" || m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1);
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}`, "Accept-Ranges": "bytes" } });
  }
  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(end - start + 1));
  return new Response(request.method === "HEAD" ? null : body.slice(start, end + 1), { status: 206, headers });
}
