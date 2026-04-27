export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      title: 'Angaza Dryland – Empowering Kenyan Harvesters',
      meta: [
        { name: 'description', content: 'Mobile platform for rural Kenyan harvesters of baobab, tamarind, and wild cotton. Training, marketplace, and AI advisory in English and Swahili.' },
        { name: 'theme-color', content: '#2D6A4F' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Angaza' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
      ],
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
  ],

  css: [
    'primeicons/primeicons.css',
    '~/assets/css/main.css',
  ],

  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: 'Aura',
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities',
          },
        },
      },
    },
    autoImport: true,
  },

  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'sw', name: 'Kiswahili', file: 'sw.json' },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    langDir: 'locales/',
    bundle: { optimizeTranslationDirective: false },
    lazy: false,
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3003',
    },
  },

  build: {
    transpile: ['primevue'],
  },

  vite: {
    optimizeDeps: {
      include: ['axios', 'vee-validate', '@vee-validate/rules', 'yup'],
    },
  },

  compatibilityDate: '2024-11-01',
})
