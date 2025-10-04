<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <img src="/img/logo/marcher-logo.png" alt="Marcher Logo" class="w-16 h-16" />
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Welcome back</h2>
        <p class="mt-2 text-gray-600">Sign in to your Marcher account</p>
      </div>

      <!-- Login Form -->
      <div class="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
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
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
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
                class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your password"
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

          <!-- Remember me & Forgot password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" class="text-sm text-teal-600 hover:text-teal-500">
              Forgot your password?
            </a>
          </div>

          <!-- Submit Button -->
          <Button
            type="submit"
            :disabled="loading"
            class="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="w-5 h-5 mr-2 animate-spin" />
            <Icon v-else name="lucide:user-check" class="w-5 h-5 mr-2" />
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </Button>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <!-- Social Login -->
          <div class="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" class="w-full py-3">
              <Icon name="lucide:chrome" class="w-5 h-5 mr-2" />
              Google
            </Button>
            <Button variant="outline" type="button" class="w-full py-3">
              <Icon name="lucide:facebook" class="w-5 h-5 mr-2" />
              Facebook
            </Button>
          </div>
        </form>
      </div>

      <!-- Sign up link -->
      <div class="text-center">
        <p class="text-gray-600">
          Don't have an account?
          <NuxtLink to="/register" class="text-teal-600 hover:text-teal-500 font-medium">
            Sign up here
          </NuxtLink>
        </p>
      </div>

      <!-- Role Selection Demo -->
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 class="text-sm font-medium text-blue-900 mb-2">Demo Accounts:</h3>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="bg-white p-2 rounded border">
            <div class="font-medium text-gray-900">Admin</div>
            <div class="text-gray-600">admin@marcher.com</div>
          </div>
          <div class="bg-white p-2 rounded border">
            <div class="font-medium text-gray-900">Staff</div>
            <div class="text-gray-600">staff@marcher.com</div>
          </div>
          <div class="bg-white p-2 rounded border">
            <div class="font-medium text-gray-900">Patient</div>
            <div class="text-gray-600">patient@marcher.com</div>
          </div>
          <div class="bg-white p-2 rounded border">
            <div class="font-medium text-gray-900">Partner</div>
            <div class="text-gray-600">partner@marcher.com</div>
          </div>
        </div>
        <div class="text-xs text-blue-700 mt-2">Password: Marcher2024!</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/app/useAuthStore'

definePageMeta({
  layout: 'auth',
  middleware: []  // Disable auth middleware on login page
})

useHead({
  title: 'Sign In - Marcher Healthcare',
  meta: [
    { name: 'description', content: 'Sign in to your Marcher healthcare account to access your dashboard and manage your healthcare journey.' }
  ]
})

const { $trpc } = useNuxtApp()

const loading = ref(false)
const showPassword = ref(false)

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const handleLogin = async () => {
  loading.value = true
  
  try {
    // Use the auth store's login method which handles everything
    const authStore = useAuthStore()
    await authStore.login({
      email: form.email,
      password: form.password
    })
  } catch (error) {
    console.error('Login error:', error)
    useToast('error', 'Login Failed', 'An error occurred during login. Please try again.')
  } finally {
    loading.value = false
  }
}


</script>