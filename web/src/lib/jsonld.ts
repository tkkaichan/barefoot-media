/**
 * JSON-LD の生成。すべて Sanity のデータから組み立てる（手書き禁止・REQUIREMENTS §4）。
 * 生成物は BaseLayout の <JsonLd> で1つの @graph にまとめて出力する。
 */
import { imageUrl } from './image'
import { SCENE_LABEL, WATERPROOF_LABEL } from './labels'
import { isoDate } from './format'
import type { AuthorRef, PageDoc, Post, ShoeFull, ShoeSummary, SiteSettings } from './types'

type Json = Record<string, unknown>

const clean = <T extends Json>(obj: T): T =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ) as T

export function absoluteUrl(site: SiteSettings, path: string): string {
  const base = site.url?.replace(/\/$/, '') ?? ''
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function organizationLd(site: SiteSettings): Json {
  return clean({
    '@type': 'Organization',
    '@id': `${site.url}/#organization`,
    name: site.organizationName || site.siteName,
    url: site.url,
    logo: site.logo ? imageUrl(site.logo, 512) : undefined,
    address: site.organizationAddress
      ? { '@type': 'PostalAddress', addressLocality: site.organizationAddress, addressCountry: 'JP' }
      : undefined,
    foundingDate: site.foundingDate,
    sameAs: site.sameAs?.length ? site.sameAs : undefined,
    founder: site.primaryAuthor ? personLd(site, site.primaryAuthor) : undefined,
  })
}

export function websiteLd(site: SiteSettings): Json {
  return clean({
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: site.siteName,
    url: site.url,
    description: site.description,
    inLanguage: 'ja',
    publisher: { '@id': `${site.url}/#organization` },
    // 内部検索を実装したら potentialAction (SearchAction) をここに足す
  })
}

export function personLd(site: SiteSettings, author: AuthorRef): Json {
  return clean({
    '@type': 'Person',
    '@id': author.slug ? `${site.url}/about/#${author.slug}` : undefined,
    name: author.name,
    jobTitle: author.jobTitle,
    description: author.bio,
    image: author.photo ? imageUrl(author.photo, 400, 400) : undefined,
    sameAs: author.sameAs?.length ? author.sameAs : undefined,
    hasCredential: author.credentials
      ? {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: author.credentials,
        }
      : undefined,
  })
}

export function breadcrumbLd(
  site: SiteSettings,
  trail: Array<{ name: string; path?: string }>,
): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(site, item.path) } : {}),
    })),
  }
}

