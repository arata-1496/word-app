-- 技術用語単語帳アプリ：追加の用語（言語・フレームワーク・ツール・SQL文）
-- Supabase の SQL Editor で実行してください。
-- 同じ用語名が既にある場合はスキップされるため、二重に実行しても重複しません。
--
-- ※ 以下は既に初期データ(seed.sql)に含まれているため、ここには含めていません:
--    Struts2 / JSP / Tailwind CSS / Supabase / Firebase / GitHub /
--    SELECT文 / INSERT文 / UPDATE文 / DELETE文 / WHERE句 / JOIN / サブクエリ

-- ===== 言語・フレームワーク =====

INSERT INTO words (term, description, example, category)
SELECT 'Java',
  '世界中の業務システムで広く使われるオブジェクト指向のプログラミング言語。一度書けばOSを問わず動く（Write Once, Run Anywhere）のが特長。現職の社内システムで使用中。',
  'どのコンビニ（OS）に持って行っても使える共通商品券のように、環境を選ばず動くイメージ。',
  'java'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'Java');

INSERT INTO words (term, description, example, category)
SELECT 'JavaScript',
  'Webブラウザ上で動く代表的なプログラミング言語。ボタンを押したら画面が変わる、といった動きをWebページに付けられる。ReactやNext.jsもこの言語がベース。',
  '静止画（HTML/CSS）に動きを加える「アニメーター」のような存在。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'JavaScript');

INSERT INTO words (term, description, example, category)
SELECT 'React',
  'Meta（旧Facebook）製のUIライブラリ。画面を「コンポーネント」という部品に分けて作り、状態（state）が変わると自動で再描画される。',
  'レゴブロック（コンポーネント）を組み合わせて画面を作る仕組み。ブロックの中身が変われば見た目も自動で更新される。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'React');

INSERT INTO words (term, description, example, category)
SELECT 'Next.js',
  'Reactをベースにしたフレームワーク。ページのルーティングやサーバー側の処理、ビルドまで面倒を見てくれる。この単語帳アプリもNext.jsで作られている。',
  'React（エンジン）に、ハンドルやボディ（ルーティングや表示の仕組み）まで付けて、すぐ走れる車にしたもの。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'Next.js');

-- ===== ツール =====

INSERT INTO words (term, description, example, category)
SELECT 'MySQL',
  '世界的に広く使われるオープンソースのリレーショナルデータベース（RDBMS）。SQLでデータを操作する。現職ではA5:SQL Mk-2から接続して使用。',
  'たくさんの表（テーブル）を保管し、SQLという命令で出し入れする「巨大な電子ファイルキャビネット」。',
  'tool'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'MySQL');

INSERT INTO words (term, description, example, category)
SELECT 'Excel',
  '表計算ソフト。データの集計・確認のほか、テスト仕様書や項目一覧などのドキュメント作成にも使う。開発現場で頻繁に使われる。',
  'マス目に数字や文字を入れると自動で計算してくれる「電子方眼紙」。',
  'tool'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'Excel');

-- ===== SQL文（INSERT文などの補完。既存の4文に加えてよく使うもの） =====

INSERT INTO words (term, description, example, category)
SELECT 'ORDER BY句',
  '検索結果を指定したカラムで並び替えるSQL。ASCで昇順、DESCで降順。SELECT文の終わりの方に書く。',
  'テストの点数が高い順（DESC）に名簿を並べ替えるイメージ。',
  'db'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'ORDER BY句');

INSERT INTO words (term, description, example, category)
SELECT 'GROUP BY句',
  '同じ値のデータをグループにまとめて集計するSQL。COUNTやSUMなどの集計関数と一緒に使うことが多い。',
  'クラスごとに人数を数えるように、「部署ごとの売上合計」をまとめて出す。',
  'db'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'GROUP BY句');

INSERT INTO words (term, description, example, category)
SELECT 'LIKE演算子',
  'WHERE句で部分一致のあいまい検索をする演算子。%は任意の文字列、_（アンダースコア）は任意の1文字を表す。',
  'name LIKE 「田%」のように書くと「田」から始まる名字をまとめて探せる。',
  'db'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'LIKE演算子');

INSERT INTO words (term, description, example, category)
SELECT 'CREATE TABLE文',
  'データベースに新しいテーブル（表）を作成するSQL。カラム名・型・制約（NOT NULLなど）を指定する。',
  'データを入れる前に「どんな列を持つ表にするか」を設計して用意する作業。',
  'db'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'CREATE TABLE文');

INSERT INTO words (term, description, example, category)
SELECT '集計関数（COUNT/SUM/AVG）',
  'データをまとめて計算する関数。COUNTは件数、SUMは合計、AVGは平均、MAX/MINは最大・最小を返す。GROUP BYと組み合わせて使うことが多い。',
  '名簿全体の「人数（COUNT）」や「年齢の平均（AVG）」をまとめて算出するイメージ。',
  'db'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = '集計関数（COUNT/SUM/AVG）');
