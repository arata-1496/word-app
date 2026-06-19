import { createClient } from "@supabase/supabase-js";

// 環境変数（.env.local で設定）から Supabase の接続情報を取得する。
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 設定漏れを分かりやすくするためのフラグ。各ページでこの値を使い、
// 未設定のときは「環境変数を設定してください」という案内を表示する。
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// 未設定でもビルド・起動が落ちないよう、プレースホルダーでクライアントを生成する。
// （空文字だと createClient が即エラーになるため有効な形式のダミー値を渡す）
// 実際にリクエストするとエラーになるので、呼び出し側で isSupabaseConfigured を確認する。
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
);
