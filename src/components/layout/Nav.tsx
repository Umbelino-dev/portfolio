"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { site } from "@/content/profile";
import { SURFACE_EVENT } from "./surface";

const ITEMS = [
  { id: "hero", key: "index" },
  { id: "about", key: "about" },
  { id: "projects", key: "projects" },
  { id: "contact", key: "contact" },
] as const;

type ItemId = (typeof ITEMS)[number]["id"];
/** Sections without a nav item (e.g. "approach") mark nothing as current. */
type SectionId = ItemId | (string & {});

/** The line, in px from the top, that decides the nav theme (Homepage R02: 44px). */
const THEME_LINE = 44;

/**
 * Primary nav. Reads the page instead of being told:
 * - theme: the `data-surface` of the section under the nav (light ↔ dark),
 * - active item: the `[data-nav-id]` section crossing the middle of the viewport.
 * One passive scroll listener, throttled to one frame.
 */
export function Nav({ variant = "home" }: { variant?: "home" | "case" }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [light, setLight] = useState(false);
  const [active, setActive] = useState<SectionId>("hero");
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      // The surface under the nav: the innermost [data-surface] box that spans the
      // line THEME_LINE px from the top (later in document order = deeper). Read
      // from geometry: every surface is an in-flow section today, and this replaced
      // an elementsFromPoint hit-test that was the costliest call while scrolling
      // (2026-11-16 audit). A clipped layer (as the old Night→Day stage was) would
      // need the hit-test back. `data-nav-as` still names the active item.
      let surface = "dark";
      let alias: string | undefined;
      document.querySelectorAll<HTMLElement>("[data-surface]").forEach((owner) => {
        const r = owner.getBoundingClientRect();
        if (r.top <= THEME_LINE && r.bottom > THEME_LINE) {
          surface = owner.dataset.surface ?? "dark";
          alias = owner.dataset.navAs;
        }
      });
      let current: SectionId = "hero";
      document.querySelectorAll<HTMLElement>("[data-nav-id]").forEach((s) => {
        if (s.getBoundingClientRect().top < mid) current = s.dataset.navId ?? current;
      });
      setLight(surface === "light");
      // The page scrollbar's track follows the same surface (globals.css).
      if (document.documentElement.dataset.scrollSurface !== surface) document.documentElement.dataset.scrollSurface = surface;
      setActive(alias ?? current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    // A surface change can land after this frame's scroll read; re-read once it has painted.
    let late = 0;
    const onSurface = () => {
      cancelAnimationFrame(late);
      late = requestAnimationFrame(() => (late = requestAnimationFrame(read)));
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener(SURFACE_EVENT, onSurface);
    return () => {
      cancelAnimationFrame(late);
      window.removeEventListener(SURFACE_EVENT, onSurface);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Mobile menu: Escape and outside clicks close it; focus returns to the button.
  useEffect(() => {
    if (!open) return;
    menuPanel.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!menuPanel.current?.contains(target) && !menuButton.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const glass = light
    ? "border-ink/14 bg-paper/62 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_24px_rgba(16,16,16,0.06)]"
    : "border-paper/24 bg-[linear-gradient(180deg,rgba(255,255,255,0.085),rgba(255,255,255,0.03))] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.35),0_8px_28px_rgba(0,0,0,0.45)]";
  const glassBlur = "backdrop-blur-[16px] backdrop-saturate-[1.4] backdrop-brightness-[1.15]";
  const transition = "transition-[color,background-color,border-color,box-shadow] duration-(--duration-base) ease-(--ease-out-soft)";
  const focusRing = light ? "focus-visible:outline-ink" : "focus-visible:outline-signal";

  // Below md the page scrolls under the name: once past the hero it gets the same
  // glass pill as the other floating controls, so it never sits on top of text.
  // From md up it is bare text: the whole backdrop-filter goes (brightness and
  // saturate too, not only the blur) and the dark gradient image, or the box
  // tints the page behind it.
  const overContent = variant === "case" || active !== "hero";
  const brand = `flex min-h-11 items-center whitespace-nowrap font-display text-[1.0625rem] font-bold tracking-[-0.01em] ${focusRing} ${
    overContent ? `max-md:-ml-3 max-md:rounded-pill max-md:border max-md:px-3 ${glass} ${glassBlur} md:border-transparent md:bg-transparent md:bg-none md:shadow-none md:backdrop-filter-none` : ""
  }`;

  const link = (id: ItemId, key: (typeof ITEMS)[number]["key"], extra = "") => (
    <a
      key={id}
      href={`#${id}`}
      aria-current={active === id ? "location" : undefined}
      onClick={() => setOpen(false)}
      className={`flex min-h-11 items-center rounded-pill px-3.5 text-[max(0.8125rem,12px)] font-medium transition-opacity duration-(--duration-base) hover:opacity-100 ${active === id ? "opacity-100" : "opacity-65"} ${focusRing} ${extra}`}
    >
      {t(key)}
    </a>
  );

  return (
    // The nav strip spans the full width: only its controls take the pointer,
    // so content scrolling under the empty part stays hoverable and clickable.
    <div className="pointer-events-none sticky top-0 z-40 h-0">
      <nav
        aria-label={t("label")}
        className={`pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-6 [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&>div]:pointer-events-auto px-(--page-margin) py-3 md:py-5 ${transition} ${light ? "text-ink" : "text-paper"}`}
      >
        {variant === "home" ? (
          <a href="#hero" aria-label={t("home")} className={brand}>
            {site.name}
          </a>
        ) : (
          <Link href="/" aria-label={t("home")} className={brand}>
            {site.name}
          </Link>
        )}

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {variant === "case" && (
            // Case study: one pill back to the index (Case Study R01; 44px tall on mobile).
            <Link
              href="/#projects"
              className={`flex min-h-11 min-w-11 items-center justify-center gap-2.5 rounded-pill border px-4 text-[max(0.8125rem,12px)] whitespace-nowrap max-[26.25rem]:px-0 sm:px-4.5 font-medium ${glass} ${glassBlur} ${transition} ${focusRing}`}
            >
              <span aria-hidden="true">←</span>
              {/* Under 420px the bar would overflow beside the name: the arrow alone, the label for assistive tech. */}
              <span className="sm:hidden max-[26.25rem]:sr-only">{t("projectsShort")}</span>
              <span className="max-sm:hidden">{t("allProjects")}</span>
            </Link>
          )}
          {variant === "case" && (
            // Every page has a way to talk: on a project page, the footer's contact block.
            <a
              href="#contact"
              aria-label={t("contact")}
              className={`flex min-h-11 min-w-11 items-center justify-center rounded-pill border text-[max(0.8125rem,12px)] font-medium whitespace-nowrap sm:px-4 ${glass} ${glassBlur} ${transition} ${focusRing}`}
            >
              {/* Small screens: an envelope, so the bar fits beside the name; the label from sm up. */}
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[1.125rem] sm:hidden" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
                <path d="M4 7l8 6 8-6" />
              </svg>
              <span className="max-sm:hidden">{t("contact")}</span>
            </a>
          )}

          {/* Desktop: the glass pill with every section */}
          <div className={`${variant === "case" ? "!hidden" : ""} hidden items-center gap-0.5 rounded-pill border p-[3px] md:flex ${glass} ${glassBlur} ${transition}`}>
            {ITEMS.map((i) => link(i.id, i.key))}
          </div>

          {/* The language, said: the current one marked (ink pill), the other a link
              that switches. Both read "PT" / "EN" in every language. */}
          <div role="group" aria-label={t("language")} className={`flex items-center rounded-pill border p-[3px] ${glass} ${glassBlur} ${transition}`}>
            {(["pt", "en"] as const).map((l) =>
              l === locale ? (
                <span
                  key={l}
                  aria-current="true"
                  lang={l === "pt" ? "pt-BR" : "en"}
                  className={`flex min-h-[2.375rem] min-w-[2.375rem] items-center justify-center rounded-pill px-2 text-label font-bold tracking-label ${light ? "bg-ink text-paper" : "bg-paper text-ink"}`}
                >
                  {l.toUpperCase()}
                </span>
              ) : (
                <Link
                  key={l}
                  href={pathname}
                  locale={l}
                  hrefLang={l === "pt" ? "pt-BR" : "en"}
                  aria-label={`${l.toUpperCase()} · ${t("switchLocale")}`}
                  className={`flex min-h-[2.375rem] min-w-[2.375rem] items-center justify-center rounded-pill px-2 text-label font-medium tracking-label opacity-65 transition-opacity duration-(--duration-fast) hover:opacity-100 ${focusRing}`}
                >
                  {l.toUpperCase()}
                </Link>
              ),
            )}
          </div>

          {/* Mobile: one pill that opens the same list */}
          <button
            ref={menuButton}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
            className={`${variant === "case" ? "!hidden" : ""} flex min-h-11 items-center rounded-pill border px-4 text-[max(0.8125rem,12px)] font-medium md:hidden ${glass} ${glassBlur} ${transition} ${focusRing}`}
          >
            {t("menu")}
          </button>
        </div>

        <div
          ref={menuPanel}
          id={menuId}
          hidden={!open}
          className={`absolute top-full right-(--page-margin) w-56 rounded-[18px] border p-1.5 md:hidden ${glassBlur} ${
            // Opaque enough to read over the hero: an open list is content, not decoration.
            light ? "border-ink/14 bg-paper/95" : "border-paper/20 bg-ink-800/95"
          }`}
        >
          <ul className="flex flex-col">
            {ITEMS.map((i) => (
              <li key={i.id}>{link(i.id, i.key, "w-full rounded-[12px]")}</li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
