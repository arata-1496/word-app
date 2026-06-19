import type { Word } from "@/types";

// 関連語を検索するときの最小キー長。
// 「ログ」(2文字) が「プログラム」「ダイアログ」などに部分一致して
// 誤検出するのを防ぐため、3文字未満の用語名はキーとして使わない。
const MIN_NEEDLE_LENGTH = 3;

// 用語名・説明・例え話をまとめた検索対象テキスト（小文字化）
function haystack(w: Word): string {
  return `${w.term}\n${w.description}\n${w.example ?? ""}`.toLowerCase();
}

// 指定した単語に関連する単語を、説明文などの相互参照から自動抽出する。
// - current の説明等に相手の用語名が出てくる（forward）
// - 相手の説明等に current の用語名が出てくる（backward）
// のどちらかで関連とみなす。
export function findRelated(current: Word, all: Word[], limit = 8): Word[] {
  const currentText = haystack(current);
  const currentNeedle = current.term.toLowerCase();

  const matches = all.filter((w) => {
    if (w.id === current.id) return false;

    const otherNeedle = w.term.toLowerCase();
    const forward =
      otherNeedle.length >= MIN_NEEDLE_LENGTH &&
      currentText.includes(otherNeedle);
    const backward =
      currentNeedle.length >= MIN_NEEDLE_LENGTH &&
      haystack(w).includes(currentNeedle);

    return forward || backward;
  });

  // 同じカテゴリを優先し、その後は用語名順で並べる
  matches.sort((a, b) => {
    const aSame = a.category === current.category ? 0 : 1;
    const bSame = b.category === current.category ? 0 : 1;
    if (aSame !== bSame) return aSame - bSame;
    return a.term.localeCompare(b.term, "ja");
  });

  return matches.slice(0, limit);
}
