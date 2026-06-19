import type { Category } from "@/types";

// カテゴリの表示ラベルとバッジ色をまとめた定義。
// Tailwind v4 はソース内に文字列として現れたクラス名だけを生成するため、
// バッジ色は `bg-blue-100` のように完全なクラス名で静的に書く必要がある。
export type CategoryMeta = {
  value: Category;
  label: string;
  badgeClass: string;
};

export const CATEGORIES: CategoryMeta[] = [
  { value: "java", label: "Java", badgeClass: "bg-blue-100 text-blue-800 border border-blue-200" },
  { value: "front", label: "フロントエンド", badgeClass: "bg-green-100 text-green-800 border border-green-200" },
  { value: "db", label: "DB・SQL", badgeClass: "bg-amber-100 text-amber-800 border border-amber-200" },
  { value: "tool", label: "ツール", badgeClass: "bg-purple-100 text-purple-800 border border-purple-200" },
  { value: "design", label: "設計", badgeClass: "bg-pink-100 text-pink-800 border border-pink-200" },
  { value: "general", label: "その他", badgeClass: "bg-gray-100 text-gray-800 border border-gray-200" },
];

const CATEGORY_MAP = new Map<Category, CategoryMeta>(
  CATEGORIES.map((c) => [c.value, c]),
);

// カテゴリ値から表示ラベルを取得（未知の値はそのまま返す）
export function categoryLabel(value: string): string {
  return CATEGORY_MAP.get(value as Category)?.label ?? value;
}

// カテゴリ値からバッジ用クラスを取得（未知の値はグレー）
export function categoryBadgeClass(value: string): string {
  return (
    CATEGORY_MAP.get(value as Category)?.badgeClass ??
    "bg-gray-100 text-gray-800 border border-gray-200"
  );
}
