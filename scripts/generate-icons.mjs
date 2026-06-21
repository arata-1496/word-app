// アプリアイコン（PWA用PNG）を sharp で生成するスクリプト。
// `node scripts/generate-icons.mjs` で public/ 配下にPNGを書き出す。
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const publicDir = join(root, "public");
const appDir = join(root, "app");

// 単語カード（フラッシュカード）を重ねたモチーフ。
// 文字を使わずに図形だけで構成し、フォント依存をなくしている。
const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#1e293b"/>
  <g transform="rotate(-9 256 256)">
    <rect x="150" y="158" width="212" height="236" rx="22" fill="#64748b"/>
  </g>
  <g transform="rotate(5 256 256)">
    <rect x="138" y="142" width="236" height="252" rx="24" fill="#ffffff"/>
    <rect x="166" y="172" width="64" height="24" rx="12" fill="#3b82f6"/>
    <rect x="166" y="220" width="184" height="18" rx="9" fill="#1e293b"/>
    <rect x="166" y="256" width="156" height="13" rx="6.5" fill="#94a3b8"/>
    <rect x="166" y="282" width="172" height="13" rx="6.5" fill="#94a3b8"/>
    <rect x="166" y="308" width="124" height="13" rx="6.5" fill="#94a3b8"/>
  </g>
</svg>`;

const buf = Buffer.from(svg);

async function main() {
  await mkdir(publicDir, { recursive: true });

  // 通常アイコン（purpose: any）
  await sharp(buf).resize(192, 192).png().toFile(join(publicDir, "icon-192.png"));
  await sharp(buf).resize(512, 512).png().toFile(join(publicDir, "icon-512.png"));

  // maskable アイコン：背景を全面に敷き、図形はセーフゾーン内に収めているため同じ描画を流用
  await sharp(buf).resize(512, 512).png().toFile(join(publicDir, "icon-maskable-512.png"));

  // Apple のホーム画面用アイコン（角丸はiOS側で付くので四角のまま）
  await sharp(buf).resize(180, 180).png().toFile(join(publicDir, "apple-touch-icon.png"));

  // ブラウザのタブ用 SVG ファビコン（Next.js が app/icon.svg を自動配信）
  await writeFile(join(appDir, "icon.svg"), svg, "utf8");

  console.log("icons generated: public/icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png, app/icon.svg");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
