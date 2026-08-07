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
└── .claude/skills/
    └── barefoot-article-pipeline/     # 記事制作パイプライン（編集部方式・7役割）
```

## 実装の始め方（Claude Code）

1. `CLAUDE.md` と `docs/IMPLEMENTATION-HANDOFF.md` を読む
2. `docs/design-mockups/` のHTML/CSSをAstroに1:1移植する（再デザイン禁止）
3. 技術要件・Sanityスキーマは `docs/REQUIREMENTS.md` が正

## 記事制作

`.claude/skills/barefoot-article-pipeline/SKILL.md` のフローで制作する。
体験パートは運営者の生ログ（メモ・計測値）のみを原料とし、AIによる体験の創作は禁止。
