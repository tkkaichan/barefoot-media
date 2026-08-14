import { groq } from './sanity'
import type {
  Homepage,
  NavData,
  PageDoc,
  Post,
  PostCard,
  ShoeFull,
  ShoeSummary,
  SiteSettings,
} from './types'

/* ------------------------------------------------------------------ */
/* 投影の断片。ここを1箇所にまとめて、クエリ間で形をずらさない          */
/* ------------------------------------------------------------------ */

const IMAGE = `{..., "alt": alt, "caption": caption, "shotAt": shotAt}`

const CATEGORY = `{
  title,
  navTitle,
  "slug": slug.current,
  labelEn,
  description
}`

const TOPIC = `{title, labelShort, "slug": slug.current}`

const AUTHOR = `{
  name,
  "slug": slug.current,
  role,
  jobTitle,
  credentials,
  bio,
  photo${IMAGE},
  sameAs
}`

const POST_CARD = `{
  _id,
  title,
  "slug": slug.current,
  leadDefinition,
  mainImage${IMAGE},
  publishedAt,
  updatedAt,
  articleType,
  category->${CATEGORY},
  topics[]->${TOPIC}
}`

const SHOE_FIELDS = `
  _id,
  name,
  nameJa,
  "slug": slug.current,
  summary,
  category,
  priceJpy,
  priceCheckedAt,
  priceNote,
  imageMain${IMAGE},
  specOfficial,
  specMeasured,
  fieldTest,
  ratings,
  miScore,
  transitionDifficulty,
  recommendedScenes,
  sceneMatrix,
  affiliate,
  isProvided,
  status,
  brand->{name, nameJa, "slug": slug.current, officialUrl},
  reviewArticle->{title, "slug": slug.current}
`

const SHOE_SUMMARY = `{${SHOE_FIELDS}}`

/**
 * 本文中の参照はここで解決する。
 * body の中の shoe 参照（specTable / comparisonTable / buyBlock / testConditionBlock）と
 * リンクアノテーションの内部リンクを、レンダラが同期的に使えるよう展開しておく。
 */
const BODY = `body[]{
  ...,
  _type == "specTable" || _type == "buyBlock" || _type == "testConditionBlock" => {
    ...,
    shoe->${SHOE_SUMMARY}
  },
  _type == "comparisonTable" => {
    ...,
    shoes[]->${SHOE_SUMMARY}
  },
  markDefs[]{
    ...,
    _type == "internalLink" => {
      ...,
      "slug": reference->slug.current,
      "docType": reference->_type
    }
  }
}`

/* ------------------------------------------------------------------ */
/* サイト共通                                                          */
/* ------------------------------------------------------------------ */

export const getSiteSettings = () =>
  groq<SiteSettings>(`*[_type == "siteSettings"][0]{
    ...,
    defaultOgImage${IMAGE},
    logo${IMAGE},
    primaryAuthor->${AUTHOR}
  }`)

export const getNav = () =>
  groq<NavData>(`{
    "categories": *[_type == "category" && showInNav == true] | order(order asc) ${CATEGORY},
    "topics": *[_type == "topic" && showInSidebar == true] | order(order asc) ${TOPIC}
  }`)

/* ------------------------------------------------------------------ */
/* トップ                                                              */
/* ------------------------------------------------------------------ */

export const getHomepage = () =>
  groq<Homepage>(`*[_type == "homepage"][0]{
    ...,
    marqueeImages[]${IMAGE},
    pickupPosts[]->${POST_CARD},
    startHerePosts[]->${POST_CARD}
  }`)

/** homepage.pickupPosts が空のときのフォールバック。 */
export const getFallbackPickup = () =>
  groq<PostCard[]>(
    `*[_type == "post" && isPickup == true && publishedAt <= now()] | order(publishedAt desc)[0...2] ${POST_CARD}`,
  )

export const getSeriesList = () =>
  groq<
    Array<{
      title: string
      slug: string
      number: number
      description?: string
      image?: unknown
    }>
  >(`*[_type == "series" && showOnHome == true] | order(number asc){
    title, "slug": slug.current, number, description, image${IMAGE}
  }`)

/* ------------------------------------------------------------------ */
/* 記事                                                                */
/* ------------------------------------------------------------------ */

export const getPostSlugs = () =>
  groq<string[]>(`*[_type == "post" && defined(slug.current) && publishedAt <= now()].slug.current`)

export const getAllPosts = () =>
  groq<PostCard[]>(
    `*[_type == "post" && publishedAt <= now()] | order(publishedAt desc) ${POST_CARD}`,
  )

export const getPostsByCategory = (categorySlug: string) =>
  groq<PostCard[]>(
    `*[_type == "post" && publishedAt <= now() && category->slug.current == $categorySlug]
      | order(publishedAt desc) ${POST_CARD}`,
    { categorySlug },
  )

