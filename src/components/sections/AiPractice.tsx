import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getProject } from "@/content/projects";
import { SectionTitle } from "@/components/layout/SectionTitle";

/**
 * "IA na prática" (Iury, 2026-11-16): the four kinds of AI evidence a recruiter
 * asks for, each answered with something real on this site and a link to it.
 *   1. prompts and LLM experiments → Tisco
 *   2. automations → the DOX / e-mail work at Giassi (Profile)
 *   3. internal tools and agents in use → Hyper, Tisco
 *   4. in production, with measured results → Koinonia's usage numbers
 * The Koinonia numbers come from its `caseStudy.usage` (dated, sourced, aggregates
 * only, per the metrics policy); nothing here is a number of its own. No "hours
 * saved" claim: there is no measured figure for it yet.
 * Inside Projects, after the list, before the Approach. Separated by space only.
 */
export async function AiPractice() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("aiPractice");
  const koinonia = getProject("koinonia");
  const usage = koinonia?.caseStudy?.usage?.confirmed ? koinonia.caseStudy.usage : undefined;
  const people = usage?.items[0];
  const care = usage?.items[3];
  const asOf = usage
    ? new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${usage.asOf}T12:00:00`))
    : "";

  const items: { kind: string; text: string; note?: string; href: string; link: string }[] = [
    { kind: t("prompts.kind"), text: t("prompts.text"), href: "/projects/tisco", link: t("prompts.link") },
    { kind: t("automations.kind"), text: t("automations.text"), href: "/#about", link: t("automations.link") },
    { kind: t("tools.kind"), text: t("tools.text"), href: "/projects/hyper", link: t("tools.link") },
  ];
  if (usage && people && care) {
    items.push({
      kind: t("production.kind"),
      text: t("production.text", {
        people: people.value[locale],
        peopleLabel: people.label[locale],
        care: care.value[locale],
        careLabel: care.label[locale],
      }),
      note: t("production.note", { source: usage.source[locale], date: asOf }),
      href: "/projects/koinonia",
      link: t("production.link"),
    });
  }

  return (
    <div id="ai" aria-labelledby="ai-title" role="region" className="scroll-mt-24 pt-(--section-space)">
      <div className="flex flex-col gap-4 pb-[clamp(2.5rem,5vw,4.5rem)]">
        <SectionTitle id="ai-title" as="h3">
          {t("label")}
        </SectionTitle>
        <p className="max-w-[24ch] font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] leading-[1.05] font-bold tracking-[-0.03em] text-balance">
          {t("title")}
        </p>
      </div>
      <ul className="grid gap-x-[clamp(2rem,5vw,6rem)] gap-y-[clamp(2.5rem,5vw,4rem)] md:grid-cols-2">
        {items.map((it) => (
          <li key={it.kind} className="flex max-w-[44ch] flex-col gap-2.5">
            <span className="text-note text-gray-600">{it.kind}</span>
            <p className="font-display text-[clamp(1.125rem,1rem+0.45vw,1.4375rem)] leading-[1.3] font-medium tracking-[-0.01em] text-pretty">{it.text}</p>
            {it.note && <p className="text-caption text-gray-600">{it.note}</p>}
            <Link
              href={it.href}
              className="mt-1 flex min-h-11 w-fit items-center gap-2 font-display text-[1.0625rem] font-bold tracking-[-0.01em] underline decoration-1 underline-offset-[0.3em] transition-colors duration-(--duration-fast) hover:text-gray-600"
            >
              {it.link} <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
