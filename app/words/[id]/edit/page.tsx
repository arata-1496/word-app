"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Word } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import WordForm from "@/components/WordForm";

export default function EditWordPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWord() {
      if (!isSupabaseConfigured) {
        setError(
          "Supabaseの環境変数が設定されていません。.env.local を確認してください。",
        );
        setLoading(false);
        return;
      }

      const { data, error: dbError } = await supabase
        .from("words")
        .select("*")
        .eq("id", id)
        .single();

      if (dbError) {
        setError(`データの取得に失敗しました: ${dbError.message}`);
      } else {
        setWord(data as Word);
      }
      setLoading(false);
    }

    fetchWord();
  }, [id]);

  if (loading) {
    return <p className="text-slate-500">読み込み中...</p>;
  }

  if (error || !word) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {error ?? "単語が見つかりませんでした。"}
        </div>
        <Link href="/" className="text-sm text-slate-600 hover:underline">
          ← 一覧へ戻る
        </Link>
      </div>
    );
  }

  return <WordForm initial={word} />;
}
