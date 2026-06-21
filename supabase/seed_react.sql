-- =============================================
-- React / Next.js 復習用 追加用語データ
-- 単語帳アプリ（Supabase）用
--
-- Supabase の SQL Editor で実行してください。
-- 各行を WHERE NOT EXISTS でガードしているため、
-- 何度実行しても重複行はできません。
--
-- ※ useState / useEffect は seed.sql に、Next.js は seed_additional.sql に
--   既にあるため、未追加なら挿入され、既にあれば自動でスキップされます。
-- =============================================

-- JSX
INSERT INTO words (term, description, example, category)
SELECT 'JSX',
  'JavaScriptの中にHTMLっぽい書き方ができる構文。Reactのコンポーネントの見た目をこれで書く。ブラウザはそのまま読めないので、裏でJavaScriptに変換される。',
  '<div>や<p>をJSの中に書けるイメージ。{}の中にJSの変数や式を入れられる。例：<h1>{title}</h1>',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'JSX');

-- コンポーネント（React）
INSERT INTO words (term, description, example, category)
SELECT 'コンポーネント（React）',
  'UIの部品のこと。関数1つ＝部品1つ。ボタン・カード・ヘッダーなどをそれぞれコンポーネントとして作り、組み合わせてページを作る。名前は必ず大文字始まりにする。',
  'レゴブロックの1個1個がコンポーネント。WordCard・Header・Buttonなど部品ごとに関数を作る。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'コンポーネント（React）');

-- props（プロップス）
INSERT INTO words (term, description, example, category)
SELECT 'props（プロップス）',
  '親コンポーネントから子コンポーネントにデータを渡す仕組み。子は受け取ったpropsを読むだけで、直接書き換えることはできない（読み取り専用）。',
  '親から子へのお手紙。子は読めるけど書き直せない。<WordCard term="useState" desc="状態管理のhook" />',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'props（プロップス）');

-- state（ステート）
INSERT INTO words (term, description, example, category)
SELECT 'state（ステート）',
  'コンポーネントが持つ「状態（データ）」のこと。stateが変わると画面が自動で再描画される。直接書き換えはNGで、必ずsetterを使う。',
  'いいね数・入力中のテキスト・モーダルの開閉など、変化するデータはすべてstate。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'state（ステート）');

-- useState（既存の可能性あり）
INSERT INTO words (term, description, example, category)
SELECT 'useState',
  'stateを作るためのhook。[現在の値, 値を変える関数]のセットで返ってくる。値を変えるときは必ずsetter関数を使う（直接変えると画面が更新されない）。',
  'const [count, setCount] = useState(0); → count=1はNG、setCount(1)がOK',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'useState');

-- useEffect（既存の可能性あり）
INSERT INTO words (term, description, example, category)
SELECT 'useEffect',
  '画面が表示されたあと、または特定のstateが変わったあとに処理を実行するhook。DBからのデータ取得・タイマー処理などに使う。第2引数の[]が「いつ実行するか」を決める。',
  '[]を渡すと最初の1回だけ実行。[category]を渡すとcategoryが変わるたびに実行。画面を開いたら自動でデータ取得するときに必ず使う。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'useEffect');

-- hook（フック）
INSERT INTO words (term, description, example, category)
SELECT 'hook（フック）',
  'use〇〇という名前のReact専用の関数群。コンポーネントの中でしか使えない。useState・useEffectが代表的。自分でカスタムhookを作ることもできる。',
  '「フック（釣り針）」でReactの機能を引っ張ってくるイメージ。useStateでstateを、useEffectで副作用を引っ張ってくる。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'hook（フック）');

-- 再レンダリング
INSERT INTO words (term, description, example, category)
SELECT '再レンダリング',
  'stateやpropsが変わったとき、コンポーネントが自動で再描画されること。Reactの一番の強み。生のJSでは自分でDOMを探して書き換えていたが、Reactは自動でやってくれる。',
  '生JS：document.getElementById("count").textContent = count; → React：setCount(count+1)だけで自動更新。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = '再レンダリング');

-- key（キー）
INSERT INTO words (term, description, example, category)
SELECT 'key（キー）',
  'リストをmapで表示するとき、各要素に必ずつけるIDのようなもの。Reactがどの要素が変わったかを判断するために使う。忘れると警告が出る。',
  'words.map((w) => <div key={w.id}>{w.term}</div>) → key={w.id}を忘れるとWarning発生。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'key（キー）');

