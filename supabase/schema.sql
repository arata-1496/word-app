-- 技術用語単語帳アプリ：テーブル定義
-- Supabase の SQL Editor で実行してください。

create extension if not exists "pgcrypto";

create table if not exists words (
  id          uuid primary key default gen_random_uuid(),
  term        text not null,
  description text not null,
  example     text,
  category    text not null,
  created_at  timestamptz default now()
);

-- 認証なしのアプリのため、anon ロールから読み書きできるようにする。
-- （本番で公開する場合はポリシーを見直してください）
alter table words enable row level security;

drop policy if exists "words are readable by everyone" on words;
create policy "words are readable by everyone"
  on words for select
  using (true);

drop policy if exists "words are insertable by everyone" on words;
create policy "words are insertable by everyone"
  on words for insert
  with check (true);

drop policy if exists "words are updatable by everyone" on words;
create policy "words are updatable by everyone"
  on words for update
  using (true)
  with check (true);

drop policy if exists "words are deletable by everyone" on words;
create policy "words are deletable by everyone"
  on words for delete
  using (true);
