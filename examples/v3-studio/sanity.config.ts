import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {nextToV3Schema} from '../../src/compat/next-to-v3'
import {human} from './schemas/human'

export default defineConfig({
  name: 'default',
  title: 'Sanity v3 Studio',

  projectId: 'ppsg7ml5',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: nextToV3Schema(human),
  },
})
