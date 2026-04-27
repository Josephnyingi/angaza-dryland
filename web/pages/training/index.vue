<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
definePageMeta({ layout: 'default' })

const api = useApi()

interface TrainingModule {
  id: string
  title: string
  titleSw: string
  duration: number
  thumbnail: string
  topics: string[]
  completed: boolean
}

const mockModules: TrainingModule[] = [
  {
    id: 'baobab-harvesting',
    title: 'Sustainable Baobab Harvesting',
    titleSw: 'Uvunaji Endelevu wa Mbuyu',
    duration: 18,
    thumbnail: '🌳',
    topics: ['Harvest timing', 'Tree health', 'Pod selection'],
    completed: true,
  },
  {
    id: 'baobab-processing',
    title: 'Baobab Powder Processing',
    titleSw: 'Usindikaji wa Unga wa Mbuyu',
    duration: 22,
    thumbnail: '⚗️',
    topics: ['Drying methods', 'Sieving', 'Packaging & storage'],
    completed: true,
  },
  {
    id: 'tamarind-value',
    title: 'Tamarind Value Addition',
    titleSw: 'Kuongeza Thamani ya Ukwaju',
    duration: 15,
    thumbnail: '🍈',
    topics: ['Paste production', 'Juice processing', 'Labelling'],
    completed: false,
  },
  {
    id: 'quality-grading',
    title: 'Quality Grading & Standards',
    titleSw: 'Upimaji na Viwango vya Ubora',
    duration: 20,
    thumbnail: '✅',
    topics: ['Grade A/B/C', 'Moisture testing', 'Buyer requirements'],
    completed: false,
  },
  {
    id: 'marketplace-skills',
    title: 'Marketplace & Negotiation',
    titleSw: 'Soko na Mazungumzo ya Biashara',
    duration: 25,
    thumbnail: '🤝',
    topics: ['Finding buyers', 'Price negotiation', 'Contracts'],
    completed: false,
  },
  {
    id: 'wild-cotton-basics',
    title: 'Wild Cotton Basics',
    titleSw: 'Misingi ya Pamba Mwitu',
    duration: 12,
    thumbnail: '🌿',
    topics: ['Identification', 'Harvesting season', 'Lint quality'],
    completed: false,
  },
]

const modules = ref<TrainingModule[]>(mockModules)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const result = await api.get<TrainingModule[]>('/training')
    modules.value = result
  }
  catch {
    modules.value = mockModules
  }
  finally {
    loading.value = false
  }
})

const completed = computed(() => modules.value.filter(m => m.completed).length)
const total = computed(() => modules.value.length)
const progressPct = computed(() => Math.round((completed.value / total.value) * 100))
</script>

<template>
  <div class="page-container py-4 space-y-5">
    <h1 class="section-title">{{ t('training.title') }}</h1>

    <!-- Progress bar -->
    <div class="card p-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700">{{ t('training.progress') }}</span>
        <span class="text-sm font-bold text-primary">{{ completed }} / {{ total }} {{ t('training.modulesCompleted') }}</span>
      </div>
      <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          class="h-full bg-primary rounded-full transition-all duration-500"
          :style="{ width: `${progressPct}%` }"
        />
      </div>
      <p class="text-xs text-gray-500 mt-1.5">{{ progressPct }}% complete</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-12 flex justify-center">
      <i class="pi pi-spin pi-spinner text-primary text-2xl" />
    </div>

    <!-- Module list -->
    <div v-else class="space-y-3">
      <TrainingCard
        v-for="module in modules"
        :key="module.id"
        :module="module"
      />
    </div>
  </div>
</template>
