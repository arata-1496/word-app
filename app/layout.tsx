import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "技術単語帳",
  description: "IT技術用語を登録・管理・復習できる単語帳アプリ",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "単語帳",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e293b",
  width: "device-width",
  initialScale: 1,
  // iPhone のノッチ/Dynamic Island 領域まで描画を広げ、safe-area-inset を有効化
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans safe-px safe-pb">
        <ServiceWorkerRegister />
        <Header />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
