/**
 * Firestore 初期データ投入スクリプト
 * 実行: node scripts/seed-firebase.mjs
 */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp, getDocs, query, where } from "firebase/firestore";
import { readFileSync } from "fs";

function loadEnv(path) {
  const env = {};
  try {
    const lines = readFileSync(path, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      env[key.trim()] = rest.join("=").trim();
    }
  } catch {
    console.error(".env.local が見つかりません");
    process.exit(1);
  }
  return env;
}

const env = loadEnv(".env.local");

const app = initializeApp({
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
});
const db = getFirestore(app);

const words = [
  // Java
  { term: 'オブジェクト指向', description: '物や役割ごとに「クラス」という設計図を作り、それをもとに実際の「オブジェクト」を作る考え方。役割を分けることで修正しやすくなる。', example: '車の設計図（クラス）を作っておけば同じ設計図から何台でも車（インスタンス）が作れるイメージ。', category: 'java' },
  { term: 'インスタンス', description: 'クラスという設計図から実際に作られた「モノ」のこと。new キーワードで生成する。', example: '「車の設計図（クラス）」から作られた「実際の1台の車」がインスタンス。', category: 'java' },
  { term: 'クラス', description: 'フィールド（変数）とメソッド（処理）をひとまとめにした設計図。同じ種類のデータと処理を1か所で管理できる。', example: 'たい焼きの型（クラス）があれば、同じ形のたい焼き（インスタンス）を何個でも作れる。', category: 'java' },
  { term: 'メソッド', description: 'クラスの中に書く「処理のまとまり」。何度も使う処理をメソッドにまとめておくとコードが短くなり読みやすくなる。', example: '「お茶を出す」という動作（メソッド）を定義しておけば、何度でも呼び出せる。', category: 'java' },
  { term: 'フィールド', description: 'クラスの中で持つ変数のこと。そのオブジェクトの「状態」を保持する。基本的にprivateにして外から直接触れないようにする。', example: '人物クラスで「名前」「年齢」などを保持する変数がフィールド。', category: 'java' },
  { term: 'private / public', description: 'アクセス修飾子。privateはそのクラス内からしかアクセスできない。publicはどこからでもアクセスできる。フィールドはprivateが基本。', example: 'private＝社員専用の裏口、public＝誰でも入れる正面玄関のイメージ。', category: 'java' },
  { term: 'getter / setter', description: 'privateにしたフィールドの値を取得（get）・変更（set）するためのメソッド。外から直接触れない代わりにこれを通じて操作する。', example: '銀行の窓口（getter/setter）を通してしかお金（フィールド）を動かせない仕組み。', category: 'java' },
  { term: 'try-catch-finally', description: 'エラーが起きても処理を止めずにコントロールする仕組み。tryでエラーになりそうな処理を囲み、catchでエラー時の対応、finallyで必ず実行する処理を書く。', example: '料理中に焦がしても（エラー）換気（catch）と後片付け（finally）は必ずやる、みたいなイメージ。', category: 'java' },
  { term: '例外（Exception）', description: 'プログラムの実行中に起きる想定外のエラーのこと。try-catchで捕まえて対処する。', example: '「ファイルが見つからない」「数字以外が入力された」など、予期せぬ出来事が例外。', category: 'java' },
  { term: 'List', description: '順番があるデータの集まり。重複する値もOK。上から順に処理したいときに使う。ArrayListが最もよく使われる。', example: '買い物リストのように、順番があって同じものが2回あってもOK。', category: 'java' },
  { term: 'Map', description: 'キーと値をセットにして持つコレクション。キーを指定することで対応する値をすぐ取り出せる。HashMapが代表的。', example: '辞書みたいなもの。「単語（キー）」を引けば「意味（値）」がすぐ出てくる。', category: 'java' },
  { term: 'for文 / 拡張for文', description: '繰り返し処理。通常のforは回数指定、拡張for（for-each）はリストなどの要素を1つずつ取り出すのに使う。', example: '「リストの全員に案内を送る」処理を拡張forで1人ずつ取り出してメール送信するイメージ。', category: 'java' },
  { term: 'null', description: '「何もない」「値が入っていない」状態を表す特別な値。nullのまま処理しようとするとNullPointerExceptionが発生する。', example: '空っぽの箱（null）を開けようとするとエラーになる。開ける前に中身確認が必要。', category: 'java' },
  { term: 'Struts2', description: 'JavaでWebアプリを作るためのフレームワーク。画面（JSP）と処理（Action）を分けて管理するMVCパターンで動く。現職の社内システムで使用中。', example: 'レストランで「注文を受ける人（Action）」と「料理を出す（JSP）」を分けて管理する厨房のルール。', category: 'java' },
  { term: 'Actionクラス', description: 'Struts2でHTTPリクエストを受け取って処理を行うクラス。画面からの入力を受け取り、DBと連携して結果をJSPに渡す。', example: '注文を受けて厨房に伝える「ウェイター」のような役割。', category: 'java' },
  { term: 'JSP', description: 'JavaでHTMLを動的に生成するためのテンプレートファイル。Actionから受け取ったデータを画面に表示する役割を担う。', example: 'HTMLに「ここにJavaの値を入れて！」と指示できるようにしたもの。', category: 'java' },
  { term: 'Formクラス', description: 'Struts2で画面の入力値を受け取るためのクラス。入力フォームの各項目をフィールドとして持つ。', example: '注文用紙（フォーム）に記入された内容を保管する入れ物。', category: 'java' },
  { term: 'インターセプター', description: 'Struts2でActionの処理の前後に共通処理を挟む仕組み。ログイン確認やログ出力などを毎回書かずに済む。', example: 'お店の入口でセキュリティチェック（ログイン確認）を自動でやってくれる人。', category: 'java' },
  { term: 'MVCパターン', description: 'Model（データ）・View（画面）・Controller（制御）に分けてアプリを設計する考え方。役割を分けることで修正しやすくなる。', example: '料理（Model）・皿盛り（View）・指示を出すシェフ（Controller）が分業するイメージ。', category: 'java' },
  { term: 'DAO（Data Access Object）', description: 'DBへのアクセス処理をまとめたクラス。SQLの実行はDAOに集めることで、ロジック側はDBの詳細を気にしなくてよくなる。', example: '「DB担当の専門窓口」。他のクラスはDAOに頼めばDBのことは任せられる。', category: 'java' },
  { term: 'コンストラクタ', description: 'クラスからインスタンスを生成するときに自動で呼ばれる初期化メソッド。クラス名と同じ名前で定義する。', example: '新入社員が入社したとき（インスタンス生成）に必ず行われる初期設定（コンストラクタ）。', category: 'java' },
  { term: 'オーバーライド', description: '親クラスのメソッドを子クラスで上書きすること。@Overrideアノテーションを付けて書く。', example: '親から引き継いだレシピを、子が自分流にアレンジして使うイメージ。', category: 'java' },
  { term: 'インターフェース', description: 'クラスが実装すべきメソッドの一覧を定義したもの。「何ができるか」を約束させる仕組み。', example: '「このアプリを出すにはこの機能が必要」という契約書のようなもの。', category: 'java' },
  { term: 'Java', description: '世界中の業務システムで広く使われるオブジェクト指向のプログラミング言語。一度書けばOSを問わず動く（Write Once, Run Anywhere）のが特長。現職の社内システムで使用中。', example: 'どのコンビニ（OS）に持って行っても使える共通商品券のように、環境を選ばず動くイメージ。', category: 'java' },
  // DB
  { term: 'SELECT文', description: 'DBからデータを取り出すSQL。WHEREで条件を絞り、ORDER BYで並び替え、LIMITで件数を制限できる。', example: '「名簿の中から大阪在住の人を、名前順で10人だけ出して」という命令。', category: 'db' },
  { term: 'INSERT文', description: 'DBに新しいデータを追加するSQL。VALUESに追加する値を書く。INSERT SELECTを使うとSELECTの結果をそのまま追加できる。', example: '名簿に新しい人を1行追加する命令。', category: 'db' },
  { term: 'UPDATE文', description: 'DBのデータを更新するSQL。WHEREで対象を絞り忘れると全行が変わってしまうので要注意。', example: 'WHEREを付けずにUPDATEすると全員の情報が書き換わる。絶対に条件を忘れずに。', category: 'db' },
  { term: 'DELETE文', description: 'DBからデータを削除するSQL。WHEREを忘れると全件削除になるので要注意。', example: '条件なしのDELETEはテーブルが空になる。本番では特に慎重に。', category: 'db' },
  { term: 'WHERE句', description: 'SELECT・UPDATE・DELETEで対象行を絞り込む条件を書く部分。AND/ORで複数条件を組み合わせられる。', example: '「年齢が20以上 AND 大阪在住」のように条件を重ねて絞る。', category: 'db' },
  { term: 'JOIN（テーブル結合）', description: '複数のテーブルを関連するカラムで繋いで1つの結果として取り出す方法。INNER JOINは両方に存在する行のみ、LEFT JOINは左側の全行を返す。', example: '社員テーブルと部署テーブルを社員IDで繋いで「誰がどの部署か」を1度に取り出す。', category: 'db' },
  { term: 'サブクエリ', description: 'SQL文の中にさらにSELECT文を入れる書き方。同じテーブルを参照するときはASで別名をつける必要がある（MySQLの制約）。', example: '「最高点を取った人を検索」→ まず最高点をSELECTして、その値で絞り込む。', category: 'db' },
  { term: 'COALESCE関数', description: '値がNULLだったときに代わりの値を返す関数。COALESCE(値, デフォルト値)の形で書く。MAX()などがNULLを返す可能性があるときに使う。', example: 'COALESCE(MAX(SORT), 0) + 1 → SORTが0件ならMAXはNULL→0を返す→1から始まる。実際の業務で使った。', category: 'db' },
  { term: 'トランザクション', description: '複数のDB処理をひとまとまりとして扱う仕組み。途中でエラーが起きたら全部なかったことにする（ロールバック）、全部成功したら確定（コミット）。', example: '銀行振込で「口座Aから引く＋口座Bに足す」がセット。片方だけ失敗したら両方取り消す。', category: 'db' },
  { term: 'ページネーション', description: '大量のデータを一定件数ずつ分けて表示する仕組み。LIMITとOFFSETのSQLで実現する。実務で実装した。', example: '検索結果を「1ページ10件」に区切って「次のページ」ボタンで送る仕組み。', category: 'db' },
  { term: 'インデックス', description: 'テーブルの検索を速くするための仕組み。よく検索するカラムに設定する。設定しすぎると更新が遅くなるデメリットもある。', example: '本の目次（インデックス）があれば全ページ読まなくてもすぐ探せる。', category: 'db' },
  { term: '主キー（PRIMARY KEY）', description: 'テーブルの各行を一意に識別するカラム。重複不可・NULL不可。通常はIDカラムに設定する。', example: '社員番号のようなもの。同じ番号を持つ人は存在できない。', category: 'db' },
  { term: '外部キー（FOREIGN KEY）', description: '別テーブルの主キーを参照するカラム。テーブル間の関連を表し、参照整合性を保つ。', example: '注文テーブルに「顧客ID」があり、顧客テーブルの主キーを指している。', category: 'db' },
  { term: 'ORDER BY句', description: '検索結果を指定したカラムで並び替えるSQL。ASCで昇順、DESCで降順。SELECT文の終わりの方に書く。', example: 'テストの点数が高い順（DESC）に名簿を並べ替えるイメージ。', category: 'db' },
  { term: 'GROUP BY句', description: '同じ値のデータをグループにまとめて集計するSQL。COUNTやSUMなどの集計関数と一緒に使うことが多い。', example: 'クラスごとに人数を数えるように、「部署ごとの売上合計」をまとめて出す。', category: 'db' },
  { term: 'LIKE演算子', description: 'WHERE句で部分一致のあいまい検索をする演算子。%は任意の文字列、_（アンダースコア）は任意の1文字を表す。', example: 'name LIKE 「田%」のように書くと「田」から始まる名字をまとめて探せる。', category: 'db' },
  { term: 'CREATE TABLE文', description: 'データベースに新しいテーブル（表）を作成するSQL。カラム名・型・制約（NOT NULLなど）を指定する。', example: 'データを入れる前に「どんな列を持つ表にするか」を設計して用意する作業。', category: 'db' },
  { term: '集計関数（COUNT/SUM/AVG）', description: 'データをまとめて計算する関数。COUNTは件数、SUMは合計、AVGは平均、MAX/MINは最大・最小を返す。GROUP BYと組み合わせて使うことが多い。', example: '名簿全体の「人数（COUNT）」や「年齢の平均（AVG）」をまとめて算出するイメージ。', category: 'db' },
  // フロントエンド
  { term: 'コンポーネント', description: 'UIの部品のこと。ボタン・ヘッダー・カードなど再利用できる単位に分けたもの。Reactではこの単位で開発する。', example: 'レゴブロックの1個1個がコンポーネント。組み合わせてページを作る。', category: 'front' },
  { term: 'useState', description: 'stateを作るためのhook。[現在の値, 値を変える関数]のセットで返ってくる。値を変えるときは必ずsetter関数を使う（直接変えると画面が更新されない）。', example: 'const [count, setCount] = useState(0); → count=1はNG、setCount(1)がOK', category: 'front' },
  { term: 'useEffect', description: '画面が表示されたあと、または特定のstateが変わったあとに処理を実行するhook。DBからのデータ取得・タイマー処理などに使う。第2引数の[]が「いつ実行するか」を決める。', example: '[]を渡すと最初の1回だけ実行。[category]を渡すとcategoryが変わるたびに実行。', category: 'front' },
  { term: 'props', description: '親コンポーネントから子コンポーネントにデータを渡す仕組み。子は受け取ったpropsを使うだけで直接変更はできない。', example: '親から子へのお手紙（props）。子は読めるけど書き直せない。', category: 'front' },
  { term: 'TypeScript', description: 'JavaScriptに型（数値・文字列・配列など）を追加した言語。型があることでバグを早期に発見できる。', example: '「ここには数字しか入れてはダメ」というルールをコードに書ける、強化版JavaScript。', category: 'front' },
  { term: 'Tailwind CSS', description: 'クラス名を使って直接スタイルを当てるCSSフレームワーク。HTMLにクラスを書くだけでデザインが完成する。', example: 'text-lg font-bold text-blue-500 のようにクラスを並べてデザインする。', category: 'front' },
  { term: '非同期処理（async/await）', description: '時間のかかる処理（API通信・ファイル読み込みなど）を「待ってから次の処理に進む」書き方。awaitで処理が終わるまで一時停止する。', example: '「ピザを注文して（await）、届いてから食べる」という順番を守る書き方。', category: 'front' },
  { term: 'API', description: '他のシステムやサーバーと「データのやり取り」をするための窓口。fetchやaxiosでリクエストを送り、JSONで結果を受け取る。', example: 'レストランのメニュー表（API）。「これをください」と頼むと料理（データ）が届く。', category: 'front' },
  { term: 'JSON', description: 'データをやり取りするための書き方（形式）。キーと値のセットで書く。APIのレスポンスはほぼJSONで返ってくる。', example: '{"name": "石黒", "age": 30} のような形式で書いたデータの入れ物。', category: 'front' },
  { term: 'JavaScript', description: 'Webブラウザ上で動く代表的なプログラミング言語。ボタンを押したら画面が変わる、といった動きをWebページに付けられる。ReactやNext.jsもこの言語がベース。', example: '静止画（HTML/CSS）に動きを加える「アニメーター」のような存在。', category: 'front' },
  { term: 'React', description: 'Meta（旧Facebook）製のUIライブラリ。画面を「コンポーネント」という部品に分けて作り、状態（state）が変わると自動で再描画される。', example: 'レゴブロック（コンポーネント）を組み合わせて画面を作る仕組み。ブロックの中身が変われば見た目も自動で更新される。', category: 'front' },
  { term: 'Next.js', description: 'Reactをベースにしたフレームワーク。ページのルーティング・サーバーサイドレンダリング・APIルートなど、本番アプリに必要な機能が最初から入っている。', example: 'ReactだけだとSPA（1枚のHTML）。Next.jsを使うとページごとにURLが作れたり、SEOに強くなったりする。', category: 'front' },
  { term: 'JSX', description: 'JavaScriptの中にHTMLっぽい書き方ができる構文。Reactのコンポーネントの見た目をこれで書く。ブラウザはそのまま読めないので、裏でJavaScriptに変換される。', example: '<div>や<p>をJSの中に書けるイメージ。{}の中にJSの変数や式を入れられる。例：<h1>{title}</h1>', category: 'front' },
  { term: 'コンポーネント（React）', description: 'UIの部品のこと。関数1つ＝部品1つ。ボタン・カード・ヘッダーなどをそれぞれコンポーネントとして作り、組み合わせてページを作る。名前は必ず大文字始まりにする。', example: 'レゴブロックの1個1個がコンポーネント。WordCard・Header・Buttonなど部品ごとに関数を作る。', category: 'front' },
  { term: 'props（プロップス）', description: '親コンポーネントから子コンポーネントにデータを渡す仕組み。子は受け取ったpropsを読むだけで、直接書き換えることはできない（読み取り専用）。', example: '親から子へのお手紙。子は読めるけど書き直せない。<WordCard term="useState" desc="状態管理のhook" />', category: 'front' },
  { term: 'state（ステート）', description: 'コンポーネントが持つ「状態（データ）」のこと。stateが変わると画面が自動で再描画される。直接書き換えはNGで、必ずsetterを使う。', example: 'いいね数・入力中のテキスト・モーダルの開閉など、変化するデータはすべてstate。', category: 'front' },
  { term: 'hook（フック）', description: 'use〇〇という名前のReact専用の関数群。コンポーネントの中でしか使えない。useState・useEffectが代表的。自分でカスタムhookを作ることもできる。', example: '「フック（釣り針）」でReactの機能を引っ張ってくるイメージ。useStateでstateを、useEffectで副作用を引っ張ってくる。', category: 'front' },
  { term: '再レンダリング', description: 'stateやpropsが変わったとき、コンポーネントが自動で再描画されること。Reactの一番の強み。生のJSでは自分でDOMを探して書き換えていたが、Reactは自動でやってくれる。', example: '生JS：document.getElementById("count").textContent = count; → React：setCount(count+1)だけで自動更新。', category: 'front' },
  { term: 'key（キー）', description: 'リストをmapで表示するとき、各要素に必ずつけるIDのようなもの。Reactがどの要素が変わったかを判断するために使う。忘れると警告が出る。', example: 'words.map((w) => <div key={w.id}>{w.term}</div>) → key={w.id}を忘れるとWarning発生。', category: 'front' },
  { term: 'フラグメント（<>）', description: 'Reactではreturnできるのは1つのタグだけというルールがある。余分なdivを増やしたくないときに<>...</>で囲む。これがフラグメント。', example: 'return (<><h1>タイトル</h1><p>説明</p></>) → divを使わずに複数要素をまとめられる。', category: 'front' },
  { term: '単方向データフロー', description: 'Reactではデータは必ず「親→子」の一方向にしか流れない。子から親にデータを渡したいときは、親が関数をpropsとして渡して子から呼び出す。', example: '子コンポーネントが「削除ボタン」を押したとき、親のstate（リスト）を更新するには、親からonDelete関数をpropsで渡して子が呼び出す。', category: 'front' },
  { term: '条件付きレンダリング', description: 'stateの値によって表示する内容を切り替えること。&&演算子や三項演算子を使う。', example: 'isOpen && <Modal /> → isOpenがtrueのときだけModalを表示。isLoading ? <Spinner /> : <Content />のようにも書ける。', category: 'front' },
  { term: 'イベントハンドラ', description: 'ボタンクリックや入力など、ユーザーの操作に反応する関数。onClickやonChangeなどの属性に渡す。JSのaddEventListenerと同じ役割をJSX内で書ける。', example: '<button onClick={handleClick}>送信</button> → handleClick関数がクリック時に実行される。', category: 'front' },
  { term: 'App Router', description: 'Next.js 13以降の新しいルーティング方式。appフォルダの中にpage.tsxを置くだけでURLページが作られる。以前のPages Routerより直感的。', example: 'app/quiz/page.tsx を作ると自動で /quiz というURLのページになる。', category: 'front' },
  { term: 'サーバーコンポーネント', description: 'Next.jsのApp Routerで登場した概念。サーバー側で実行されるコンポーネント。DBアクセスやAPIキーを安全に扱える。デフォルトはサーバーコンポーネント。', example: 'useStateやonClickを使いたい場合は「use client」を先頭に書いてクライアントコンポーネントにする必要がある。', category: 'front' },
  { term: 'use client（クライアントコンポーネント）', description: 'Next.jsでuseStateやuseEffect・イベントハンドラなど、ブラウザ側の操作が必要なときにファイルの先頭に書く宣言。これがないとhookが使えない。', example: 'ファイルの1行目に "use client" と書くだけ。書き忘れるとuseStateでエラーになるのでよく引っかかる。', category: 'front' },
  { term: 'Tailwindのクラスの書き方', description: 'classNameにスペース区切りでクラスを並べてスタイルをあてる。CSSファイルを別で書かなくていい。サイズ・色・余白・flexなどすべてクラス名で指定する。', example: '<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow"> → flex・中央揃え・余白・背景・角丸・影をクラス名だけで指定。', category: 'front' },
  { term: 'Supabaseクライアントの使い方', description: 'createClient()でクライアントを作り、.from("テーブル名").select()でデータ取得。.insert()で追加、.update()で更新、.delete()で削除。SQLを直接書かなくてもJSのメソッドでDB操作できる。', example: 'const { data } = await supabase.from("words").select("*"); → wordsテーブルの全データを取得。SQLのSELECT * FROM wordsと同じ意味。', category: 'front' },
  // ツール
  { term: 'Git', description: 'コードの変更履歴を管理するツール。commitで履歴を保存、branchで並行作業、mergeで合流する。', example: 'ゲームのセーブデータ管理。いつでも過去の状態に戻れる。', category: 'tool' },
  { term: 'GitHub', description: 'Gitの履歴をオンラインで共有・管理するサービス。チームで同じコードを扱うときに必須。', example: 'Gitのセーブデータを置く「共有ロッカー」。チーム全員がアクセスできる。', category: 'tool' },
  { term: 'Eclipse', description: 'Java開発でよく使われるIDE（統合開発環境）。コード補完・デバッグ・ビルドなどが1つのツールでできる。現職で使用中。', example: 'Javaを書くための「全部入りの仕事机」。メモ帳とは違い、エラーも教えてくれる。', category: 'tool' },
  { term: 'VSCode', description: '軽量で拡張性が高いエディタ。フロントエンド開発でよく使われる。訓練校ではこちらを使用。', example: 'シンプルだけど拡張機能を入れれば何でもできる「カスタマイズできる仕事机」。', category: 'tool' },
  { term: 'Tomcat', description: 'JavaのWebアプリを動かすためのサーバーソフト。Struts2アプリを動かすために必要。現職で使用中。', example: 'Javaで作ったWebアプリを「公開・実行」するための土台。', category: 'tool' },
  { term: 'A5:SQL Mk-2', description: 'MySQLなどのDBに接続してSQLを実行・確認できるツール。テーブルの中身を目で見て確認できる。現職で使用中。', example: 'DBの中身をExcelのように一覧で見たり、SQLを直接試したりできるツール。', category: 'tool' },
  { term: 'Supabase', description: 'データベース・認証・APIなどをまとめて提供するBaaSサービス。PostgreSQLをベースにしている。訓練校で使用。', example: '「DB・ログイン機能・API」をパッケージで提供してくれるサービス。自分で全部作らなくていい。', category: 'tool' },
  { term: 'Firebase', description: 'Googleが提供するBaaS。認証・DB（Firestore）・ストレージなどが使える。この単語帳アプリのDBとして使用。', example: 'Supabaseと同じく「よく使う機能をまとめて提供」してくれるGoogleのサービス。', category: 'tool' },
  { term: 'MySQL', description: '世界的に広く使われるオープンソースのリレーショナルデータベース（RDBMS）。SQLでデータを操作する。現職ではA5:SQL Mk-2から接続して使用。', example: 'たくさんの表（テーブル）を保管し、SQLという命令で出し入れする「巨大な電子ファイルキャビネット」。', category: 'tool' },
  { term: 'Excel', description: '表計算ソフト。データの集計・確認のほか、テスト仕様書や項目一覧などのドキュメント作成にも使う。開発現場で頻繁に使われる。', example: 'マス目に数字や文字を入れると自動で計算してくれる「電子方眼紙」。', category: 'tool' },
  // 設計
  { term: '基本設計', description: '「何を作るか」を決める工程。画面のレイアウト・処理の流れ・テーブル構成などを決める。詳細設計の前に行う。', example: '家を建てる前に「部屋数・間取り」を決める設計図のようなもの。', category: 'design' },
  { term: '詳細設計', description: '基本設計をもとに「どう実装するか」を決める工程。メソッド名・引数・戻り値・処理の流れなどを細かく定義する。', example: '「カレーを作る」が基本設計、「玉ねぎを何分炒めるか」が詳細設計。', category: 'design' },
  { term: '単体テスト', description: 'メソッドやクラスなど、小さな単位が正しく動くか確認するテスト。実装直後に自分で行う。', example: '部品の出来栄えをひとつひとつ確認してから組み立てるイメージ。', category: 'design' },
  { term: '結合テスト', description: '複数の機能を繋いで全体として正しく動くか確認するテスト。単体テストで合格した後に行う。', example: '部品を組み立てた後に、全体として正常に動くか試走するイメージ。', category: 'design' },
  { term: '境界値テスト', description: '「20歳以上OK」なら19・20・21のように、条件の境目の前後を重点的にテストする考え方。バグが出やすい場所を狙い打つ。', example: '制限速度60kmなら59・60・61で試してみるのと同じ発想。', category: 'design' },
  { term: '影響範囲の調査', description: '機能を追加・修正するとき、どこに影響が出るかを洗い出す作業。DB・画面・バッチ・外部連携など幅広く確認する。', example: '壁を1枚動かすと、電気配線・水道管・構造に影響が出るかを確認するリフォームの事前調査。', category: 'design' },
  { term: 'ページネーション設計', description: '一覧画面でデータを何件ずつ表示するかを決め、「前へ/次へ」ボタンで切り替える仕組みの設計。LIMIT・OFFSETとページ番号の計算が必要。', example: '実務でページネーション機能の追加を担当した。totalCount÷pageSizeで総ページ数を計算する。', category: 'design' },
  // その他
  { term: 'フレームワーク', description: 'アプリ開発でよく使う処理をまとめてくれた「土台」。ゼロから作らなくてよいので開発が速くなる。Struts2・React・Next.jsなどが代表例。', example: '家を建てるときの「プレハブキット」。基本的な構造はすでにあり、自分はカスタマイズするだけ。', category: 'general' },
  { term: 'デバッグ', description: 'プログラムのバグ（不具合）を見つけて修正する作業。System.out.printlnやEclipseのデバッガで変数の中身を確認する。', example: '料理の味がおかしいとき、どの調味料が原因か一つずつ確認するイメージ。', category: 'general' },
  { term: 'リファクタリング', description: 'プログラムの動作を変えずに、コードの読みやすさや構造を改善すること。メソッドを分割したり変数名を分かりやすくしたりする。', example: '引き出しの中を整理整頓する作業。外から見た使い勝手は同じでも、中がきれいになる。', category: 'general' },
  { term: 'コードレビュー', description: '自分が書いたコードを他の人に確認してもらうこと。バグや設計の問題を早期に発見できる。指摘は勉強のチャンス。', example: '作文を先生に添削してもらうイメージ。指摘されたことを次に活かす。', category: 'general' },
  { term: 'ログ', description: 'プログラムの動作状況を記録したもの。エラー発生時の原因特定に使う。どこで何が起きたかを後から追いかけられる。', example: 'レストランの注文履歴。「何時に何をオーダーしたか」が後から確認できる。', category: 'general' },
  { term: '環境変数', description: 'パスワードやAPIキーなどをコードに直書きせず、外部から設定する仕組み。本番・開発・テストで値を切り替えるのにも使う。', example: '設定値をコードの外に置いておくイメージ。本番では本物、開発では偽物を使える。', category: 'general' },
  { term: 'スタックトレース', description: 'エラーが発生したときに表示される「どこでエラーが起きたか」の記録。一番上が直接の原因で、下に行くほど呼び出し元になる。', example: '「4階で火災→3階の非常ベル→2階の警報→1階のセンサー」のようにエラーの経路が書いてある。', category: 'general' },
  { term: 'HTTP / HTTPS', description: 'Webブラウザとサーバーがデータをやりとりするためのルール（プロトコル）。HTTPSは暗号化されていて安全。', example: '手紙のやりとりのルール。HTTPSは封筒を二重にして暗号化した手紙を送るイメージ。', category: 'general' },
];

const wordsCol = collection(db, "words");

console.log(`${words.length} 件のデータを投入します...`);
let success = 0;
let skipped = 0;

for (const word of words) {
  // 同じ用語名が既にあればスキップ
  const q = query(wordsCol, where("term", "==", word.term));
  const existing = await getDocs(q);
  if (!existing.empty) {
    console.log(`  スキップ: ${word.term}`);
    skipped++;
    continue;
  }

  await addDoc(wordsCol, {
    ...word,
    created_at: Timestamp.now(),
  });
  console.log(`  ✓ ${word.term}`);
  success++;
}

console.log(`\n完了: ${success} 件追加 / ${skipped} 件スキップ`);
process.exit(0);
