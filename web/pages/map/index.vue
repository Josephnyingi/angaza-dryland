<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
definePageMeta({ layout: 'default' })

type MarkerType = 'collection' | 'warehouse' | 'buyer'

interface MapPoint {
  id: string
  name: string
  type: MarkerType
  lat: number
  lng: number
  address: string
  contact: string
  hours: string
  description: string
}

const mapPoints: MapPoint[] = [
  {
    id: 'ngwata',
    name: 'Ngwata Collection Centre',
    type: 'collection',
    lat: -2.06,
    lng: 37.95,
    address: 'Ngwata Market, Kibwezi West, Makueni',
    contact: '+254712300001',
    hours: 'Mon–Sat 7am–5pm',
    description: 'Primary collection point for baobab and tamarind in western Makueni.',
  },
  {
    id: 'kibwezi',
    name: 'Kibwezi Aggregation Hub',
    type: 'warehouse',
    lat: -2.42,
    lng: 37.98,
    address: 'Kibwezi Town, Makueni County',
    contact: '+254712300002',
    hours: 'Mon–Fri 8am–6pm',
    description: 'Main warehouse with cold storage and drying facilities.',
  },
  {
    id: 'makindu',
    name: 'Makindu Buyer Zone',
    type: 'buyer',
    lat: -2.28,
    lng: 37.83,
    address: 'Makindu Trading Centre, Makueni',
    contact: '+254712300003',
    hours: 'Tue & Thu 9am–3pm',
    description: 'Designated buyer meeting zone. Bring samples for price negotiation.',
  },
  {
    id: 'wote',
    name: 'Wote Cooperative Store',
    type: 'collection',
    lat: -1.78,
    lng: 37.64,
    address: 'Wote Town, Makueni County',
    contact: '+254712300004',
    hours: 'Mon–Sat 7am–5pm',
    description: 'County HQ collection point serving northern Makueni harvesters.',
  },
  {
    id: 'kitui-hub',
    name: 'Kitui County Hub',
    type: 'warehouse',
    lat: -1.37,
    lng: 38.01,
    address: 'Kitui Town Centre, Kitui County',
    contact: '+254712300005',
    hours: 'Mon–Fri 8am–5pm',
    description: 'Regional warehouse serving Kitui, Mwingi, and Mutomo harvesters.',
  },
]

const activeFilter = ref<'all' | MarkerType>('all')
const selectedPoint = ref<MapPoint | null>(null)

const filters = [
  { id: 'all', label: computed(() => t('map.all')) },
  { id: 'collection', label: computed(() => t('map.collectionPoints')) },
  { id: 'warehouse', label: computed(() => t('map.warehouses')) },
  { id: 'buyer', label: computed(() => t('map.buyerZones')) },
]

const filteredPoints = computed(() => {
  if (activeFilter.value === 'all') return mapPoints
  return mapPoints.filter(p => p.type === activeFilter.value)
})

const markerColors: Record<MarkerType, string> = {
  collection: '#2D6A4F',
  warehouse: '#F4A261',
  buyer: '#E76F51',
}

function openDirections(point: MapPoint) {
  if (process.client) {
    window.open(`https://maps.google.com?q=${point.lat},${point.lng}`, '_blank')
  }
}

// Leaflet map setup
const mapContainer = ref<HTMLElement | null>(null)
let leafletMap: any = null

async function initMap() {
  if (!process.client || !mapContainer.value) return

  const L = (await import('leaflet')).default
  await import('leaflet/dist/leaflet.css')

  // Fix default icon paths
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  leafletMap = L.map(mapContainer.value, {
    center: [-2.2, 37.9],
    zoom: 9,
    zoomControl: true,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(leafletMap)

  function placeMarkers(points: MapPoint[]) {
    points.forEach((point) => {
      const color = markerColors[point.type]
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:32px;height:32px;background:${color};border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      })

      const marker = L.marker([point.lat, point.lng], { icon })
        .addTo(leafletMap)
        .on('click', () => {
          selectedPoint.value = point
        })
    })
  }

  placeMarkers(mapPoints)
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (leafletMap) {
    leafletMap.remove()
    leafletMap = null
  }
})
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-3.5rem-4rem)]">
    <!-- Filter bar -->
    <div class="bg-white px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-100 flex-shrink-0">
      <button
        v-for="f in filters"
        :key="f.id"
        class="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
        :class="activeFilter === f.id
          ? 'bg-primary text-white'
          : 'bg-gray-100 text-gray-600'"
        @click="activeFilter = f.id as any"
      >
        {{ f.label.value }}
      </button>
    </div>

    <!-- Map -->
    <ClientOnly>
      <div ref="mapContainer" class="flex-1 w-full" style="min-height:0" />
      <template #fallback>
        <div class="flex-1 bg-gray-100 flex items-center justify-center">
          <div class="text-center text-gray-500">
            <i class="pi pi-map-marker text-3xl mb-2 block" />
            <p class="text-sm">Loading map…</p>
          </div>
        </div>
      </template>
    </ClientOnly>

    <!-- Legend -->
    <div class="bg-white px-4 py-2 flex gap-3 text-xs border-t border-gray-100 flex-shrink-0">
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 rounded-full bg-primary inline-block" /> Collection
      </div>
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 rounded-full bg-secondary inline-block" /> Warehouse
      </div>
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 rounded-full bg-accent inline-block" /> Buyer Zone
      </div>
    </div>

    <!-- Bottom sheet for selected point -->
    <Teleport to="body">
      <Transition name="slide-up">
        <CollectionPointSheet
          v-if="selectedPoint"
          :point="selectedPoint"
          @close="selectedPoint = null"
          @directions="openDirections(selectedPoint!)"
        />
      </Transition>
    </Teleport>
  </div>
</template>
