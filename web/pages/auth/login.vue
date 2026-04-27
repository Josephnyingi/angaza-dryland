<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const { t } = useI18n()
const router = useRouter()
definePageMeta({ layout: 'default' })

const { login } = useAuth()

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(1, 'Password is required').required('Password is required'),
})

const { handleSubmit, errors } = useForm({ validationSchema: schema })
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

const submitting = ref(false)
const serverError = ref('')

const onSubmit = handleSubmit(async (values) => {
  submitting.value = true
  serverError.value = ''
  try {
    await login(values.email, values.password)
    router.push('/')
  }
  catch (err: any) {
    serverError.value = err?.data?.message ?? 'Invalid email or password.'
  }
  finally {
    submitting.value = false
  }
})
</script>

<template>
  <div class="page-container py-8 space-y-6">
    <!-- Logo -->
    <div class="text-center pt-4">
      <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
        <span class="text-white font-bold text-2xl">A</span>
      </div>
      <h1 class="text-2xl font-bold text-gray-900">{{ t('auth.loginTitle') }}</h1>
      <p class="text-gray-500 text-sm mt-1">{{ t('auth.loginSubtitle') }}</p>
    </div>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="space-y-1">
        <label class="text-sm font-medium text-gray-700">{{ t('auth.email') }}</label>
        <input v-model="email" type="email" class="input-field" placeholder="you@example.com" autocomplete="email" />
        <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
      </div>

      <div class="space-y-1">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.password') }}</label>
          <button type="button" class="text-xs text-primary font-medium">{{ t('auth.forgotPassword') }}</button>
        </div>
        <input v-model="password" type="password" class="input-field" placeholder="••••••••" autocomplete="current-password" />
        <p v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</p>
      </div>

      <div v-if="serverError" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
        {{ serverError }}
      </div>

      <button
        type="submit"
        class="btn-primary w-full flex items-center justify-center gap-2"
        :disabled="submitting"
      >
        <i v-if="submitting" class="pi pi-spin pi-spinner" />
        {{ submitting ? t('common.loading') : t('auth.login') }}
      </button>

      <p class="text-center text-sm text-gray-500">
        {{ t('auth.noAccount') }}
        <NuxtLink to="/register" class="text-primary font-medium">{{ t('auth.registerHere') }}</NuxtLink>
      </p>
    </form>
  </div>
</template>
