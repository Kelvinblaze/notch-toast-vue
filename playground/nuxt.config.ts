// Set NUXT_PUBLIC_SITE_URL (e.g. https://notch-toast-vue.vercel.app) when deploying so canonical,
// og:url and og:image are emitted as absolute URLs, which crawlers require.
const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '')

export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  css: ['~/assets/landing.css'],
  runtimeConfig: { public: { siteUrl } },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap',
        },
      ],
      meta: [
        { name: 'theme-color', content: '#1a1a1a' },
        { name: 'author', content: 'Kelvin Ossai' },
      ],
    },
  },
})
