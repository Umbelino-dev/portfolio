import { getMessages } from "next-intl/server";
import { getCaseStudies } from "@/content/projects";
import type { AssistantScript, AssistantUI } from "./CatAssistant";
import type { Quips } from "./quips";

/**
 * Builds the assistant's scripted copy on the server (messages/*.json → assistant.*),
 * so the client bundle carries only the strings for the current page and locale.
 */
export async function assistantProps(kind: "home" | "case", slug?: string) {
  const { assistant } = (await getMessages()) as unknown as {
    assistant: {
      ui: Record<string, string>;
      go: Record<string, string>;
      home: AssistantScript;
      cases: Record<string, AssistantScript>;
      quips: Quips;
    };
  };
  const ui = assistant.ui;
  const caseScript = kind === "case" && slug ? assistant.cases[slug] : undefined;
  const script: AssistantScript = caseScript ?? assistant.home;
  // "Ask about this project" only where the cat has a script for this project;
  // elsewhere it is the general assistant and says so.
  const onCase = Boolean(caseScript);
  // Where the cat may point: the home sections plus every project page that exists.
  const goLabels: Record<string, string> = {
    about: assistant.go.about ?? "",
    projects: assistant.go.projects ?? "",
    approach: assistant.go.approach ?? "",
    contact: assistant.go.contact ?? "",
  };
  for (const p of getCaseStudies()) goLabels[p.slug] = (assistant.go.project ?? "").replace("{name}", p.name);
  const assistantUI: AssistantUI = {
    title: ui.title ?? "",
    subtitle: (onCase ? ui.subtitleCase : ui.subtitle) ?? "",
    open: (onCase ? ui.openCase : ui.open) ?? "",
    hint: ui.hint ?? "",
    close: ui.close ?? "",
    handle: ui.handle ?? "",
    placeholder: (onCase ? ui.placeholderCase : ui.placeholder) ?? "",
    send: ui.send ?? "",
    thinking: ui.thinking ?? "",
    you: ui.you ?? "",
    cat: ui.cat ?? "",
    log: ui.log ?? "",
    privacy: ui.privacy ?? "",
    rateLimited: ui.rateLimited ?? "",
    busy: ui.busy ?? "",
    go: goLabels,
    quips: assistant.quips,
  };
  return { script, ui: assistantUI };
}
