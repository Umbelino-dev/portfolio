"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { DUR, gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";

export interface TimelineStep {
  role: string;
  org: string;
  /** The period in words: "abril de 2024 – julho de 2025". */
  period: string;
  /** "1 ano e 4 meses" / "desde abril de 2026". */
  duration: string;
  area: string;
  summary: string;
  details: string[];
  more: string;
  /** Extra lines for the expanded account (the current role's CV highlights). */
  list?: string[];
  /** Tools named in the CV for this role. */
  stack?: string[];
  current?: boolean;
}

export interface TimelineLabels {
  now: string;
  seeMore: string;
  close: string;
  stack: string;
}

const SVG_NS = "http://www.w3.org/2000/svg";
/** Gap between a step's text and the line under it (px). */
const UNDER = 22;

/**
 * The career path as one drawn line, left to right.
 *
 * Desktop (≥1024): the roles stand in four columns, each one step higher than
 * the last, and a single line runs under them from the left edge to the right:
 * flat under each role, then a soft S-curve up to the next. As the section
 * scrolls in, the line draws itself (a trim path, scrubbed to the scroll) with a
 * point of light at its tip; each role lights up when the tip passes under it.
 * Smaller screens: the same line runs down the left side, top to bottom.
 *
 * The path is built from the real positions of the roles (measured, rebuilt on
 * resize), so it always passes under the text, whatever the copy's length.
 *
 * Hover or keyboard focus quiets the other roles and unrolls a few details in
 * the free space above the role (clip-path; nothing moves). On touch the details
 * are always shown. Click / Enter opens the full account under the line
 * (inside the step on small screens); Esc closes.
 * Reduced motion: the line is drawn, every role is lit, no tip.
 */
