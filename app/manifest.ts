import type { MetadataRoute } from "next";

// PWA のウェブアプリマニフェスト。Next.js が /manifest.webmanifest として配信する。
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "技術単語帳",
    short_name: "単語帳",
    description: "IT技術用語を登録・管理・復習できる単語帳アプリ",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f8fafc",
    theme_color: "#1e293b",
    lang: "ja",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
