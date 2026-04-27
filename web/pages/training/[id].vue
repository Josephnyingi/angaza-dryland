<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
definePageMeta({ layout: 'default' })

const api = useApi()

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
}

interface TrainingModule {
  id: string
  title: string
  titleSw: string
  duration: number
  thumbnail: string
  description: string
  topics: string[]
  completed: boolean
  quiz: QuizQuestion[]
}

const MOCK_MODULES: Record<string, TrainingModule> = {
  'baobab-harvesting': {
    id: 'baobab-harvesting',
    title: 'Sustainable Baobab Harvesting',
    titleSw: 'Uvunaji Endelevu wa Mbuyu',
    duration: 18,
    thumbnail: '🌳',
    description: 'Learn the best practices for harvesting baobab pods sustainably to protect tree health and maximize quality of yield for the best market price.',
    topics: ['Identifying ripe pods', 'Safe collection techniques', 'Tree health monitoring', 'Storage immediately after harvest'],
    completed: false,
    quiz: [
      {
        id: 'q1',
        question: 'When is the best time to harvest baobab pods?',
        options: ['When pods are green', 'When pods are brown and the shell is hard', 'After heavy rain', 'Any time of year'],
        correctIndex: 1,
      },
      {
        id: 'q2',
        question: 'How should you store freshly harvested baobab pods?',
        options: ['In a wet sack', 'In a cool, dry, ventilated place', 'Buried underground', 'In direct sunlight'],
        correctIndex: 1,
      },
      {
        id: 'q3',
        question: 'Which part of the baobab has the highest Vitamin C content?',
        options: ['Bark', 'Leaves', 'Fruit pulp powder', 'Roots'],
        correctIndex: 2,
      },
    ],
  },
  'quality-grading': {
    id: 'quality-grading',
    title: 'Quality Grading & Standards',
    titleSw: 'Upimaji na Viwango vya Ubora',
    duration: 20,
    thumbnail: '✅',
    description: 'Understand the grading system for dryland products and how to meet buyer quality requirements to achieve premium prices.',
    topics: ['Grade A, B, C criteria', 'Moisture testing methods', 'Foreign matter limits', 'Buyer documentation'],
    completed: false,
    quiz: [
      {
        id: 'q1',
        question: 'What moisture level is required for Grade A baobab powder?',
        options: ['< 5%', '< 10%', '< 15%', '< 20%'],
        correctIndex: 1,
      },
      {
        id: 'q2',
        question: 'Which grade commands the highest market price?',
        options: ['Grade C', 'Grade B', 'Grade A', 'They are all the same price'],
        correctIndex: 2,
      },
    ],
  },
}

const module = ref<TrainingModule | null>(null)
const loading = ref(true)
const videoPlaying = ref(false)
const quizStarted = ref(false)
const answers = ref<Record<string, number>>({})
const quizSubmitted = ref(false)
const badgeVisible = ref(false)

onMounted(async () => {
  loading.value = true
  const id = route.params.id as string
  try {
    const result = await api.get<TrainingModule>(`/training/${id}`)
    module.value = result
  }
  catch {
    module.value = MOCK_MODULES[id] ?? null
  }
  finally {
    loading.value = false
  }
})

function selectAnswer(questionId: string, index: number) {
  if (quizSubmitted.value) return
  answers.value[questionId] = index
}

function submitQuiz() {
  if (!module.value) return
  quizSubmitted.value = true
  const allCorrect = module.value.quiz.every(
    q => answers.value[q.id] === q.correctIndex,
  )
  if (allCorrect) {
    badgeVisible.value = true
  }
}

const allAnswered = computed(() => {
  if (!module.value) return false
  return module.value.quiz.every(q => answers.value[q.id] !== undefined)
})

