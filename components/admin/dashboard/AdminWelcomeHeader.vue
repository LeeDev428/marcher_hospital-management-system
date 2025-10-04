<script setup lang="ts">
import { useAuthStore } from '~/stores/app/useAuthStore'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Get current date and time
const currentDate = new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})

const currentTime = ref('')

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})
</script>

<template>
  <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 rounded-2xl p-8 text-white mb-8">
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between">
      <div class="mb-6 lg:mb-0">
        <h1 class="text-4xl font-bold mb-3">
          Welcome back, {{ user?.firstName || 'Administrator' }}! 👨‍💼
        </h1>
        <p class="text-indigo-100 text-xl mb-4">
          Manage and oversee your healthcare system with comprehensive controls
        </p>
        <div class="flex flex-wrap items-center gap-6 text-indigo-100">
          <div class="flex items-center space-x-2">
            <Icon name="lucide:calendar" class="w-5 h-5" />
            <span class="font-medium">{{ currentDate }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <Icon name="lucide:clock" class="w-5 h-5" />
            <span class="font-medium">{{ currentTime }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <Icon name="lucide:shield-check" class="w-5 h-5" />
            <span class="font-medium">System Administrator</span>
          </div>
        </div>
      </div>
      
      <!-- Quick Admin Actions -->
      <div class="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="secondary" 
          class="bg-white/20 hover:bg-white/30 text-white border-white/30 font-semibold"
          @click="navigateTo('/admin/users')"
        >
          <Icon name="lucide:user-cog" class="w-5 h-5 mr-2" />
          Manage Users
        </Button>
        <Button 
          variant="secondary" 
          class="bg-white/20 hover:bg-white/30 text-white border-white/30 font-semibold"
          @click="navigateTo('/admin/settings')"
        >
          <Icon name="lucide:settings" class="w-5 h-5 mr-2" />
          System Settings
        </Button>
        <Button 
          variant="secondary" 
          class="bg-white/20 hover:bg-white/30 text-white border-white/30 font-semibold"
          @click="navigateTo('/admin/logs')"
        >
          <Icon name="lucide:activity" class="w-5 h-5 mr-2" />
          View Logs
        </Button>
      </div>
    </div>
  </div>
</template>