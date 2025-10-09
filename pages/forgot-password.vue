<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <img src="/img/logo/marcher-logo.png" alt="Marcher Logo" class="w-16 h-16" />
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Forgot your password?</h2>
        <p class="mt-2 text-gray-600">
          No worries! Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <!-- Success Message -->
      <div v-if="emailSent" class="bg-green-50 border border-green-200 rounded-2xl p-6">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <Icon name="lucide:mail-check" class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">Check your email</h3>
            <div class="mt-2 text-sm text-green-700">
              <p>
                If an account exists with <strong>{{ form.email }}</strong>, you will receive a password reset link shortly.
              </p>
              <p class="mt-2">
                The link will expire in 1 hour. If you don't receive the email, please check your spam folder.
              </p>
            </div>
            <div class="mt-4">
              <Button 
                @click="resetForm" 
                variant="outline" 
                class="text-green-700 border-green-300 hover:bg-green-50"
              >
                Send another email
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div v-else class="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="lucide:mail" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                :disabled="loading"
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <Button
            type="submit"
            :disabled="loading"
            class="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="w-5 h-5 mr-2 animate-spin" />
            <Icon v-else name="lucide:send" class="w-5 h-5 mr-2" />
            {{ loading ? 'Sending...' : 'Send reset link' }}
          </Button>
        </form>

        <!-- Security Notice -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-start">
            <Icon name="lucide:shield-check" class="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
            <p class="text-sm text-blue-800">
              For security reasons, we'll send the reset link to the email address associated with your account. 
              The link will expire after 1 hour.
            </p>
          </div>
        </div>
      </div>

      <!-- Back to Login -->
      <div class="text-center">
        <NuxtLink 
          to="/login" 
          class="inline-flex items-center text-teal-600 hover:text-teal-500 font-medium"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
          Back to login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: []
})

useHead({
  title: 'Forgot Password - Marcher Healthcare',
  meta: [
    { name: 'description', content: 'Reset your Marcher healthcare account password.' }
  ]
})

const { $trpc } = useNuxtApp()

const loading = ref(false)
const emailSent = ref(false)

const form = reactive({
  email: '',
})

const handleSubmit = async () => {
  loading.value = true
  
  try {
    const result = await $trpc.auth.requestPasswordReset.mutate({
      email: form.email
    })

    if (result.success) {
      emailSent.value = true
      useToast('success', 'Email Sent', result.message)
    }
  } catch (error: any) {
    console.error('Password reset request error:', error)
    const errorMessage = error?.message || 'Failed to send reset email. Please try again.'
    useToast('error', 'Error', errorMessage)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  emailSent.value = false
  form.email = ''
}
</script>
