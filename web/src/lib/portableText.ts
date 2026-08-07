import type { PortableTextBlock, PortableTextNode } from './types'

export type Heading = { id: string; text: string; number: string }

function isBlock(node: PortableTextNode): node is PortableTextBlock {
  return node?._type === 'block'
}

export function blockToPlainText(block: PortableTextBlock): string {
  return (block.children ?? []).map((c) => c.text ?? '').join('')
}

/** 本文全体のプレーンテキスト。meta description のフォールバックに使う。 */
export function toPlainText(body: PortableTextNode[] | undefined): string {
  if (!body) return ''
  return body
    .filter(isBlock)
    .map(blockToPlainText)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * h2 に安定した id を振る。
 * 見出し文字列ではなく Portable Text の _key を使う。
 * 見出しを書き換えてもアンカーが壊れず、日本語見出しでもURLが崩れないため。
 */
export function headingId(key: string): string {
  return `s-${key}`
}

/** 追従目次と h2 の連番（01, 02…）の生成元。h2 のみを拾う。 */
export function extractHeadings(body: PortableTextNode[] | undefined): Heading[] {
  if (!body) return []
  const out: Heading[] = []
  let n = 0
  for (const node of body) {
    if (!isBlock(node) || node.style !== 'h2') continue
    n += 1
    out.push({
      id: headingId(node._key),
      text: blockToPlainText(node),
      number: String(n).padStart(2, '0'),
    })
  }
  return out
}

/** 指定した h2 が何番目かを返す（レンダラ側で連番を出すため）。 */
export function buildHeadingNumberMap(body: PortableTextNode[] | undefined): Map<string, string> {
  const map = new Map<string, string>()
  for (const h of extractHeadings(body)) {
    map.set(h.id, h.number)
  }
  return map
}

/** 抜粋。leadDefinition が無いときの meta description に使う。 */
export function excerpt(text: string, length = 120): string {
  const t = text.trim()
  if (t.length <= length) return t
  return `${t.slice(0, length - 1)}…`
}
