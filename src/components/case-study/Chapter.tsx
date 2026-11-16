import type { Locale } from "@/i18n/routing";
import type { CaseStudyChapter } from "@/content/types";
import { MediaFrame } from "./MediaFrame";

/** True when a chapter has something to show; empty chapters are never rendered. */
export function hasContent(c: CaseStudyChapter) {
  return Boolean(c.body?.pt.length || c.steps?.length || c.figures?.length);
}

/**
 * One block inside a project page part ("Sobre o projeto" or "Processo e
 * desenvolvimento"). The home's hierarchy: the block's name as a muted note, its
 * title one step under the part title (title size, not display), body in Plex,
 * steps as spaced headings with one sentence, figures rounded like the rest of
 * the site. No numbers or rules. Text keeps the 48px cat lane on mobile.
 */
export function Chapter({
  chapter,
  locale,
  placeholder,
}: {
  chapter: CaseStudyChapter;
  locale: Locale;
  placeholder: string;
}) {
  const title = chapter.title[locale];
  const mark = chapter.highlight?.[locale];
  const at = mark ? title.indexOf(mark) : -1;
  const headingId = `chapter-${chapter.id}`;

  return (
    <section id={chapter.id} aria-labelledby={headingId} className="flex scroll-mt-24 flex-col gap-8">
      <div className="page-grid w-full gap-y-5 max-md:pr-12">
        <p className="col-span-4 text-note text-gray-600 md:col-span-12 lg:col-span-3 lg:pt-1.5">{chapter.label[locale]}</p>
        <div className="col-span-4 flex min-w-0 flex-col gap-6 md:col-span-12 lg:col-span-8 lg:col-start-5">
          <h3 id={headingId} className="max-w-[24ch] font-display text-[clamp(1.5rem,1.2rem+1.1vw,2.25rem)] leading-[1.08] font-bold tracking-[-0.025em] text-balance">
            {at >= 0 && mark ? (
              <>
                {title.slice(0, at)}
                <span className="highlight">{mark}</span>
                {title.slice(at + mark.length)}
              </>
            ) : (
              title
            )}
          </h3>

          {chapter.body && (
            <div className="grid gap-x-10 gap-y-5 lg:grid-cols-2">
              {chapter.body[locale].map((para, i) => (
                <p key={i} className={`max-w-[60ch] text-body text-pretty ${i > 0 ? "text-[#3f3d39]" : ""}`}>
                  {para}
                </p>
              ))}
            </div>
          )}

          {chapter.steps && (
            <ol className="grid gap-x-10 gap-y-8 pt-2 sm:grid-cols-2">
              {chapter.steps.map((step, i) => (
                <li key={i} className="flex flex-col gap-2">
                  <h4 className="font-display text-title font-bold tracking-[-0.01em] text-balance">{step.title[locale]}</h4>
                  <p className="max-w-[48ch] text-body text-pretty text-[#3f3d39]">{step.text[locale]}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {chapter.figures && (
        <div className="page-grid w-full gap-y-8">
          {chapter.figures.map((fig, i) => (
            <figure key={fig.id} className="col-span-4 flex min-w-0 flex-col gap-3 md:col-span-6">
              <MediaFrame slot={fig} locale={locale} sizes="(min-width: 768px) 46vw, 100vw" tone={i % 2 === 0 ? "ink" : "stone"} pending={placeholder} />
              <figcaption className="text-caption text-gray-600 max-md:pr-12">{fig.caption[locale]}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
