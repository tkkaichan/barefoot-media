/**
 * Sanity の選択肢 value → 日本語表示名。
 * studio/lib/constants.ts と 1:1 で対応させること。片方だけ変えない。
 */

export const SHOE_CATEGORY_LABEL: Record<string, string> = {
  barefoot: 'ベアフット（ゼロドロップ・薄底）',
  zeroDropCushion: 'ゼロドロップ・クッションあり',
  tabi: '地下足袋・足袋型',
  workShoe: 'ワークシューズ・外仕事',
  sandal: 'サンダル',
  sockShoe: 'ソックスシューズ',
}

export const WATERPROOF_LABEL: Record<string, string> = {
  none: 'なし',
  waterRepellent: '撥水',
  waterproof: '防水',
}

export const SCENE_LABEL: Record<string, string> = {
  pavedCommute: '舗装路・通勤',
  standingWork: '立ち仕事',
  rain: '雨天',
  gravel: '砂利',
  field: '畑・外仕事',
  running: 'ランニング',
  gym: 'ジム・トレーニング',
  business: 'ビジネス',
}

/** ◎○△× は記号だけに頼らず、必ず title / aria-label にテキストを併記する。 */
export const SCENE_FIT_SYMBOL: Record<string, string> = {
  best: '◎',
  good: '○',
  fair: '△',
  poor: '×',
}
export const SCENE_FIT_LABEL: Record<string, string> = {
  best: '最適',
  good: '使える',
  fair: '条件付き',
  poor: '向かない',
}

export const TRANSITION_LABEL: Record<string, string> = {
  beginner: '初心者向け',
  intermediate: '中級',
  advanced: '上級',
}

export const ARTICLE_TYPE_LABEL: Record<string, string> = {
  guide: 'ガイド',
  comparison: '比較',
  review: 'レビュー',
  health: '健康',
  column: 'コラム',
  policy: 'ポリシー',
}

export const EVIDENCE_LEVEL_LABEL: Record<string, string> = {
  rct: 'RCT・メタ分析',
  observational: '観察研究',
  expert: '専門家見解',
  ownMeasurement: '当サイトの実測',
  anecdote: '個人の体験',
  insufficient: '根拠不十分',
}

/** 比較表の列見出しと単位。 */
export const COLUMN_LABEL: Record<string, { label: string; unit?: string }> = {
  priceJpy: { label: '価格', unit: '円' },
  weightG: { label: '実測重量', unit: 'g' },
  soleThicknessMm: { label: '実測ソール厚', unit: 'mm' },
  dropMm: { label: 'ドロップ', unit: 'mm' },
  toeboxWidthMm: { label: 'トゥボックス幅', unit: 'mm' },
  waterproof: { label: '防水性' },
  transitionDifficulty: { label: '慣らし難易度' },
  miScore: { label: 'ミニマリストインデックス' },
  wetGripScore: { label: '雨天グリップ', unit: '/5' },
  waterIntrusionMin: { label: '浸水時間', unit: '分' },
  overall: { label: '総合評価', unit: '/5' },
}

export function label(map: Record<string, string>, key: string | undefined | null): string {
  if (!key) return '—'
  return map[key] ?? key
}
