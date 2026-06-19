// 共通の型定義

// カテゴリの値（words.category カラムに入る文字列）
export type Category = "java" | "front" | "db" | "tool" | "design" | "general";

// words テーブルの1行に対応する型
export type Word = {
  id: string;
  term: string;
  description: string;
  example: string | null;
  category: Category;
  created_at: string;
};

// フォームで扱う入力値（id や created_at は含まない）
export type WordInput = {
  term: string;
  description: string;
  example: string;
  category: Category;
};
