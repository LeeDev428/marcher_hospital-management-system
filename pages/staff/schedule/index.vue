<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/app'
import { useBreadcrumbsStore } from '@/stores/app'
import { Button } from '@/components/ui/button'
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

// Initialize schedule for all days with default times
const weekSchedule = ref<DayScheduleData[]>(
  dayOptions.map(day => ({
    day: day.value,
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
    const response = await $trpc.schedule.getSchedule.query({ 
      staffId: authStore.user.id 
    })
    
    if (response.success && response.data) {
      console.log('📥 Loaded from database:', response.data)
      
      // Update schedule with existing data
      response.data.forEach((schedule: any) => {
        const dayIndex = weekSchedule.value.findIndex(d => d.day === schedule.day)
        if (dayIndex !== -1) {
          weekSchedule.value[dayIndex] = {
            id: schedule.id,
            day: schedule.day,
            isAvailable: Boolean(schedule.isAvailable),
            startTime: schedule.startTime || '08:00',
            endTime: schedule.endTime || '17:00'
          }
          console.log(`✅ ${schedule.day}: isAvailable=${schedule.isAvailable}, startTime=${schedule.startTime}`)
        }
      })
    }
  } catch (error) {
    console.error('❌ Error loading schedule:', error)
  } finally {
    loading.value = false
  }
}

// Save schedule - Save ALL 7 days with their current state
const saveSchedule = async () => {
  if (!authStore.user?.id) return
  
  saving.value = true
  try {
    console.log('🔍 BEFORE SAVE - RAW weekSchedule.value:', JSON.stringify(weekSchedule.value, null, 2))
    console.log('🔍 BEFORE SAVE - isAvailable values:', weekSchedule.value.map(d => ({ 
      day: d.day, 
      isAvailable: d.isAvailable,
      type: typeof d.isAvailable
    })))
    
    // Prepare ALL 7 days for saving - FORCE BOOLEAN
    const schedulesData = weekSchedule.value.map(day => {
      const isAvail = day.isAvailable === true || day.isAvailable === 'true' || day.isAvailable === 1
      console.log(`📝 Preparing ${day.day}: original=${day.isAvailable}, converted=${isAvail}`)
      return {
        day: day.day,
        isAvailable: isAvail,
        startTime: day.startTime || '08:00',
        endTime: day.endTime || '17:00',
      }
    })
    
    console.log('💾 Saving ALL 7 days:', JSON.stringify(schedulesData, null, 2))
    console.log('✅ Days marked as AVAILABLE:', schedulesData.filter(d => d.isAvailable).map(d => d.day))
    
    const response = await $trpc.schedule.bulkUpdateSchedule.mutate({
      staffId: authStore.user.id,
      schedules: schedulesData
    })
    
    if (response.success) {
      useToast('success', 'Schedule Saved', 'Your weekly schedule has been updated successfully')
      await loadSchedule() // Reload to confirm
    } else {
      useToast('error', 'Save Failed', response.message || 'Failed to save schedule')
    }
  } catch (error) {
    console.error('❌ Error saving schedule:', error)
    useToast('error', 'Save Failed', 'An error occurred while saving your schedule')
  } finally {
    saving.value = false
  }
}

// Computed properties
const availableDaysCount = computed(() => {
  return weekSchedule.value.filter(d => d.isAvailable).length
})

const totalWeeklyHours = computed(() => {
  return weekSchedule.value.reduce((total, day) => {
    if (!day.isAvailable) return total
    
    const [startHour, startMin] = day.startTime.split(':').map(Number)
    const [endHour, endMin] = day.endTime.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    const diffMinutes = endMinutes - startMinutes
    
    return total + (diffMinutes > 0 ? diffMinutes / 60 : 0)
  }, 0)
})

// Calculate hours for a single day
const calculateHours = (startTime: string, endTime: string): string => {
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)
  
  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin
  const diffMinutes = endMinutes - startMinutes
  
  if (diffMinutes <= 0) return '0 hours'
  
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60
  
  if (minutes === 0) return `${hours} hours`
  return `${hours} hours ${minutes} min`
}

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
      <Button 
        @click="saveSchedule"
        :disabled="loading || saving"
        class="bg-blue-600 hover:bg-blue-700 px-6"
      >
        <Icon name="lucide:save" class="w-4 h-4 mr-2" />
        {{ saving ? 'Saving...' : 'Save Schedule' }}
      </Button>
    </div>

    <!-- Loading State -->
    <ClientOnly>
      <div v-if="loading" class="text-center py-12">
        <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-blue-600 mx-auto" />
        <p class="mt-4 text-gray-600">Loading your schedule...</p>
      </div>

      <!-- Schedule Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div 
        v-for="(day, index) in weekSchedule" 
        :key="day.day"
        class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        <!-- Day Header -->
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ day.day.charAt(0) + day.day.slice(1).toLowerCase() }}
          </h3>
          <div class="flex items-center gap-2">
            <Label 
              :for="`check-${day.day}`" 
              class="text-sm font-medium text-gray-600 cursor-pointer select-none"
            >
              Available
            </Label>
            <!-- Native checkbox for testing -->
            <input
              type="checkbox"
              :id="`check-${day.day}`"
              v-model="weekSchedule[index].isAvailable"
              @change="() => {
                console.log(`✅ ${day.day} NATIVE checkbox changed to:`, weekSchedule[index].isAvailable)
              }"
              class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>

        <!-- Time Inputs -->
        <div class="p-5 space-y-4">
          <!-- Start Time -->
          <div class="space-y-2">
            <Label :for="`start-${day.day}`" class="text-sm font-medium text-gray-700">
              Start Time
            </Label>
            <div class="relative">
              <Icon name="lucide:clock" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                :id="`start-${day.day}`"
                v-model="day.startTime"
                type="time"
                class="pl-10 h-11"
              />
            </div>
          </div>

          <!-- End Time -->
          <div class="space-y-2">
            <Label :for="`end-${day.day}`" class="text-sm font-medium text-gray-700">
              End Time
            </Label>
            <div class="relative">
              <Icon name="lucide:clock" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                :id="`end-${day.day}`"
                v-model="day.endTime"
                type="time"
                class="pl-10 h-11"
              />
            </div>
          </div>

          <!-- Duration Display -->
          <div 
            v-if="day.isAvailable" 
            class="pt-3 border-t border-gray-100 flex items-center justify-between"
          >
            <span class="text-sm text-gray-600">Total Hours</span>
            <span class="text-sm font-semibold text-blue-600 flex items-center gap-1">
              <Icon name="lucide:clock" class="w-4 h-4" />
              {{ calculateHours(day.startTime, day.endTime) }}
            </span>
          </div>
          <div 
            v-else 
            class="pt-3 border-t border-gray-100 text-center"
          >
            <span class="text-sm text-gray-400 flex items-center justify-center gap-1">
              <Icon name="lucide:x-circle" class="w-4 h-4" />
              Not Available
            </span>
          </div>
        </div>
      </div>
    </div>
    </ClientOnly>

    <!-- Schedule Summary -->
    <ClientOnly>
    <div class="bg-white border border-gray-200 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Schedule Summary</h3>
      <div class="flex items-center gap-8">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Icon name="lucide:calendar-check" class="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">5 days available this week</p>
            <p class="text-2xl font-bold text-gray-900">{{ availableDaysCount }} / 7</p>
          </div>
        </div>

        <div class="h-12 w-px bg-gray-200"></div>

        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Icon name="lucide:clock" class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">45 hours total hours</p>
            <p class="text-2xl font-bold text-gray-900">{{ Math.round(totalWeeklyHours) }} hours</p>
          </div>
        </div>

        <div class="ml-auto flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
          <Icon name="lucide:info" class="w-4 h-4 text-blue-600" />
          <span class="text-sm font-medium text-blue-900">Remember to save your changes!</span>
        </div>
      </div>
    </div>
    </ClientOnly>
  </div>
</template>
