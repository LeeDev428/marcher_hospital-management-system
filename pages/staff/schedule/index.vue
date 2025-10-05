<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/app'
import { useBreadcrumbsStore } from '@/stores/app'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/composables/useToast'
import { dayOptions } from '@/types/schedule'
import type { DayOfWeek } from '@/types/schedule'

definePageMeta({
  layout: 'staff',
  middleware: 'auth'
})

useHead({
  title: 'My Schedule - Staff Portal'
})

const authStore = useAuthStore()
const breadcrumbsStore = useBreadcrumbsStore()
const { $trpc } = useNuxtApp()

interface DayScheduleData {
  id?: string
  day: DayOfWeek
  isAvailable: boolean
  startTime: string
  endTime: string
}

const loading = ref(false)
const saving = ref(false)

// Initialize schedule for all days
const weekSchedule = ref<DayScheduleData[]>(
  dayOptions.map(day => ({
    day: day.value as DayOfWeek,
    isAvailable: false,
    startTime: '08:00',
    endTime: '17:00'
  }))
)

// Load existing schedule
const loadSchedule = async () => {
  if (!authStore.user?.id) return
  
  loading.value = true
  try {
    const { $trpc } = useNuxtApp()
    const response = await $trpc.schedule.getSchedule.query({ 
      staffId: authStore.user.id 
    })
    
    if (response.success && response.data) {
      // Update schedule with existing data
      response.data.forEach((schedule: any) => {
        const dayIndex = weekSchedule.value.findIndex(d => d.day === schedule.day)
        if (dayIndex !== -1) {
          weekSchedule.value[dayIndex] = {
            id: schedule.id,
            day: schedule.day,
            isAvailable: schedule.isAvailable,
            startTime: schedule.startTime || '08:00',
            endTime: schedule.endTime || '17:00'
          }
        }
      })
    }
  } catch (error) {
    console.error('Error loading schedule:', error)
  } finally {
    loading.value = false
  }
}

// Save schedule
const saveSchedule = async () => {
  if (!authStore.user?.id) return
  
  saving.value = true
  try {
    const { $trpc } = useNuxtApp()
    const response = await $trpc.schedule.bulkUpdateSchedule.mutate({
      staffId: authStore.user.id,
      schedules: weekSchedule.value.map(day => ({
        day: day.day,
        isAvailable: day.isAvailable,
        startTime: day.isAvailable ? day.startTime : null,
        endTime: day.isAvailable ? day.endTime : null,
      }))
    })
    
    if (response.success) {
      useToast('success', 'Schedule Saved', 'Your weekly schedule has been updated successfully')
      await loadSchedule() // Reload to get IDs
    } else {
      useToast('error', 'Save Failed', response.message || 'Failed to save schedule')
    }
  } catch (error) {
    console.error('Error saving schedule:', error)
    useToast('error', 'Save Failed', 'An error occurred while saving your schedule')
  } finally {
    saving.value = false
  }
}

// Set all days to same time
const applyToAll = () => {
  const firstAvailable = weekSchedule.value.find(d => d.isAvailable)
  if (!firstAvailable) {
    useToast('info', 'No Schedule', 'Please set at least one day as available first')
    return
  }
  
  weekSchedule.value.forEach(day => {
    if (day.isAvailable) {
      day.startTime = firstAvailable.startTime
      day.endTime = firstAvailable.endTime
    }
  })
  
  useToast('success', 'Applied', 'Time schedule applied to all available days')
}

// Quick set work week (Mon-Fri 8AM-5PM)
const setWorkWeek = () => {
  weekSchedule.value.forEach(day => {
    const isWeekday = !['SATURDAY', 'SUNDAY'].includes(day.day)
    day.isAvailable = isWeekday
    if (isWeekday) {
      day.startTime = '08:00'
      day.endTime = '17:00'
    }
  })
  useToast('success', 'Work Week Set', 'Monday to Friday, 8:00 AM - 5:00 PM')
}

// Get day label
const getDayLabel = (day: DayOfWeek) => {
  return dayOptions.find(d => d.value === day)?.label || day
}

// Modern card styling - consistent across all days
const getCardStyle = (isAvailable: boolean) => {
  if (isAvailable) {
    return 'bg-white border-blue-500 shadow-md hover:shadow-xl'
  }
  return 'bg-gray-50 border-gray-200 hover:shadow-md'
}

// Helper function to calculate duration
const calculateDuration = (start: string, end: string): string => {
  if (!start || !end) return '0 hours'
  
  const [startHour, startMin] = start.split(':').map(Number)
  const [endHour, endMin] = end.split(':').map(Number)
  
  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin
  
  const diffMinutes = endMinutes - startMinutes
  
  if (diffMinutes <= 0) return 'Invalid'
  
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60
  
  if (minutes === 0) return `${hours} hour${hours !== 1 ? 's' : ''}`
  return `${hours}h ${minutes}m`
}

