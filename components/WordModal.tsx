"use client";

import { useRouter } from "next/navigation";
import type { Word } from "@/types";
import { categoryBadgeClass, categoryLabel } from "@/lib/categories";
import { findRelated } from "@/lib/related";

type Props = {
  word: Word | null;
  // 関連語の抽出に使う全単語リスト
  allWords: Word[];
  onClose: () => void;
  onDelete: (word: Word) => void;
  // 関連語チップを押したときに表示単語を切り替えるためのコールバック
  onSelectWord: (word: Word) => void;
};

// 単語の詳細を表示するモーダル。編集・削除ボタンと関連語を持つ。
export default function WordModal({
  word,
  allWords,
  onClose,
  onDelete,
  onSelectWord,
}: Props) {
  const router = useRouter();

  if (!word) return null;

  const related = findRelated(word, allWords);

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <span
                className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${categoryBadgeClass(
                  word.category,
                )}`}
              >
                {categoryLabel(word.category)}
              </span>
              <h2 className="text-xl font-bold text-slate-800 break-words">
                {word.term}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="閉じる"
              className="shrink-0 text-slate-400 hover:text-slate-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <section className="mb-4">
            <h3 className="text-xs font-semibold text-slate-500 mb-1">説明</h3>
            <p className="text-slate-700 whitespace-pre-wrap">
              {word.description}
            </p>
          </section>

          {word.example && (
            <section className="mb-4">
              <h3 className="text-xs font-semibold text-slate-500 mb-1">
                例え話
              </h3>
              <p className="text-slate-700 whitespace-pre-wrap bg-slate-50 rounded-md p-3">
                {word.example}
              </p>
            </section>
          )}

          {related.length > 0 && (
            <section className="mb-4">
              <h3 className="text-xs font-semibold text-slate-500 mb-2">
                関連する用語
              </h3>
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onSelectWord(r)}
                    title={r.description}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full hover:opacity-80 transition ${categoryBadgeClass(
                      r.category,
                    )}`}
                  >
                    {r.term}
                  </button>
                ))}
              </div>
            </section>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => router.push(`/words/${word.id}/edit`)}
              className="px-4 py-2 rounded-md text-sm font-medium bg-slate-800 text-white hover:bg-slate-700"
            >
              編集
            </button>
            <button
              type="button"
              onClick={() => onDelete(word)}
              className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-500"
            >
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
