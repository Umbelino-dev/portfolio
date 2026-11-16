/**
 * The site's one button shape (Iury, 2026-11-16): a rounded pill in Satoshi Bold,
 * 48px tall. `ink` on light surfaces, `paper` on dark ones (it lights up lime on
 * hover there). Used for every primary action: contact, project access, LinkedIn
 * posts, the assistant. Text links stay underlined Satoshi (CLAUDE.md).
 */
const base =
  "inline-flex min-h-12 items-center justify-center gap-2.5 self-start rounded-full px-6 py-3 font-display text-[max(1rem,14px)] font-bold tracking-[-0.01em] transition-colors duration-(--duration-fast) ease-(--ease-out-soft)";

export const button = {
  ink: `${base} bg-ink text-paper hover:bg-[#2a2a2a] focus-visible:outline-ink`,
  paper: `${base} bg-paper text-ink hover:bg-signal`,
  /** Quiet partner of a primary button: an outline in the surface's own ink. */
  outline: `${base} border border-current/25 hover:border-current/60`,
} as const;
