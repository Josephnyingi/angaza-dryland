<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface MapPoint {
  id: string
  name: string
  type: 'collection' | 'warehouse' | 'buyer'
  lat: number
  lng: number
  address: string
  contact: string
  hours: string
  description: string
}

defineProps<{ point: MapPoint }>()
const emit = defineEmits<{ close: []; directions: [] }>()

const typeLabels: Record<string, string> = {
  collection: 'Collection Point',
  warehouse: 'Warehouse',
  buyer: 'Buyer Zone',
}

const typeColors: Record<string, string> = {
  collection: 'badge-green',
  warehouse: 'badge-amber',
  buyer: 'bg-accent/10 text-accent badge',
}

function callContact(phone: string) {
  if (process.client) {
    window.open(`tel:${phone}`)
  }
}
</script>

<template>
  <div class="bottom-sheet max-w-lg mx-auto">
    <!-- Drag handle -->
    <div class="flex justify-center pt-3 pb-1">
      <div class="w-10 h-1 bg-gray-200 rounded-full" />
    </div>

    <div class="px-5 py-3 space-y-4">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span :class="typeColors[point.type]">{{ typeLabels[point.type] }}</span>
          </div>
          <h3 class="font-bold text-gray-900 text-lg leading-tight">{{ point.name }}</h3>
        </div>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 flex-shrink-0"
          @click="emit('close')"
        >
          <i class="pi pi-times text-gray-500 text-sm" />
        </button>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-600 leading-relaxed">{{ point.description }}</p>

      <!-- Info rows -->
      <div class="space-y-3">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="pi pi-map-marker text-primary text-sm" />
          </div>
          <div>
            <div class="text-xs text-gray-500 font-medium">{{ t('map.address') }}</div>
            <div class="text-sm text-gray-800">{{ point.address }}</div>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="pi pi-clock text-secondary text-sm" />
          </div>
          <div>
            <div class="text-xs text-gray-500 font-medium">{{ t('map.hours') }}</div>
            <div class="text-sm text-gray-800">{{ point.hours }}</div>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="pi pi-phone text-accent text-sm" />
          </div>
          <div>
            <div class="text-xs text-gray-500 font-medium">{{ t('map.contact') }}</div>
            <button
              class="text-sm text-primary font-medium"
              @click="callContact(point.contact)"
            >
              {{ point.contact }}
            </button>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="grid grid-cols-2 gap-3 pb-2">
        <button
          class="btn-outline text-sm py-2.5 flex items-center justify-center gap-2"
          @click="callContact(point.contact)"
        >
          <i class="pi pi-phone" />
          Call
        </button>
        <button
          class="btn-primary text-sm py-2.5 flex items-center justify-center gap-2"
          @click="emit('directions')"
        >
          <i class="pi pi-directions" />
          {{ t('map.getDirections') }}
        </button>
      </div>
    </div>
  </div>
</template>
