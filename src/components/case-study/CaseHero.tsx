import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { CaseStudy, Project } from "@/content/types";
import { StatusMark } from "@/components/layout/StatusMark";
import { button } from "@/components/layout/button";

/**
 * 1 · Apresentação (Iury, 2026-11-16: every project page has the same four parts).
 * Left: what it is ("Projeto"), the name as h1 at the home's headline size, the
 * lead and, when there is one, the button to the project. Right: the facts as a
 * quiet list (status, year, role, stack, tools, tags). Same type scale and grid
 * as the home, so a project page never looks like another site.
 */
export async function CaseHero({
  project,
  caseStudy,
  locale,
}: {
  project: Project;
  caseStudy: CaseStudy;
  locale: Locale;
}) {
  const t = await getTranslations("caseStudy");
  const ts = await getTranslations("status");
  const tt = await getTranslations("tags");
  const link = project.links?.[0];
  const fact = (key: string, value: React.ReactNode) => (
    <div className="flex flex-col gap-1">
      <dt className="text-note text-gray-600">{key}</dt>
      <dd className="text-ui leading-snug font-medium">{value}</dd>
    </div>
  );

  return (
    <header className="page-grid w-full gap-y-10 pt-[clamp(7rem,12vh,9.5rem)] pb-[clamp(2.5rem,5vw,4.5rem)] max-md:pr-12">
      <div className="col-span-4 flex flex-col gap-5 md:col-span-12 lg:col-span-7">
        <p className="text-note text-gray-600">{t("label")}</p>
        <h1
          lang={project.nameLang && project.nameLang !== locale ? project.nameLang : undefined}
          className="font-display text-headline-l font-bold tracking-[-0.03em] text-balance [overflow-wrap:anywhere]"
        >
          {project.name}
        </h1>
        {(caseStudy.lead ?? project.summary)[locale] && (
          <p className="max-w-[48ch] text-lead leading-snug text-pretty text-[#3f3d39]">{(caseStudy.lead ?? project.summary)[locale]}</p>
        )}
        {link && (
          <a href={link.href} target="_blank" rel="noopener noreferrer" className={`${button.ink} mt-2`}>
            {link.label[locale]} <span aria-hidden="true">↗</span>
            <span className="sr-only"> ({t("newTab")})</span>
          </a>
        )}
      </div>

      <dl className="col-span-4 grid grid-cols-2 content-start gap-x-6 gap-y-6 md:col-span-12 md:grid-cols-3 lg:col-span-4 lg:col-start-9 lg:grid-cols-2 lg:pt-12">
        {fact(t("status"), <StatusMark status={project.status} label={ts(project.status)} className="text-ink" />)}
        {project.year && fact(t("year"), project.year)}
        {project.role && <div className="col-span-2">{fact(t("role"), project.role[locale])}</div>}
        {project.stack && <div className="col-span-2">{fact(t("stack"), project.stack.join(", "))}</div>}
        {caseStudy.builtWith && fact(t("builtWith"), caseStudy.builtWith.join(", "))}
        {fact(t("tags"), project.tags.map((tag) => tt(tag)).join(", "))}
      </dl>
    </header>
  );
}
