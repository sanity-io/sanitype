import {transformerTwoslash} from '@shikijs/twoslash'
import {createTwoslasher} from 'twoslash'
import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Sanitype',
  description: 'Sanitype docs & playground',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: 'Home', link: '/'},
      {text: 'Examples', link: '/examples/basic'},
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          {text: 'Basic example', link: '/examples/basic'},
          {text: 'Portable text', link: '/examples/portable-text'},
          {text: 'Markdown Examples', link: '/markdown-examples'},
          {text: 'Runtime API Examples', link: '/api-examples'},
        ],
      },
    ],

    socialLinks: [{icon: 'github', link: 'https://github.com/vuejs/vitepress'}],
  },
  markdown: {
    theme: 'vitesse-dark',
    codeTransformers: [
      transformerTwoslash({
        twoslasher: createTwoslasher({fsCache: true}),
      }),
    ],
  },
  vite: {
    resolve: {
      alias: {
        '@sanity/sanitype': '../src',
      },
    },
  },
})
