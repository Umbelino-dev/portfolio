"use client";

import Image from "next/image";
import { memo, useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type RefObject } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { button } from "@/components/layout/button";

export interface DeckPhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  /** Shown in the box that rises from the pointer. */
  summary?: string;
  /** Shown when the card is opened. */
  story?: string;
  linkedin?: { url: string; embed?: string; also?: { label: string; url: string }[] };
  /** What the moment added (short points). */
  takeaways?: string[];
  /** CSS object-position for the crop. */
  focus?: string;
}

export interface DeckLabels {
  deck: string;
  show: string; // "Mostrar {caption}"
  more: string; // "Saber mais"
  hint: string; // "Clique para saber mais"
  pending: string; // "A história desta foto entra em breve."
  linkedin: string; // "Ver no LinkedIn"
  post: string; // "Post no LinkedIn" (iframe title)
  takeaways: string; // "O que agregou"
  profile: string; // "Ver perfil no LinkedIn"
  profileUrl: string; // the LinkedIn profile, when a photo has no post
  close: string;
  pause: string; // "Pausar fotos"
  play: string; // "Reproduzir fotos"
  prev: string; // "Foto anterior"
  next: string; // "Próxima foto"
}

/** Seconds a card stays in front before the next one is dealt. */
const HOLD = 3.4;

/**
 * Where a card sits for its offset from the front (0 = front, ±1 = beside it,
 * ±2 = further out / tucked behind). Fractions of the card's own width.
 */
function pose(o: number, n: number) {
  const a = Math.abs(o);
  const side = Math.sign(o);
  // With 4 cards, the one opposite the front waits hidden behind it.
  if (n === 4 && a === 2) return { x: 0, y: 0.02, scale: 0.7, rotation: 0, opacity: 0, z: 0 };
  if (a === 0) return { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, z: 30 };
  if (a === 1) return { x: side * 0.66, y: 0.05, scale: 0.8, rotation: side * 7, opacity: 1, z: 20 };
  return { x: side * 1.18, y: 0.13, scale: 0.64, rotation: side * 13, opacity: a > 2 ? 0 : 0.85, z: 10 - a };
}

/**
 * A small deck of large photo cards (About), after Iury's reference: the card in
 * front is centred at full size; its neighbours tuck behind it, smaller, turned
 * outward in a fan. Every few seconds the next card is dealt to the front.
 *
 * Choosing a card: on hover a card lifts a little out of the deck (its inner
 * layer, so it never fights the deck's own transforms) and a small box rises
 * from the pointer with the photo's name, a one-line summary and "click to learn
 * more". A click (or Enter) opens the card: the photo held still on the left, and
 * on the right its story, what it added, and always a link to LinkedIn (the post,
 * or the profile when there is none). The panel is a native <dialog> (focus trap,
 * Esc, backdrop click closes, focus returns to the card).
 *
 * Each card: rounded portrait, a rim of light, and a dark gradient at the base
 * under the white caption (painted once, then moved as a texture).
 *
 * Mouse and keyboard: clicking any card opens it (its details). Touch: tapping a
 * card beside the front one brings it forward; tapping the front card opens it. Arrow buttons under the deck deal too.
 *
 * - GSAP tweens only when the front card changes (transform + opacity), no loop.
 * - Swipe / drag sideways or ← → on the deck deal the next / previous card.
 * - It deals by itself only while visible, with motion allowed, not hovered or
 *   focused, and while no card is open.
 * - Reduced motion: no auto-play; changes and the panel are instant.
 */
