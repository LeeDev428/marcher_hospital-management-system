<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <img src="/img/logo/marcher-logo.png" alt="Marcher Logo" class="w-16 h-16" />
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Reset your password</h2>
        <p class="mt-2 text-gray-600">
          Enter your new password below. Make sure it's at least 8 characters long.
        </p>
      </div>

      <!-- Success Message -->
      <div v-if="resetSuccess" class="bg-green-50 border border-green-200 rounded-2xl p-6">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <Icon name="lucide:check-circle" class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">Password reset successful!</h3>
            <div class="mt-2 text-sm text-green-700">
              <p>
                Your password has been reset successfully. You can now log in with your new password.
              </p>
            </div>
            <div class="mt-4">
              <NuxtLink to="/login">
                <Button class="bg-green-600 hover:bg-green-700 text-white">
                  <Icon name="lucide:log-in" class="w-4 h-4 mr-2" />
                  Go to login
                </Button>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Invalid Token Message -->
      <div v-else-if="tokenValid === false" class="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <Icon name="lucide:alert-circle" class="h-6 w-6 text-red-600" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Invalid or expired reset link</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>
                This password reset link is invalid or has expired. Reset links are only valid for 1 hour.
              </p>
            </div>
            <div class="mt-4">
              <NuxtLink to="/forgot-password">
                <Button variant="outline" class="text-red-700 border-red-300 hover:bg-red-50">
                  <Icon name="lucide:mail" class="w-4 h-4 mr-2" />
                  Request new reset link
                </Button>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="verifying" class="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
        <div class="text-center py-8">
          <Icon name="lucide:loader-2" class="w-12 h-12 mx-auto text-teal-500 animate-spin" />
          <p class="mt-4 text-gray-600">Verifying reset link...</p>
        </div>
      </div>

      <!-- Reset Password Form -->
      <div v-else class="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- New Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="lucide:lock" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="8"
                :disabled="loading"
                class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter new password (min. 8 characters)"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="lucide:lock" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                minlength="8"
                :disabled="loading"
                class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Icon :name="showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'" class="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          <!-- Password Requirements -->
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p class="text-xs font-medium text-gray-700 mb-2">Password requirements:</p>
            <ul class="text-xs text-gray-600 space-y-1">
              <li class="flex items-center">
                <Icon 
                  :name="form.password.length >= 8 ? 'lucide:check-circle' : 'lucide:circle'" 
                  :class="form.password.length >= 8 ? 'text-green-600' : 'text-gray-400'" 
                  class="w-4 h-4 mr-2" 
                />
                At least 8 characters
              </li>
              <li class="flex items-center">
                <Icon 
                  :name="form.password === form.confirmPassword && form.password.length > 0 ? 'lucide:check-circle' : 'lucide:circle'" 
                  :class="form.password === form.confirmPassword && form.password.length > 0 ? 'text-green-600' : 'text-gray-400'" 
                  class="w-4 h-4 mr-2" 
                />
                Passwords match
              </li>
            </ul>
          </div>

          <!-- Submit Button -->
          <Button
            type="submit"
            :disabled="loading || form.password !== form.confirmPassword || form.password.length < 8"
            class="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="w-5 h-5 mr-2 animate-spin" />
            <Icon v-else name="lucide:key" class="w-5 h-5 mr-2" />
            {{ loading ? 'Resetting password...' : 'Reset password' }}
          </Button>
        </form>
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
  title: 'Reset Password - Marcher Healthcare',
  meta: [
    { name: 'description', content: 'Reset your Marcher healthcare account password.' }
  ]
})

const { $trpc } = useNuxtApp()
const route = useRoute()

const loading = ref(false)
const verifying = ref(true)
const tokenValid = ref<boolean | null>(null)
const resetSuccess = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  password: '',
  confirmPassword: '',
})

const token = computed(() => route.query.token as string)

// Verify token on mount
onMounted(async () => {
  if (!token.value) {
    tokenValid.value = false
    verifying.value = false
    return
  }

  try {
    const result = await $trpc.auth.verifyResetToken.query({
      token: token.value
    })
    
    tokenValid.value = result.valid
  } catch (error) {
    console.error('Token verification error:', error)
    tokenValid.value = false
  } finally {
    verifying.value = false
  }
})

const handleSubmit = async () => {
  // Validate passwords match
  if (form.password !== form.confirmPassword) {
    useToast('error', 'Error', 'Passwords do not match')
    return
  }

  // Validate password length
  if (form.password.length < 8) {
    useToast('error', 'Error', 'Password must be at least 8 characters long')
    return
  }

  loading.value = true
  
  try {
    const result = await $trpc.auth.resetPassword.mutate({
      token: token.value,
      newPassword: form.password
    })

    if (result.success) {
      resetSuccess.value = true
      useToast('success', 'Success', result.message)
    }
  } catch (error: any) {
    console.error('Password reset error:', error)
    const errorMessage = error?.message || 'Failed to reset password. Please try again.'
    useToast('error', 'Error', errorMessage)
  } finally {
    loading.value = false
  }
}
</script>
