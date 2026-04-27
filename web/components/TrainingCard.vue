<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

interface TrainingModule {
  id: string
  title: string
  titleSw: string
  duration: number
  thumbnail: string
  topics: string[]
  completed: boolean
}

const props = defineProps<{
  module: TrainingModule
}>()

const displayTitle = computed(() =>
  locale.value === 'sw' ? props.module.titleSw : props.module.title,
)
</script>

<template>
  <NuxtLink
    :to="`/training/${module.id}`"
    class="card flex gap-4 p-4 active:scale-[0.99] transition-transform"
    :class="module.completed ? 'border-l-4 border-l-primary' : ''"
  >
    <!-- Thumbnail -->
    <div
      class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
      :class="module.completed ? 'bg-primary/10' : 'bg-gray-100'"
    >
      {{ module.thumbnail }}
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-2">
        <div class="font-semibold text-gray-900 text-sm leading-snug">{{ displayTitle }}</div>
        <div v-if="module.completed" class="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <i class="pi pi-check text-white text-[10px]" />
        </div>
      </div>

      <div class="flex items-center gap-3 mt-1.5">
        <span class="text-xs text-gray-500 flex items-center gap-1">
          <i class="pi pi-clock text-[10px]" />
          {{ module.duration }} {{ t('training.minutesShort') }}
        </span>
        <span v-if="module.completed" class="badge badge-green text-[10px]">
          {{ t('training.completed') }}
        </span>
        <span v-else class="text-xs text-secondary-600 font-medium">
          {{ t('training.startModule') }} →
        </span>
      </div>

      <div class="flex gap-1 mt-2 flex-wrap">
        <span
          v-for="topic in module.topics.slice(0, 2)"
          :key="topic"
          class="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
        >
          {{ topic }}
        </span>
        <span v-if="module.topics.length > 2" class="text-[10px] text-gray-400">
          +{{ module.topics.length - 2 }} more
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
