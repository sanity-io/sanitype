# Sanity Studio with typed schemas using compat layer


## Example
```ts
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'

import {toClassicSchema} from '@sanity/sanitype'
import {human} from './schemas/human'

export default defineConfig({
  name: 'default',
  title: 'Sanity Classic (v3) Studio',

  projectId: 'ppsg7ml5',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: toClassicSchema(human),
    //      ^--- this is all you need 
  },
})

```
