<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'

const { locale, t } = useI18n()
const route = useRoute()
const showAIAdvisor = ref(false)

function toggleLocale() {
  locale.value = locale.value === 'en' ? 'sw' : 'en'
}

const navItems = computed(() => [
  { to: '/', label: t('nav.home'), icon: 'pi pi-home', exact: true },
  { to: '/encyclopedia', label: t('nav.encyclopedia'), icon: 'pi pi-book' },
  { to: '/training', label: t('nav.training'), icon: 'pi pi-play-circle' },
  { to: '/marketplace', label: t('nav.marketplace'), icon: 'pi pi-shopping-cart' },
  { to: '/map', label: t('nav.map'), icon: 'pi pi-map-marker' },
])

function isActive(item: { to: string; exact?: boolean }) {
  if (item.exact) return route.path === item.to
  return route.path.startsWith(item.to)
}
</script>

<template>
  <div class="min-h-screen bg-neutral-100 flex flex-col">
    <!-- Top Header -->
    <header class="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-sm"
      :style="{ paddingTop: 'env(safe-area-inset-top, 0px)' }">
      <div class="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">A</span>
          </div>
          <span class="font-bold text-primary text-lg leading-tight">Angaza</span>
        </NuxtLink>

        <!-- Right actions -->
        <div class="flex items-center gap-3">
          <!-- Language toggle -->
          <button
            class="text-xs font-bold border border-gray-200 rounded-lg px-2 py-1 text-gray-600 hover:border-primary hover:text-primary transition-colors"
            @click="toggleLocale"
          >
            {{ locale === 'en' ? 'SW' : 'EN' }}
          </button>

          <!-- AI Advisor button -->
          <button
            class="flex items-center gap-1.5 bg-primary/10 text-primary rounded-lg px-3 py-1.5 text-sm font-medium"
            @click="showAIAdvisor = true"
          >
            <i class="pi pi-sparkles text-xs" />
            <span class="hidden xs:inline">{{ t('nav.aiAdvisor') }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 mt-14 pb-nav overflow-auto">
      <slot />
    </main>

    <!-- Bottom Navigation Bar -->
    <nav
      class="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg"
      :style="{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }"
    >
      <div class="max-w-lg mx-auto flex items-stretch">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors"
          :class="isActive(item)
            ? 'text-primary'
            : 'text-gray-400 hover:text-gray-600'"
        >
          <i :class="[item.icon, 'text-lg']" />
          <span class="text-[10px] font-medium leading-tight">{{ item.label }}</span>
          <!-- Active indicator -->
          <span
            v-if="isActive(item)"
            class="absolute bottom-0 w-8 h-0.5 bg-primary rounded-full"
          />
        </NuxtLink>
      </div>
    </nav>

    <!-- AI Advisor Drawer -->
    <AppAIAdvisor :open="showAIAdvisor" @close="showAIAdvisor = false" />
  </div>
</template>
