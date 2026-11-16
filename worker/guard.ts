/**
 * Output guard: a second layer behind the prompt. The prompt asks the model to
 * stay inside the knowledge base; this checks the reply in code, because a
 * prompt is not a guarantee. A reply that fails is never shown or cached: the
 * client falls back to the scripted answers.
 *
 *  - contacts: every e-mail, link and @handle in the reply must already exist
 *    in the knowledge text (a made-up contact is the worst hallucination here);
 *  - length: replies are short by design, so a long one is a dump or a runaway;
 *  - leaks: markers of the system prompt must never appear.
 */

export const MAX_REPLY_CHARS = 1200;

const EMAIL = /[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+/gi;
const URL_LIKE = /(?:https?:\/\/)?(?:[a-z0-9-]+\.)+(?:com|br|dev|app|io|net|org|me|co)\b(?:\/[^\s)]*)?/gi;
const HANDLE = /(?<![\w.])@[a-z0-9_.]{2,}/gi;
const LEAK_MARKERS = ["<conteudo>", "</conteudo>", "REGRAS", "SYSTEM_PROMPT", "systemInstruction"];

const clean = (t: string) => t.toLowerCase().replace(/[.,;:!?)\]"']+$/g, "");

export type GuardResult = { ok: true } | { ok: false; reason: "too_long" | "leak" | "unknown_contact" };

export function checkReply(reply: string, knowledge: string): GuardResult {
  if (reply.length > MAX_REPLY_CHARS) return { ok: false, reason: "too_long" };
  if (LEAK_MARKERS.some((m) => reply.includes(m))) return { ok: false, reason: "leak" };

  const known = knowledge.toLowerCase();
  const emails = reply.match(EMAIL) ?? [];
  const rest = reply.replace(EMAIL, " ");
  const found = [...emails, ...(rest.match(URL_LIKE) ?? []), ...(rest.match(HANDLE) ?? [])];
  for (const raw of found) {
    const token = clean(raw).replace(/^https?:\/\//, "").replace(/^www\./, "");
    if (token && !known.includes(token)) return { ok: false, reason: "unknown_contact" };
  }
  return { ok: true };
}

/**
 * The cat may end a reply with `[[ir:destino]]` to point the visitor to a part of
 * the site. The tag never reaches the visitor: it is stripped here and the
 * destination is accepted only if it is on the fixed allowlist.
 */
export const SECTION_DESTINATIONS = ["about", "projects", "approach", "contact"] as const;

export function extractGo(raw: string, projectSlugs: readonly string[]): { text: string; go: string | null } {
  const found: string[] = [];
  const text = raw
    .replace(/\[\[\s*ir\s*:\s*([a-z0-9-]+)\s*\]\]/gi, (_m, d: string) => {
      found.push(d.toLowerCase());
      return "";
    })
    .replace(/\[\[[^\n]*$/, "") // a tag cut off by the token limit
    .trim();
  const allowed = new Set<string>([...SECTION_DESTINATIONS, ...projectSlugs]);
  const last = found[found.length - 1];
  return { text, go: last && allowed.has(last) ? last : null };
}
