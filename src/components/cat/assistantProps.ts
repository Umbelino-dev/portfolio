import { getMessages } from "next-intl/server";
import type { AssistantScript, AssistantUI } from "./CatAssistant";

/**
 * Builds the assistant's scripted copy on the server (messages/*.json → assistant.*),
 * so the client bundle carries only the strings for the current page and locale.
 */
export async function assistantProps(kind: "home" | "case", slug?: string) {
  const { assistant } = (await getMessages()) as unknown as {
    assistant: { ui: Record<string, string>; home: AssistantScript; cases: Record<string, AssistantScript> };
  };
  const ui = assistant.ui;
  const caseScript = kind === "case" && slug ? assistant.cases[slug] : undefined;
  const script: AssistantScript = caseScript ?? assistant.home;
  // "Ask about this project" only where the cat has a script for this project;
  // elsewhere it is the general assistant and says so.
  const onCase = Boolean(caseScript);
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
  };
  return { script, ui: assistantUI };
}
