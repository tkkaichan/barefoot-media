import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { sanity } from './sanity'

const builder = imageUrlBuilder(sanity)

type SanityImage = SanityImageSource

export type ImageWithMeta = {
  _type?: string
  asset?: { _ref?: string; _type?: string }
  hotspot?: unknown
  crop?: unknown
  alt?: string
  caption?: string
  shotAt?: string
}

/**
 * Sanity Image CDN の URL を組み立てる。
 * リサイズ・WebP/AVIF 変換は CDN 側に任せる（REQUIREMENTS §1）。
 */
export function urlFor(source: SanityImage | undefined | null) {
  if (!source) return null
  return builder.image(source).auto('format').fit('max')
}

/** 単一URL。width 指定必須（レイアウトシフト防止のため呼び出し側で高さも決める）。 */
export function imageUrl(
  source: SanityImage | undefined | null,
  width: number,
  height?: number,
): string | undefined {
  const b = urlFor(source)
  if (!b) return undefined
  const sized = height ? b.width(width).height(height).fit('crop') : b.width(width)
  return sized.url()
}

/**
 * srcset を作る。widths は表示幅の 1x/2x を想定して渡す。
 * 例: srcSet(img, [560, 840, 1120])
 */
export function srcSet(
  source: SanityImage | undefined | null,
  widths: number[],
  aspect?: number,
): string | undefined {
  const b = urlFor(source)
  if (!b) return undefined
  return widths
    .map((w) => {
      const h = aspect ? Math.round(w / aspect) : undefined
      const url = h ? b.width(w).height(h).fit('crop').url() : b.width(w).url()
      return `${url} ${w}w`
    })
    .join(', ')
}

/** alt は必須。未入力を静かに通さず、ビルドログに警告を出す。 */
export function altText(image: ImageWithMeta | undefined | null, context: string): string {
  const alt = image?.alt?.trim()
  if (!alt) {
    console.warn(`[a11y] alt が未設定です: ${context}`)
    return ''
  }
  return alt
}
