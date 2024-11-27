import {defineConfig} from 'vitepress'
import {transformerTwoslash} from '@shikijs/vitepress-twoslash'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Sanitype',
  description: 'Sanitype docs & playground',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: 'Home', link: '/'},
      {text: 'Examples', link: '/examples'},
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          {text: 'Portable text Examples', link: '/examples'},
          {text: 'Markdown Examples', link: '/markdown-examples'},
          {text: 'Runtime API Examples', link: '/api-examples'},
        ],
      },
    ],

    socialLinks: [{icon: 'github', link: 'https://github.com/vuejs/vitepress'}],
  },
  markdown: {
    codeTransformers: [transformerTwoslash()],
  },
})
