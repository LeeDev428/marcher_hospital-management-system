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
  <div class="bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl p-8 text-white mb-8">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
      <div class="mb-4 md:mb-0">
        <h1 class="text-3xl font-bold mb-2">
          Good morning, {{ user?.firstName || 'Staff' }}! 👋
        </h1>
        <p class="text-teal-100 text-lg">
          Ready to make a difference in healthcare today?
        </p>
        <div class="flex items-center space-x-4 mt-3 text-teal-100">
          <div class="flex items-center space-x-2">
            <Icon name="lucide:calendar" class="w-4 h-4" />
            <span>{{ currentDate }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <Icon name="lucide:clock" class="w-4 h-4" />
            <span>{{ currentTime }}</span>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="secondary" 
          class="bg-white/20 hover:bg-white/30 text-white border-white/30"
          @click="navigateTo('/staff/appointments')"
        >
          <Icon name="lucide:calendar-plus" class="w-4 h-4 mr-2" />
          New Appointment
        </Button>
        <Button 
          variant="secondary" 
          class="bg-white/20 hover:bg-white/30 text-white border-white/30"
          @click="navigateTo('/staff/patients')"
        >
          <Icon name="lucide:user-plus" class="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>
    </div>
  </div>
</template>