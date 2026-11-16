import localFont from "next/font/local";

/**
 * Display: Satoshi (variable weight 300–900, Indian Type Foundry, ITF Free Font
 * License). Headings, numerals and display UI. The file is not in git: the
 * license forbids distributing it through a public repository, so
 * scripts/fonts.mjs fetches the official woff2 before every build (npm prebuild).
 * The hero name is NOT set in this font at runtime: it is pre-lettered SVG
 * (scripts/lettering.py → src/components/hero/name-paths.ts).
 */
export const display = localFont({
  src: [{ path: "../fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" }],
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  fallback: ["system-ui", "sans-serif"],
});

/**
 * Text: IBM Plex Sans — body, UI, metadata. No italic face: nothing on the site is
 * set in italic, and next/font preloads every face of a family, so the unused
 * italic (24 KB) was fetched on every first visit, competing with Satoshi on slow
 * connections (2026-11-16 audit). Re-add IBMPlexSans-Italic.woff2 here if italic
 * text is ever needed (the file stays in src/fonts).
 */
export const sans = localFont({
  src: [
    { path: "../fonts/IBMPlexSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/IBMPlexSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/IBMPlexSans-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  fallback: ["system-ui", "sans-serif"],
});

/** Editorial voice: Instrument Serif italic — only the statement and pull lines. */
export const serif = localFont({
  src: [{ path: "../fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" }],
  variable: "--font-instrument-serif",
  display: "swap",
  // Not preloaded: no page uses it today (Iury, 2026-11-11: the curved face did not
  // work), so a preload fetched 22 KB nobody saw. Unpreloaded and unused, the
  // browser never downloads it; if it comes back, it loads on first use.
  preload: false,
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "serif"],
});
