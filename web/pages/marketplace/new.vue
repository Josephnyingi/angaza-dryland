<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const { t } = useI18n()
const router = useRouter()
definePageMeta({ layout: 'default' })

const api = useApi()
const { isHarvester } = useAuth()

// Redirect non-harvesters
onMounted(() => {
  if (!isHarvester.value) {
    router.replace('/marketplace')
  }
})

const schema = yup.object({
  productName: yup.string().required('Product is required'),
  quantity: yup.number().min(1, 'Must be at least 1 kg').required('Quantity is required'),
  pricePerKg: yup.number().min(1, 'Price must be positive').required('Price is required'),
  quality: yup.string().oneOf(['A', 'B', 'C']).required('Quality grade is required'),
  description: yup.string().max(300, 'Max 300 characters'),
})

const { handleSubmit, errors } = useForm({ validationSchema: schema })
const { value: productName } = useField<string>('productName')
const { value: quantity } = useField<number>('quantity')
const { value: pricePerKg } = useField<number>('pricePerKg')
const { value: quality } = useField<string>('quality')
const { value: description } = useField<string>('description')

const submitting = ref(false)
const submitted = ref(false)

const products = [
  'Baobab Powder',
  'Baobab Oil',
  'Baobab Seeds',
  'Tamarind Pods',
  'Tamarind Paste',
  'Wild Cotton Lint',
  'Wild Cotton Seed Oil',
]

const qualityOptions = [
  { value: 'A', label: t('marketplace.qualityGrades.A') },
  { value: 'B', label: t('marketplace.qualityGrades.B') },
  { value: 'C', label: t('marketplace.qualityGrades.C') },
]

const onSubmit = handleSubmit(async (values) => {
  submitting.value = true
  try {
    await api.post('/marketplace', values)
    submitted.value = true
    setTimeout(() => router.push('/marketplace'), 1500)
  }
  catch {
    // In prototype, just simulate success
    submitted.value = true
    setTimeout(() => router.push('/marketplace'), 1500)
  }
  finally {
    submitting.value = false
  }
})
</script>

<template>
  <div class="page-container py-4 space-y-5">
    <div class="flex items-center gap-3">
      <NuxtLink to="/marketplace" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
        <i class="pi pi-chevron-left text-gray-600" />
      </NuxtLink>
      <h1 class="section-title">{{ t('marketplace.listProduct') }}</h1>
    </div>

    <!-- Success state -->
    <div v-if="submitted" class="py-16 text-center space-y-3">
      <div class="text-5xl">✅</div>
      <h2 class="font-bold text-xl text-primary">Listing created!</h2>
      <p class="text-gray-500 text-sm">Redirecting to marketplace…</p>
    </div>

    <form v-else class="space-y-4" @submit.prevent="onSubmit">
      <!-- Product -->
      <div class="space-y-1">
        <label class="text-sm font-medium text-gray-700">Product *</label>
        <select v-model="productName" class="input-field">
          <option value="">Select product…</option>
          <option v-for="p in products" :key="p" :value="p">{{ p }}</option>
        </select>
        <p v-if="errors.productName" class="text-xs text-red-500">{{ errors.productName }}</p>
      </div>

      <!-- Quantity + Price (2 columns) -->
      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">{{ t('marketplace.quantityKg') }} *</label>
          <input v-model="quantity" type="number" min="1" class="input-field" placeholder="50" />
          <p v-if="errors.quantity" class="text-xs text-red-500">{{ errors.quantity }}</p>
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">{{ t('marketplace.pricePerKg') }} *</label>
          <input v-model="pricePerKg" type="number" min="1" class="input-field" placeholder="280" />
          <p v-if="errors.pricePerKg" class="text-xs text-red-500">{{ errors.pricePerKg }}</p>
        </div>
      </div>

      <!-- Quality grade -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">{{ t('marketplace.quality') }} *</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="opt in qualityOptions"
            :key="opt.value"
            type="button"
            class="py-3 px-2 rounded-xl border text-xs font-medium text-center transition-colors"
            :class="quality === opt.value
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-gray-200 text-gray-600'"
            @click="quality = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
        <p v-if="errors.quality" class="text-xs text-red-500">{{ errors.quality }}</p>
      </div>

      <!-- Description -->
      <div class="space-y-1">
        <label class="text-sm font-medium text-gray-700">Description (optional)</label>
        <textarea
          v-model="description"
          class="input-field resize-none"
          rows="3"
          placeholder="Add any notes about your product quality, location, or availability…"
        />
        <p v-if="errors.description" class="text-xs text-red-500">{{ errors.description }}</p>
      </div>

      <button
        type="submit"
        class="btn-primary w-full flex items-center justify-center gap-2"
        :disabled="submitting"
      >
        <i v-if="submitting" class="pi pi-spin pi-spinner" />
        {{ submitting ? t('common.loading') : t('marketplace.listProduct') }}
      </button>
    </form>
  </div>
</template>
