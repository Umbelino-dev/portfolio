import { SectionTitle } from "@/components/layout/SectionTitle";
import { getTranslations } from "next-intl/server";
import { contacts } from "@/content/profile";
import { AskCatButton } from "@/components/layout/AskCatButton";
import { button } from "@/components/layout/button";
import { CatFigure } from "@/components/cat/CatFigure";

/**
 * Contact — dark. Two ways to talk (Iury, 2026-11-16): write to Iury (one rounded
 * button, the site's button shape) or ask the cat, the scripted assistant, shown
 * here with its face so it reads as someone you can talk to, not as decoration.
 * On the right, every published contact, saying exactly where it goes. The
 * tagline moved to the footer at a modest size: no giant line here.
 *
 * Only contacts with `publish: true` render; without an e-mail the cat is the
 * primary action, never a placeholder address.
 */
export async function Contact() {
  const t = await getTranslations("contact");
  const published = contacts.filter((c) => c.publish);
  const email = published.find((c) => c.kind === "email");

  return (
    <section
      id="contact"
      data-nav-id="contact"
      data-surface="dark"
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden bg-ink pt-(--section-space) text-paper"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -top-30 left-[10%] -z-10 h-[520px] w-[70%] bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(243,241,235,0.07),transparent_72%)]" />
      <div className="page-grid w-full gap-y-12">
        <div className="col-span-full flex flex-col gap-3">
          <SectionTitle id="contact-title" dark>
            {t("label")}
          </SectionTitle>
          <p className="text-note text-paper-300">{t("open")}</p>
        </div>

        <div className="col-span-4 flex flex-col gap-8 md:col-span-12 lg:col-span-6">
          <div className="flex flex-col gap-6">
            <p className="max-w-[22ch] font-display text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)] leading-[1.05] font-bold tracking-[-0.025em] text-balance">
              {email ? t("lead") : t("pending")}
            </p>
            {email && (
              <a href={email.href} className={button.paper}>
                {t("cta")} <span aria-hidden="true">→</span>
              </a>
            )}
          </div>

          {/* The assistant, with the cat as its face: an invitation to a conversation. */}
          <div className="flex max-w-[34rem] items-center gap-5 rounded-[1.5rem] border border-paper/12 bg-ink-800 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <span aria-hidden="true" className="flex size-16 shrink-0 items-end justify-center rounded-full border border-ink/14 bg-paper pb-2">
              <CatFigure className="w-11 overflow-visible" />
            </span>
            <div className="flex min-w-0 flex-col gap-3">
              <div className="flex flex-col gap-1">
                <p className="font-display text-title font-black tracking-[-0.01em]">{t("catTitle")}</p>
                <p className="text-ui leading-snug text-pretty text-paper-300">{t("catText")}</p>
              </div>
              <AskCatButton label={t("catCta")} className={`${button.outline} min-h-11 px-5 text-paper`} />
            </div>
          </div>
        </div>

        {published.length > 0 && (
          <nav aria-label={t("links")} className="col-span-4 flex flex-col gap-1 md:col-span-12 lg:col-span-5 lg:col-start-8 lg:pt-2">
            {published.map((c) => (
              <a
                key={c.kind}
                href={c.href}
                target={c.kind === "email" ? undefined : "_blank"}
                rel={c.kind === "email" ? undefined : "noopener noreferrer"}
                // Mobile: label above the value, so a full email address fits on one line.
                className="group/contact grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-0.5 py-2.5 transition-colors duration-(--duration-fast) hover:text-signal md:grid-cols-[6rem_minmax(0,1fr)_auto]"
              >
                <span className="text-note col-span-2 text-gray-500 md:col-span-1">{t(`kinds.${c.kind}`)}</span>
                <span className="font-display text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] font-medium tracking-[-0.01em] [overflow-wrap:anywhere]">{c.label}</span>
                <span aria-hidden="true" className="text-lg transition-transform duration-(--duration-fast) group-hover/contact:translate-x-0.5 group-hover/contact:-translate-y-0.5">↗</span>
              </a>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
