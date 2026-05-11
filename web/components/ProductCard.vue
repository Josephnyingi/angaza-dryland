<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  productId: string
  name: string
  localName: string
  emoji: string
  image?: string
  description: string
  color?: string
  textColor?: string
  compact?: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="`/encyclopedia/${productId}`"
    class="card flex gap-4 p-4 active:scale-[0.99] transition-transform"
    :class="{ 'flex-col': compact }"
  >
    <!-- Image / emoji -->
    <div
      class="flex-shrink-0 overflow-hidden rounded-xl"
      :class="compact ? 'w-full h-24' : 'w-16 h-16'"
    >
      <img
        v-if="image"
        :src="image"
        :alt="name"
        class="w-full h-full object-cover"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center"
        :class="[color ?? 'bg-gray-100', compact ? 'text-4xl' : 'text-3xl']"
      >
        {{ emoji }}
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="font-semibold text-gray-900 text-sm">{{ name }}</div>
      <div class="text-xs italic text-gray-500 mb-1">{{ localName }}</div>
      <p class="text-xs text-gray-600 leading-relaxed line-clamp-2">{{ description }}</p>

      <div
        v-if="!compact"
        class="mt-2 text-xs font-medium flex items-center gap-1"
        :class="textColor ?? 'text-primary'"
      >
        {{ t('common.learnMore') }}
        <i class="pi pi-arrow-right text-[10px]" />
      </div>
    </div>
  </NuxtLink>
</template>
