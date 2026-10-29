export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  css: ['~/assets/landing.css'],
  app: {
    head: {
      title: 'notch-toast-vue — Notifications that morph beautifully',
      meta: [
        {
          name: 'description',
          content: 'A notch-style toast system for Vue 3 and Nuxt with smooth morphing, promise states, and edge-attached or floating placement.',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },
})
