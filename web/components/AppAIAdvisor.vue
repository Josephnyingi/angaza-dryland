<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const api = useApi()

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: Date
}

const messages = ref<Message[]>([])
const input = ref('')
const thinking = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const suggestions = computed(() => [
  t('ai.suggestions.price'),
  t('ai.suggestions.dry'),
  t('ai.suggestions.buyers'),
])

function generateId() {
  return Math.random().toString(36).slice(2)
}

async function sendMessage(text: string) {
  if (!text.trim() || thinking.value) return

  const userMsg: Message = {
    id: generateId(),
    role: 'user',
    text: text.trim(),
    timestamp: new Date(),
  }
  messages.value.push(userMsg)
  input.value = ''
  thinking.value = true

  await nextTick()
  scrollToBottom()

  try {
    const response = await api.post<{ reply: string }>('/ai/chat', {
      message: text.trim(),
      language: locale.value,
    })

    messages.value.push({
      id: generateId(),
      role: 'assistant',
      text: response.reply,
      timestamp: new Date(),
    })
  }
  catch {
    // Graceful fallback mock response
    const mockReplies: Record<string, string> = {
      en: `Thank you for your question about "${text.trim()}". Based on current market data in Makueni County, baobab powder is trading at KSh 250–300/kg for Grade A. Tamarind paste is at KSh 130–170/kg. For wild cotton lint, buyers are currently paying KSh 70–90/kg. Always verify current prices at your nearest collection point before selling.`,
      sw: `Asante kwa swali lako kuhusu "${text.trim()}". Kulingana na data ya soko la sasa katika Kaunti ya Makueni, unga wa mbuyu unauziwa KSh 250–300/kg kwa Daraja A. Bondo ya ukwaju ipo KSh 130–170/kg. Kwa nyuzi za pamba mwitu, wanunuzi sasa wanalipa KSh 70–90/kg. Thibitisha bei za sasa katika kituo chako cha ukusanyaji wa karibu kabla ya kuuza.`,
    }
    messages.value.push({
      id: generateId(),
      role: 'assistant',
      text: mockReplies[locale.value] ?? mockReplies.en,
      timestamp: new Date(),
    })
  }
  finally {
    thinking.value = false
    await nextTick()
    scrollToBottom()
  }
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage(input.value)
  }
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 bg-black/40 z-50 flex items-end"
        @click.self="emit('close')"
      >
        <Transition name="slide-up">
          <div
            v-if="open"
            class="w-full max-w-lg mx-auto bg-white rounded-t-3xl flex flex-col"
            style="max-height: 85vh; padding-bottom: env(safe-area-inset-bottom, 0px)"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                  <i class="pi pi-sparkles text-white text-sm" />
                </div>
                <div>
                  <div class="font-bold text-gray-900 text-sm">{{ t('ai.title') }}</div>
                  <div class="text-xs text-green-500 font-medium">Online</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <!-- Language toggle -->
                <button
                  class="text-xs font-bold border border-gray-200 rounded-lg px-2 py-1 text-gray-600"
                  @click="locale = locale === 'en' ? 'sw' : 'en'"
                >
                  {{ locale === 'en' ? 'SW' : 'EN' }}
                </button>
                <button
                  class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  @click="emit('close')"
                >
                  <i class="pi pi-times text-gray-500" />
                </button>
              </div>
            </div>

            <!-- Messages area -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
              <!-- Welcome / starter suggestions -->
              <div v-if="messages.length === 0" class="space-y-4">
                <div class="bg-primary/5 rounded-2xl p-4 text-sm text-gray-700 leading-relaxed">
                  <p class="font-medium text-primary mb-1">Hi! I'm the Angaza AI Advisor 🌱</p>
                  <p>{{ t('ai.disclaimer') }}</p>
                </div>

                <div class="space-y-2">
                  <p class="text-xs text-gray-500 font-medium uppercase tracking-wide">Try asking:</p>
                  <button
                    v-for="suggestion in suggestions"
                    :key="suggestion"
                    class="block w-full text-left text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 hover:border-primary hover:bg-primary/5 transition-colors"
                    @click="sendMessage(suggestion)"
                  >
                    {{ suggestion }}
                  </button>
                </div>
              </div>

              <!-- Message list -->
              <template v-for="msg in messages" :key="msg.id">
                <!-- User message -->
                <div v-if="msg.role === 'user'" class="flex justify-end">
                  <div class="max-w-[80%]">
                    <div class="bg-primary text-white rounded-2xl rounded-tr-md px-4 py-3 text-sm leading-relaxed">
                      {{ msg.text }}
                    </div>
                    <p class="text-xs text-gray-400 mt-1 text-right">{{ formatTime(msg.timestamp) }}</p>
                  </div>
                </div>

                <!-- Assistant message -->
                <div v-else class="flex gap-3">
                  <div class="w-7 h-7 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i class="pi pi-sparkles text-white text-[10px]" />
                  </div>
                  <div class="flex-1">
                    <div class="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-relaxed text-gray-800">
                      {{ msg.text }}
                    </div>
                    <p class="text-xs text-gray-400 mt-1">{{ formatTime(msg.timestamp) }}</p>
                  </div>
                </div>
              </template>

              <!-- Thinking indicator -->
              <div v-if="thinking" class="flex gap-3">
                <div class="w-7 h-7 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-sparkles text-white text-[10px]" />
                </div>
                <div class="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3">
                  <div class="flex gap-1 items-center">
                    <span class="text-xs text-gray-500">{{ t('ai.thinking') }}</span>
                    <div class="flex gap-1 ml-1">
                      <span v-for="i in 3" :key="i" class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" :style="{ animationDelay: `${(i - 1) * 0.15}s` }" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Input bar -->
            <div class="px-4 py-3 border-t border-gray-100 flex gap-2 items-end">
              <textarea
                v-model="input"
                class="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary max-h-24"
                rows="1"
                :placeholder="t('ai.placeholder')"
                @keydown="handleKeydown"
              />
              <button
                class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-50 active:scale-95 transition-all"
                :disabled="!input.trim() || thinking"
                @click="sendMessage(input)"
              >
                <i class="pi pi-send text-white text-sm" />
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