export function PhotoDeck({ photos, labels }: { photos: DeckPhoto[]; labels: DeckLabels }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [front, setFront] = useState(0);
  // Read by the memoised cards' stable click handler.
  const frontRef = useRef(0);
  useEffect(() => {
    frontRef.current = front;
  }, [front]);
  // The card whose text the hover box holds: kept while the box fades out, so it
  // never flashes a placeholder; before any hover it holds nothing.
  const [shownIdx, setShownIdx] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [opened, setOpened] = useState<number | null>(null);
  // Auto-dealing can be paused and resumed (WCAG 2.2.2); a deal by the visitor
  // pauses it, and the play button brings it back.
  const [playing, setPlaying] = useState(true);
  const first = useRef(true);
  const paused = useRef(false);
  const visible = useRef(false);

  // Each photo appears once (Iury, 2026-11-16): no repeated cards.
  const cards = photos;
  const n = cards.length;
  const offset = useCallback(
    (i: number, f: number) => {
      let o = (((i - f) % n) + n) % n;
      if (o > n / 2) o -= n;
      return o;
    },
    [n],
  );
  const go = useCallback((to: number) => setFront(((to % n) + n) % n), [n]);
  /** A deal the visitor asked for: it also ends auto-dealing. */
  const deal = useCallback(
    (to: number) => {
      setPlaying(false);
      go(to);
    },
    [go],
  );

  // Lay the cards out for the current front card. A card that wraps round the
  // deck (the one leaving one side for the other) travels behind the front card,
  // smaller and dimmer at the middle of its path, so the deck reads as one turn.
  const prevFront = useRef(front);
  useGSAP(
    () => {
      const el = stage.current;
      if (!el) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-deck-card]", el);
      const reduced = window.matchMedia(MQ.reduced).matches;
      const instant = first.current || reduced;
      first.current = false;
      const from = prevFront.current;
      prevFront.current = front;
      items.forEach((card, i) => {
        const p = pose(offset(i, front), n);
        const before = offset(i, from);
        const after = offset(i, front);
        const w = card.offsetWidth;
        const to = { x: p.x * w, y: p.y * w, scale: p.scale, rotation: p.rotation, opacity: p.opacity };
        const wraps = !instant && Math.sign(before) !== 0 && Math.sign(after) !== 0 && Math.sign(before) !== Math.sign(after);
        if (instant) {
          gsap.set(card, { ...to, zIndex: p.z });
          return;
        }
        if (wraps) {
          // Behind everything for the whole trip; its final layer only at the end.
          gsap.set(card, { zIndex: 1 });
          gsap.to(card, {
            keyframes: [
              { x: 0, y: -0.02 * w, scale: Math.min(p.scale, 0.62), rotation: 0, opacity: 0.55, duration: 0.47, ease: "power2.in" },
              { ...to, duration: 0.48, ease: "power2.out" },
            ],
            overwrite: "auto",
            onComplete: () => void gsap.set(card, { zIndex: p.z }),
          });
          return;
        }
        gsap.set(card, { zIndex: p.z });
        gsap.to(card, { ...to, duration: 0.95, ease: "power3.inOut", overwrite: "auto" });
      });
    },
    { scope: stage, dependencies: [front, n], revertOnUpdate: false },
  );

  // Re-place on resize (poses are fractions of the card's width). Created once:
  // a ResizeObserver reports on observe(), and when this effect was re-created on
  // every deal that first report snapped every card to its end pose in the first
  // frame of the tween, then the tween pulled it back: the one-frame "zoom"
  // (Iury, 2026-11-16). Now it acts only when the card width really changes.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let width = el.offsetWidth;
    const ro = new ResizeObserver(() => {
      if (el.offsetWidth === width) return;
      width = el.offsetWidth;
      gsap.utils.toArray<HTMLElement>("[data-deck-card]", el).forEach((card, i) => {
        const p = pose(offset(i, frontRef.current), n);
        gsap.killTweensOf(card);
        gsap.set(card, { x: p.x * card.offsetWidth, y: p.y * card.offsetWidth, scale: p.scale, rotation: p.rotation, opacity: p.opacity, zIndex: p.z });
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [n, offset]);

  // Auto-deal: only while visible, motion allowed, not hovered, no card open, tab shown.
  useEffect(() => {
    const el = root.current;
    if (!el || !playing || window.matchMedia(MQ.reduced).matches) return;
    const io = new IntersectionObserver(([e]) => (visible.current = Boolean(e?.isIntersecting)), { threshold: 0.35 });
    io.observe(el);
    const call = gsap.delayedCall(HOLD, () => {
      if (visible.current && !paused.current && opened === null && !document.hidden) go(front + 1);
      else call.restart(true);
    });
    return () => {
      io.disconnect();
      call.kill();
    };
  }, [front, go, opened, playing]);

  // The box that rises from the pointer: follows it, appears with a short rise.
  // Stable callbacks, so the memoised cards never re-render for hover or panel state.
  const placeTip = useCallback((x: number, y: number) => {
    const el = tip.current;
    if (!el) return;
    const w = el.offsetWidth;
    const flip = x + 18 + w > window.innerWidth - 12;
    el.style.transform = `translate3d(${flip ? x - 18 - w : x + 18}px, ${y - el.offsetHeight - 14}px, 0)`;
  }, []);
  const onEnter = useCallback(
    (i: number, x: number, y: number) => {
      setHovered(i);
      setShownIdx(i);
      placeTip(x, y);
    },
    [placeTip],
  );
  const onLeave = useCallback((i: number) => setHovered((h) => (h === i ? null : h)), []);

  // Open / close the card's panel. The panel grows out of the card that was
  // clicked (its position and size), and shrinks back into the front card.
  const origin = useRef<HTMLElement | null>(null);
  const closing = useRef(false);
  /** Offset and scale that put the panel exactly over `el`. */
  const over = (d: HTMLElement, el: HTMLElement) => {
    const a = el.getBoundingClientRect();
    const b = d.getBoundingClientRect();
    return {
      x: a.left + a.width / 2 - (b.left + b.width / 2),
      y: a.top + a.height / 2 - (b.top + b.height / 2),
      scale: Math.max(0.2, Math.min(a.width / b.width, a.height / b.height)),
    };
  };
  const open = useCallback(
    (i: number, el: HTMLElement, touch: boolean) => {
      // Touch: a card beside the front one comes forward first (and ends
      // auto-dealing); only the front card opens. Mouse / keyboard open any card.
      if (touch && offset(i, frontRef.current) !== 0) {
        deal(i);
        return;
      }
      // The deck stays as it is behind the panel: no second animation while it opens.
      origin.current = el;
      setOpened(i % photos.length);
      setHovered(null);
    },
    [deal, offset, photos.length],
  );
  useEffect(() => {
    const d = dialog.current;
    if (!d || opened === null) return;
    closing.current = false;
    d.classList.remove("is-closing");
    if (!d.open) d.showModal();
    if (window.matchMedia(MQ.reduced).matches) return;
    gsap.set(d, { x: 0, y: 0, scale: 1, opacity: 1 });
    const from = origin.current ? over(d, origin.current) : { x: 0, y: 24, scale: 0.96 };
    // Its own compositor layer while it moves: scaled as a texture, not repainted.
    d.style.willChange = "transform, opacity";
    gsap.fromTo(
      d,
      { ...from, opacity: 0.4, transformOrigin: "50% 50%" },
      { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.62, ease: "expo.out", onComplete: () => void (d.style.willChange = "") },
    );
    gsap.fromTo(
      d.querySelectorAll("[data-panel-in]"),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.06, delay: 0.18 },
    );
  }, [opened]);
  const close = () => {
    const d = dialog.current;
    if (!d || !d.open || closing.current) return;
    closing.current = true;
    d.classList.add("is-closing"); // fades the backdrop (CSS)
    // Back into the card it came from (it is still where it was).
    const card = origin.current;
    if (window.matchMedia(MQ.reduced).matches || !card) {
      d.close();
      return;
    }
    d.style.willChange = "transform, opacity";
    gsap.to(d, {
      ...over(d, card),
      opacity: 0,
      duration: 0.42,
      ease: "power3.in",
      onComplete: () => {
        d.close();
        d.style.willChange = "";
        gsap.set(d, { x: 0, y: 0, scale: 1, opacity: 1 });
      },
    });
  };

  // Drag / swipe: a horizontal flick deals the next or previous card.
  const drag = useRef<{ x: number; id: number; moved: boolean; type: string } | null>(null);
  const onDown = (e: PointerEvent) => {
    drag.current = { x: e.clientX, id: e.pointerId, moved: false, type: e.pointerType };
  };
  const onUp = (e: PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 40) {
      d.moved = true;
      deal(front + (dx < 0 ? 1 : -1));
    }
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") deal(front + 1);
    else if (e.key === "ArrowLeft") deal(front - 1);
    else return;
    e.preventDefault();
  };

  const shown = shownIdx !== null ? cards[shownIdx] : undefined;
  /** The three round controls under the deck: quiet until hovered. */
  const ctrl =
    "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-ink/12 text-ink/70 transition-colors duration-(--duration-fast) hover:border-ink/40 hover:bg-ink/[0.04] hover:text-ink focus-visible:outline-ink";
  const story = opened !== null ? photos[opened] : undefined;

  return (
    <div
      ref={root}
      role="group"
      aria-roledescription="carousel"
      aria-label={labels.deck}
      onKeyDown={onKey}
      onPointerEnter={(e) => e.pointerType === "mouse" && (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
      className="relative overflow-hidden py-[clamp(2.5rem,5vw,4.5rem)] lg:py-[clamp(1.5rem,4vh,3.5rem)]"
    >
      <div
        ref={stage}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (drag.current = null)}
        className="relative mx-auto h-[calc(var(--card-w)*4/3*1.12)] w-(--card-w) touch-pan-y select-none [--card-w:clamp(15rem,64vw,26rem)] md:[--card-w:clamp(15rem,min(27vw,calc((100svh-20rem)*0.67)),26rem)]"
      >
        {cards.map((p, i) => (
          <DeckCard
            key={i}
            p={p}
            i={i}
            more={labels.more}
            dragRef={drag}
            onOpen={open}
            onEnter={onEnter}
            onMove={placeTip}
            onLeave={onLeave}
          />
        ))}
      </div>

      {/* Under the deck: the photos' names, and right under them one control,
          ← | pause/play | → (Iury, 2026-11-16). The arrows deal (and pause the
          auto-deal); the middle button pauses or resumes it. Under reduced motion
          there is no auto-deal, so the middle button is hidden. */}
      <div className="mt-[clamp(1.5rem,3vw,2.5rem)] flex flex-col items-center gap-3 px-(--page-margin)">
        {/* The names are the index: one per photo, side by side. The one in front
            is ink on the lime highlighter; any name brings its photo forward. They
            follow `front`, so they stay in step with clicks, arrows and auto-play. */}
        <ul className="grid w-full max-w-[42rem] gap-x-4 text-center" style={{ gridTemplateColumns: `repeat(${photos.length}, minmax(0, 1fr))` }}>
          {photos.map((p, i) => {
            const active = front === i;
            return (
              <li key={p.src}>
                <button
                  type="button"
                  onClick={() => deal(i)}
                  aria-current={active ? "true" : undefined}
                  aria-label={labels.show.replace("{caption}", p.caption)}
                  className={`min-h-11 cursor-pointer font-display text-[max(1.0625rem,14px)] font-bold tracking-[-0.01em] transition-colors duration-(--duration-base) ease-(--ease-out-soft) ${
                    active ? "text-ink" : "text-gray-600 hover:text-ink"
                  }`}
                >
                  <span className={active ? "highlight" : ""}>{p.caption}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => deal(front - 1)} aria-label={labels.prev} className={ctrl}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[1.125rem]" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setPlaying((v) => !v)}
            aria-label={playing ? labels.pause : labels.play}
            aria-pressed={!playing}
            className={`${ctrl} motion-reduce:hidden`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[1.125rem]" fill="currentColor">
              {playing ? (
                <>
                  <rect x="7" y="5.5" width="3" height="13" rx="1" />
                  <rect x="14" y="5.5" width="3" height="13" rx="1" />
                </>
              ) : (
                <path d="M8.5 5.8v12.4a.8.8 0 0 0 1.2.7l9.6-6.2a.8.8 0 0 0 0-1.4L9.7 5.1a.8.8 0 0 0-1.2.7z" />
              )}
            </svg>
          </button>
          <button type="button" onClick={() => deal(front + 1)} aria-label={labels.next} className={ctrl}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[1.125rem]" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* The box that rises from the pointer (fine pointers only; decorative: the
          card's own label and the panel carry the same text). */}
      <div ref={tip} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[80] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
        <div
          className={`w-[min(18rem,70vw)] rounded-[1rem] bg-paper-0/95 p-4 text-ink shadow-[0_18px_40px_-18px_rgba(16,16,16,0.45)] backdrop-blur-md transition-[opacity,translate,visibility] duration-(--duration-base) ease-(--ease-out-soft) ${
            hovered !== null ? "visible translate-y-0 opacity-100" : "invisible translate-y-3 opacity-0"
          }`}
        >
          {shown && (
            <>
              <p className="font-display text-[1.0625rem] leading-tight font-bold tracking-[-0.01em]">{shown.caption}</p>
              <p className="mt-1.5 text-caption leading-snug text-gray-600">{shown.summary ?? labels.pending}</p>
              <p className="mt-3 font-display text-[max(0.875rem,12.5px)] font-bold underline decoration-1 underline-offset-[0.3em]">{labels.hint}</p>
            </>
          )}
        </div>
      </div>

      {/* The card, opened: the photo, its story and its LinkedIn post. */}
      <dialog
        ref={dialog}
        aria-labelledby="deck-story-title"
        onCancel={(e) => {
          // Esc: close with the animation instead of the instant default.
          e.preventDefault();
          close();
        }}
        onClose={() => {
          closing.current = false;
          setOpened(null);
        }}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto max-h-[min(92dvh,46rem)] w-[min(64rem,calc(100vw-2rem))] overflow-y-auto rounded-[1.75rem] bg-paper p-0 text-ink shadow-[0_28px_56px_-28px_rgba(16,16,16,0.55)] backdrop:bg-ink/62 md:overflow-hidden"
      >
        {story && (
          /* Desktop: two fixed columns, the photo held still and centred on the left,
             only the text on the right scrolls. Small screens: one column, the whole
             panel scrolls. */
          <div className="grid gap-[clamp(1.5rem,3vw,2.5rem)] p-[clamp(1.25rem,3vw,2.5rem)] md:h-[min(calc(92dvh-0px),46rem)] md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)]">
            <div className="flex items-center justify-center md:min-h-0">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] bg-ink-800 md:max-h-full">
                <Image src={story.src} alt={story.alt} width={story.width} height={story.height} sizes="(min-width: 768px) 30rem, 90vw" className="h-full w-full object-cover" style={{ objectPosition: story.focus ?? "50% 18%" }} />
              </div>
            </div>
            <div data-panel-in className="flex min-w-0 flex-col gap-5 md:min-h-0 md:overflow-y-auto md:pr-2 md:[scrollbar-width:thin]">
              <div className="flex items-start justify-between gap-4">
                <h3 id="deck-story-title" className="font-display text-headline-m leading-[1.02] font-bold tracking-[-0.02em] text-balance">
                  {story.caption}
                </h3>
                <button
                  type="button"
                  onClick={close}
                  className="-mt-1 flex min-h-11 shrink-0 items-center font-display text-[1rem] font-bold underline decoration-1 underline-offset-[0.3em] hover:text-gray-600"
                >
                  {labels.close}
                </button>
              </div>
              {story.summary && <p className="text-lead leading-snug text-pretty">{story.summary}</p>}
              {(story.story || !story.takeaways) && <p className="max-w-[60ch] text-body text-pretty text-[#3f3d39]">{story.story ?? labels.pending}</p>}
              {story.takeaways && (
                <div className="flex flex-col gap-3">
                  <h4 className="font-display text-title font-bold tracking-[-0.01em]">{labels.takeaways}</h4>
                  <ul className="flex flex-col gap-3">
                    {story.takeaways.map((item, k) => (
                      <li key={k} className="max-w-[56ch] text-body leading-relaxed text-pretty">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {story.linkedin?.embed && (
                <iframe
                  src={story.linkedin.embed}
                  title={labels.post}
                  loading="lazy"
                  className="h-[min(34rem,60dvh)] w-full shrink-0 rounded-[1rem] border-0 bg-paper-0"
                  allowFullScreen
                />
              )}
              {/* Always a way to LinkedIn: the post, or the profile when there is none. */}
              <a
                href={story.linkedin?.url ?? labels.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${button.ink} mt-1 shrink-0`}
              >
                {story.linkedin?.url ? labels.linkedin : labels.profile} <span aria-hidden="true">↗</span>
              </a>
              {story.linkedin?.also?.map((post) => (
                <a
                  key={post.url}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="-mt-2 flex min-h-11 shrink-0 items-center gap-2 self-start font-display text-[1rem] font-bold underline decoration-1 underline-offset-[0.3em] transition-colors duration-(--duration-fast) hover:text-gray-600"
                >
                  {post.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}

/**
 * One card of the deck. Memoised: its props are stable (the photo object, plain
 * values and stable callbacks), so hovering, dealing and opening the panel never
 * re-render the card or its two images. The deck's position, scale and z-index
 * are set by GSAP on the <figure> directly.
 */
const DeckCard = memo(function DeckCard({
  p,
  i,
  more,
  dragRef,
  onOpen,
  onEnter,
  onMove,
  onLeave,
}: {
  p: DeckPhoto;
  i: number;
  more: string;
  dragRef: RefObject<{ x: number; id: number; moved: boolean; type: string } | null>;
  onOpen: (i: number, el: HTMLElement, touch: boolean) => void;
  onEnter: (i: number, x: number, y: number) => void;
  onMove: (x: number, y: number) => void;
  onLeave: (i: number) => void;
}) {
  return (
    <figure data-deck-card className="absolute inset-x-0 top-0 aspect-[3/4] will-change-transform">
      <button
        type="button"
        aria-label={`${more}: ${p.caption}`}
        onClick={(e) => {
          // A swipe that ended on a card is not a click.
          if (dragRef.current?.moved) {
            dragRef.current = null;
            return;
          }
          // Keyboard clicks have no pointerdown: they count as "not touch".
          const touch = Boolean(dragRef.current && dragRef.current.type !== "mouse");
          dragRef.current = null;
          onOpen(i, e.currentTarget, touch);
        }}
        onPointerEnter={(e) => e.pointerType === "mouse" && onEnter(i, e.clientX, e.clientY)}
        onPointerMove={(e) => e.pointerType === "mouse" && onMove(e.clientX, e.clientY)}
        onPointerLeave={() => onLeave(i)}
        className="group/card block h-full w-full cursor-pointer text-left focus-visible:outline-ink"
      >
        {/* The lift: an inner layer, so it composes with the deck's own transforms. */}
        <span className="relative block h-full overflow-hidden rounded-[clamp(1.25rem,2vw,1.875rem)] bg-ink-800 shadow-[0_22px_36px_-22px_rgba(16,16,16,0.55)] transition-[translate] duration-(--duration-base) ease-(--ease-out-soft) [will-change:translate] [@media(hover:hover)]:group-hover/card:-translate-y-4 group-focus-visible/card:-translate-y-4">
          <Image
            src={p.src}
            alt={p.alt}
            width={p.width}
            height={p.height}
            draggable={false}
            sizes="(min-width: 768px) 27vw, 64vw"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: p.focus ?? "50% 18%" }}
          />
          {/* A dark base under the caption, only at the bottom: the face stays
              clear and the white title keeps its contrast. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.3)_35%,transparent_60%)]"
          />
          <span className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 px-5 pb-[clamp(1.125rem,1.8vw,1.625rem)] text-center text-paper-0 [text-shadow:0_1px_8px_rgba(0,0,0,0.35)]">
            <span className="font-display text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-tight font-bold tracking-[-0.015em] text-balance">
              {p.caption}
            </span>
            <span className="font-display text-[max(0.9375rem,13px)] font-medium opacity-85">{more}</span>
          </span>
          {/* Rim light: a bright edge and a soft inner glow. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.5),inset_0_1px_24px_rgba(255,255,255,0.2)]"
          />
        </span>
      </button>
    </figure>
  );
});
