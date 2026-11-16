/**
 * Project covers drawn from the project logos (Iury, 2026-11-16), 1600×1200 (4:3),
 * written to assets/media/<slug>-cover.png; `npm run images` then makes the web
 * variants. Logos: Via Hebraica and Hyper were vectorised from Iury's files
 * (potrace) into assets/media/*-logo.svg; 1Kid is his raster file.
 *   node scripts/covers.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("assets/media");
const W = 1600;
const H = 1200;

/** The logo SVG's inner path(s) and viewBox, to place it inside a cover SVG. */
async function logo(file) {
  const svg = await fs.readFile(path.join(SRC, file), "utf8");
  const [, vb] = svg.match(/viewBox="([^"]+)"/) ?? [];
  const [, inner] = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/) ?? [];
  const [, , w, h] = (vb ?? "0 0 1 1").split(" ").map(Number);
  return { inner: inner ?? "", w, h };
}

async function viaHebraica() {
  const l = await logo("via-hebraica-logo.svg");
  const s = (H * 0.56) / l.h;
  const x = (W - l.w * s) / 2;
  const y = (H - l.h * s) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="100%" height="100%" fill="#ECE6DA"/>
    <g transform="translate(${x} ${y}) scale(${s})">${l.inner}</g></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(SRC, "via-hebraica-cover.png"));
}

async function oneKid() {
  const bg = { r: 254, g: 249, b: 239 };
  const mark = await sharp(path.join(SRC, "1kid-logo.webp")).resize({ height: Math.round(H * 0.96) }).toBuffer();
  await sharp({ create: { width: W, height: H, channels: 3, background: bg } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(path.join(SRC, "1kid-cover.png"));
}

/** Hyper: a hype curve going up (the product's promise), the H mark above it. */
async function hyper() {
  const l = await logo("hyper-logo.svg");
  const s = 300 / l.h;
  // A noisy but rising series, eased upward at the end: a positive hype chart.
  const pts = [];
  const n = 26;
  let v = 0.12;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    v = 0.1 + 0.78 * Math.pow(t, 2.2) + 0.05 * Math.sin(i * 1.7) * (1 - t);
    pts.push([160 + t * 1280, 1060 - v * 760]);
  }
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts.at(-1)[0]},1060 L160,1060 Z`;
  const [ex, ey] = pts.at(-1);
  const grid = [0, 1, 2, 3].map((i) => `<line x1="160" x2="1440" y1="${1060 - i * 220}" y2="${1060 - i * 220}" stroke="#F3F1EB" stroke-opacity="0.07" stroke-width="2"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8F169" stop-opacity="0.32"/><stop offset="1" stop-color="#C8F169" stop-opacity="0"/></linearGradient>
    <radialGradient id="g"><stop offset="0" stop-color="#C8F169" stop-opacity="0.55"/><stop offset="1" stop-color="#C8F169" stop-opacity="0"/></radialGradient></defs>
    <rect width="100%" height="100%" fill="#101010"/>${grid}
    <path d="${area}" fill="url(#a)"/>
    <path d="${line}" fill="none" stroke="#C8F169" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${ex}" cy="${ey}" r="70" fill="url(#g)"/><circle cx="${ex}" cy="${ey}" r="16" fill="#C8F169"/>
    <g transform="translate(160 110) scale(${s})">${l.inner}</g></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(SRC, "hyper-cover.png"));
}

await viaHebraica();
await oneKid();
await hyper();
console.log("covers: via-hebraica, 1kid, hyper");
