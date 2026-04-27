<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const { t, locale } = useI18n()
const router = useRouter()
definePageMeta({ layout: 'default' })

const { register } = useAuth()

const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu',
  'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
  'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale',
  'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit',
  'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru',
  'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu',
  'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi', 'Trans Nzoia',
  'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
]

const schema = yup.object({
  firstName: yup.string().min(2).required('First name is required'),
  lastName: yup.string().min(2).required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(/^(\+254|07|01)\d{8,9}$/, 'Enter a valid Kenyan phone number').required('Phone is required'),
  county: yup.string().required('County is required'),
  role: yup.string().oneOf(['harvester', 'buyer']).required('Please select a role'),
  password: yup.string().min(8, 'At least 8 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
  languagePreference: yup.string().oneOf(['en', 'sw']).required(),
})

const { handleSubmit, errors } = useForm({ validationSchema: schema })
const { value: firstName } = useField<string>('firstName')
const { value: lastName } = useField<string>('lastName')
const { value: email } = useField<string>('email')
const { value: phone } = useField<string>('phone')
const { value: county } = useField<string>('county')
const { value: role } = useField<string>('role', undefined, { initialValue: '' })
const { value: password } = useField<string>('password')
const { value: confirmPassword } = useField<string>('confirmPassword')
const { value: languagePreference } = useField<string>('languagePreference', undefined, { initialValue: locale.value })

const submitting = ref(false)
const serverError = ref('')

const onSubmit = handleSubmit(async (values) => {
  submitting.value = true
  serverError.value = ''
  try {
    await register({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      county: values.county,
      role: values.role as 'harvester' | 'buyer',
      password: values.password,
      languagePreference: values.languagePreference as 'en' | 'sw',
    })
    router.push('/')
  }
  catch (err: any) {
    serverError.value = err?.data?.message ?? t('common.error')
  }
  finally {
    submitting.value = false
  }
})
</script>

<template>
  <div class="page-container py-4 space-y-5">
    <h1 class="section-title">{{ t('register.title') }}</h1>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <!-- Role selector -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">{{ t('register.role') }} *</label>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="r in [{ id: 'harvester', label: t('register.harvester'), desc: t('register.harvesterDesc'), icon: '🌾' }, { id: 'buyer', label: t('register.buyer'), desc: t('register.buyerDesc'), icon: '🛒' }]"
            :key="r.id"
            type="button"
            class="p-4 rounded-xl border-2 text-left transition-all"
            :class="role === r.id
              ? 'border-primary bg-primary/5'
              : 'border-gray-200'"
            @click="role = r.id"
          >
            <div class="text-2xl mb-1">{{ r.icon }}</div>
            <div class="font-semibold text-sm" :class="role === r.id ? 'text-primary' : 'text-gray-900'">
              {{ r.label }}
            </div>
            <div class="text-xs text-gray-500 mt-0.5">{{ r.desc }}</div>
          </button>
        </div>
        <p v-if="errors.role" class="text-xs text-red-500">{{ errors.role }}</p>
      </div>

      <!-- Name row -->
      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">{{ t('register.firstName') }} *</label>
          <input v-model="firstName" type="text" class="input-field" :placeholder="t('register.firstName')" />
          <p v-if="errors.firstName" class="text-xs text-red-500">{{ errors.firstName }}</p>
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">{{ t('register.lastName') }} *</label>
          <input v-model="lastName" type="text" class="input-field" :placeholder="t('register.lastName')" />
          <p v-if="errors.lastName" class="text-xs text-red-500">{{ errors.lastName }}</p>
        </div>
      </div>

      <!-- Email -->
      <div class="space-y-1">
        <label class="text-sm font-medium text-gray-700">{{ t('register.email') }} *</label>
        <input v-model="email" type="email" class="input-field" placeholder="you@example.com" />
        <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
      </div>

      <!-- Phone -->
      <div class="space-y-1">
        <label class="text-sm font-medium text-gray-700">{{ t('register.phone') }} *</label>
        <input v-model="phone" type="tel" class="input-field" placeholder="+254712345678" />
        <p v-if="errors.phone" class="text-xs text-red-500">{{ errors.phone }}</p>
      </div>

      <!-- County -->
      <div class="space-y-1">
        <label class="text-sm font-medium text-gray-700">{{ t('register.county') }} *</label>
        <select v-model="county" class="input-field">
          <option value="">{{ t('register.selectCounty') }}</option>
          <option v-for="c in KENYA_COUNTIES" :key="c" :value="c">{{ c }}</option>
        </select>
        <p v-if="errors.county" class="text-xs text-red-500">{{ errors.county }}</p>
      </div>

      <!-- Language preference -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">{{ t('register.languagePreference') }}</label>
        <div class="flex gap-2">
          <button
            v-for="lang in [{ id: 'en', label: 'English' }, { id: 'sw', label: 'Kiswahili' }]"
            :key="lang.id"
            type="button"
            class="flex-1 py-2 rounded-lg border text-sm font-medium transition-colors"
            :class="languagePreference === lang.id
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-gray-200 text-gray-600'"
            @click="languagePreference = lang.id"
          >
            {{ lang.label }}
          </button>
        </div>
      </div>

      <!-- Password -->
      <div class="space-y-1">
        <label class="text-sm font-medium text-gray-700">{{ t('register.password') }} *</label>
        <input v-model="password" type="password" class="input-field" placeholder="Min 8 characters" />
        <p v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</p>
      </div>

      <!-- Confirm password -->
      <div class="space-y-1">
        <label class="text-sm font-medium text-gray-700">{{ t('register.confirmPassword') }} *</label>
        <input v-model="confirmPassword" type="password" class="input-field" :placeholder="t('register.confirmPassword')" />
        <p v-if="errors.confirmPassword" class="text-xs text-red-500">{{ errors.confirmPassword }}</p>
      </div>

      <!-- Server error -->
      <div v-if="serverError" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
        {{ serverError }}
      </div>

      <button
        type="submit"
        class="btn-primary w-full flex items-center justify-center gap-2"
        :disabled="submitting"
      >
        <i v-if="submitting" class="pi pi-spin pi-spinner" />
        {{ submitting ? t('common.loading') : t('common.submit') }}
      </button>

      <p class="text-center text-sm text-gray-500">
        {{ t('register.alreadyHaveAccount') }}
        <NuxtLink to="/auth/login" class="text-primary font-medium">{{ t('register.loginHere') }}</NuxtLink>
      </p>
    </form>
  </div>
</template>