// Computed properties
const availableDaysCount = computed(() => {
  return weekSchedule.value.filter(d => d.isAvailable).length
})

const totalHoursPerWeek = computed(() => {
  let totalMinutes = 0
  
  weekSchedule.value.forEach(day => {
    if (day.isAvailable && day.startTime && day.endTime) {
      const [startHour, startMin] = day.startTime.split(':').map(Number)
      const [endHour, endMin] = day.endTime.split(':').map(Number)
      
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin
      
      if (endMinutes > startMinutes) {
        totalMinutes += (endMinutes - startMinutes)
      }
    }
  })
  
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  
  if (minutes === 0) return `${hours} hours`
  return `${hours}h ${minutes}m`
})

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: 'My Schedule', link: '/staff/schedule' }
  ])
  loadSchedule()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">My Weekly Schedule</h1>
        <p class="mt-2 text-gray-600">Set your availability for each day of the week</p>
      </div>
      <div class="flex gap-3">
        <Button 
          variant="outline" 
          @click="setWorkWeek"
          :disabled="loading || saving"
        >
          <Icon name="lucide:briefcase" class="w-4 h-4 mr-2" />
          Set Work Week
        </Button>
        <Button 
          variant="outline" 
          @click="applyToAll"
          :disabled="loading || saving"
        >
          <Icon name="lucide:copy" class="w-4 h-4 mr-2" />
          Apply to All
        </Button>
        <Button 
          @click="saveSchedule"
          :disabled="loading || saving"
          class="bg-blue-600 hover:bg-blue-700"
        >
          <Icon name="lucide:save" class="w-4 h-4 mr-2" />
          {{ saving ? 'Saving...' : 'Save Schedule' }}
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-blue-600 mx-auto" />
      <p class="mt-4 text-gray-600">Loading your schedule...</p>
    </div>

    <!-- Schedule Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <Card 
        v-for="day in weekSchedule" 
        :key="day.day"
        class="p-6 border-2 transition-all hover:shadow-lg"
        :class="[
          getDayColor(day.day),
          day.isAvailable ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
        ]"
      >
        <!-- Day Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ getDayLabel(day.day) }}
          </h3>
          <div class="flex items-center space-x-2">
            <Checkbox 
              :id="`available-${day.day}`"
              v-model:checked="day.isAvailable"
              class="data-[state=checked]:bg-blue-600"
            />
            <Label 
              :for="`available-${day.day}`"
              class="text-sm font-medium cursor-pointer"
            >
              Available
            </Label>
          </div>
        </div>

        <!-- Time Inputs -->
        <div 
          v-if="day.isAvailable" 
          class="space-y-4 mt-4 pt-4 border-t border-gray-200"
        >
          <!-- Start Time -->
          <div>
            <Label :for="`start-${day.day}`" class="text-sm text-gray-700 mb-1.5 block">
              Start Time
            </Label>
            <Input
              :id="`start-${day.day}`"
              v-model="day.startTime"
              type="time"
              class="w-full"
            />
          </div>

          <!-- End Time -->
          <div>
            <Label :for="`end-${day.day}`" class="text-sm text-gray-700 mb-1.5 block">
              End Time
            </Label>
            <Input
              :id="`end-${day.day}`"
              v-model="day.endTime"
              type="time"
              class="w-full"
            />
          </div>

          <!-- Duration Display -->
          <div class="text-sm text-gray-600 bg-white/50 rounded-lg p-2 text-center">
            <Icon name="lucide:clock" class="w-4 h-4 inline mr-1" />
            {{ calculateDuration(day.startTime, day.endTime) }}
          </div>
        </div>

        <!-- Not Available State -->
        <div v-else class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-center text-gray-500 text-sm italic">
            <Icon name="lucide:x-circle" class="w-4 h-4 inline mr-1" />
            Not Available
          </p>
        </div>
      </Card>
    </div>

    <!-- Summary Card -->
    <Card class="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Schedule Summary</h3>
          <div class="space-y-2">
            <p class="text-sm text-gray-700">
              <Icon name="lucide:calendar-check" class="w-4 h-4 inline mr-2 text-green-600" />
              <strong>{{ availableDaysCount }}</strong> days available this week
            </p>
            <p class="text-sm text-gray-700">
              <Icon name="lucide:clock" class="w-4 h-4 inline mr-2 text-blue-600" />
              <strong>{{ totalHoursPerWeek }}</strong> total hours
            </p>
          </div>
        </div>
        <div class="text-right">
          <div class="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <Icon name="lucide:info" class="w-5 h-5 text-blue-600 mr-2" />
            <span class="text-sm text-gray-700">Remember to save your changes!</span>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
