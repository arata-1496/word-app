// 技術単語帳アプリ サービスワーカー（オフライン対応）
// 同一オリジンのGETのみ扱う。Supabaseなど別オリジンへのリクエストは素通しする。
const CACHE = "tango-cache-v1";
const PRECACHE = [
  "/",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // 一部が失敗しても install を止めないよう個別に追加
      .then((cache) =>
        Promise.allSettled(PRECACHE.map((url) => cache.add(url))),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // 別オリジン（Supabase等）はキャッシュせずそのまま
  if (url.origin !== self.location.origin) return;

  // ページ遷移はネットワーク優先（最新を取得し、失敗時はキャッシュ→トップ）
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match("/")),
        ),
    );
    return;
  }

  // 静的アセット（JS/CSS/画像/フォント）はキャッシュ優先
  const dest = request.destination;
  if (["script", "style", "image", "font"].includes(dest)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return res;
          }),
      ),
    );
  }
});
