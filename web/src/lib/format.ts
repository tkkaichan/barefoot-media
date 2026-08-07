/** 表示用フォーマッタ。日付はモックに合わせて YYYY.MM.DD（ドット区切り）。 */

export function formatDate(value: string | undefined | null): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

/** 「2026.08時点」のような年月表記。価格の取得日に使う。 */
export function formatYearMonth(value: string | undefined | null): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** JSON-LD / <time datetime> 用の ISO 日付。 */
export function isoDate(value: string | undefined | null): string | undefined {
  if (!value) return undefined
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

export function formatPrice(value: number | undefined | null): string {
  if (typeof value !== 'number') return '—'
  return `¥${value.toLocaleString('ja-JP')}`
}

/** 01, 02 … の2桁ゼロ埋め。mono の連番ラベルに使う。 */
export function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

export function formatNumber(
  value: number | undefined | null,
  unit?: string,
): string {
  if (typeof value !== 'number') return '—'
  return `${value.toLocaleString('ja-JP')}${unit ?? ''}`
}
