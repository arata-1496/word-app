"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Word, WordInput } from "@/types";
import { CATEGORIES } from "@/lib/categories";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

type Props = {
  // 編集時は既存データを渡す。新規追加時は undefined。
  initial?: Word;
};

// 単語の追加・編集で共用するフォーム。
export default function WordForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [form, setForm] = useState<WordInput>({
    category: initial?.category ?? "java",
    term: initial?.term ?? "",
    description: initial?.description ?? "",
    example: initial?.example ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof WordInput>(key: K, value: WordInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError(
        "Supabaseの環境変数が設定されていません。.env.local を確認してください。",
      );
      return;
    }

    // 必須項目のチェック
    if (!form.term.trim() || !form.description.trim()) {
      setError("用語名と説明は必須です。");
      return;
    }

    setSubmitting(true);

    // example は任意。空文字なら null として保存する。
    const payload = {
      category: form.category,
      term: form.term.trim(),
      description: form.description.trim(),
      example: form.example.trim() ? form.example.trim() : null,
    };

    const { error: dbError } = isEdit
      ? await supabase.from("words").update(payload).eq("id", initial!.id)
      : await supabase.from("words").insert(payload);

    setSubmitting(false);

    if (dbError) {
      setError(`保存に失敗しました: ${dbError.message}`);
      return;
    }

    // 一覧ページへ戻る（最新データを反映）
    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-6">
        {isEdit ? "単語を編集" : "単語を追加"}
      </h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            カテゴリ
          </label>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value as Category)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            用語名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.term}
            onChange={(e) => update("term", e.target.value)}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="例: オブジェクト指向"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            説明 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            required
            rows={4}
            className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="用語の説明を入力"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            例え話（任意）
          </label>
          <textarea
            value={form.example}
            onChange={(e) => update("example", e.target.value)}
            rows={3}
            className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="分かりやすい例え話があれば入力"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-md text-sm font-medium bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {submitting ? "保存中..." : isEdit ? "更新する" : "登録する"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-5 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
