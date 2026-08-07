/**
 * 選択肢の一元管理。
 * ここの value は Astro 側 web/src/lib/labels.ts の key と 1:1 で対応させること。
 * 値を追加・変更したら必ず両方を更新する。
 */

export const SHOE_CATEGORIES = [
  { title: 'ベアフット（ゼロドロップ・薄底）', value: 'barefoot' },
  { title: 'ゼロドロップ・クッションあり', value: 'zeroDropCushion' },
  { title: '地下足袋・足袋型', value: 'tabi' },
  { title: 'ワークシューズ・外仕事', value: 'workShoe' },
  { title: 'サンダル', value: 'sandal' },
  { title: 'ソックスシューズ', value: 'sockShoe' },
] as const

export const WATERPROOF_LEVELS = [
  { title: 'なし', value: 'none' },
  { title: '撥水', value: 'waterRepellent' },
  { title: '防水', value: 'waterproof' },
] as const

export const SCENES = [
  { title: '舗装路・通勤', value: 'pavedCommute' },
  { title: '立ち仕事', value: 'standingWork' },
  { title: '雨天', value: 'rain' },
  { title: '砂利', value: 'gravel' },
  { title: '畑・外仕事', value: 'field' },
  { title: 'ランニング', value: 'running' },
  { title: 'ジム・トレーニング', value: 'gym' },
  { title: 'ビジネス', value: 'business' },
] as const

export const SCENE_FITS = [
  { title: '◎ 最適', value: 'best' },
  { title: '○ 使える', value: 'good' },
  { title: '△ 条件付き', value: 'fair' },
  { title: '× 向かない', value: 'poor' },
] as const

export const TRANSITION_DIFFICULTY = [
  { title: '初心者向け', value: 'beginner' },
  { title: '中級', value: 'intermediate' },
  { title: '上級', value: 'advanced' },
] as const

export const SHOE_STATUS = [
  { title: 'テスト中', value: 'testing' },
  { title: '公開済み', value: 'published' },
  { title: '取扱終了', value: 'retired' },
] as const

export const ARTICLE_TYPES = [
  { title: 'ガイド（D: 定義・入門）', value: 'guide' },
  { title: '比較（H）', value: 'comparison' },
  { title: 'レビュー（R）', value: 'review' },
  { title: '健康（M）', value: 'health' },
  { title: 'コラム', value: 'column' },
  { title: 'ポリシー・固定ページ', value: 'policy' },
] as const

export const CONTENT_TIERS = [
  { title: '集客層（traffic・8割）', value: 'traffic' },
  { title: '差別化層（differentiation・2割）', value: 'differentiation' },
] as const

export const LEAD_MAGNETS = [
  { title: 'なし', value: 'none' },
  { title: 'LM1: 移行30日カレンダー', value: 'LM1' },
  { title: 'LM2: 足指トレーニング', value: 'LM2' },
] as const

export const PERSONAS = [
  { title: 'P1 健康志向の一般層', value: 'P1' },
  { title: 'P2 立ち仕事', value: 'P2' },
  { title: 'P3 ランナー', value: 'P3' },
  { title: 'P4 外仕事・ガーデニング', value: 'P4' },
] as const

export const PREFERRED_LINKS = [
  { title: 'Amazon', value: 'amazon' },
  { title: '楽天', value: 'rakuten' },
  { title: '公式', value: 'official' },
] as const

export const AUTHOR_ROLES = [
  { title: '著者', value: 'author' },
  { title: '監修者', value: 'supervisor' },
] as const
