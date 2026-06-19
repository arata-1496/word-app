import type { Word } from "@/types";
import { categoryBadgeClass, categoryLabel } from "@/lib/categories";

type Props = {
  word: Word;
  onClick: (word: Word) => void;
};

// 一覧に並べる1枚のカード。クリックで詳細モーダルを開く。
export default function WordCard({ word, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick(word)}
      className="text-left bg-white rounded-lg border border-slate-200 shadow-sm p-4 hover:shadow-md hover:border-slate-300 transition w-full"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h2 className="font-bold text-slate-800 break-words">{word.term}</h2>
        <span
          className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${categoryBadgeClass(
            word.category,
          )}`}
        >
          {categoryLabel(word.category)}
        </span>
      </div>
      <p className="text-sm text-slate-600 line-clamp-3">{word.description}</p>
    </button>
  );
}