const score = computed(() => {
  if (!module.value) return 0
  return module.value.quiz.filter(q => answers.value[q.id] === q.correctIndex).length
})
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="py-20 flex justify-center">
      <i class="pi pi-spin pi-spinner text-primary text-2xl" />
    </div>

    <div v-else-if="!module" class="page-container py-16 text-center">
      <p class="text-gray-500">Module not found.</p>
      <NuxtLink to="/training" class="btn-primary mt-4 inline-block">{{ t('common.back') }}</NuxtLink>
    </div>

    <div v-else class="pb-6">
      <!-- Video player area -->
      <div class="relative bg-gray-900 aspect-video flex items-center justify-center">
        <div v-if="!videoPlaying" class="text-center">
          <div class="text-6xl mb-4">{{ module.thumbnail }}</div>
          <button
            class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30"
            @click="videoPlaying = true"
          >
            <i class="pi pi-play text-white text-xl ml-1" />
          </button>
          <p class="text-white/70 text-sm mt-3">{{ t('training.watchVideo') }}</p>
        </div>
        <div v-else class="text-center text-white">
          <div class="text-4xl mb-2">▶️</div>
          <p class="text-white/70 text-sm">Video player would embed here</p>
        </div>
      </div>

      <div class="page-container py-4 space-y-5">
        <!-- Back -->
        <NuxtLink to="/training" class="flex items-center gap-1 text-sm text-gray-500">
          <i class="pi pi-chevron-left text-xs" /> {{ t('common.back') }}
        </NuxtLink>

        <!-- Title + meta -->
        <div>
          <h1 class="text-xl font-bold text-gray-900">{{ module.title }}</h1>
          <p class="text-sm text-gray-500 italic mt-0.5">{{ module.titleSw }}</p>
          <div class="flex items-center gap-3 mt-2">
            <span class="badge badge-green">
              <i class="pi pi-clock text-[10px] mr-1" />{{ module.duration }} {{ t('training.minutesShort') }}
            </span>
            <span v-if="module.completed" class="badge badge-amber">
              <i class="pi pi-check-circle text-[10px] mr-1" />{{ t('training.completed') }}
            </span>
          </div>
        </div>

        <!-- Description -->
        <p class="text-sm text-gray-700 leading-relaxed">{{ module.description }}</p>

        <!-- Topics -->
        <div>
          <h2 class="font-semibold text-gray-900 mb-2">Topics Covered</h2>
          <ul class="space-y-2">
            <li v-for="topic in module.topics" :key="topic" class="flex items-start gap-2 text-sm text-gray-700">
              <i class="pi pi-check-circle text-primary mt-0.5" />
              {{ topic }}
            </li>
          </ul>
        </div>

        <!-- Quiz section -->
        <div v-if="!module.completed">
          <div v-if="!quizStarted" class="card p-4 border border-primary/20">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <i class="pi pi-question-circle text-primary" />
              </div>
              <div>
                <div class="font-semibold text-gray-900 text-sm">{{ t('training.quizTitle') }}</div>
                <div class="text-xs text-gray-500">{{ module.quiz.length }} questions to earn your badge</div>
              </div>
            </div>
            <button class="btn-primary w-full text-sm" @click="quizStarted = true">
              {{ t('training.takeQuiz') }}
            </button>
          </div>

          <div v-else-if="!quizSubmitted" class="space-y-4">
            <h2 class="font-semibold text-gray-900">{{ t('training.quizTitle') }}</h2>
            <div
              v-for="(q, qi) in module.quiz"
              :key="q.id"
              class="card p-4 space-y-3"
            >
              <p class="font-medium text-gray-900 text-sm">{{ qi + 1 }}. {{ q.question }}</p>
              <div class="space-y-2">
                <button
                  v-for="(opt, oi) in q.options"
                  :key="oi"
                  class="w-full text-left text-sm px-4 py-3 rounded-xl border transition-colors"
                  :class="answers[q.id] === oi
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-gray-200 text-gray-700'"
                  @click="selectAnswer(q.id, oi)"
                >
                  {{ opt }}
                </button>
              </div>
            </div>
            <button
              class="btn-primary w-full"
              :disabled="!allAnswered"
              :class="{ 'opacity-50 cursor-not-allowed': !allAnswered }"
              @click="submitQuiz"
            >
              {{ t('training.submitAnswers') }}
            </button>
          </div>

          <!-- Quiz results -->
          <div v-else class="card p-5 text-center space-y-3">
            <div class="text-4xl">{{ score === module.quiz.length ? '🎉' : '📖' }}</div>
            <div class="font-bold text-xl text-gray-900">
              {{ score }} / {{ module.quiz.length }} correct
            </div>
            <p v-if="score === module.quiz.length" class="text-green-700 text-sm font-medium">
              {{ t('training.congratulations') }}
            </p>
            <p v-else class="text-gray-600 text-sm">
              Review the module and try again to earn your badge.
            </p>
            <button v-if="score < module.quiz.length" class="btn-outline w-full text-sm" @click="quizSubmitted = false; answers = {}">
              Retry Quiz
            </button>
          </div>
        </div>

        <!-- Badge earned -->
        <Transition name="fade">
          <div v-if="badgeVisible" class="card p-5 bg-gradient-to-r from-primary/10 to-secondary/10 text-center space-y-2">
            <div class="text-5xl">🏅</div>
            <h3 class="font-bold text-primary text-lg">{{ t('training.badgeEarned') }}</h3>
            <p class="text-sm text-gray-600">{{ module.title }}</p>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
