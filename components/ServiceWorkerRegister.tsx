"use client";

import { useEffect } from "react";

// サービスワーカーを登録するクライアントコンポーネント。
// 開発中はHMRと干渉しないよう本番ビルドでのみ登録する。
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // 登録失敗時はオフライン機能なしで通常動作する
      });
    }
  }, []);

  return null;
}
