# デザインブリーフ: barefoot-media（はだしノート・仮称）

> 本ブリーフは docs/DESIGN.md と併用する。トークン値（色・タイポ・余白・角丸）はDESIGN.mdが正。
> 完成モック: docs/design-mockups/plan-c2-portal-hero.html（トップ）、page-privacy / page-company / page-contact.html（サブページ）。実装はモックの再現を基準とする。

## 0. 前提
- ページの型: これは**専門メディアのポータル型トップ＋記事ページ**です（page archetype: content portal / article）。ブランドLPではない。
- 想定ユーザー(persona): 足の悩み（外反母趾・浮き指・立ち仕事の疲れ）を持つ30〜50代の一般層と、ベアフット入門検討者。検索で記事に直接着地する流入が主。
- 主要CV / 行動: ①入門記事を読む → ②メールリスト登録（移行30日ガイドPDF）。アフィリリンクは記事内。
- モーション強度: **控えめ**

## 1. テイスト
- 雑誌の誌面のようなエディトリアルレイアウト(editorial/magazine layout)を基調に、装飾を排したミニマリズム(minimalism)で構成する
- 骨格・ナビ配置はヤコブの法則(Jakob's law)に従い慣習的に。独自性は写真とタイポで出す
- まず視覚品質（整列・余白・タイポ）を磨く（aesthetic-usability effect）

## 2. 配色
- 配色はニュートラルグレー基調＋アクセント1色(monochrome + single accent)。ベースグレー#F4F4F4(60) / 白サーフェスと墨#222220(30) / 深緑#42603B(10) の60-30-10ルール
- アクセント緑はCTA・リンク・カテゴリラベル・フォーカスリングのみ。装飾の緑面は作らない
- メール登録セクションだけ#33492Eの反転ブロック(inverted brand color block)。反転は全サイトでこの1用途のみ
- 文字色はWCAG AA(コントラスト比4.5:1以上)を満たすこと
- 【禁止】クリーム・生成り・ベージュ系の背景(warm off-white)は使わない

## 3. タイポグラフィ
- フォントペアリングは明朝見出し×ゴシック本文(font pairing: mincho serif display + gothic sans body)。見出し=Shippori Mincho B1、本文=Noto Sans JP
- 英字ラベル・番号・日付・実測数値はIBM Plex Mono(monospace)。数値はタブラー数字(tabular figures)で桁を揃える
- 見出しはline-height 1.5〜1.7、本文は1.85〜1.95でゆったり
- 見出しはtext-wrap:balanceで行長を揃え、意味の切れ目で改行する
- セクション見出しに上罫線＋mono英字ラベル（PICKUP / LATEST / SERIES）。サブページ見出しはmonoの索引番号(numbered headings, 01〜)付き
- 和欧混植(mixed JP/EN typesetting)では英数字をわずかに大きく(103〜105%)

## 4. レイアウト / レスポンシブ
- コンテンツ幅は最大1160px(default container)。記事本文は680〜760px(narrow)に絞る
- トップはメイン＋右サイドバー320pxのサイドバーレイアウト(sidebar layout)
- 余白は8ptグリッド(spacing scale, 8/16/24/32/48/64)に限定。セクション間80pxで縦リズム(vertical rhythm)を統一
- モバイルファースト(mobile-first)。960px以下でサイドバーは本文下に縦積み(responsive stacking)、タップ領域は44px以上(touch target)
- 角丸は全体2px。カテゴリチップのみピル型(pill)、著者近影のみ円形

## 5. セクション構成（トップ）
1. **header** — 固定ヘッダー(sticky header): ロゴ / グローバルナビ5項目 / 記事検索 / 緑の小CTA「移行30日ガイド」
2. **hero** — コンパクトなスプリットヒーロー(split hero): 左にmono英字eyebrow＋明朝コピー「裸足の感覚は、畑で確かめてからすすめます。」＋リード1文＋CTA1本（はじめてのベアフット入門）。右に畑の実写4:3。全面写真ヒーロー(fullscreen hero)にはしない
3. **pickup** — 編集部おすすめ2枚(card grid, 2 columns): 16:9写真＋カテゴリラベル＋明朝タイトル＋日付
4. **latest + sidebar** — 新着記事2列カードグリッド＋ページネーション(pagination)。サイドバーは上から: 著者ボックス（白面・近影・実地テストの一文＋テストポリシーへのリンク）/ 「まずこの3本から」番号付きリスト（記事20本超で人気ランキングに切替）/ メール登録の反転ブロック（hero with inline signup型のフォーム連結）/ カテゴリチップ(tag)
5. **series** — 連載2枚: 白面カード（番号ラベル＋明朝タイトル＋説明＋正方形写真）
6. **footer** — ミニマルフッター(minimal footer): 一行の説明＋運営者情報・テストポリシー・プライバシーポリシー・お問い合わせ

記事ページ: パンくず(breadcrumbs)＋中央1カラム＋追従目次(sticky table of contents, scrollspy)＋上部2pxスクロール進捗バー(scroll progress bar)。
サブページ: page-privacy / page-company / page-contact.html の枠を踏襲。フォームは枠線型入力＋緑のフォーカスリング(focus ring)、ラベル上置き(top-aligned labels)・任意項目のみ「(任意)」表示、インラインバリデーション(inline validation)、送信ボタンはdisabled→送信中→完了の3状態(button states)。

## 6. モーション / インタラクション
- 全体方針: ease-out、UI反応150ms・演出250ms。spring/bounceは使わない
- ナビリンクは下線スライドイン(underline slide-in)
- カード写真はホバーでゆっくりズーム(image zoom on hover, scale 1.03, 500ms)
- 矢印はホバーで4px右へナッジ(arrow nudge on hover)
- スクロール演出は薄いフェードアップ(scroll reveal)のみ任意で。パララックス・ピン留め・スクラブ(scroll-driven animation)は使わない
- ホバー情報はタッチデバイスで常時表示に置き換える(hover-independent)

## 7. 細部の意匠
- 矢印: **細いロングアロー(long thin arrow: 軸長め・鏃小さめ、stroke 1.4px)** のSVG1種に全サイト統一。文字・記号の矢印は使わない
- displayコピーの改行: ヒーローは「裸足の感覚は、／畑で確かめてからすすめます。」の読点位置で改行＋コンテナmax-width調整、モバイルはtext-wrap:balanceフォールバック
- アイコン: lucide系の実SVG(line icons, stroke 1.5px)のみ。使用箇所は検索虫眼鏡・ページネーションのシェブロン程度に最小限
- 画像上テキスト: 置かない。例外は実測値・出典・操作ラベルのみ（モックの「仮素材」注記は実装時に削除）
- 写真: 実写のみ。カード16:10 / Pickup16:9 / ヒーロー4:3に統一(aspect ratio)。未確定の枠は中身を注記したプレースホルダー(labeled image placeholder)にする

## 8. UXライティング
- voice & toneは「正直・実測・穏やか」の3語。です・ます調、一人称は「わたし／当サイト」、絵文字なし、誇張形容詞なし
- 数字はspecific numbersで語る（「軽い」→「片足158g」、「すぐ濡れる」→「8分で浸水」）
- CTA文言はaction-first: 「登録」ではなく「受け取る」「まず読む」
- CTA直下に安心のreassurance microcopy: 「週1通・いつでも1クリックで解除できます」
- 健康系の見出しは煽らない。benefit-drivenだが断定は避け「〜を整理する」の距離感で

## 9. 行動設計 / HCD
- リードマグネットは返報性(reciprocity)の設計: 入門記事で価値を先に渡し、記事末・サイドバーで登録を求める。ヒーローでメールは要求しない
- 記事末に「この記事の次に読む」導線（内部リンク2本＋登録CTA）
- 社会的証明(social proof)は実数が貯まるまで置かない。「読者1,000人」等の未達数値・虚偽の希少性は使わない
- a11y: キーボード操作(keyboard nav)・可視フォーカスリング(focus visible)・全画像にalt。状態は色だけに頼らずラベル併記(don't rely on color alone)

## 10. 禁止事項
- カード・見出しの1辺だけを色付け/太くするアクセントボーダーは使わない(no single-edge colored border accents)
- 頭文字・文字を円や角丸に入れた擬似アイコンは使わない(no letter-in-circle pseudo-icons)。実ロゴが無い項目はテキストのみで組む
- 「→」「›」等の文字・記号矢印は使わない(no text-character arrows)。矢印は「7. 細部の意匠」のロングアローSVG1種に統一
- 画像の上に役割のないキャプション・雰囲気テキストを置かない(no decorative captions on imagery)
- eyebrowはセクション見出し行（PICKUP / LATEST / SERIES / ページ名英字）のみに限定し、全ブロックへ機械的に置かない。直後の見出しと情報が重複するeyebrowは削る
- クリーム・生成り・ベージュの背景色は使わない（運営者の明示的決定。#F4F4F4系の無彩色グレーを維持）
- トップページに全面写真ヒーロー(fullscreen hero)を置かない（全画面写真はテストポリシーページ・連載トップ限定）
- localStorage/sessionStorageに依存するUIを作らない（メール登録状態等はサーバー側で扱う）

---
作成: 2026-08-06 ／ web-design-brief-builder（語彙集324語）に基づき選定・約36語
