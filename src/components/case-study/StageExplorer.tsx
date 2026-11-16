"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";

export interface StageEvidence {
  title: string;
  text: string;
  source?: { label: string; href: string };
}

export interface StageLabels {
  stage: string; // "Etapa atual"
  hint: string;
  stageOf: string; // "{step}, etapa {n} de {total}" (already filled for the current step)
  current: string; // "etapa atual"
  research: string; // "Pesquisa externa"
  source: string; // "Fonte"
  notReached: string;
  noRecord: string;
  newTab: string;
}

/**
 * The project's path through the five approach steps, as tabs (Iury, 2026-11-16):
 * every step is there; the ones behind the project in ink, its current one lime,
 * the ones ahead open. Choosing a step shows what it held for this project: facts
 * from the work, or outside research with its source. A step with nothing says so
 * ("not here yet" / "not documented yet"): nothing is invented to fill it.
 * Opens on the current step. Tablist: roving tabindex, ← → Home End.
 */
export function StageExplorer({
  steps,
  stage,
  note,
  evidence,
  labels,
}: {
  steps: { title: string; phase: string }[];
  stage: number;
  note: string;
  evidence: (StageEvidence[] | undefined)[];
  labels: StageLabels;
}) {
  const uid = useId();
  const [active, setActive] = useState(stage);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = steps.length;
  const select = (i: number, focus = false) => {
    const to = Math.max(0, Math.min(n - 1, i));
    setActive(to);
    if (focus) tabs.current[to]?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") select(active + 1, true);
    else if (e.key === "ArrowLeft") select(active - 1, true);
    else if (e.key === "Home") select(0, true);
    else if (e.key === "End") select(n - 1, true);
    else return;
    e.preventDefault();
  };
  const items = evidence[active] ?? [];
  const step = steps[active];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-note text-gray-600">{labels.stage}</p>
        <p className="max-w-[56ch] text-body text-pretty">
          <span className="font-display font-bold">{labels.stageOf}.</span> <span className="text-[#3f3d39]">{note}</span>
        </p>
      </div>

      <div role="tablist" aria-label={labels.stage} onKeyDown={onKey} className="grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {steps.map((s, i) => {
          const on = i === active;
          const past = i < stage;
          const current = i === stage;
          return (
            <button
              key={s.title}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-selected={on}
              aria-controls={`${uid}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(i)}
              className={`group/st relative flex min-h-11 cursor-pointer flex-col items-start gap-2 pr-2 text-left transition-opacity duration-(--duration-fast) focus-visible:outline-none ${on ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
            >
              {i < n - 1 && <span aria-hidden="true" className={`absolute top-[5px] right-0 left-3 h-[1.5px] ${past ? "bg-ink" : "bg-ink/15"}`} />}
              <span
                aria-hidden="true"
                className={`relative size-3 rounded-full border-[1.5px] transition-transform duration-(--duration-base) group-focus-visible/st:outline-2 group-focus-visible/st:outline-offset-4 group-focus-visible/st:outline-ink ${
                  current ? "border-ink bg-signal" : past ? "border-ink bg-ink" : "border-ink/30 bg-paper"
                } ${on ? "scale-150" : ""}`}
              />
              <span className={`font-display text-[max(1rem,14px)] font-bold tracking-[-0.01em] ${on ? "underline decoration-1 underline-offset-[0.3em]" : ""} max-sm:sr-only`}>{s.title}</span>
              <span className="text-caption leading-snug text-gray-600 max-md:hidden">{s.phase}</span>
            </button>
          );
        })}
      </div>
      <p className="text-caption text-gray-600">{labels.hint}</p>

      {/* What this step held for the project. Re-keyed so each change rises in. */}
      <div
        key={active}
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${active}`}
        className="flex flex-col gap-6 rounded-[1.25rem] bg-paper-0 p-[clamp(1.25rem,2.5vw,2rem)] motion-safe:animate-[fade-rise_320ms_cubic-bezier(0.2,0.7,0.1,1)]"
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="font-display text-title font-bold tracking-[-0.01em]">{step?.title}</p>
          <p className="text-note text-gray-600">
            {step?.phase}
            {active === stage && <> · {labels.current}</>}
          </p>
        </div>
        {items.length ? (
          <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
            {items.map((it) => (
              <li key={it.title} className="flex flex-col gap-2">
                {it.source && <span className="self-start rounded-full bg-signal/45 px-2.5 py-0.5 text-caption font-medium text-ink">{labels.research}</span>}
                <span className="font-display text-[max(1.0625rem,14px)] font-bold tracking-[-0.01em] text-balance">{it.title}</span>
                <span className="max-w-[52ch] text-body text-pretty text-[#3f3d39]">{it.text}</span>
                {it.source && (
                  <a
                    href={it.source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 w-fit items-center gap-1.5 text-caption font-medium text-gray-600 underline decoration-1 underline-offset-[0.25em] hover:text-ink"
                  >
                    {labels.source}: {it.source.label} <span aria-hidden="true">↗</span>
                    <span className="sr-only"> ({labels.newTab})</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body text-gray-600">{active > stage ? labels.notReached : labels.noRecord}</p>
        )}
      </div>
    </div>
  );
}
