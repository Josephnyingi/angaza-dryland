<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

definePageMeta({ layout: 'default' })

const stats = [
  { value: '2,400+', labelKey: 'home.stats.harvesters' },
  { value: '8,700+', labelKey: 'home.stats.trainings' },
  { value: '340+', labelKey: 'home.stats.listings' },
]

const products = [
  {
    id: 'baobab',
    name: 'Baobab',
    localName: 'Mbuyu',
    emoji: '🌳',
    color: 'bg-primary/10',
    textColor: 'text-primary',
    description: 'Rich in Vitamin C and calcium. Powder, oil, and seeds are all marketable.',
  },
  {
    id: 'tamarind',
    name: 'Tamarind',
    localName: 'Ukwaju',
    emoji: '🍈',
    color: 'bg-secondary/20',
    textColor: 'text-secondary-600',
    description: 'Sweet-sour pods used in cooking, juice, and traditional medicine.',
  },
  {
    id: 'wild-cotton',
    name: 'Wild Cotton',
    localName: 'Pamba Mwitu',
    emoji: '🌿',
    color: 'bg-accent/10',
    textColor: 'text-accent',
    description: 'Natural fibre and seed oil with growing demand in artisan markets.',
  },
]
</script>

<template>
  <div class="page-container py-4 space-y-6">
    <!-- Hero -->
    <section class="rounded-2xl bg-gradient-to-br from-primary to-primary-700 text-white p-6 shadow-md">
      <div class="text-4xl mb-3">🌍</div>
      <h1 class="text-2xl font-bold leading-tight mb-2">
        {{ t('home.heroTitle') }}
      </h1>
      <p class="text-white/80 text-sm leading-relaxed">
        {{ t('home.heroSubtitle') }}
      </p>
      <!-- Quick actions -->
      <div class="mt-5 flex flex-wrap gap-2">
        <NuxtLink to="/training" class="btn-secondary text-sm py-2 px-4">
          {{ t('home.trainNow') }}
        </NuxtLink>
        <NuxtLink
          to="/marketplace"
          class="border border-white/50 text-white text-sm py-2 px-4 rounded-xl font-semibold active:scale-95 transition-all"
        >
          {{ t('home.viewMarketplace') }}
        </NuxtLink>
      </div>
    </section>

    <!-- Stats bar -->
    <section class="grid grid-cols-3 gap-3">
      <div
        v-for="stat in stats"
        :key="stat.labelKey"
        class="card p-3 text-center"
      >
        <div class="text-xl font-bold text-primary">{{ stat.value }}</div>
        <div class="text-[10px] text-gray-500 leading-tight mt-0.5">{{ t(stat.labelKey) }}</div>
      </div>
    </section>

    <!-- Featured Products -->
    <section>
      <div class="flex items-center justify-between mb-3">
        <h2 class="section-title">{{ t('home.featuredProducts') }}</h2>
        <NuxtLink to="/encyclopedia" class="text-sm text-primary font-medium">
          {{ t('common.viewAll') }}
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 gap-3">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product-id="product.id"
          :name="product.name"
          :local-name="product.localName"
          :emoji="product.emoji"
          :color="product.color"
          :text-color="product.textColor"
          :description="product.description"
        />
      </div>
    </section>

    <!-- Find Collection Point CTA -->
    <section>
      <NuxtLink
        to="/map"
        class="card flex items-center gap-4 p-4 border-l-4 border-secondary"
      >
        <div class="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <i class="pi pi-map-marker text-secondary text-xl" />
        </div>
        <div>
          <div class="font-semibold text-gray-900 text-sm">{{ t('home.findCollection') }}</div>
          <div class="text-xs text-gray-500 mt-0.5">Makueni, Kitui, Machakos & more</div>
        </div>
        <i class="pi pi-chevron-right text-gray-400 ml-auto" />
      </NuxtLink>
    </section>

    <!-- AI Advisor CTA -->
    <section>
      <div class="card p-4 bg-gradient-to-r from-primary/5 to-secondary/10 border border-primary/20">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <i class="pi pi-sparkles text-white" />
          </div>
          <div class="flex-1">
            <div class="font-semibold text-gray-900 text-sm">{{ t('home.aiCta.title') }}</div>
            <div class="text-xs text-gray-500 mt-0.5">{{ t('home.aiCta.subtitle') }}</div>
          </div>
        </div>
        <NuxtLink
          to="/training"
          class="mt-3 block text-center text-sm font-medium text-primary py-2 border border-primary/30 rounded-xl"
        >
          {{ t('common.learnMore') }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
