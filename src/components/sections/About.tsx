import { getLocale, getTranslations } from "next-intl/server";
import { contacts, education, educationEarlier, experience, plain, skills, type Education } from "@/content/profile";
import { gallery } from "@/content/gallery";
import type { Locale } from "@/i18n/routing";
import { Emphasis } from "@/components/layout/Emphasis";
import { SectionTitle, sectionTitleClass } from "@/components/layout/SectionTitle";
import { PhotoDeck } from "@/components/media/PhotoDeck";
import { SkillPills } from "./SkillPills";
import { Timeline } from "./Timeline";

/**
 * About — light editorial. The section name opens it ("Sobre"); right under it,
 * who Iury is in brief and what he has done (verified CV facts); then the photo
 * deck (each card tells its story); the career path.
 */
export async function About() {
  const ta = await getTranslations("about");
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("experience");
  const tl = await getTranslations("experience.timeline");
  const intl = locale === "pt" ? "pt-BR" : "en";
  // Small headings inside the block: Satoshi, sentence case. No eyebrow labels.
  const subhead = "font-display text-title font-bold tracking-[-0.01em]";
  // "MM.YYYY" → months since year 0, to compute each role's length.
  const month = (mmYYYY: string) => {
    const [m, y] = mmYYYY.split(".").map(Number) as [number, number];
    return y * 12 + (m - 1);
  };
  /** "04.2024" → "abril de 2024" / "April 2024". */
  const spell = (mmYYYY: string) => {
    const [m, y] = mmYYYY.split(".").map(Number) as [number, number];
    return new Intl.DateTimeFormat(intl, { month: "long", year: "numeric" }).format(new Date(y, m - 1, 1));
  };
  const duration = (period: string) => {
    const [from, to] = period.split("–").map((p) => p.trim());
    if (!from) return "";
    if (!to) return tl("since", { date: spell(from) });
    const total = month(to) - month(from) + 1; // both months included
    const years = Math.floor(total / 12);
    const months = total % 12;
    const parts = [years ? tl("years", { n: years }) : "", months ? tl("months", { n: months }) : ""].filter(Boolean);
    return parts.join(` ${tl("and")} `);
  };
  // Oldest first: the path reads as a climb up to today.
  const steps = [...experience.path].reverse().map((s) => {
    const [from, to] = s.period.split("–").map((p) => p.trim());
    return {
      role: s.role[locale],
      org: experience.employer,
      period: to ? `${spell(from ?? "")} – ${spell(to)}` : tl("since", { date: spell(from ?? "") }),
      duration: duration(s.period),
      area: s.area[locale],
      summary: s.summary[locale],
      details: s.details.map((d) => d[locale]),
      more: s.more[locale],
      list: s.highlights ? experience.highlights.map((h) => plain(h[locale])) : undefined,
      // The CV lists the daily tools for the current role only.
      stack: s.highlights ? skills.filter((k) => k.daily).map((k) => k.name[locale]) : undefined,
      current: !to,
    };
  });
  /** One course: its name, then the school and its years as a note. */
  const course = (e: Education) => (
    <li key={e.school} className="flex flex-col gap-0.5">
      {e.course && <span className="text-ui font-medium">{e.course[locale]}</span>}
      <span className={e.course ? "text-note text-gray-600" : "text-ui font-medium"}>
        {e.school}
        {e.from !== undefined && e.expected !== undefined && <>, {t("expected", { from: e.from, year: e.expected })}</>}
        {e.from !== undefined && e.to !== undefined && <>, {t("span", { from: e.from, to: e.to })}</>}
      </span>
    </li>
  );
  const timelineLabels = { now: t("now"), seeMore: tl("seeMore"), close: tl("close"), stack: t("stack") };


  return (
    <section
      id="about"
      data-nav-id="about"
      data-surface="light"
      aria-labelledby="about-title"
      className="surface-light overflow-hidden pb-(--section-space)"
    >
      {/*
        Two screens, one after the other (Iury, 2026-11-16): the profile, then the
        photos. On desktop each fills the viewport and is a scroll-snap point
        (proximity, see globals.css); on small screens they simply follow.
      */}
      <div className="flex flex-col justify-center pt-(--section-space) lg:min-h-svh lg:snap-start lg:pt-[clamp(5.5rem,11vh,8rem)] lg:pb-[clamp(2rem,6vh,4rem)]">
        <div className="page-grid w-full gap-y-[clamp(2.5rem,5vw,4rem)] lg:gap-y-[clamp(2.5rem,7vh,4.5rem)]">
          <SectionTitle id="about-title" className="col-span-full">
            {ta("label")}
          </SectionTitle>

          {/* Top left: the current role and what it is, in brief. */}
          <div className="col-span-4 flex flex-col gap-4 md:col-span-12 lg:col-span-6">
            <div className="flex flex-col gap-2">
              <p className="font-display text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)] leading-[1.05] font-bold tracking-[-0.025em]">{experience.role[locale]}</p>
              <p className="text-note text-gray-600">
                {experience.employer} · {experience.period[locale]}
              </p>
            </div>
            <p className="max-w-[46ch] font-display text-[clamp(1.0625rem,0.98rem+0.35vw,1.3125rem)] leading-[1.45] font-medium tracking-[-0.01em] text-pretty text-[#3f3d39]">
              {t("roleSummary")}
            </p>
          </div>

          {/* Top right: what he does (his own four lines). */}
          <div className="col-span-4 flex flex-col gap-5 md:col-span-12 lg:col-span-5 lg:col-start-8 lg:pt-2">
            <h3 className={subhead}>{t("highlights")}</h3>
            <ul className="flex flex-col gap-4">
              {experience.highlights.map((h, i) => (
                <li key={i} className="flex max-w-[60ch] gap-3.5 text-[clamp(1rem,0.97rem+0.15vw,1.0625rem)] leading-[1.6] text-pretty">
                  {/* A small graphite dot leads each line (Iury, 2026-11-13). */}
                  <span aria-hidden="true" className="mt-[0.68em] size-[5px] shrink-0 rounded-full bg-ink/70" />
                  <span>
                    <Emphasis text={h[locale]} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom left: education (earlier courses behind a native disclosure). */}
          <div className="col-span-4 flex flex-col gap-3 md:col-span-12 lg:col-span-6">
            <h3 className={subhead}>{t("education")}</h3>
            <ul className="flex flex-col gap-4">{education.map(course)}</ul>
            <details className="group mt-1">
              <summary className="flex min-h-11 w-fit cursor-pointer list-none items-center font-display text-[max(0.9375rem,13px)] font-bold underline decoration-1 underline-offset-[0.3em] hover:text-gray-600 [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">{t("earlierShow")}</span>
                <span className="hidden group-open:inline">{t("earlierHide")}</span>
              </summary>
              <ul className="mt-3 flex flex-col gap-4 motion-safe:group-open:animate-[fade-rise_320ms_cubic-bezier(0.2,0.7,0.1,1)]">{educationEarlier.map(course)}</ul>
            </details>
          </div>

          {/* Bottom right: skills, as interactive pills. */}
          <div className="col-span-4 flex flex-col gap-3 md:col-span-12 lg:col-span-5 lg:col-start-8">
            <h3 className={subhead}>{t("skills")}</h3>
            <p className="text-note text-gray-600">{t("skillsHint")}</p>
            <SkillPills skills={skills.map((k) => ({ name: k.name[locale], note: k.note[locale] }))} />
          </div>
        </div>
      </div>

      {/* Screen two: the photos, under a title that says why they are here. */}
      <div className="flex flex-col justify-center pt-(--section-space) lg:min-h-svh lg:snap-start lg:pt-[clamp(5.5rem,11vh,8rem)] lg:pb-[clamp(1.5rem,4vh,3rem)]">
        {/* w-full: page-grid centres itself with auto margins, which would shrink it in this flex column. */}
        <div className="page-grid w-full">
          <h3 className={`${sectionTitleClass} col-span-full text-center`}>{ta("galleryTitle")}</h3>
        </div>
        <PhotoDeck
          photos={gallery.map((p) => ({
            src: p.src,
            width: p.width,
            height: p.height,
            alt: p.alt[locale],
            caption: p.caption[locale],
            summary: p.summary?.[locale],
            story: p.story?.[locale],
            linkedin: p.linkedin && {
              url: p.linkedin.url,
              embed: p.linkedin.embed,
              also: p.linkedin.also?.map((post) => ({ label: post.label[locale], url: post.url })),
            },
            takeaways: p.takeaways?.[locale],
            focus: p.focus,
          }))}
          labels={{
            deck: ta("gallery"),
            show: ta.raw("galleryShow") as string,
            more: ta("galleryMore"),
            hint: ta("galleryHint"),
            pending: ta("galleryPending"),
            linkedin: ta("galleryLinkedIn"),
            post: ta("galleryPost"),
            takeaways: ta("galleryTakeaways"),
            profile: ta("galleryProfile"),
            profileUrl: contacts.find((c) => c.kind === "linkedin")?.href ?? "https://www.linkedin.com/in/iuryumbelino/",
            close: ta("galleryClose"),
            pause: ta("galleryPause"),
            play: ta("galleryPlay"),
            prev: ta("galleryPrev"),
            next: ta("galleryNext"),
          }}
        />
      </div>

      {/* The career path, full width. */}
      <div className="page-grid mt-(--section-space)">
        <div className="col-span-full flex flex-col gap-[clamp(2.5rem,5vw,4.5rem)]">
          <h3 className={sectionTitleClass}>{t("path")}</h3>
          <Timeline steps={steps} labels={timelineLabels} />
        </div>
      </div>
    </section>
  );
}
