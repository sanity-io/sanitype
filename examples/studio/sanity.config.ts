import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'

import {toV3Schema} from '../../src/compat/toV3Schema'
import {human} from './schemas/human'

export default defineConfig({
  name: 'default',
  title: 'Sanity v3 Studio',

  projectId: 'ppsg7ml5',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: toV3Schema(human),
  },
})
