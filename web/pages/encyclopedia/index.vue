<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
definePageMeta({ layout: 'default' })

const api = useApi()
const search = ref('')
const activeFilter = ref('all')

const filters = [
  { id: 'all', label: computed(() => t('encyclopedia.all')) },
  { id: 'baobab', label: computed(() => 'Baobab') },
  { id: 'tamarind', label: computed(() => 'Tamarind') },
  { id: 'wild-cotton', label: computed(() => 'Wild Cotton') },
]

interface Product {
  id: string
  name: string
  localName: string
  category: string
  emoji: string
  description: string
  color: string
  textColor: string
}

const mockProducts: Product[] = [
  {
    id: 'baobab',
    name: 'Baobab',
    localName: 'Mbuyu',
    category: 'baobab',
    emoji: '🌳',
    color: 'bg-primary/10',
    textColor: 'text-primary',
    description: 'The "tree of life" — powder, oil, leaves, and bark all have market value.',
  },
  {
    id: 'baobab-oil',
    name: 'Baobab Oil',
    localName: 'Mafuta ya Mbuyu',
    category: 'baobab',
    emoji: '💧',
    color: 'bg-primary/10',
    textColor: 'text-primary',
    description: 'Cold-pressed from seeds. Used in cosmetics and cooking.',
  },
  {
    id: 'tamarind',
    name: 'Tamarind',
    localName: 'Ukwaju',
    category: 'tamarind',
    emoji: '🍈',
    color: 'bg-secondary/20',
    textColor: 'text-secondary-600',
    description: 'Sweet-sour pods prized in food processing and traditional medicine.',
  },
  {
    id: 'tamarind-paste',
    name: 'Tamarind Paste',
    localName: 'Bondo ya Ukwaju',
    category: 'tamarind',
    emoji: '🫙',
    color: 'bg-secondary/20',
    textColor: 'text-secondary-600',
    description: 'Processed concentrate with 3× the value of raw pods.',
  },
  {
    id: 'wild-cotton',
    name: 'Wild Cotton',
    localName: 'Pamba Mwitu',
    category: 'wild-cotton',
    emoji: '🌿',
    color: 'bg-accent/10',
    textColor: 'text-accent',
    description: 'Seed fibre and oil used in artisan textiles and cosmetics.',
  },
  {
    id: 'wild-cotton-seed-oil',
    name: 'Wild Cotton Seed Oil',
    localName: 'Mafuta ya Mbegu za Pamba',
    category: 'wild-cotton',
    emoji: '🌻',
    color: 'bg-accent/10',
    textColor: 'text-accent',
    description: 'High-value seed oil with niche export potential.',
  },
]

const products = ref<Product[]>(mockProducts)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const result = await api.get<Product[]>('/products')
    products.value = result
  }
  catch {
    // Fall back to mock data
    products.value = mockProducts
  }
  finally {
    loading.value = false
  }
})

const filtered = computed(() => {
  let list = products.value
  if (activeFilter.value !== 'all') {
    list = list.filter(p => p.category === activeFilter.value)
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.localName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }
  return list
})
</script>

<template>
  <div class="page-container py-4 space-y-4">
    <h1 class="section-title">{{ t('encyclopedia.title') }}</h1>

    <!-- Search -->
    <div class="relative">
      <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        v-model="search"
        type="search"
        class="input-field pl-9"
        :placeholder="t('encyclopedia.searchPlaceholder')"
      />
    </div>

    <!-- Filter tabs -->
    <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      <button
        v-for="f in filters"
        :key="f.id"
        class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors"
        :class="activeFilter === f.id
          ? 'bg-primary text-white'
          : 'bg-white border border-gray-200 text-gray-600'"
        @click="activeFilter = f.id"
      >
        {{ f.label.value }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-12 flex justify-center">
      <i class="pi pi-spin pi-spinner text-primary text-2xl" />
    </div>

    <!-- Product grid -->
    <div v-else-if="filtered.length" class="grid grid-cols-2 gap-3">
      <ProductCard
        v-for="product in filtered"
        :key="product.id"
        :product-id="product.id"
        :name="product.name"
        :local-name="product.localName"
        :emoji="product.emoji"
        :color="product.color"
        :text-color="product.textColor"
        :description="product.description"
        compact
      />
    </div>

    <!-- Empty state -->
    <div v-else class="py-16 text-center text-gray-500">
      <div class="text-4xl mb-3">🔍</div>
      <p>{{ t('encyclopedia.noResults') }}</p>
    </div>
  </div>
</template>