export function Timeline({ steps, labels }: { steps: TimelineStep[]; labels: TimelineLabels }) {
  const root = useRef<HTMLDivElement>(null);
  // `open` is the step asked for; `shown` is the step on screen. They differ only
  // while a panel animates out, so closing and switching never cut abruptly.
  const [open, setOpen] = useState<number | null>(null);
  const [shown, setShown] = useState<number | null>(null);
  /** How the next `shown` arrives: revealed (opening) or crossfaded (switching on desktop). */
  const arrival = useRef<"reveal" | "swap">("reveal");
  const [hot, setHot] = useState<number | null>(null);
  const uid = useId();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      /** Draws the line inside `box` along `axis`; returns its cleanup. */
      const run = (box: HTMLElement, axis: "x" | "y", motion: boolean) => {
        const svg = box.querySelector<SVGSVGElement>("[data-tl-svg]");
        const items = gsap.utils.toArray<HTMLElement>("[data-step]", box);
        if (!svg || !items.length) return () => {};
        svg.replaceChildren();
        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "currentColor");
        path.setAttribute("stroke-width", "1.5");
        path.setAttribute("stroke-linecap", "round");
        const tip = document.createElementNS(SVG_NS, "circle");
        tip.setAttribute("r", "5");
        tip.setAttribute("class", "fill-signal");
        tip.style.filter = "drop-shadow(0 0 6px rgba(200,241,105,0.9)) drop-shadow(0 0 16px rgba(200,241,105,0.55))";
        svg.append(path, tip);
        // "Now": where the line ends (the current role), a lime point with a soft
        // pulse. HTML, not SVG, so the pulse is a composited transform/opacity
        // animation; it runs only while the path is on screen, and never with
        // reduced motion (the point stays, still).
        const now = document.createElement("span");
        now.setAttribute("aria-hidden", "true");
        now.className = "pointer-events-none absolute size-2.5 -translate-1/2 rounded-full bg-signal opacity-0 shadow-[0_0_8px_rgba(200,241,105,0.9)]";
        const ring = document.createElement("span");
        ring.className = "absolute inset-0 rounded-full bg-signal opacity-60 motion-safe:animate-[tl-ping_2.4s_cubic-bezier(0,0,0.2,1)_infinite] motion-reduce:hidden";
        now.append(ring);
        box.append(now);
        const seen = new IntersectionObserver(([e]) => {
          ring.style.animationPlayState = e?.isIntersecting ? "running" : "paused";
        });
        seen.observe(box);

        let length = 0;
        let marks: number[] = []; // where each step starts, along the axis (px)
        // The path, pre-sampled at build time: getPointAtLength on every scroll update
        // was the second costliest call while scrolling (2026-11-16 audit). 256
        // samples put a point every few pixels; between them the tip is interpolated
        // (well under a pixel off on these gentle curves).
        const SAMPLES = 256;
        const lut = new Float32Array((SAMPLES + 1) * 2);
        const pointAt = (t: number) => {
          const f = Math.min(Math.max(t, 0), 1) * SAMPLES;
          const i = Math.min(Math.floor(f), SAMPLES - 1);
          const k = f - i;
          return {
            x: lut[i * 2]! + (lut[i * 2 + 2]! - lut[i * 2]!) * k,
            y: lut[i * 2 + 1]! + (lut[i * 2 + 3]! - lut[i * 2 + 1]!) * k,
          };
        };
        let progress = motion ? 0 : 1;

        const build = () => {
          const b = box.getBoundingClientRect();
          svg.setAttribute("viewBox", `0 0 ${b.width} ${b.height}`);
          const pts = items.map((it) => {
            const r = it.getBoundingClientRect();
            return axis === "x"
              ? { x: r.left - b.left, y: r.bottom - b.top + UNDER, w: r.width }
              : { x: 6, y: r.top - b.top + 6, w: r.height };
          });
          marks = pts.map((p) => (axis === "x" ? p.x : p.y));
          let d = "";
          if (axis === "x") {
            const first = pts[0]!;
            d = `M 0 ${first.y}`;
            pts.forEach((p, i) => {
              const shelf = p.x + p.w * 0.45; // flat under the text
              d += ` L ${shelf} ${p.y}`;
              const next = pts[i + 1];
              if (next) {
                const span = next.x - shelf;
                d += ` C ${shelf + span * 0.55} ${p.y} ${next.x - span * 0.45} ${next.y} ${next.x} ${next.y}`;
              } else {
                d += ` L ${b.width} ${p.y}`;
              }
            });
          } else {
            const last = pts[pts.length - 1]!;
            d = `M 6 ${pts[0]!.y} L 6 ${last.y + last.w - 12}`;
          }
          path.setAttribute("d", d);
          length = path.getTotalLength();
          for (let k = 0; k <= SAMPLES; k++) {
            const pt = path.getPointAtLength((length * k) / SAMPLES);
            lut[k * 2] = pt.x;
            lut[k * 2 + 1] = pt.y;
          }
          const end = pointAt(1);
          now.style.left = `${end.x}px`;
          now.style.top = `${end.y}px`;
          path.style.strokeDasharray = `${length}`;
          paint();
        };

        const paint = () => {
          path.style.strokeDashoffset = `${length * (1 - progress)}`;
          const at = pointAt(progress);
          tip.setAttribute("cx", `${at.x}`);
          tip.setAttribute("cy", `${at.y}`);
          tip.style.opacity = motion && progress > 0.001 && progress < 0.999 ? "1" : "0";
          // The tip hands over to the "now" point once the line is fully drawn.
          now.style.opacity = progress >= 0.999 ? "1" : "0";
          const head = axis === "x" ? at.x : at.y;
          items.forEach((it, i) => {
            const reached = !motion || head >= (marks[i] ?? 0) - 2;
            // Only on a change: rewriting the same attribute every scroll frame still
            // invalidated the role's style.
            if (reached === it.hasAttribute("data-reached")) return;
            if (reached) it.dataset.reached = "";
            else delete it.dataset.reached;
          });
        };

        build();
        if (motion) box.dataset.tlAnim = "";
        const ro = new ResizeObserver(build);
        ro.observe(box);

        let st: ScrollTrigger | undefined;
        if (motion) {
          const proxy = { p: 0 };
          const tween = gsap.to(proxy, {
            p: 1,
            ease: "none",
            onUpdate: () => {
              progress = proxy.p;
              paint();
            },
            scrollTrigger: { trigger: box, start: "top 85%", end: axis === "x" ? "bottom 92%" : "bottom 118%", scrub: 0.6 },
          });
          st = tween.scrollTrigger;
        }
        return () => {
          ro.disconnect();
          seen.disconnect();
          now.remove();
          st?.kill();
          delete box.dataset.tlAnim;
          items.forEach((it) => delete it.dataset.reached);
          svg.replaceChildren();
        };
      };

      const h = el.querySelector<HTMLElement>("[data-tl-h]");
      const v = el.querySelector<HTMLElement>("[data-tl-v]");
      mm.add({ wide: "(min-width: 1024px)", motion: MQ.motion }, (ctx) => {
        const { wide, motion } = ctx.conditions as { wide: boolean; motion: boolean };
        const box = wide ? h : v;
        if (!box) return;
        return run(box, wide ? "x" : "y", motion);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  /** The account panels currently on screen (desktop or mobile layout). */
  const panels = () =>
    Array.from(root.current?.querySelectorAll<HTMLElement>("[data-tl-panel]") ?? []).filter((el) => el.offsetParent !== null);

  // Leaving: close (the panel folds up) or switch (desktop: the content fades and
  // the new one rises in the same panel; mobile: the panel moves to another role,
  // so the old one folds up first). Driven by the event, not an effect. Only
  // clip-path, opacity and transform.
  const leaving = useRef<gsap.core.Tween | null>(null);
  const go = (next: number | null) => {
    setOpen(next);
    leaving.current?.kill();
    const els = panels();
    if (shown === null || !els.length || window.matchMedia(MQ.reduced).matches) {
      arrival.current = "reveal";
      setShown(next);
      return;
    }
    if (next === shown) {
      // Asked back mid-exit: restore the panel as it was.
      gsap.to(els, { clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 0.2 });
      gsap.to(els.map((el) => el.querySelector("[data-tl-content]")), { opacity: 1, y: 0, duration: 0.2 });
      return;
    }
    const inPlace = next !== null && els.every((el) => el.dataset.tlPanel === "h");
    leaving.current = inPlace
      ? gsap.to(
          els.map((el) => el.querySelector("[data-tl-content]")),
          {
            opacity: 0,
            y: -10,
            duration: 0.18,
            ease: "power1.in",
            onComplete: () => {
              arrival.current = "swap";
              setShown(next);
            },
          },
        )
      : gsap.to(els, {
          clipPath: "inset(0 0 100% 0)",
          opacity: 0,
          duration: DUR.base,
          ease: "power2.in",
          onComplete: () => {
            arrival.current = "reveal";
            setShown(next);
          },
        });
  };
  // The latest `go` for listeners registered once (Esc), so they never act on a stale `shown`.
  const goRef = useRef(go);
  useEffect(() => {
    goRef.current = go;
  });
  useEffect(() => {
    return () => {
      leaving.current?.kill();
    };
  }, []);

  // Arriving: reveal a new panel, or bring the swapped content in.
  useLayoutEffect(() => {
    if (shown === null) return;
    const els = panels();
    if (!els.length) return;
    gsap.set(els, { clearProps: "opacity", clipPath: "inset(0 0 0% 0)" });
    if (!window.matchMedia(MQ.reduced).matches) {
      const content = els.map((el) => el.querySelector("[data-tl-content]"));
      if (arrival.current === "swap") {
        gsap.fromTo(content, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.42, ease: "power3.out" });
      } else {
        gsap.fromTo(els, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: DUR.slow, ease: "power3.out" });
        gsap.fromTo(content, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: DUR.slow, ease: "power3.out", delay: 0.08 });
      }
    }
    els[0]?.scrollIntoView({ block: "nearest", behavior: "auto" });
  }, [shown]);

  // Esc closes.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") goRef.current(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = (i: number) => go(open === i ? null : i);
  const panelId = (i: number) => `${uid}-panel-${i}`;
  const quiet = (i: number) => hot !== null && hot !== i;
  /** "desde abril de 2026" → "Desde abril de 2026" when it opens a sentence. */
  const cap = (text: string) => text.charAt(0).toLocaleUpperCase() + text.slice(1);
  const ease = "duration-(--duration-base) ease-(--ease-out-soft)";

  // Render helpers (plain functions, not components: no remount, focus stays put).
  const account = (s: TimelineStep) => (
    <div className="flex flex-col gap-6">
      <p className="max-w-[54ch] text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] leading-normal text-pretty">{s.more}</p>
      {s.list && (
        <ul className="flex max-w-[60ch] flex-col gap-4">
          {s.list.map((item, j) => (
            <li key={j} className="text-body text-pretty text-[#3f3d39]">
              {item}
            </li>
          ))}
        </ul>
      )}
      {s.stack && (
        <p className="max-w-[60ch] text-ui leading-relaxed text-[#3f3d39]">
          <span className="font-display font-bold text-ink">{labels.stack}. </span>
          {s.stack.join(", ")}.
        </p>
      )}
    </div>
  );

  /** `always`: details are shown without hover (small screens, touch). */
  const head = (s: TimelineStep, i: number, always = false) => (
    <button
      type="button"
      onClick={() => toggle(i)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHot(i)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHot(null)}
      onFocus={(e) => e.currentTarget.matches(":focus-visible") && setHot(i)}
      onBlur={() => setHot(null)}
      aria-expanded={open === i}
      aria-controls={`${panelId(i)} ${panelId(i)}-m`}
      // A short name ("role, period"); the summary is its description. The whole
      // block as a name was ~30 words for a screen reader.
      aria-label={`${s.role}, ${s.period}`}
      aria-describedby={`${uid}-sum-${always ? "v" : "h"}-${i}`}
      className={`group/step relative flex w-full cursor-pointer flex-col items-start gap-2 text-left transition-opacity ${ease} focus-visible:outline-ink ${quiet(i) ? "opacity-40" : ""}`}
    >
      <span className="text-note text-gray-600">
        {s.current ? (
          <>
            {s.period} <span className="highlight text-ink">{labels.now}</span>
          </>
        ) : (
          s.period
        )}
      </span>
      <span className="font-display text-[clamp(1.375rem,1.1rem+0.9vw,2rem)] leading-[1.05] font-bold tracking-[-0.025em] text-balance">{s.role}</span>
      <span className="text-caption font-medium">{s.org}</span>
      <span id={`${uid}-sum-${always ? "v" : "h"}-${i}`} className="max-w-[30ch] text-ui leading-snug text-pretty text-gray-600">{s.summary}</span>
      {/* More: on the line it unrolls in the free space above the role (no layout,
          nothing moves); on small screens it is part of the step. */}
      <span
        className={`flex flex-col gap-1 text-caption text-ink transition-[clip-path,opacity] ${ease} ${
          always
            ? ""
            : "absolute bottom-full left-0 mb-4 opacity-0 [clip-path:inset(100%_0_0_0)] group-hover/step:opacity-100 group-hover/step:[clip-path:inset(0)] group-focus-visible/step:opacity-100 group-focus-visible/step:[clip-path:inset(0)] [@media(hover:none)]:opacity-100 [@media(hover:none)]:[clip-path:none]"
        }`}
      >
        {s.details.map((d) => (
          <span key={d}>{d}</span>
        ))}
        {/* The current role's period already says "since…". */}
        {!s.current && <span className="text-note text-gray-600">{cap(s.duration)}</span>}
      </span>
      <span className="mt-1 font-display text-[1rem] font-bold tracking-[-0.01em] underline decoration-1 underline-offset-[0.3em]">
        {open === i ? labels.close : labels.seeMore}
      </span>
    </button>
  );

  const opened = shown !== null ? steps[shown] : undefined;

  return (
    <div ref={root}>
      {/* Desktop: the roles climb to the right; one line runs under them. */}
      <div data-tl-h className="relative hidden pt-28 pb-16 lg:block">
        <svg data-tl-svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-ink" />
        <ol
          className="relative grid items-end gap-x-[clamp(1.5rem,3vw,3.5rem)] [--rise:clamp(2.75rem,5vw,5.5rem)]"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((s, i) => (
            <li
              key={s.period}
              data-step
              style={{ "--step": i } as CSSProperties}
              className="tl-step mb-[calc(var(--step)*var(--rise)+2.5rem)]"
            >
              {head(s, i)}
            </li>
          ))}
        </ol>

        {opened && shown !== null && (
          <div
            data-tl-panel="h"
            id={panelId(shown)}
            role="region"
            aria-label={opened.role}
            className="relative mt-[clamp(1.5rem,3vw,3rem)] scroll-mb-8"
          >
            <div data-tl-content className="grid grid-cols-12 gap-x-(--page-gutter) gap-y-8">
            <div className="col-span-4 flex flex-col gap-4">
              <p className="font-display text-headline-l leading-[0.98] font-bold tracking-[-0.03em] text-balance">{opened.role}</p>
              <p className="text-note text-[1.125rem] text-gray-600">
                {opened.org}, {opened.area}. {cap(opened.duration)}.
              </p>
              <button
                type="button"
                onClick={() => go(null)}
                className="mt-2 flex min-h-11 items-center self-start font-display text-[1rem] font-bold underline decoration-1 underline-offset-[0.3em] transition-colors duration-(--duration-fast) hover:text-gray-600 focus-visible:outline-ink"
              >
                {labels.close}
              </button>
            </div>
            <div className="col-span-7 col-start-6">{account(opened)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Small screens: the line runs down the left side, top to bottom. */}
      <div data-tl-v className="relative lg:hidden">
        <svg data-tl-svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-ink" />
        <ol className="relative flex flex-col gap-[clamp(2.5rem,8vw,3.5rem)] pl-8">
          {steps.map((s, i) => (
            <li key={s.period} data-step className="tl-step flex flex-col gap-5">
              {head(s, i, true)}
              {shown === i && (
                <div id={`${panelId(i)}-m`} data-tl-panel="v" role="region" aria-label={s.role} className="flex flex-col gap-4">
                  <div data-tl-content className="flex flex-col gap-4">
                  <p className="text-note text-gray-600">
                    {s.org}, {s.area}. {cap(s.duration)}.
                  </p>
                  {account(s)}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
