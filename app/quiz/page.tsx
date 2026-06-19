"use client";

import { useEffect, useMemo, useState } from "react";
import type { Word } from "@/types";
import { CATEGORIES, categoryBadgeClass, categoryLabel } from "@/lib/categories";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Fisher–Yates シャッフル（元配列は変更しない）
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<string>("all");
  // シャッフルされた出題順（Word の配列）
  const [deck, setDeck] = useState<Word[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // 単語を取得
  useEffect(() => {
    async function fetchWords() {
      if (!isSupabaseConfigured) {
        setError(
          "Supabaseの環境変数が設定されていません。.env.local を確認してください。",
        );
        setLoading(false);
        return;
      }

      const { data, error: dbError } = await supabase
        .from("words")
        .select("*");

      if (dbError) {
        setError(`データの取得に失敗しました: ${dbError.message}`);
      } else {
        setWords((data as Word[]) ?? []);
      }
      setLoading(false);
    }

    fetchWords();
  }, []);

  // 選択カテゴリで絞った対象
  const pool = useMemo(() => {
    return category === "all"
      ? words
      : words.filter((w) => w.category === category);
  }, [words, category]);

  // pool が変わったらデッキを作り直す（最初からシャッフルして出題）
  useEffect(() => {
    setDeck(shuffle(pool));
    setIndex(0);
    setFlipped(false);
  }, [pool]);

  const current = deck[index];

  function goPrev() {
    if (deck.length === 0) return;
    setFlipped(false);
    setIndex((i) => (i - 1 + deck.length) % deck.length);
  }

  function goNext() {
    if (deck.length === 0) return;
    setFlipped(false);
    setIndex((i) => (i + 1) % deck.length);
  }

  function reshuffle() {
    setDeck(shuffle(pool));
    setIndex(0);
    setFlipped(false);
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h1 className="text-xl font-bold text-slate-800">クイズ</h1>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="all">すべてのカテゴリ</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-500">読み込み中...</p>
      ) : deck.length === 0 ? (
        !error && (
          <p className="text-slate-500">
            出題できる単語がありません。単語を追加するか、カテゴリを変更してください。
          </p>
        )
      ) : (
        <>
          {/* カウンタ */}
          <p className="text-center text-sm text-slate-500 mb-3">
            {index + 1} / {deck.length}
          </p>

          {/* フリップカード */}
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="w-full min-h-64 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-6 flex flex-col items-center justify-center text-center"
          >
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full mb-4 ${categoryBadgeClass(
                current.category,
              )}`}
            >
              {categoryLabel(current.category)}
            </span>

            {!flipped ? (
              <>
                <p className="text-2xl font-bold text-slate-800 break-words">
                  {current.term}
                </p>
                <p className="mt-4 text-xs text-slate-400">
                  カードをクリックで説明を表示
                </p>
              </>
            ) : (
              <div className="text-left w-full">
                <p className="text-lg font-bold text-slate-800 mb-3 text-center">
                  {current.term}
                </p>
                <p className="text-slate-700 whitespace-pre-wrap">
                  {current.description}
                </p>
                {current.example && (
                  <p className="mt-3 text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 rounded-md p-3">
                    例え: {current.example}
                  </p>
                )}
              </div>
            )}
          </button>

          {/* 操作ボタン */}
          <div className="flex items-center justify-between gap-3 mt-5">
            <button
              type="button"
              onClick={goPrev}
              className="px-4 py-2 rounded-md text-sm font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              ← 前へ
            </button>
            <button
              type="button"
              onClick={reshuffle}
              className="px-4 py-2 rounded-md text-sm font-medium bg-slate-800 text-white hover:bg-slate-700"
            >
              シャッフル
            </button>
            <button
              type="button"
              onClick={goNext}
              className="px-4 py-2 rounded-md text-sm font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              次へ →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