export const getPostsByTopic = (topicSlug: string) =>
  groq<PostCard[]>(
    `*[_type == "post" && publishedAt <= now() && $topicSlug in topics[]->slug.current]
      | order(publishedAt desc) ${POST_CARD}`,
    { topicSlug },
  )

export const getPostsBySeries = (seriesSlug: string) =>
  groq<PostCard[]>(
    `*[_type == "post" && publishedAt <= now() && series->slug.current == $seriesSlug]
      | order(publishedAt asc) ${POST_CARD}`,
    { seriesSlug },
  )

export const getPost = (slug: string) =>
  groq<Post | null>(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      leadDefinition,
      mainImage${IMAGE},
      publishedAt,
      updatedAt,
      articleType,
      contentTier,
      leadMagnet,
      category->${CATEGORY},
      topics[]->${TOPIC},
      author->${AUTHOR},
      supervisor->${AUTHOR},
      series->{title, "slug": slug.current, number},
      shoes[]->${SHOE_SUMMARY},
      faq,
      relatedPosts[]->${POST_CARD},
      seo{metaDescription, ogImage${IMAGE}, canonicalUrl, noindex},
      ${BODY}
    }`,
    { slug },
  )

/* ------------------------------------------------------------------ */
/* シューズDB                                                          */
/* ------------------------------------------------------------------ */

export const getShoeSlugs = () =>
  groq<string[]>(
    `*[_type == "shoe" && status == "published" && defined(slug.current)].slug.current`,
  )

export const getAllShoes = () =>
  groq<ShoeSummary[]>(
    `*[_type == "shoe" && status == "published"] | order(brand->name asc, name asc) ${SHOE_SUMMARY}`,
  )

export const getShoe = (slug: string) =>
  groq<ShoeFull | null>(
    `*[_type == "shoe" && slug.current == $slug][0]{
      ${SHOE_FIELDS},
      images[]${IMAGE},
      pros,
      cons,
      missingRequirements,
      brand->{name, nameJa, "slug": slug.current, officialUrl, officialStoreNote, description},
      "relatedPosts": *[_type == "post" && references(^._id) && publishedAt <= now()]
        | order(publishedAt desc) ${POST_CARD}
    }`,
    { slug },
  )

/* ------------------------------------------------------------------ */
/* 固定ページ                                                          */
/* ------------------------------------------------------------------ */

export const getPageSlugs = () =>
  groq<string[]>(`*[_type == "page" && defined(slug.current)].slug.current`)

/** ルーティング振り分け用（root 直下の固定ページと /lp/ 配下を分ける）。 */
export const getPageRefs = () =>
  groq<Array<{ slug: string; template: PageDoc['template'] }>>(
    `*[_type == "page" && defined(slug.current)]{"slug": slug.current, template}`,
  )

export const getPage = (slug: string) =>
  groq<PageDoc | null>(
    `*[_type == "page" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      labelEn,
      template,
      lead,
      effectiveNote,
      leadMagnet,
      updatedAt,
      seo{metaDescription, ogImage${IMAGE}, canonicalUrl, noindex},
      ${BODY}
    }`,
    { slug },
  )

/* ------------------------------------------------------------------ */
/* 一覧系のメタ                                                        */
/* ------------------------------------------------------------------ */

export const getAllCategories = () =>
  groq<NavData['categories']>(
    `*[_type == "category" && defined(slug.current)] | order(order asc) ${CATEGORY}`,
  )

export const getAllTopics = () =>
  groq<NavData['topics']>(
    `*[_type == "topic" && defined(slug.current)] | order(order asc) ${TOPIC}`,
  )

export const getCategorySlugs = () =>
  groq<string[]>(`*[_type == "category" && defined(slug.current)].slug.current`)

export const getCategory = (slug: string) =>
  groq<NavData['categories'][number] | null>(
    `*[_type == "category" && slug.current == $slug][0] ${CATEGORY}`,
    { slug },
  )

export const getTopicSlugs = () =>
  groq<string[]>(`*[_type == "topic" && defined(slug.current)].slug.current`)

export const getTopic = (slug: string) =>
  groq<{ title: string; slug: string; description?: string } | null>(
    `*[_type == "topic" && slug.current == $slug][0]{title, "slug": slug.current, description}`,
    { slug },
  )

export const getSeriesSlugs = () =>
  groq<string[]>(`*[_type == "series" && defined(slug.current)].slug.current`)

export const getSeries = (slug: string) =>
  groq<{
    title: string
    slug: string
    number: number
    description?: string
    heroImage?: unknown
  } | null>(
    `*[_type == "series" && slug.current == $slug][0]{
      title, "slug": slug.current, number, description, heroImage${IMAGE}
    }`,
    { slug },
  )
