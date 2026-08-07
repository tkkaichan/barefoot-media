import type { ImageWithMeta } from './image'

/** GROQ の投影に対応する型。クエリを変えたらここも合わせる。 */

export type PortableTextSpan = {
  _type: 'span'
  _key: string
  text: string
  marks?: string[]
}

export type PortableTextBlock = {
  _type: 'block'
  _key: string
  style?: string
  listItem?: 'bullet' | 'number'
  level?: number
  children: PortableTextSpan[]
  markDefs?: Array<Record<string, any>>
}

export type PortableTextNode = PortableTextBlock | ({ _type: string; _key: string } & Record<string, any>)

export type CategoryRef = {
  title: string
  navTitle?: string
  slug: string
  labelEn: string
  description?: string
}

export type TopicRef = {
  title: string
  labelShort?: string
  slug: string
}

export type AuthorRef = {
  name: string
  slug?: string
  role?: string
  jobTitle?: string
  credentials?: string
  bio?: string
  photo?: ImageWithMeta
  sameAs?: string[]
}

export type SeriesRef = {
  title: string
  slug: string
  number: number
  description?: string
  image?: ImageWithMeta
  heroImage?: ImageWithMeta
}

export type FaqItem = { question: string; answer: string }

export type ShoeSummary = {
  _id: string
  name: string
  nameJa?: string
  slug: string
  summary?: string
  brand?: { name: string; nameJa?: string; slug: string; officialUrl?: string }
  category?: string
  priceJpy?: number
  priceCheckedAt?: string
  priceNote?: string
  imageMain?: ImageWithMeta
  specOfficial?: Record<string, any>
  specMeasured?: Record<string, any>
  fieldTest?: Record<string, any>
  ratings?: Record<string, number>
  miScore?: number
  transitionDifficulty?: string
  recommendedScenes?: string[]
  sceneMatrix?: Array<{ scene: string; fit: string; note?: string }>
  affiliate?: Record<string, any>
  isProvided?: boolean
  status?: string
  reviewArticle?: { slug: string; title: string }
}

export type ShoeFull = ShoeSummary & {
  images?: ImageWithMeta[]
  pros?: string[]
  cons?: string[]
  missingRequirements?: Array<Record<string, any>>
  brand?: ShoeSummary['brand'] & { description?: string; officialStoreNote?: string }
}

export type PostCard = {
  _id: string
  title: string
  slug: string
  leadDefinition?: string
  mainImage?: ImageWithMeta
  publishedAt: string
  updatedAt?: string
  category?: CategoryRef
  topics?: TopicRef[]
  articleType?: string
}

export type Post = PostCard & {
  body: PortableTextNode[]
  faq?: FaqItem[]
  shoes?: ShoeSummary[]
  author: AuthorRef
  supervisor?: AuthorRef
  series?: SeriesRef
  leadMagnet?: string
  contentTier?: string
  relatedPosts?: PostCard[]
  seo?: {
    metaDescription?: string
    ogImage?: ImageWithMeta
    canonicalUrl?: string
    noindex?: boolean
  }
}

export type PageDoc = {
  title: string
  slug: string
  labelEn: string
  template: 'doc' | 'about' | 'testPolicy' | 'lp'
  lead?: string
  effectiveNote?: string
  heroImage?: ImageWithMeta
  leadMagnet?: string
  body: PortableTextNode[]
  updatedAt?: string
  seo?: Post['seo']
}

export type SiteSettings = {
  siteName: string
  siteNameEn?: string
  tagline?: string
  description: string
  url: string
  defaultOgImage?: ImageWithMeta
  logo?: ImageWithMeta
  navCtaLabel?: string
  navCtaHref?: string
  footerLinks?: Array<{ label: string; href: string }>
  newsletterEndpoint?: string
  newsletterHeadline?: string
  newsletterSidebarHeadline?: string
  newsletterSidebarBody?: string
  newsletterMicrocopy?: string
  newsletterButtonLabel?: string
  primaryAuthor?: AuthorRef
  testPolicySummary: string
  organizationName?: string
  organizationAddress?: string
  foundingDate?: string
  sameAs?: string[]
  affiliateDisclosure: string
  medicalDisclaimer: string
}

export type Homepage = {
  heroEyebrow?: string
  heroHeadline: string
  heroLead: string
  heroCtaLabel: string
  heroCtaHref: string
  heroImage?: ImageWithMeta
  pickupPosts?: PostCard[]
  startHereTitle?: string
  startHereLabelEn?: string
  startHerePosts?: PostCard[]
}

export type NavData = {
  categories: CategoryRef[]
  topics: TopicRef[]
}
