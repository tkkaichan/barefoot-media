import { createClient, type SanityClient } from '@sanity/client'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production'
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || '2024-10-01'
const token = import.meta.env.SANITY_READ_TOKEN || undefined

if (!projectId) {
  throw new Error(
    'PUBLIC_SANITY_PROJECT_ID が未設定です。web/.env.example をコピーして .env を作ってください。',
  )
}

/**
 * ビルド時にだけ使う読み取りクライアント。
 * useCdn: false — ビルドは常に最新を取りに行く（Webhook 起動の再ビルドで古い値を焼き込まない）。
 */
export const sanity: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  perspective: 'published',
})

/** GROQ を実行する薄いラッパー。失敗時にどのクエリで落ちたかを出す。 */
export async function groq<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  try {
    return await sanity.fetch<T>(query, params)
  } catch (error) {
    console.error('[sanity] クエリに失敗しました\n', query, '\nparams:', params)
    throw error
  }
}
