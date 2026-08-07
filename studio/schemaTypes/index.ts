import type { SchemaTypeDefinition } from 'sanity'

// documents
import { author } from './documents/author'
import { brand } from './documents/brand'
import { category } from './documents/category'
import { homepage } from './documents/homepage'
import { page } from './documents/page'
import { post } from './documents/post'
import { series } from './documents/series'
import { shoe } from './documents/shoe'
import { siteSettings } from './documents/siteSettings'
import { topic } from './documents/topic'

// objects
import {
  affiliate,
  datedImage,
  faqItem,
  fieldTest,
  missingRequirement,
  ratings,
  sceneFit,
  seo,
  specMeasured,
  specOfficial,
} from './objects/specs'

// blocks
import { blockContent } from './blocks/blockContent'
import {
  buyBlock,
  claimEvidenceTable,
  comparisonTable,
  ctaBlock,
  evidenceTable,
  fieldNoteQuote,
  infoTable,
  specTable,
  testConditionBlock,
} from './blocks/customBlocks'

export const schemaTypes: SchemaTypeDefinition[] = [
  // documents
  post,
  shoe,
  brand,
  author,
  category,
  topic,
  series,
  page,
  homepage,
  siteSettings,

  // objects
  specOfficial,
  specMeasured,
  fieldTest,
  ratings,
  affiliate,
  sceneFit,
  missingRequirement,
  datedImage,
  faqItem,
  seo,

  // blocks
  blockContent,
  specTable,
  comparisonTable,
  testConditionBlock,
  claimEvidenceTable,
  evidenceTable,
  fieldNoteQuote,
  infoTable,
  buyBlock,
  ctaBlock,
]
