# 技術単語帳アプリ

IT技術用語を自分で登録・管理・復習できる単語帳 Web アプリです。面談・勉強の場で技術用語をすぐ確認・復習できることを目的としています。

## 技術スタック

- **フロントエンド**: Next.js (App Router) + TypeScript
- **スタイル**: Tailwind CSS (v4)
- **データベース**: Supabase (PostgreSQL)
- **デプロイ**: Vercel

## 機能

- **単語一覧 `/`**: カード一覧、カテゴリバッジ、カテゴリフィルタ、キーワード検索、件数表示、クリックで詳細モーダル（編集・削除）
- **追加・編集 `/words/new` `/words/[id]/edit`**: カテゴリ・用語名・説明・例え話の入力フォーム
- **クイズ `/quiz`**: ランダム1枚ずつ表示、クリックでフリップ、前へ/次へ、シャッフル、カテゴリフィルタ、「3 / 68」形式のカウンタ

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabase の準備

1. [Supabase](https://supabase.com/) でプロジェクトを作成
2. SQL Editor で `supabase/schema.sql` を実行（テーブル作成）
3. 続けて `supabase/seed.sql` を実行（初期データ 68 件を投入）
4. （任意）`supabase/seed_additional.sql` を実行すると、言語・フレームワーク・ツール・SQL文の用語を追加できます（二重実行しても重複しません）
5. （任意）`supabase/seed_react.sql` を実行すると、React / Next.js 復習用の用語を追加できます（二重実行しても重複しません）

### 3. 環境変数の設定

`.env.local.example` を `.env.local` にコピーし、Supabase の値を設定します（Settings → API から取得）。

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 を開いて動作確認します。

## ディレクトリ構成

```
app/
├── layout.tsx              # 共通レイアウト（ヘッダー含む）
├── page.tsx                # 単語一覧ページ
├── words/
│   ├── new/page.tsx        # 単語追加ページ
│   └── [id]/edit/page.tsx  # 単語編集ページ
└── quiz/page.tsx           # クイズページ
components/
├── Header.tsx              # ナビゲーションヘッダー
├── WordCard.tsx            # 単語カード
├── WordModal.tsx           # 詳細モーダル
└── WordForm.tsx            # 追加・編集フォーム
lib/
├── supabase.ts             # Supabase クライアント初期化
└── categories.ts           # カテゴリのラベル・バッジ色定義
types/
└── index.ts                # Word 型など共通の型定義
supabase/
├── schema.sql              # テーブル作成 SQL
└── seed.sql                # 初期データ SQL
```

## カテゴリとバッジ色

| カテゴリ | 値 | バッジ色 |
|----------|-----|----------|
| Java | `java` | blue |
| フロントエンド | `front` | green |
| DB・SQL | `db` | amber |
| ツール | `tool` | purple |
| 設計 | `design` | pink |
| その他 | `general` | gray |

## 補足

- ログイン・認証機能はありません。
- スマホでも崩れないようレスポンシブ対応しています。
- 削除時は `confirm()` で確認ダイアログを表示します。
- Supabase 未設定・接続エラー時は画面にエラーメッセージを表示します。
