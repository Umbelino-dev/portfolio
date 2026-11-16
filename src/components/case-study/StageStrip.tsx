import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { CaseStudy, Project, ProjectStage } from "@/content/types";
import { StageExplorer } from "./StageExplorer";

type Step = { title: string; phase: string };

/**
 * Where the project stands on the approach (the home's five steps), and what
 * each step held for it: server side it resolves the copy, `StageExplorer` makes
 * the steps choosable. Never shows a step as done when it is not.
 */
export async function StageStrip({ project, caseStudy, locale }: { project: Project; caseStudy: CaseStudy; locale: Locale }) {
  const ta = await getTranslations("approach");
  const t = await getTranslations("caseStudy");
  const steps = ta.raw("steps") as Step[];
  const current = steps[project.stage];
  const evidence = steps.map((_, i) =>
    caseStudy.evidence?.[i as ProjectStage]?.map((e) => ({ title: e.title[locale], text: e.text[locale], source: e.source })),
  );
  return (
    <StageExplorer
      steps={steps.map((s) => ({ title: s.title, phase: s.phase }))}
      stage={project.stage}
      note={project.stageNote[locale]}
      evidence={evidence}
      labels={{
        stage: t("stage"),
        hint: t("stageHint"),
        stageOf: current ? t("stageOf", { step: current.title, n: project.stage + 1, total: steps.length }) : "",
        current: t("stageCurrent"),
        research: t("research"),
        source: t("sourceLabel"),
        notReached: t("notReached"),
        noRecord: t("noRecord"),
        newTab: t("newTab"),
      }}
    />
  );
}
