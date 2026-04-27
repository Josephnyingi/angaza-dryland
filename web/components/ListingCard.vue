<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Listing {
  id: string
  productName: string
  productNameSw?: string
  quantity: number
  pricePerKg: number
  quality: 'A' | 'B' | 'C'
  county: string
  sellerName: string
  sellerPhone: string
  createdAt: string
}

const props = defineProps<{
  listing: Listing
  showEdit?: boolean
}>()

const emit = defineEmits<{ contact: [] }>()

const qualityColors: Record<string, string> = {
  A: 'badge-green',
  B: 'badge-amber',
  C: 'bg-gray-100 text-gray-500 badge',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="card p-4 space-y-3">
    <div class="flex items-start justify-between">
      <div>
        <div class="font-semibold text-gray-900 text-sm">{{ listing.productName }}</div>
        <div v-if="listing.productNameSw" class="text-xs text-gray-500 italic">{{ listing.productNameSw }}</div>
      </div>
      <span :class="qualityColors[listing.quality]">Grade {{ listing.quality }}</span>
    </div>

    <div class="flex items-center gap-4 text-sm">
      <div>
        <span class="text-gray-500 text-xs">Quantity</span>
        <div class="font-semibold text-gray-900">{{ listing.quantity }} kg</div>
      </div>
      <div>
        <span class="text-gray-500 text-xs">{{ t('marketplace.pricePerKg') }}</span>
        <div class="font-bold text-primary">KSh {{ listing.pricePerKg }}</div>
      </div>
      <div class="ml-auto text-right">
        <div class="flex items-center gap-1 text-xs text-gray-500">
          <i class="pi pi-map-marker text-[10px]" />
          {{ listing.county }}
        </div>
        <div class="text-xs text-gray-400 mt-0.5">{{ formatDate(listing.createdAt) }}</div>
      </div>
    </div>

    <div class="flex items-center justify-between pt-1 border-t border-gray-50">
      <div class="text-xs text-gray-600">
        <i class="pi pi-user text-gray-400 mr-1" />
        {{ listing.sellerName }}
      </div>
      <div class="flex gap-2">
        <button
          v-if="showEdit"
          class="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 font-medium"
        >
          Edit
        </button>
        <button
          class="btn-primary text-xs py-1.5 px-4"
          @click="emit('contact')"
        >
          <i class="pi pi-phone mr-1" />
          {{ t('marketplace.contactSeller') }}
        </button>
      </div>
    </div>
  </div>
</template>
