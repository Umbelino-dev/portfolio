import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { Project } from "@/content/types";

type Step = { title: string; phase: string };

/**
 * Where the project stands on the approach (the same five steps as the home's
 * Abordagem): a row of five stops, the steps already behind it in ink, the
 * current one lime, the ones ahead open, and one line saying what that means for
 * this project. It never shows a step as done when it is not (Iury, 2026-11-16).
 */
export async function StageStrip({ project, locale }: { project: Project; locale: Locale }) {
  const ta = await getTranslations("approach");
  const t = await getTranslations("caseStudy");
  const steps = ta.raw("steps") as Step[];
  const current = steps[project.stage];
  return (
    <div className="flex flex-col gap-5">
      <p className="text-note text-gray-600">{t("stage")}</p>
      <ol className="grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }} aria-label={t("stage")}>
        {steps.map((s, i) => {
          const on = i === project.stage;
          const past = i < project.stage;
          return (
            <li key={s.title} aria-current={on ? "step" : undefined} className="relative flex flex-col gap-2 pr-2">
              {/* The line between stops: ink up to the current step. */}
              {i < steps.length - 1 && (
                <span aria-hidden="true" className={`absolute top-[5px] left-3 right-0 h-[1.5px] ${past ? "bg-ink" : "bg-ink/15"}`} />
              )}
              <span
                aria-hidden="true"
                className={`relative size-3 rounded-full border-[1.5px] ${on ? "scale-150 border-ink bg-signal" : past ? "border-ink bg-ink" : "border-ink/30 bg-paper"}`}
              />
              <span className={`font-display text-[max(1rem,14px)] font-bold tracking-[-0.01em] ${on ? "text-ink" : "text-gray-600"} max-sm:sr-only`}>{s.title}</span>
              <span className={`text-caption leading-snug ${on ? "text-ink" : "text-gray-600"} max-md:hidden`}>{s.phase}</span>
            </li>
          );
        })}
      </ol>
      {current && (
        <p className="max-w-[52ch] text-body text-pretty">
          <span className="font-display font-bold">{t("stageOf", { step: current.title, n: project.stage + 1, total: steps.length })}.</span>{" "}
          <span className="text-[#3f3d39]">{project.stageNote[locale]}</span>
        </p>
      )}
    </div>
  );
}
