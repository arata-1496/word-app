/**
 * Supabase → Firestore データ移行スクリプト
 * 実行: node scripts/migrate-supabase-to-firebase.mjs
 */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { readFileSync } from "fs";

// .env.local を手動でパース
function loadEnv(path) {
  const env = {};
  try {
    const lines = readFileSync(path, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      env[key.trim()] = rest.join("=").trim();
    }
  } catch {
    console.error(".env.local が見つかりません");
    process.exit(1);
  }
  return env;
}

const env = loadEnv(".env.local");

// Supabase から全データ取得
async function fetchFromSupabase(supabaseUrl, supabaseKey) {
  const res = await fetch(`${supabaseUrl}/rest/v1/words?select=*&order=created_at.asc`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase エラー (${res.status}): ${text}`);
  }

  return res.json();
}

// Firebase 初期化
const app = initializeApp({
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
});
const db = getFirestore(app);

// Supabase の接続情報（引数で渡す）
const supabaseUrl = process.argv[2];
const supabaseKey = process.argv[3];

if (!supabaseUrl || !supabaseKey) {
  console.error("使い方: node scripts/migrate-supabase-to-firebase.mjs <SUPABASE_URL> <SUPABASE_ANON_KEY>");
  process.exit(1);
}

console.log("Supabase からデータを取得中...");
let words;
try {
  words = await fetchFromSupabase(supabaseUrl, supabaseKey);
} catch (e) {
  console.error("取得失敗:", e.message);
  process.exit(1);
}

console.log(`${words.length} 件のデータを取得しました`);

if (words.length === 0) {
  console.log("移行するデータがありません。終了します。");
  process.exit(0);
}

console.log("Firestore にインポート中...");
let success = 0;
let failed = 0;

for (const word of words) {
  try {
    await addDoc(collection(db, "words"), {
      term: word.term,
      description: word.description,
      example: word.example ?? null,
      category: word.category,
      created_at: word.created_at
        ? Timestamp.fromDate(new Date(word.created_at))
        : Timestamp.now(),
    });
    console.log(`  ✓ ${word.term}`);
    success++;
  } catch (e) {
    console.error(`  ✗ ${word.term}: ${e.message}`);
    failed++;
  }
}

console.log(`\n完了: ${success} 件成功 / ${failed} 件失敗`);
process.exit(failed > 0 ? 1 : 0);