export function faqLd(faq: Array<{ question: string; answer: string }>): Json | null {
  if (!faq?.length) return null
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.question, // 口語形のまま出す（C4）
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

/**
 * 実測値は additionalProperty(PropertyValue) で機械可読にする。
 * ここが「独自データをAIに拾わせる」中心なので、値があるものは漏らさず出す。
 */
function measuredProperties(shoe: ShoeSummary): Json[] {
  const m = shoe.specMeasured ?? {}
  const f = shoe.fieldTest ?? {}
  const props: Array<[string, unknown, string?]> = [
    ['実測重量', m.weightG, 'g'],
    ['実測ソール厚', m.soleThicknessMm, 'mm'],
    ['ドロップ', m.dropMm, 'mm'],
    ['トゥボックス幅', m.toeboxWidthMm, 'mm'],
    ['実測サイズ', m.measuredSizeCm, 'cm'],
    ['雨天グリップ', f.wetGripScore, '/5'],
    ['泥詰まり', f.mudCloggingScore, '/5'],
    ['浸水時間', f.waterIntrusionMin, '分'],
    ['テスト日数', f.testDays, '日'],
    ['テスト距離', f.testDistanceKm, 'km'],
    ['ミニマリストインデックス', shoe.miScore],
  ]
  const out: Json[] = props
    .filter(([, v]) => typeof v === 'number')
    .map(([name, value, unit]) =>
      clean({
        '@type': 'PropertyValue',
        name: name as string,
        value: value as number,
        unitText: unit,
      }),
    )
  if (m.measuredAt) {
    out.push({ '@type': 'PropertyValue', name: '実測日', value: m.measuredAt })
  }
  if (shoe.specOfficial?.waterproof) {
    out.push({
      '@type': 'PropertyValue',
      name: '防水性',
      value: WATERPROOF_LABEL[shoe.specOfficial.waterproof] ?? shoe.specOfficial.waterproof,
    })
  }
  if (shoe.recommendedScenes?.length) {
    out.push({
      '@type': 'PropertyValue',
      name: '適したシーン',
      value: shoe.recommendedScenes.map((s) => SCENE_LABEL[s] ?? s).join('、'),
    })
  }
  return out
}

function offerUrl(shoe: ShoeSummary): string | undefined {
  const a = shoe.affiliate ?? {}
  const preferred = a.preferredLink as string | undefined
  return (
    (preferred === 'rakuten' && a.rakutenUrl) ||
    (preferred === 'official' && a.officialUrl) ||
    a.amazonUrl ||
    a.rakutenUrl ||
    a.officialUrl ||
    undefined
  )
}

export function productLd(site: SiteSettings, shoe: ShoeSummary): Json {
  return clean({
    '@type': 'Product',
    '@id': absoluteUrl(site, `/shoes/${shoe.slug}/#product`),
    name: [shoe.brand?.name, shoe.name].filter(Boolean).join(' '),
    alternateName: shoe.nameJa,
    description: shoe.summary,
    brand: shoe.brand ? { '@type': 'Brand', name: shoe.brand.name } : undefined,
    image: shoe.imageMain ? imageUrl(shoe.imageMain, 1200) : undefined,
    url: absoluteUrl(site, `/shoes/${shoe.slug}/`),
    offers:
      typeof shoe.priceJpy === 'number'
        ? clean({
            '@type': 'AggregateOffer',
            priceCurrency: 'JPY',
            lowPrice: shoe.priceJpy,
            highPrice: shoe.priceJpy,
            offerCount: 1,
            url: offerUrl(shoe),
            availability: 'https://schema.org/InStock',
          })
        : undefined,
    additionalProperty: measuredProperties(shoe),
  })
}

export function reviewLd(site: SiteSettings, shoe: ShoeSummary, post: Post): Json | null {
  const rating = shoe.ratings?.overall
  if (typeof rating !== 'number') return null
  return clean({
    '@type': 'Review',
    itemReviewed: { '@id': absoluteUrl(site, `/shoes/${shoe.slug}/#product`) },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: personLd(site, post.author),
    datePublished: isoDate(post.publishedAt),
    publisher: { '@id': `${site.url}/#organization` },
  })
}

export function articleLd(site: SiteSettings, post: Post): Json {
  const url = absoluteUrl(site, `/articles/${post.slug}/`)
  return clean({
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.seo?.metaDescription || post.leadDefinition,
    url,
    mainEntityOfPage: url,
    image: post.mainImage ? imageUrl(post.mainImage, 1200) : undefined,
    datePublished: isoDate(post.publishedAt),
    dateModified: isoDate(post.updatedAt || post.publishedAt),
    inLanguage: 'ja',
    author: personLd(site, post.author),
    reviewedBy: post.supervisor ? personLd(site, post.supervisor) : undefined,
    publisher: { '@id': `${site.url}/#organization` },
    articleSection: post.category?.title,
  })
}

export function itemListLd(
  site: SiteSettings,
  items: Array<{ name: string; path: string }>,
): Json {
  return {
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: absoluteUrl(site, item.path),
    })),
  }
}

export function webPageLd(site: SiteSettings, page: PageDoc): Json {
  const url = absoluteUrl(site, `/${page.slug}/`)
  return clean({
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    name: page.title,
    url,
    description: page.seo?.metaDescription || page.lead,
    inLanguage: 'ja',
    isPartOf: { '@id': `${site.url}/#website` },
    dateModified: isoDate(page.updatedAt),
  })
}

/** シューズDB詳細用に Product + Review をまとめる。 */
export function shoeDetailLd(site: SiteSettings, shoe: ShoeFull, authorRef?: AuthorRef): Json[] {
  const graph: Json[] = [productLd(site, shoe)]
  const rating = shoe.ratings?.overall
  if (typeof rating === 'number' && authorRef) {
    graph.push(
      clean({
        '@type': 'Review',
        itemReviewed: { '@id': absoluteUrl(site, `/shoes/${shoe.slug}/#product`) },
        reviewRating: { '@type': 'Rating', ratingValue: rating, bestRating: 5, worstRating: 1 },
        author: personLd(site, authorRef),
        datePublished: isoDate(shoe.specMeasured?.measuredAt),
        publisher: { '@id': `${site.url}/#organization` },
      }),
    )
  }
  return graph
}