-- フラグメント（<>）
INSERT INTO words (term, description, example, category)
SELECT 'フラグメント（<>）',
  'Reactではreturnできるのは1つのタグだけというルールがある。余分なdivを増やしたくないときに<>...</>で囲む。これがフラグメント。',
  'return (<><h1>タイトル</h1><p>説明</p></>) → divを使わずに複数要素をまとめられる。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'フラグメント（<>）');

-- 単方向データフロー
INSERT INTO words (term, description, example, category)
SELECT '単方向データフロー',
  'Reactではデータは必ず「親→子」の一方向にしか流れない。子から親にデータを渡したいときは、親が関数をpropsとして渡して子から呼び出す。',
  '子コンポーネントが「削除ボタン」を押したとき、親のstate（リスト）を更新するには、親からonDelete関数をpropsで渡して子が呼び出す。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = '単方向データフロー');

-- 条件付きレンダリング
INSERT INTO words (term, description, example, category)
SELECT '条件付きレンダリング',
  'stateの値によって表示する内容を切り替えること。&&演算子や三項演算子を使う。',
  'isOpen && <Modal /> → isOpenがtrueのときだけModalを表示。isLoading ? <Spinner /> : <Content />のようにも書ける。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = '条件付きレンダリング');

-- イベントハンドラ
INSERT INTO words (term, description, example, category)
SELECT 'イベントハンドラ',
  'ボタンクリックや入力など、ユーザーの操作に反応する関数。onClickやonChangeなどの属性に渡す。JSのaddEventListenerと同じ役割をJSX内で書ける。',
  '<button onClick={handleClick}>送信</button> → handleClick関数がクリック時に実行される。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'イベントハンドラ');

-- Next.js（既存の可能性あり）
INSERT INTO words (term, description, example, category)
SELECT 'Next.js',
  'Reactをベースにしたフレームワーク。ページのルーティング・サーバーサイドレンダリング・APIルートなど、本番アプリに必要な機能が最初から入っている。',
  'ReactだけだとSPA（1枚のHTML）。Next.jsを使うとページごとにURLが作れたり、SEOに強くなったりする。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'Next.js');

-- App Router
INSERT INTO words (term, description, example, category)
SELECT 'App Router',
  'Next.js 13以降の新しいルーティング方式。appフォルダの中にpage.tsxを置くだけでURLページが作られる。以前のPages Routerより直感的。',
  'app/quiz/page.tsx を作ると自動で /quiz というURLのページになる。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'App Router');

-- サーバーコンポーネント
INSERT INTO words (term, description, example, category)
SELECT 'サーバーコンポーネント',
  'Next.jsのApp Routerで登場した概念。サーバー側で実行されるコンポーネント。DBアクセスやAPIキーを安全に扱える。デフォルトはサーバーコンポーネント。',
  'useStateやonClickを使いたい場合は「use client」を先頭に書いてクライアントコンポーネントにする必要がある。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'サーバーコンポーネント');

-- use client（クライアントコンポーネント）  ※用語名から二重引用符を除去
INSERT INTO words (term, description, example, category)
SELECT 'use client（クライアントコンポーネント）',
  'Next.jsでuseStateやuseEffect・イベントハンドラなど、ブラウザ側の操作が必要なときにファイルの先頭に書く宣言。これがないとhookが使えない。',
  'ファイルの1行目に "use client" と書くだけ。書き忘れるとuseStateでエラーになるのでよく引っかかる。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'use client（クライアントコンポーネント）');

-- Tailwindのクラスの書き方
INSERT INTO words (term, description, example, category)
SELECT 'Tailwindのクラスの書き方',
  'classNameにスペース区切りでクラスを並べてスタイルをあてる。CSSファイルを別で書かなくていい。サイズ・色・余白・flexなどすべてクラス名で指定する。',
  '<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow"> → flex・中央揃え・余白・背景・角丸・影をクラス名だけで指定。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'Tailwindのクラスの書き方');

-- Supabaseクライアントの使い方
INSERT INTO words (term, description, example, category)
SELECT 'Supabaseクライアントの使い方',
  'createClient()でクライアントを作り、.from("テーブル名").select()でデータ取得。.insert()で追加、.update()で更新、.delete()で削除。SQLを直接書かなくてもJSのメソッドでDB操作できる。',
  'const { data } = await supabase.from("words").select("*"); → wordsテーブルの全データを取得。SQLのSELECT * FROM wordsと同じ意味。',
  'front'
WHERE NOT EXISTS (SELECT 1 FROM words WHERE term = 'Supabaseクライアントの使い方');
