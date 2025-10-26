<script setup lang="ts">
import { useAuthStore } from "~/stores/app"

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const getUserInitials = () => {
  if (!authStore.user) return 'U'
  const firstName = authStore.user.firstName || ''
  const lastName = authStore.user.lastName || ''
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const handleLogout = async () => {
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
      <!-- Logo -->
      <div class="flex items-center px-6 py-4 border-b border-gray-200">
        <div class="flex items-center">
          <img src="/img/logo/marcher-logo.png" alt="Marcher Logo" class="w-6 h-6" />
          <span class="ml-3 text-xl font-semibold text-gray-800">Marcher</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="mt-6 px-3">
        <div class="space-y-1">
          <NuxtLink 
            to="/billing_staff" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path === '/billing_staff' ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:layout-dashboard" class="w-5 h-5 mr-3" />
            Dashboard
          </NuxtLink>
          
          <NuxtLink 
            to="/billing_staff/patients" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path.startsWith('/billing_staff/patients') ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:users" class="w-5 h-5 mr-3" />
            Patients
          </NuxtLink>
          
          <NuxtLink 
            to="/billing_staff/particulars" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path.startsWith('/billing_staff/particulars') ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:package" class="w-5 h-5 mr-3" />
            Particulars Catalogue
          </NuxtLink>
          
          <NuxtLink 
            to="/billing_staff/encounters" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path.startsWith('/billing_staff/encounters') ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:clipboard-list" class="w-5 h-5 mr-3" />
            Encounters
          </NuxtLink>
          
          <NuxtLink 
            to="/billing_staff/payments" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path.startsWith('/billing_staff/payments') ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:credit-card" class="w-5 h-5 mr-3" />
            Process Payments
          </NuxtLink>
          
          <NuxtLink 
            to="/billing_staff/invoices" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path.startsWith('/billing_staff/invoices') ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:receipt" class="w-5 h-5 mr-3" />
            Invoices
          </NuxtLink>
          
          <NuxtLink 
            to="/billing_staff/settlements" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path.startsWith('/billing_staff/settlements') ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:wallet" class="w-5 h-5 mr-3" />
            Balance Settlements
          </NuxtLink>
          
          <NuxtLink 
            to="/billing_staff/insurance" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path.startsWith('/billing_staff/insurance') ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:shield-check" class="w-5 h-5 mr-3" />
            Insurance Claims
          </NuxtLink>
          
          <NuxtLink 
            to="/billing_staff/reports" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path.startsWith('/billing_staff/reports') ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:file-text" class="w-5 h-5 mr-3" />
            Reports
          </NuxtLink>
        </div>
      </nav>

      <!-- Staff Type Badge -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div class="flex items-center">
            <Icon name="lucide:badge-dollar-sign" class="w-5 h-5 text-purple-600 mr-2" />
            <div>
              <p class="text-xs font-medium text-purple-800">Billing Staff</p>
              <p class="text-xs text-purple-600">Payment Processing</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Top Header -->
      <header class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-800">Billing Dashboard</h1>
            <p class="text-sm text-gray-600">Welcome back, {{ authStore.fullName }}</p>
          </div>
          
          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="p-2 text-gray-400 hover:text-gray-600 relative">
              <Icon name="lucide:bell" class="w-5 h-5" />
              <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <!-- User Profile & Logout -->
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-white">{{ getUserInitials() }}</span>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-800">{{ authStore.fullName }}</p>
                  <p class="text-xs text-gray-500">Billing Staff</p>
                </div>
              </div>
              
              <!-- Logout Button -->
              <button 
                @click="handleLogout"
                class="flex items-center px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Icon name="lucide:log-out" class="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
