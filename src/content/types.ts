/**
 * Content contracts. Presentation components read these types; copy lives in
 * src/content/* (facts) and messages/*.json (UI strings).
 *
 * Rule: nothing here may be invented. A fact without a source stays `undefined`
 * and the UI omits it. `confirmed: false` marks data copied from the design
 * prototype that Iury still has to validate.
 */
import type { Locale } from "@/i18n/routing";

/** Project stage — encoded by shape in the UI (StatusMark), never by colour. */
export type ProjectStatus = "concept" | "experiment" | "prototype" | "in-development" | "validating" | "live" | "evolving" | "in-use" | "pitch" | "shaping" | "mvp" | "ended";

/**
 * Where a project stands on the five-step approach (Approach section): 0 observe
 * (problem discovery), 1 understand (problem validation), 2 experiment (solution
 * validation), 3 build, 4 improve (iteration). Only what is true today.
 */
export type ProjectStage = 0 | 1 | 2 | 3 | 4;

/** A string per locale. */
export type Localized<T = string> = Record<Locale, T>;

export interface ProjectLink {
  label: Localized;
  href: string;
}

/** A figure or cover: a real image when `image` exists, otherwise the editorial placeholder. */
export interface MediaSlot {
  id: string;
  /** Desktop aspect; mobile may reflow (cover 16:9 → 4:3, 3:4 → 4:5). "1200/630" never reflows (brand pieces with text). */
  aspect: "16/9" | "4/3" | "3/4" | "1200/630";
  /** Mono spec label on the placeholder, e.g. "Painel". */
  label: Localized;
  caption: Localized;
  image?: MediaImage;
}

export interface CaseStudyStep {
  title: Localized;
  text: Localized;
}

export interface CaseStudyChapter {
  /** Stable id, used for anchors. */
  id: "problem" | "build" | "architecture" | "audit" | "product" | "learned" | "results" | "idea" | "stage" | "use" | "origin";
  /** Which part of the project page it belongs to: "Sobre o projeto" or "Processo e desenvolvimento". */
  part: "about" | "process";
  label: Localized; // "O problema" — numbered by position
  title: Localized; // display H2, max ~15ch
  /** Words of the title to mark with the `highlight` utility (light surface accent). */
  highlight?: Localized;
  body?: Localized<string[]>;
  /** Ruled list (index + H3 + one sentence). */
  steps?: CaseStudyStep[];
  figures?: MediaSlot[];
}

export interface Evidence {
  title: Localized;
  text: Localized;
  /** Outside research: where it comes from (a real, checked link). */
  source?: { label: string; href: string };
}

/**
 * Usage numbers of a live product (metrics policy, Iury 2026-11-16): aggregates
 * only, always dated and sourced, never about a person (no names, groups,
 * attendance rates, absences or people at risk), never a screenshot of a report.
 * A number without a source stays out; the block renders only when `confirmed`.
 */
export interface UsageMetrics {
  confirmed: boolean;
  /** ISO date of the data, e.g. "2026-11-16". */
  asOf: string;
  /** Where the numbers come from, said on the page. */
  source: Localized;
  /** One line of context said under the numbers (e.g. "em uma comunidade"). */
  scope?: Localized;
  items: { value: Localized; label: Localized; detail?: Localized }[];
}

/** A link related to a project that is not the product itself (its post, its repository). */
export interface RelatedLink {
  kind: "linkedin" | "github" | "instagram";
  label: Localized;
  href: string;
}

export interface CaseStudy {
  /** false = draft: no page is generated and the index does not link to it. */
  confirmed: boolean;
  lead?: Localized;
  /** Tools the product was built with (e.g. the AI builder) — shown next to the stack. */
  builtWith?: string[];
  cover?: MediaSlot;
  /** "Acesso ao projeto" when there is no public link: says why, never a dead button. */
  access?: Localized;
  /**
   * What each approach step looked like for this project (0 observe … 4 improve):
   * facts from the project, or outside research with its source. A step with
   * nothing here says so; nothing is invented to fill it.
   */
  evidence?: Partial<Record<ProjectStage, Evidence[]>>;
  /** Usage numbers shown with the facts in the presentation (see `UsageMetrics`). */
  usage?: UsageMetrics;
  /** A video shown inside a phone frame (e.g. a motion piece). No `src` yet = "em breve". */
  video?: { src?: string; poster?: string; /** CSS aspect-ratio of the video, e.g. "9 / 16". */ aspect?: string; title: Localized };
  /** Rendered in order; a chapter without body, steps or figures is skipped. */
  chapters: CaseStudyChapter[];
  source: string;
}

/** Tag keys, translated in messages (`tags.*`). */
export type TagKey = "web" | "pwa" | "product" | "personal" | "ai" | "data" | "research" | "retail" | "personalTools" | "design" | "audiovisual" | "business" | "event";

/** A real image for a project. Until it exists, the UI draws an editorial placeholder. */
export interface MediaImage {
  /** `/media/<name>.webp` — the loader resolves the width variants. */
  src: string;
  width: number;
  height: number;
  alt: Localized;
}

export interface Project {
  slug: string;
  /** Editorial index, e.g. "P.01". */
  index: string;
  name: string;
  /** Language of `name` when it differs from the page (most names are Portuguese). */
  nameLang?: "pt" | "en";
  status: ProjectStatus;
  /** Its current step on the approach, and one line saying what that means for it. */
  stage: ProjectStage;
  stageNote: Localized;
  /**
   * Where it sits in the Projects list (Iury, 2026-11-16): default = live work, first
   * and largest; "exploring" = grouped below, smaller; "closed" = an experiment that
   * ended, outside the active fronts.
   */
  tier?: "exploring" | "closed";
  year?: number;
  tags: TagKey[];
  summary: Localized;
  /** Cover used by the index preview (4:3 frame). */
  cover?: MediaImage & { fit?: "cover" | "contain"; background?: string };
  role?: Localized;
  stack?: string[];
  /** The product itself (its site or app): shown with the ↗ "go to the site" mark. */
  links?: ProjectLink[];
  /** Where it also lives: its LinkedIn post, its GitHub repository. Verified links only. */
  related?: RelatedLink[];
  /** Case study. Only `confirmed` ones get a page (/[locale]/projects/[slug]). */
  caseStudy?: CaseStudy;
  /** Where the facts came from — for maintainers, never rendered. */
  source: string;
  /** false = status/year/summary come from the design prototype and await confirmation. */
  confirmed: boolean;
}
