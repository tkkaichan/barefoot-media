import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { schemaTypes } from './schemaTypes'
import { singletonTypes, structure } from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:4321'

if (!projectId) {
  throw new Error(
    'SANITY_STUDIO_PROJECT_ID が未設定です。studio/.env.example をコピーして .env.local を作ってください。',
  )
}

export default defineConfig({
  name: 'barefoot-media',
  title: 'はだしノート（仮称）',
  projectId,
  dataset,

  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: '2024-10-01' })],

  schema: {
    types: schemaTypes,
    // シングルトンは「新規作成」から隠す
    templates: (prev) => prev.filter((t) => !singletonTypes.has(t.schemaType)),
  },

  document: {
    // シングルトンは複製・削除させない
    actions: (prev, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? prev.filter(({ action }) => action && !['duplicate', 'delete', 'unpublish'].includes(action))
        : prev,

    productionUrl: async (prev, { document }) => {
      const doc = document as { _type?: string; slug?: { current?: string } }
      const slug = doc.slug?.current
      if (!slug) return prev
      const path =
        doc._type === 'post'
          ? `/articles/${slug}/`
          : doc._type === 'shoe'
            ? `/shoes/${slug}/`
            : doc._type === 'page'
              ? `/${slug}/`
              : null
      return path ? `${previewUrl}${path}` : prev
    },
  },
})
