import { Link } from "@/i18n/navigation";

/**
 * The closing block: dark, the whole block one link to the next project (or back
 * to the index). Title at the home's headline size, like every other heading.
 */
export function NextProject({
  href,
  eyebrow,
  title,
  titleLang,
}: {
  href: string;
  eyebrow: string;
  title: string;
  titleLang?: string;
}) {
  return (
    <Link
      href={href}
      data-surface="dark"
      className="group/next mt-(--section-space) block bg-ink pt-[clamp(3rem,6vw,5rem)] pb-[clamp(2.5rem,5vw,4rem)] text-paper transition-colors duration-(--duration-fast) hover:bg-[#161616] focus-visible:outline-signal"
    >
      {/* The site grid, so the title lines up with the page's content above. */}
      <span className="page-grid w-full gap-y-3 max-md:pr-12">
        <span className="col-span-full text-note text-paper-300">{eyebrow}</span>
        <span lang={titleLang} className="col-span-full font-display text-headline-l font-black tracking-[-0.03em] text-balance [overflow-wrap:anywhere]">
          {title}{" "}
          <span aria-hidden="true" className="inline-block transition-transform duration-(--duration-base) ease-(--ease-out-soft) group-hover/next:translate-x-2">
            →
          </span>
        </span>
      </span>
    </Link>
  );
}
