# studio — Sanity Studio

はだしノート（仮称）のコンテンツ管理画面。

## セットアップ

```bash
npm install
```

1. [sanity.io/manage](https://www.sanity.io/manage) でプロジェクトを作り、Project ID を控える
2. `.env.example` をコピーして `.env.local` を作り、`SANITY_STUDIO_PROJECT_ID` を書く
3. `npx sanity login`（CLIの認証。トークンをファイルに書く必要はない）

```bash
npm run dev
```

http://localhost:3333 で開く。

## 初期コンテンツの投入

サイト設定・トップページ・ハブ5件・トピック10件・連載2件・固定ページ8件を一括で入れる。

```bash
npx sanity dataset import seed/initial-content.ndjson production --replace
```

投入後、Studio で以下を必ず埋める（未設定だと画面が寂しくなるだけで、ビルドは通る）:

- サイト設定 → 本番URL / 既定のOG画像
- トップページ → ヒーロー写真（4:3の畑の実写）
- 著者「近藤 泰樹」→ 近影
- 連載2件 → サムネイル（正方形）

## デプロイ

```bash
npm run deploy
```

`https://<SANITY_STUDIO_HOST>.sanity.studio` で公開される。

## スキーマの構成

```
schemaTypes/
├── documents/    post / shoe / brand / author / category / topic / series / page / homepage / siteSettings
├── objects/      specs.ts に実測値・畑テスト・評価・アフィリ・FAQ・SEO をまとめている
└── blocks/       blockContent.ts（本文）と customBlocks.ts（比較表・エビデンス表・CTA等）
lib/constants.ts  選択肢の一元管理
structure/        左メニューの構成とシングルトン制御
```

### 変更するときの注意

- `lib/constants.ts` の value を変えたら **`web/src/lib/labels.ts` も必ず合わせる**。
  片方だけ変えると一覧・比較表の表示が `—` になる。
- `siteSettings` と `homepage` はシングルトン。新規作成メニューには出ない。
- 実測値（`specMeasured`）を入れたら実測日も必須。C7（出典・日付の明示）要件のため。

## 秘匿値の扱い

`.env.local` に書くのは Project ID など公開しても差し支えない値だけ。
書き込みトークンや配信ツールのAPIキーは Sanity / Vercel の管理画面の環境変数に登録し、
リポジトリにもチャットにも貼らないこと。
