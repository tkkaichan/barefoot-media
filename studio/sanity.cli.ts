import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  /** Studio を Sanity のホスティングに deploy するときのサブドメイン */
  studioHost: process.env.SANITY_STUDIO_HOST,
  autoUpdates: true,
})
