"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { gsap, MQ } from "@/lib/gsap";
import { greet, hop, headTilt, tailFlick, type CatParts } from "./clips";

/**
 * Tisco's one-liners (Iury, 2026-11-16: "Mie comigo!", puns, little reactions).
 *
 * A small speech bubble that rises next to the cat, holds for a few seconds and
 * fades. It is decoration: `aria-hidden`, no pointer events, never a control, and
 * never opens anything. The lines live in messages/*.json → assistant.quips.
 */
export interface Quips {
  /** Said now and then while he is awake. */
  random: string[];
  /** Mumbled in his sleep (no gesture, he stays curled). */
  sleep: string[];
  /** Once per visit, the first time each home section comes into view. */
  sections: Record<string, string>;
  /** Once, if the page is scrolled very fast. */
  fast: string;
  /** Once, at the end of the page. */
  bottom: string;
  /** Sometimes, when he wakes up. */
  wake: string[];
  /** In the hero, once, a while after the page settles. */
  hero: string[];
}

export const pick = (lines: string[]) => lines[Math.floor(Math.random() * lines.length)] ?? "";

/** A random small gesture to go with a line: a wave, a hop, a head tilt or a tail flick. */
export function react(p: CatParts) {
  const moves = [greet, hop, headTilt, tailFlick];
  return (moves[Math.floor(Math.random() * moves.length)] ?? tailFlick)(p);
}

/** The bubble's show / hide, with a minimum gap between lines and a cap per visit. */
export function useBubble({ gapMs = 9000, max = 8 } = {}) {
  const ref = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const last = useRef(-Infinity);
  const count = useRef(0);

  const hide = useCallback(() => {
    window.clearTimeout(timer.current);
    const el = ref.current;
    if (!el) return;
    const rm = window.matchMedia(MQ.reduced).matches;
    gsap.to(el, { autoAlpha: 0, y: rm ? 0 : -4, duration: rm ? 0 : 0.25, overwrite: true });
  }, []);

  /** Shows `text`; returns false when it is too soon, the cap is reached or the tab is hidden. */
  const say = useCallback(
    (text: string, { force = false } = {}) => {
      const el = ref.current;
      const now = performance.now();
      if (!el || !text || document.visibilityState !== "visible") return false;
      if (!force && (now - last.current < gapMs || count.current >= max)) return false;
      last.current = now;
      count.current += 1;
      el.textContent = text;
      const rm = window.matchMedia(MQ.reduced).matches;
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: rm ? 0 : 8, scale: rm ? 1 : 0.94 },
        { autoAlpha: 1, y: 0, scale: 1, duration: rm ? 0 : 0.34, ease: "back.out(1.7)", overwrite: true },
      );
      window.clearTimeout(timer.current);
      // Long enough to read: ~3.2 s plus a little per character.
      timer.current = window.setTimeout(hide, 3200 + text.length * 30);
      return true;
    },
    [gapMs, max, hide],
  );

  useEffect(() => {
    return () => window.clearTimeout(timer.current);
  }, []);

  // Stable, so effects can depend on it.
  return useMemo(() => ({ ref, say, hide }), [say, hide]);
}

/**
 * The bubble itself. Dark glass with the floating controls' luminous edge, the
 * corner nearest the cat squared off as the tail of the speech. Placement comes
 * from `className` (absolute, beside the cat).
 */
export function QuipBubble({ bubbleRef, className = "" }: { bubbleRef: React.RefObject<HTMLSpanElement | null>; className?: string }) {
  return (
    <span
      ref={bubbleRef}
      aria-hidden="true"
      style={{ visibility: "hidden", opacity: 0 }}
      className={`pointer-events-none absolute z-10 w-max max-w-[min(15rem,calc(100vw-7rem))] rounded-[14px] border border-paper/20 bg-ink-800 px-3.5 py-2 font-display text-[max(0.9375rem,13px)] leading-snug font-medium tracking-[-0.005em] text-pretty text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_12px_28px_-14px_rgba(0,0,0,0.7)] ${className}`}
    />
  );
}
