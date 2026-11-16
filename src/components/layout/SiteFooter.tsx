import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { contacts } from "@/content/profile";

/**
 * The footer on every page (Iury, 2026-11-16): compact and useful instead of one
 * huge line. Dark. Who (name + the tagline at a modest size), where to go (the
 * home's sections), how to reach Iury (every published contact), then © and back
 * to top. On the home the Contact section right above already lists the contacts,
 * so it passes `withContact={false}`; everywhere else the footer is the contact
 * block and carries the `#contact` anchor the nav points to.
 */
export async function SiteFooter({ topHref = "#main", withContact = true }: { topHref?: string; withContact?: boolean }) {
  const t = await getTranslations("footer");
  const th = await getTranslations("hero");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("contact");
  const published = contacts.filter((c) => c.publish);
  const nav = [
    { href: "/#hero", label: tn("index") },
    { href: "/#about", label: tn("about") },
    { href: "/#projects", label: tn("projects") },
    { href: "/#approach", label: t("approach") },
    { href: "/#contact", label: tn("contact") },
  ];
  const head = "text-note text-gray-500";
  const item =
    "flex min-h-11 w-fit items-center font-display text-[max(1rem,14px)] font-medium tracking-[-0.01em] text-paper-300 transition-colors duration-(--duration-fast) hover:text-signal";

  return (
    <footer data-surface="dark" id={withContact ? "contact" : undefined} className="bg-ink pt-[clamp(3.5rem,6vw,5.5rem)] pb-8 text-paper">
      <div className="page-grid w-full gap-y-10">
        <div className="col-span-4 flex flex-col gap-3 md:col-span-12 lg:col-span-5">
          <p className="font-display text-title font-black tracking-[-0.01em]">Iury Umbelino</p>
          <p className="max-w-[22ch] font-display text-[clamp(1.375rem,1.1rem+1vw,2rem)] leading-[1.1] font-bold tracking-[-0.025em] text-balance">
            {th("tagline.lead")} {th("tagline.rest")} <span className="text-signal">{th("tagline.accent")}</span>
          </p>
        </div>

        <nav aria-label={t("navLabel")} className="col-span-2 flex flex-col gap-1 md:col-span-4 lg:col-span-2 lg:col-start-8">
          <p className={head}>{t("navLabel")}</p>
          <ul className="flex flex-col">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={item}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {withContact && published.length > 0 && (
          <div className="col-span-2 flex flex-col gap-1 md:col-span-4 lg:col-span-3 lg:col-start-10">
            <p className={head}>{tn("contact")}</p>
            <ul className="flex flex-col">
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

        <div className="col-span-full flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-6 pr-22 text-caption text-gray-500">
          <span>{t("rights")}</span>
          <a href={topHref} className="flex min-h-11 items-center font-display font-bold text-paper transition-colors duration-(--duration-fast) hover:text-signal">
            {t("top")} <span aria-hidden="true">&nbsp;↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
