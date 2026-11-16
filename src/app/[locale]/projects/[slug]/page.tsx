import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getCaseStudies } from "@/content/projects";
import { Nav } from "@/components/layout/Nav";
import { CaseHero } from "@/components/case-study/CaseHero";
import { Chapter, hasContent } from "@/components/case-study/Chapter";
import { MediaFrame } from "@/components/case-study/MediaFrame";
import { NextProject } from "@/components/case-study/NextProject";
import { ReadingProgress } from "@/components/case-study/ReadingProgress";
import { CatAssistant } from "@/components/cat/CatAssistant";
import { assistantProps } from "@/components/cat/assistantProps";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { StageStrip } from "@/components/case-study/StageStrip";
import { button } from "@/components/layout/button";
import { PhoneVideo } from "@/components/case-study/PhoneVideo";

// Only confirmed case studies exist as pages; everything else is a 404 at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getCaseStudies().map((p) => ({ locale, slug: p.slug })));
}

function find(slug: string) {
  return getCaseStudies().find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = find(slug);
  if (!hasLocale(routing.locales, locale) || !project) return {};
  const description = (project.caseStudy.lead ?? project.summary)[locale];
  return {
    title: project.name,
    description,
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l === "pt" ? "pt-BR" : l, `/${l}/projects/${slug}`])),
    },
    openGraph: {
      title: project.name,
      description,
      type: "article",
      url: `/${locale}/projects/${slug}`,
      images: [{ url: `/og-image-${locale}.png`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: project.name, description, images: [`/og-image-${locale}.png`] },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale: raw, slug } = await params;
  if (!hasLocale(routing.locales, raw)) notFound();
  const locale: Locale = raw;
  setRequestLocale(locale);
  const project = find(slug);
  if (!project) notFound();

  const t = await getTranslations("caseStudy");
  const assistant = await assistantProps("case", slug);
  const cs = project.caseStudy;
  const chapters = cs.chapters.filter(hasContent);
  const about = chapters.filter((c) => c.part === "about");
  const process = chapters.filter((c) => c.part === "process");
  const cases = getCaseStudies();
  const next = cases[(cases.findIndex((p) => p.slug === slug) + 1) % cases.length];
  const hasNext = next && next.slug !== slug;
  // The part titles: the home's section-title voice, one system for every project.
  const part = (id: string, title: string) => (
    <div className="page-grid w-full">
      <SectionTitle id={id} className="col-span-full">
        {title}
      </SectionTitle>
    </div>
  );

  return (
    <>
      <ReadingProgress />
      <Nav variant="case" />
      <main id="main" data-surface="light" className="surface-light">
        <article>
          {/* 1 · Apresentação */}
          <CaseHero project={project} caseStudy={cs} locale={locale} />
          {cs.cover && (
            <figure className="page-grid w-full gap-y-3">
              <div className="col-span-full">
                <MediaFrame slot={cs.cover} locale={locale} priority pending={t("pending")} sizes="(min-width: 1440px) 1328px, 92vw" />
              </div>
              <figcaption className="col-span-full text-caption text-gray-600 max-md:pr-12">{cs.cover.caption[locale]}</figcaption>
            </figure>
          )}

          {/* The project's video, inside a phone (AutonomIA's motion piece). */}
          {cs.video && (
            <figure className="page-grid w-full gap-y-4 pt-[clamp(1rem,3vw,2rem)]">
              <div className="col-span-full flex justify-center rounded-[1.5rem] bg-[#e7e3d9] py-[clamp(2.5rem,6vw,5rem)]">
                <PhoneVideo src={cs.video.src} poster={cs.video.poster} title={cs.video.title[locale]} pending={t("videoPending")} />
              </div>
              <figcaption className="col-span-full text-caption text-gray-600 max-md:pr-12">
                {t("video")}: {cs.video.title[locale]}
              </figcaption>
            </figure>
          )}

          {/* 2 · Sobre o projeto */}
          {about.length > 0 && (
            <section aria-labelledby="part-about" className="flex flex-col gap-[clamp(2.5rem,5vw,4rem)] pt-(--section-space)">
              {part("part-about", t("about"))}
              <div className="flex flex-col gap-[clamp(3.5rem,7vw,6rem)]">
                {about.map((c) => (
                  <Chapter key={c.id} chapter={c} locale={locale} placeholder={t("pending")} />
                ))}
              </div>
            </section>
          )}

          {/* 3 · Processo e desenvolvimento: where it stands, then how it was made. */}
          <section aria-labelledby="part-process" className="flex flex-col gap-[clamp(2.5rem,5vw,4rem)] pt-(--section-space)">
            {part("part-process", t("process"))}
            <div className="page-grid w-full max-md:pr-12">
              <div className="col-span-4 md:col-span-12 lg:col-span-8 lg:col-start-5">
                <StageStrip project={project} caseStudy={cs} locale={locale} />
              </div>
            </div>
            <div className="flex flex-col gap-[clamp(3.5rem,7vw,6rem)]">
              {process.map((c) => (
                <Chapter key={c.id} chapter={c} locale={locale} placeholder={t("pending")} />
              ))}
            </div>
          </section>

          {/* 4 · Acesso ao projeto: a real link, or one honest line why there is none. */}
          <section aria-labelledby="part-access" className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)] pt-(--section-space)">
            {part("part-access", t("access"))}
            <div className="page-grid w-full max-md:pr-12">
              <div className="col-span-4 flex flex-wrap gap-3 md:col-span-12 lg:col-span-8 lg:col-start-5">
                {project.links?.length ? (
                  project.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={button.ink}>
                      {l.label[locale]} <span aria-hidden="true">↗</span>
                      <span className="sr-only"> ({t("newTab")})</span>
                    </a>
                  ))
                ) : (
                  <p className="w-full max-w-[52ch] text-lead leading-snug text-pretty text-[#3f3d39]">{cs.access?.[locale]}</p>
                )}
                {/* Where the project also lives: its post, its repository (verified links only). */}
                {project.related?.map((r) => (
                  <a key={r.href} href={r.href} target="_blank" rel="noopener noreferrer" className={`${button.outline} text-ink`}>
                    {t(`relatedKinds.${r.kind}`)} · {r.label[locale]} <span aria-hidden="true">↗</span>
                    <span className="sr-only"> ({t("newTab")})</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </article>

        {hasNext ? (
          <NextProject
            href={`/projects/${next.slug}`}
            eyebrow={t("next")}
            title={next.name}
            titleLang={next.nameLang && next.nameLang !== locale ? next.nameLang : undefined}
          />
        ) : (
          <NextProject href="/#projects" eyebrow={t("index")} title={t("allProjects")} />
        )}
        <SiteFooter />
      </main>
      <CatAssistant context="case" projectsHref={`/${locale}#projects`} {...assistant} />
    </>
  );
}
