# Iury Umbelino · Portfolio

![Iury Umbelino. Curiosity builds what comes next.](public/og-image-en.png)

Live at **[umbelino.dev](https://umbelino.dev)** (PT and EN).

## The problem

A CV lists roles. It does not show how someone thinks, what they actually built, or what is still unfinished. This site does that: who I am, my work in IT and the products I build, each one with its real stage (live, in validation, idea). Nothing on it is invented. A fact without a source stays empty and the UI hides it.

It also has Tisco, a cat that answers questions about me. He can only say what I wrote down, and the code checks that before any answer reaches the visitor.

## Stack

Next.js 16 (static export) · React 19 · TypeScript · Tailwind CSS v4 · GSAP · next-intl (pt / en) · Cloudflare Workers (static assets + one Worker) · Workers KV · Gemini API

## Architecture

```
browser ──► Cloudflare
              ├─ /api/*, /video/*  ──► Worker (worker/index.ts)
              │                         ├─ /api/chat  → guard → Gemini → guard → KV cache
              │                         └─ /video/*   → byte ranges (206) from the static assets
              └─ everything else   ──► static export (./out), no code runs
```

**Static export.** `next build` writes plain HTML, CSS, JS and images to `./out`. Cloudflare serves that folder as Workers static assets. There is no Next.js server, no middleware and no ISR. `/` redirects to `/pt` (`public/_redirects`) and security headers live in `public/_headers`.

**One Worker, two routes.** `wrangler.jsonc` sets `run_worker_first` for `/api/*` and `/video/*` only, so the Worker never runs for a normal page view. `/video/*` exists because Safari only plays MP4 when the server answers range requests with 206.

**Grounding (Tisco).** Everything Tisco may say lives in `knowledge/*.md`. `scripts/knowledge.mjs` bundles those files into `worker/knowledge.generated.ts` at build time and drops lines marked `[PREENCHER]` and HTML comments, so drafts never reach the model. The system prompt tells the model to answer only from that content, to say "I don't know" instead of guessing, and to treat the visitor's text as a question, never as an instruction.

**Guard.** A prompt is not a guarantee, so `worker/guard.ts` checks every reply in code before it is shown:

- every e-mail, link and @handle in the reply must already exist in the knowledge base;
- replies that are too long, or that contain markers of the system prompt, are dropped;
- invented anecdotes and pages that do not exist are caught by patterns;
- the "go to this section" link is accepted only from a fixed allowlist, and only when the visitor's question is about that part of the site.

A reply that fails is never shown and never cached. The next model in the list is tried.

**Cache in KV.** A first question (no history) is cached for three days in the `CHAT_CACHE` namespace. The key is a hash of the normalised question, the project page and the whole system prompt, so editing `knowledge/` or the rules invalidates old answers on its own.

**Failing well.** Models are tried in the order of `GEMINI_MODEL` (a comma-separated list). A model that returns 404, 429, 5xx or times out is benched for a while, and the request has a total deadline. A best-effort per-IP limit sits in front. If everything fails, the browser falls back to scripted answers, so the cat never goes silent. The Gemini key is a Worker secret and never reaches the browser.

## Decisions

| Decision | Why |
| --- | --- |
| Static export instead of a Next.js server (OpenNext) | The site has no per-request data. Static is cheaper, faster and has less to break. |
| The AI lives in a separate Worker, not in Next.js | Keeps the export fully static. The Worker is small enough to read in one sitting. |
| Knowledge as Markdown in the repo | I edit facts in plain text and review them in a diff. The folder is public on purpose: if I would not publish it, it does not go there. |
| Guard in code, not only in the prompt | A made-up contact or fact is the worst failure for a portfolio. Code can check it, a prompt can only ask. |
| Cache only first questions | They repeat the most and carry no conversation context. |
| Scripted fallback | Free-tier quotas run out. The site must keep working when they do. |
| Satoshi fetched at build time | Its licence allows self-hosting but not redistribution, so the font files are never committed (`scripts/fonts.mjs`). |

## Running locally

Requires Node 22.

```bash
npm install
npm run dev        # http://localhost:3000/pt
npm run check      # typecheck + lint + build (writes ./out)
```

The chat needs the Worker. Run it with `npx wrangler dev` after a build, with `GEMINI_API_KEY` in a local `.dev.vars` file (ignored by git). Without a key, the cat answers with the scripted replies.

## Deploying

Cloudflare Workers Builds, connected to this repository. Build command `npm run build`, deploy command `npx wrangler deploy`. In the dashboard:

- **Build variable:** `NEXT_PUBLIC_SITE_URL=https://umbelino.dev` (canonical links, hreflang, Open Graph and the sitemap are written at build time).
- **Secret:** `GEMINI_API_KEY` (Settings → Variables and Secrets). Never in `wrangler.jsonc`.
- **KV:** the `CHAT_CACHE` namespace bound in `wrangler.jsonc`.

## Content

- Facts live in `src/content/` and UI strings in `messages/{pt,en}.json`.
- Images: source in `assets/media/`, then `npm run images` writes WebP variants to `public/media/`.
- Conventions and design tokens: `CLAUDE.md`.

Code and design by Iury Umbelino. Built with AI coding agents (Claude Code); I define the problem, write the directives, review every change and test the result.
