<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
definePageMeta({ layout: 'default' })

const api = useApi()
const { isHarvester, isBuyer, isLoggedIn } = useAuth()

const activeTab = ref('browse')

interface Listing {
  id: string
  productName: string
  productNameSw: string
  quantity: number
  pricePerKg: number
  quality: 'A' | 'B' | 'C'
  county: string
  sellerName: string
  sellerPhone: string
  createdAt: string
}

const priceGuide = [
  { product: 'Baobab Powder', productSw: 'Unga wa Mbuyu', price: 280, unit: 'kg', trend: 'up' },
  { product: 'Baobab Oil', productSw: 'Mafuta ya Mbuyu', price: 1200, unit: '500ml', trend: 'stable' },
  { product: 'Tamarind Paste', productSw: 'Bondo ya Ukwaju', price: 150, unit: 'kg', trend: 'up' },
  { product: 'Wild Cotton Lint', productSw: 'Nyuzi za Pamba', price: 80, unit: 'kg', trend: 'down' },
]

const mockListings: Listing[] = [
  {
    id: '1',
    productName: 'Baobab Powder',
    productNameSw: 'Unga wa Mbuyu',
    quantity: 50,
    pricePerKg: 270,
    quality: 'A',
    county: 'Makueni',
    sellerName: 'Grace Mutua',
    sellerPhone: '+254712345678',
    createdAt: '2026-04-25',
  },
  {
    id: '2',
    productName: 'Tamarind Pods',
    productNameSw: 'Makapi ya Ukwaju',
    quantity: 120,
    pricePerKg: 60,
    quality: 'B',
    county: 'Kitui',
    sellerName: 'James Mwangi',
    sellerPhone: '+254723456789',
    createdAt: '2026-04-24',
  },
  {
    id: '3',
    productName: 'Wild Cotton Lint',
    productNameSw: 'Nyuzi za Pamba',
    quantity: 30,
    pricePerKg: 75,
    quality: 'A',
    county: 'Machakos',
    sellerName: 'Mary Ndeti',
    sellerPhone: '+254734567890',
    createdAt: '2026-04-23',
  },
  {
    id: '4',
    productName: 'Baobab Oil',
    productNameSw: 'Mafuta ya Mbuyu',
    quantity: 10,
    pricePerKg: 1100,
    quality: 'A',
    county: 'Makueni',
    sellerName: 'Peter Nzeke',
    sellerPhone: '+254745678901',
    createdAt: '2026-04-22',
  },
]

const listings = ref<Listing[]>(mockListings)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const result = await api.get<Listing[]>('/marketplace')
    listings.value = result
  }
  catch {
    listings.value = mockListings
  }
  finally {
    loading.value = false
  }
})

function contactSeller(phone: string) {
  if (process.client) {
    window.open(`tel:${phone}`)
  }
}
</script>

<template>
  <div class="page-container py-4 space-y-4">
    <h1 class="section-title">{{ t('marketplace.title') }}</h1>

    <!-- Price Guide Banner -->
    <div class="card p-4 space-y-3">
      <h2 class="font-semibold text-gray-900 text-sm flex items-center gap-2">
        <i class="pi pi-chart-line text-primary" />
        {{ t('marketplace.currentPrices') }}
      </h2>
      <div class="space-y-2">
        <div
          v-for="item in priceGuide"
          :key="item.product"
          class="flex items-center justify-between"
        >
          <span class="text-sm text-gray-700">{{ item.product }}</span>
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-primary">KSh {{ item.price }}/{{ item.unit }}</span>
            <i
              class="text-xs"
              :class="{
                'pi pi-arrow-up text-green-500': item.trend === 'up',
                'pi pi-minus text-gray-400': item.trend === 'stable',
                'pi pi-arrow-down text-red-400': item.trend === 'down',
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200">
      <button
        class="flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors"
        :class="activeTab === 'browse' ? 'border-primary text-primary' : 'border-transparent text-gray-500'"
        @click="activeTab = 'browse'"
      >
        {{ t('marketplace.browseListings') }}
      </button>
      <button
        v-if="isLoggedIn && isHarvester"
        class="flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors"
        :class="activeTab === 'mine' ? 'border-primary text-primary' : 'border-transparent text-gray-500'"
        @click="activeTab = 'mine'"
      >
        {{ t('marketplace.myListings') }}
      </button>
      <button
        v-if="isLoggedIn && isBuyer"
        class="flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors"
        :class="activeTab === 'inquiries' ? 'border-primary text-primary' : 'border-transparent text-gray-500'"
        @click="activeTab = 'inquiries'"
      >
        {{ t('marketplace.inquiries') }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-12 flex justify-center">
      <i class="pi pi-spin pi-spinner text-primary text-2xl" />
    </div>

    <!-- Browse tab -->
    <div v-else-if="activeTab === 'browse'" class="space-y-3">
      <ListingCard
        v-for="listing in listings"
        :key="listing.id"
        :listing="listing"
        @contact="contactSeller(listing.sellerPhone)"
      />
    </div>

    <!-- My listings tab -->
    <div v-else-if="activeTab === 'mine'" class="space-y-3">
      <div v-if="!listings.length" class="py-16 text-center text-gray-500">
        <div class="text-4xl mb-3">📦</div>
        <p>{{ t('marketplace.noListings') }}</p>
      </div>
      <ListingCard
        v-for="listing in listings.slice(0, 2)"
        :key="listing.id"
        :listing="listing"
        show-edit
        @contact="contactSeller(listing.sellerPhone)"
      />
    </div>

    <!-- Inquiries tab -->
    <div v-else-if="activeTab === 'inquiries'" class="py-16 text-center text-gray-500">
      <div class="text-4xl mb-3">💬</div>
      <p>No inquiries yet.</p>
    </div>

    <!-- FAB for harvesters -->
    <Teleport to="body">
      <NuxtLink
        v-if="isHarvester"
        to="/marketplace/new"
        class="fixed bottom-24 right-4 z-30 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center"
        :style="{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))' }"
      >
        <i class="pi pi-plus text-white text-xl" />
      </NuxtLink>
    </Teleport>
  </div>
</template>
