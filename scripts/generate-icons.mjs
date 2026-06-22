import sharp from "sharp";
import { readFileSync } from "fs";

// IPAゴシックをbase64でSVGに埋め込む
const fontPath = "/usr/share/fonts/truetype/fonts-japanese-gothic.ttf";
const fontBase64 = readFileSync(fontPath).toString("base64");

function createIconSVG(size, maskable = false) {
  const s = size;
  const cardW = s * 0.60;
  const cardH = s * 0.70;
  const cardX = (s - cardW) / 2 - s * 0.01;
  const cardY = (s - cardH) / 2 - s * 0.03;
  const cardRx = cardW * 0.17;
  const fontSize = s * 0.33;
  const rotate = maskable ? 0 : -8;
  const cx = s / 2;
  const cy = s / 2;
  const bgRx = maskable ? 0 : s * 0.22;
  const shadowBlur = maskable ? 0 : s * 0.035;
  const shadowDy = maskable ? 0 : s * 0.025;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <style>
      @font-face {
        font-family: 'IPAGothic';
        src: url('data:font/truetype;base64,${fontBase64}') format('truetype');
        font-weight: bold;
      }
    </style>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B72E8"/>
      <stop offset="100%" stop-color="#6B2FC9"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="${shadowDy}" stdDeviation="${shadowBlur}" flood-color="rgba(0,0,0,0.30)"/>
    </filter>
  </defs>
  <rect width="${s}" height="${s}" rx="${bgRx}" fill="url(#bg)"/>
  <g transform="rotate(${rotate}, ${cx}, ${cy})" filter="${maskable ? 'none' : 'url(#shadow)'}">
    <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="${cardRx}" fill="white"/>
    <text
      x="${cx - s * 0.01}"
      y="${cy + fontSize * 0.38}"
      font-family="'IPAGothic', sans-serif"
      font-size="${fontSize}"
      font-weight="bold"
      fill="#4F46E5"
      text-anchor="middle"
    >単</text>
  </g>
</svg>`;
}

async function gen(svg, path, size) {
  await sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toFile(path);
  console.log(`✓ ${path}`);
}

await gen(createIconSVG(192), "public/icon-192.png", 192);
await gen(createIconSVG(512), "public/icon-512.png", 512);
await gen(createIconSVG(512, true), "public/icon-maskable-512.png", 512);
await gen(createIconSVG(180), "public/apple-touch-icon.png", 180);
await gen(createIconSVG(32), "public/favicon.png", 32);
console.log("All icons generated!");
