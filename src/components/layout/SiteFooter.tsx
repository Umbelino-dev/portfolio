import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { contacts } from "@/content/profile";
import { projects } from "@/content/projects";
import type { Locale } from "@/i18n/routing";
import { button } from "./button";

/**
 * The footer on every page (Iury, 2026-11-16). Dark, compact, four columns that
 * each answer one question: who (name, the tagline at a modest size, the e-mail
 * button), where to go on the site, which projects, how to reach Iury; then one
 * bottom bar with © and back to top. On project pages it also carries the
 * `#contact` anchor the nav points to (the home has its own Contact section).
 */
export async function SiteFooter({ topHref = "#main", withContact = true }: { topHref?: string; withContact?: boolean }) {
  const t = await getTranslations("footer");
  const th = await getTranslations("hero");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("contact");
  const locale = (await getLocale()) as Locale;
  const published = contacts.filter((c) => c.publish);
  const email = published.find((c) => c.kind === "email");
  const nav = [
    { href: "/#hero", label: tn("index") },
    { href: "/#about", label: tn("about") },
    { href: "/#projects", label: tn("projects") },
    { href: "/#approach", label: t("approach") },
    { href: "/#contact", label: tn("contact") },
  ];
  const head = "pb-1 text-note text-gray-500";
  const item =
    "flex min-h-10 w-fit items-center font-display text-[max(1rem,14px)] font-medium tracking-[-0.01em] text-paper-300 transition-colors duration-(--duration-fast) hover:text-signal";

  return (
    <footer data-surface="dark" id={withContact ? "contact" : undefined} className="bg-ink pt-[clamp(3.5rem,6vw,5.5rem)] pb-6 text-paper">
      <div className="page-grid w-full gap-y-12">
        <div className="col-span-4 flex flex-col gap-4 md:col-span-12 lg:col-span-4">
          <p className="font-display text-title font-black tracking-[-0.01em]">Iury Umbelino</p>
          <p className="max-w-[20ch] font-display text-[clamp(1.375rem,1.1rem+1vw,2rem)] leading-[1.1] font-bold tracking-[-0.025em] text-balance">
            {th("tagline.lead")} {th("tagline.rest")} <span className="text-signal">{th("tagline.accent")}</span>
          </p>
          {/* On the home the Contact section right above already has this button. */}
          {email && withContact && (
            <a href={email.href} className={`${button.paper} mt-2`}>
              {tc("cta")} <span aria-hidden="true">→</span>
            </a>
          )}
        </div>

        <nav aria-label={t("navLabel")} className="col-span-2 flex flex-col md:col-span-4 lg:col-span-2 lg:col-start-6">
          <p className={head}>{t("navLabel")}</p>
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={item}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={tn("projects")} className="col-span-2 flex flex-col md:col-span-4 lg:col-span-3 lg:col-start-8">
          <p className={head}>{tn("projects")}</p>
          <ul>
            {projects.map((p) => (
              <li key={p.slug}>
                <Link href={`/projects/${p.slug}`} lang={p.nameLang && p.nameLang !== locale ? p.nameLang : undefined} className={item}>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {published.length > 0 && (
          <div className="col-span-4 flex flex-col md:col-span-4 lg:col-span-2 lg:col-start-11">
            <p className={head}>{tn("contact")}</p>
            <ul>
              {published.map((c) => (
                <li key={c.kind}>
                  <a
                    href={c.href}
                    target={c.kind === "email" ? undefined : "_blank"}
                    rel={c.kind === "email" ? undefined : "noopener noreferrer"}
                    className={item}
                  >
                    {tc(`kinds.${c.kind}`)} <span aria-hidden="true">&nbsp;↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="col-span-full flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-4 pr-22 text-caption text-gray-500">
          <span>{t("rights")}</span>
          <a href={topHref} className="flex min-h-11 items-center font-display font-bold text-paper transition-colors duration-(--duration-fast) hover:text-signal">
            {t("top")} <span aria-hidden="true">&nbsp;↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
