<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
definePageMeta({ layout: 'default' })

const api = useApi()
const activeTab = ref('overview')

const tabs = [
  { id: 'overview', label: computed(() => t('encyclopedia.overview')) },
  { id: 'nutrition', label: computed(() => t('encyclopedia.nutrition')) },
  { id: 'harvesting', label: computed(() => t('encyclopedia.harvesting')) },
  { id: 'processing', label: computed(() => t('encyclopedia.processing')) },
]

interface ProductDetail {
  id: string
  name: string
  localName: string
  scientificName: string
  emoji: string
  heroColor: string
  overview: string
  nutrition: { label: string; value: string; unit: string; color: string }[]
  harvestMonths: string[]
  processingSteps: string[]
}

const MOCK_PRODUCTS: Record<string, ProductDetail> = {
  baobab: {
    id: 'baobab',
    name: 'Baobab',
    localName: 'Mbuyu',
    scientificName: 'Adansonia digitata',
    emoji: '🌳',
    heroColor: 'from-primary to-primary-700',
    overview: 'The baobab is often called the "tree of life" due to its extraordinary nutritional properties and multiple marketable products. Every part of the tree — fruit, seeds, leaves, bark, and roots — has traditional and commercial uses. Baobab powder is now exported globally as a superfood.',
    nutrition: [
      { label: 'Vitamin C', value: '280', unit: 'mg/100g', color: 'bg-orange-100 text-orange-700' },
      { label: 'Calcium', value: '295', unit: 'mg/100g', color: 'bg-blue-100 text-blue-700' },
      { label: 'Dietary Fiber', value: '44', unit: 'g/100g', color: 'bg-green-100 text-green-700' },
      { label: 'Potassium', value: '1240', unit: 'mg/100g', color: 'bg-purple-100 text-purple-700' },
      { label: 'Antioxidants', value: 'High', unit: 'ORAC', color: 'bg-red-100 text-red-700' },
      { label: 'Protein', value: '2.3', unit: 'g/100g', color: 'bg-yellow-100 text-yellow-700' },
    ],
    harvestMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    processingSteps: [
      'Collect dried pods from the ground or tree (avoid green pods).',
      'Break open the hard shell carefully using a rock or mallet.',
      'Remove the powdery pulp from the seeds and fibre.',
      'Sieve the powder to remove any remaining hard pieces.',
      'Dry in the shade for 2–3 days until moisture < 10%.',
      'Pack in airtight bags or containers labelled with weight and grade.',
      'Store in a cool, dry place away from direct sunlight.',
    ],
  },
  tamarind: {
    id: 'tamarind',
    name: 'Tamarind',
    localName: 'Ukwaju',
    scientificName: 'Tamarindus indica',
    emoji: '🍈',
    heroColor: 'from-secondary-600 to-secondary',
    overview: 'Tamarind is a tropical legume widely used in East African cuisine, food processing, and traditional medicine. The sweet-sour pulp is processed into paste, juice, sweets, and condiments. It is a hardy drought-resistant tree ideal for dryland farming.',
    nutrition: [
      { label: 'Vitamin C', value: '3.5', unit: 'mg/100g', color: 'bg-orange-100 text-orange-700' },
      { label: 'Iron', value: '2.8', unit: 'mg/100g', color: 'bg-red-100 text-red-700' },
      { label: 'Dietary Fiber', value: '5.1', unit: 'g/100g', color: 'bg-green-100 text-green-700' },
      { label: 'Tartaric Acid', value: 'High', unit: '%', color: 'bg-yellow-100 text-yellow-700' },
      { label: 'Sugars', value: '38', unit: 'g/100g', color: 'bg-purple-100 text-purple-700' },
      { label: 'Potassium', value: '628', unit: 'mg/100g', color: 'bg-blue-100 text-blue-700' },
    ],
    harvestMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    processingSteps: [
      'Harvest mature brown pods — avoid green unripe pods.',
      'Shell the pods to expose the sticky pulp-covered seeds.',
      'Soak pulp in warm water for 30 minutes to soften.',
      'Squeeze and strain to separate pulp from seeds and fibre.',
      'Simmer the strained pulp over low heat, stirring frequently.',
      'Allow to cool and pack as concentrate in airtight containers.',
      'Label with batch date, weight, and moisture content.',
    ],
  },
  'wild-cotton': {
    id: 'wild-cotton',
    name: 'Wild Cotton',
    localName: 'Pamba Mwitu',
    scientificName: 'Gossypium herbaceum',
    emoji: '🌿',
    heroColor: 'from-accent to-accent-600',
    overview: 'Wild cotton grows naturally in Kenyan drylands and provides two valuable outputs: seed fibre used in artisan textiles and stuffing, and seed oil used in cosmetics and cooking. Its natural, non-GMO origin commands a premium in artisan and organic markets.',
    nutrition: [
      { label: 'Seed Oil', value: '15–25', unit: '% by weight', color: 'bg-yellow-100 text-yellow-700' },
      { label: 'Protein (seed)', value: '20', unit: 'g/100g', color: 'bg-blue-100 text-blue-700' },
      { label: 'Fiber Length', value: '18–30', unit: 'mm', color: 'bg-green-100 text-green-700' },
      { label: 'Vitamin E', value: 'Moderate', unit: 'tocopherols', color: 'bg-orange-100 text-orange-700' },
    ],
    harvestMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    processingSteps: [
      'Harvest open cotton bolls — collect before rain to avoid mould.',
      'Sun-dry for 2 days to reduce moisture in the seed.',
      'Separate fibre (lint) from seeds using a hand gin or comb.',
      'Clean fibre by removing leaf fragments and dust.',
      'Grade fibre by length and fineness; pack in compressed bales.',
      'For oil: cold-press seeds using a screw press.',
      'Filter oil through muslin cloth; bottle and label.',
    ],
  },
}

