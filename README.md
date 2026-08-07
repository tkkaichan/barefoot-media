# barefoot-media（仮称: はだしノート / HADASHI FIELD NOTE）

ベアフットシューズの日本語Webメディア立ち上げプロジェクト。
熊本・山鹿で畑1haを耕す運営者が、泥・雨・砂利の実地テストと実測データで書く専門メディア。

## リポジトリ構成

```
barefoot-media/
├── CLAUDE.md                  # AI作業ルールのSSOT（最初に読む）
├── docs/
│   ├── STRATEGY.md            # 戦略SSOT（コンセプト・KPI・製品開発ゲート）
│   ├── REQUIREMENTS.md        # サイト要件（Astro + Sanity + Vercel / DBスキーマ / 構造化データ）
│   ├── DESIGN.md              # デザイントークンとDo/Don't
│   ├── design-brief.md        # デザイン指示書（モックが無い画面用のガードレール）
│   ├── IMPLEMENTATION-HANDOFF.md  # 実装指示書（モック1:1移植・再デザイン禁止）★実装はここから
│   └── design-mockups/        # 確定デザインモック（これが見た目の正）
│       ├── plan-c2-portal-hero.html   # トップページ
│       ├── page-article.html          # 記事テンプレート
│       ├── page-privacy.html / page-company.html / page-contact.html
│       └── _archive/                  # 検討過程の旧案（実装対象外）
├── research/                  # キックオフ調査（KWマップ・競合・アフィリ・LLMO監査・記事カレンダー）
├── content/                   # 記事制作パイプラインの成果物置き場
├── studio/                    # Sanity Studio（CMS）→ studio/README.md
├── web/                       # Astro フロントエンド → web/README.md
└── .claude/skills/
    └── barefoot-article-pipeline/     # 記事制作パイプライン（編集部方式・7役割）
```

## セットアップ

初回は Sanity → Astro の順。Sanity にコンテンツが無いと Astro のビルドが落ちる。

```bash
cd studio && npm install && npx sanity login
```

`sanity.io/manage` でプロジェクトを作り、`studio/.env.example` を `.env.local` にコピーして
Project ID を書く。次に初期コンテンツを投入する。

```bash
npx sanity dataset import seed/initial-content.ndjson production --replace
```

```bash
cd ../web && npm install
```

`web/.env.example` を `.env` にコピーして同じ Project ID とサイトURLを書き、`npm run dev`。

詳細は各ディレクトリの README。

## 実装の始め方（Claude Code）

1. `CLAUDE.md` と `docs/IMPLEMENTATION-HANDOFF.md` を読む
2. `docs/design-mockups/` のHTML/CSSをAstroに1:1移植する（再デザイン禁止）
3. 技術要件・Sanityスキーマは `docs/REQUIREMENTS.md` が正

### 実装済みの範囲

`studio/` と `web/` はモックの移植とスキーマ実装が済んでいる。
残っているのは**コンテンツと運用設定**（下記）で、コードの追加実装は不要。

- 写真の差し替え（ヒーロー・記事・シューズ・著者近影。モックのWikimedia素材は移植していない）
- プライバシーポリシー／免責／テストポリシー本文の確定（シードは「ローンチ前に作成」の枠だけ）
- メール配信ツールの選定と `PUBLIC_NEWSLETTER_ENDPOINT` の設定（REQUIREMENTS §5）
- お問い合わせフォームの送信先（`PUBLIC_CONTACT_ENDPOINT`）
- GA4 / Search Console / Vercel Analytics の接続
- Sanity Webhook → Vercel Deploy Hook の連携

## 記事制作

`.claude/skills/barefoot-article-pipeline/SKILL.md` のフローで制作する。
体験パートは運営者の生ログ（メモ・計測値）のみを原料とし、AIによる体験の創作は禁止。
