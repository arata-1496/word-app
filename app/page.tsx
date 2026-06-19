"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Word } from "@/types";
import { CATEGORIES } from "@/lib/categories";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import WordCard from "@/components/WordCard";
import WordModal from "@/components/WordModal";

export default function HomePage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [selected, setSelected] = useState<Word | null>(null);

  // 単語一覧を取得する
  async function fetchWords() {
    if (!isSupabaseConfigured) {
      setError(
        "Supabaseの環境変数が設定されていません。.env.local に NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を設定してください。",
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: dbError } = await supabase
      .from("words")
      .select("*")
      .order("created_at", { ascending: false });

    if (dbError) {
      setError(`データの取得に失敗しました: ${dbError.message}`);
      setWords([]);
    } else {
      setWords((data as Word[]) ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchWords();
  }, []);

  // キーワード・カテゴリでの絞り込み
  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return words.filter((w) => {
      const matchCategory = category === "all" || w.category === category;
      const matchKeyword =
        kw === "" ||
        w.term.toLowerCase().includes(kw) ||
        w.description.toLowerCase().includes(kw);
      return matchCategory && matchKeyword;
    });
  }, [words, keyword, category]);

  // 削除処理（確認ダイアログ → DELETE）
  async function handleDelete(word: Word) {
    if (!confirm(`「${word.term}」を削除します。よろしいですか？`)) return;

    const { error: dbError } = await supabase
      .from("words")
      .delete()
      .eq("id", word.id);

    if (dbError) {
      alert(`削除に失敗しました: ${dbError.message}`);
      return;
    }

    setSelected(null);
    setWords((prev) => prev.filter((w) => w.id !== word.id));
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5">
        <h1 className="text-xl font-bold text-slate-800">単語一覧</h1>
        <Link
          href="/words/new"
          className="px-4 py-2 rounded-md text-sm font-medium bg-slate-800 text-white hover:bg-slate-700 whitespace-nowrap"
        >
          ＋ 単語を追加
        </Link>
      </div>

      {/* 検索・フィルタ */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="用語名・説明で検索"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
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

      <p className="text-sm text-slate-500 mb-4">{filtered.length} 件</p>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-500">読み込み中...</p>
      ) : filtered.length === 0 && !error ? (
        <p className="text-slate-500">
          単語が見つかりません。右上の「＋ 単語を追加」から登録できます。
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((word) => (
            <WordCard key={word.id} word={word} onClick={setSelected} />
          ))}
        </div>
      )}

      <WordModal
        word={selected}
        allWords={words}
        onClose={() => setSelected(null)}
        onDelete={handleDelete}
        onSelectWord={setSelected}
      />
    </div>
  );
}