const product = ref<ProductDetail | null>(null)
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  const id = route.params.id as string
  try {
    const result = await api.get<ProductDetail>(`/products/${id}`)
    product.value = result
  }
  catch {
    product.value = MOCK_PRODUCTS[id] ?? null
  }
  finally {
    loading.value = false
  }
})

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const PEAK_MONTHS: Record<string, number[]> = {
  baobab: [0, 1, 2, 9, 10, 11],
  tamarind: [0, 1, 2, 10, 11],
  'wild-cotton': [2, 3, 4, 8, 9, 10],
}
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="py-20 flex justify-center">
      <i class="pi pi-spin pi-spinner text-primary text-2xl" />
    </div>

    <!-- Not found -->
    <div v-else-if="!product" class="page-container py-16 text-center">
      <p class="text-gray-500">Product not found.</p>
      <NuxtLink to="/encyclopedia" class="btn-primary mt-4 inline-block">
        {{ t('common.back') }}
      </NuxtLink>
    </div>

    <!-- Product detail -->
    <div v-else>
      <!-- Hero -->
      <div :class="`bg-gradient-to-br ${product.heroColor} text-white p-6 pt-4`">
        <NuxtLink to="/encyclopedia" class="flex items-center gap-1 text-white/70 text-sm mb-4">
          <i class="pi pi-chevron-left text-xs" /> {{ t('common.back') }}
        </NuxtLink>
        <div class="text-5xl mb-3">{{ product.emoji }}</div>
        <h1 class="text-2xl font-bold">{{ product.name }}</h1>
        <p class="text-white/80 text-sm">{{ product.localName }}</p>
        <p class="text-white/60 text-xs italic mt-1">{{ product.scientificName }}</p>
      </div>

      <!-- Tab bar -->
      <div class="bg-white border-b border-gray-100 sticky top-14 z-30">
        <div class="flex overflow-x-auto no-scrollbar">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            :class="activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500'"
            @click="activeTab = tab.id"
          >
            {{ tab.label.value }}
          </button>
        </div>
      </div>

      <!-- Tab content -->
      <div class="page-container py-4">
        <!-- Overview -->
        <div v-if="activeTab === 'overview'" class="space-y-4">
          <p class="text-gray-700 leading-relaxed text-sm">{{ product.overview }}</p>
        </div>

        <!-- Nutrition -->
        <div v-else-if="activeTab === 'nutrition'" class="space-y-3">
          <h2 class="section-title">{{ t('encyclopedia.nutritionalInfo') }}</h2>
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="item in product.nutrition"
              :key="item.label"
              class="card p-4 flex flex-col gap-1"
            >
              <span class="text-xs text-gray-500">{{ item.label }}</span>
              <span class="text-xl font-bold text-gray-900">{{ item.value }}</span>
              <span :class="`badge ${item.color} text-[10px]`">{{ item.unit }}</span>
            </div>
          </div>
        </div>

        <!-- Harvesting calendar -->
        <div v-else-if="activeTab === 'harvesting'" class="space-y-4">
          <h2 class="section-title">{{ t('encyclopedia.harvestingCalendar') }}</h2>
          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="(month, i) in MONTHS"
              :key="month"
              class="rounded-xl p-2 text-center text-xs font-medium"
              :class="PEAK_MONTHS[product.id]?.includes(i)
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-500'"
            >
              {{ month }}
              <div v-if="PEAK_MONTHS[product.id]?.includes(i)" class="text-[9px] mt-0.5 opacity-80">Peak</div>
            </div>
          </div>
          <div class="flex gap-3 text-xs">
            <div class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-primary inline-block" /> Peak harvest</div>
            <div class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-gray-100 inline-block" /> Off-season</div>
          </div>
        </div>

        <!-- Processing -->
        <div v-else-if="activeTab === 'processing'" class="space-y-3">
          <h2 class="section-title">{{ t('encyclopedia.processingMethods') }}</h2>
          <ol class="space-y-3">
            <li
              v-for="(step, i) in product.processingSteps"
              :key="i"
              class="flex gap-3"
            >
              <div
                class="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mt-0.5"
              >
                {{ i + 1 }}
              </div>
              <p class="text-sm text-gray-700 leading-relaxed">{{ step }}</p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
