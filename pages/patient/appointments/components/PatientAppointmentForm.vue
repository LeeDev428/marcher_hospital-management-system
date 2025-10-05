<script setup lang="ts">
import { useAppointmentStore } from "@/stores/appointments"
import { useStaffStore } from "@/stores/staff"
import { createPatientAppointmentSchema } from "@/types/appointments"
import type { CreatePatientAppointment, GetAvailableTimeSlots } from "@/types/appointments"
import {
  TypedForm,
  TypedSelect,
  TypedDate,
  TypedTime,
  TypedInput,
} from "@/components/app/form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/composables/useToast"

const staffStore = useStaffStore()
const appointmentStore = useAppointmentStore()

defineProps<{ appointmentId?: string }>()

/* ---------------- Helpers (normalize inputs) ---------------- */

// Convert "13/08/2025" -> "2025-08-13" (also supports "13-08-2025"); leave "2025-08-13" as-is
const toISODate = (val: string) => {
  const s = (val || "").trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/)
  if (m) {
    const d = m[1].padStart(2, "0")
    const mo = m[2].padStart(2, "0")
    const y = m[3]
    return `${y}-${mo}-${d}`
  }
  return s
}

// Convert "04:20 pm" -> "16:20", "4:20 PM" -> "16:20", "08:00" stays "08:00"
const toHHMM = (val: string) => {
  const s = (val || "").trim()
  const ampm = s.match(/^(\d{1,2}):(\d{2})\s*([ap]m)$/i)
  if (ampm) {
    let h = parseInt(ampm[1], 10)
    const m = ampm[2]
    const ap = ampm[3].toLowerCase()
    if (ap === "pm" && h < 12) h += 12
    if (ap === "am" && h === 12) h = 0
    return `${String(h).padStart(2, "0")}:${m}`
  }
  const hm = s.match(/^(\d{1,2}):(\d{2})$/)
  if (hm) return `${hm[1].padStart(2, "0")}:${hm[2]}`
  return s
}

/* ---------------- Local state ---------------- */

const selectedDoctorId = ref("")
const selectedDate = ref("")
const selectedTime = ref("")
const checkingAvailability = ref(false)
const availabilityMessage = ref("")
const isAvailable = ref(true)
const doctorSchedule = ref<any[]>([])
const loadingSchedule = ref(false)
const selectedScheduleSlot = ref<any>(null)
const selectedDay = ref<any>(null)
const availableTimeSlots = ref<string[]>([])

/* ---------------- Derived options ---------------- */

const doctorOptions = computed(() =>
  staffStore.staffProfiles.map((s) => ({
    label: `Dr. ${s.firstName} ${s.lastName}${s.middleName ? ` ${s.middleName}` : ""}${s.suffix ? ` ${s.suffix}` : ""}`,
    value: s.id,
  })),
)

const formatDayName = (day: string) => {
  return day.charAt(0) + day.slice(1).toLowerCase()
}

/* ---------------- Doctor Schedule ---------------- */

const fetchDoctorSchedule = async () => {
  if (!selectedDoctorId.value) {
    doctorSchedule.value = []
    selectedScheduleSlot.value = null
    return
  }

  try {
    loadingSchedule.value = true
    const { $trpc } = useNuxtApp()
    const response = await $trpc.schedule.getSchedule.query({ 
      staffId: selectedDoctorId.value 
    })
    
    if (response.success && response.data) {
      // Only show days where isAvailable = true
      doctorSchedule.value = response.data.filter((s: any) => s.isAvailable)
      console.log('📅 Doctor available schedule:', doctorSchedule.value)
    } else {
      doctorSchedule.value = []
    }
  } catch (error) {
    console.error('❌ Error fetching doctor schedule:', error)
    doctorSchedule.value = []
    useToast('error', 'Schedule Error', 'Failed to load doctor schedule')
  } finally {
    loadingSchedule.value = false
  }
}

// Generate 20-minute interval time slots
const generateTimeSlots = (startTime: string, endTime: string): string[] => {
  const slots: string[] = []
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)
  
  let currentMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  
  while (currentMinutes < endMinutes) {
    const hours = Math.floor(currentMinutes / 60)
    const minutes = currentMinutes % 60
    slots.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`)
    currentMinutes += 20 // 20-minute intervals
  }
  
  return slots
}

// Select a day and generate time slots
const selectDay = (schedule: any) => {
  selectedDay.value = schedule
  selectedScheduleSlot.value = null // Reset time selection
  selectedTime.value = ''
  
  // Generate 20-minute interval slots
  availableTimeSlots.value = generateTimeSlots(schedule.startTime, schedule.endTime)
  
  // Calculate next occurrence of this day
  const dayMap: Record<string, number> = {
    SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
    THURSDAY: 4, FRIDAY: 5, SATURDAY: 6
  }
  
  const today = new Date()
  const targetDay = dayMap[schedule.day]
  const currentDay = today.getDay()
  
  let daysToAdd = targetDay - currentDay
  if (daysToAdd <= 0) daysToAdd += 7 // Next week if day has passed
  
  const appointmentDate = new Date(today)
  appointmentDate.setDate(today.getDate() + daysToAdd)
  
  selectedDate.value = appointmentDate.toISOString().split('T')[0]
  
  console.log(`📅 Selected ${schedule.day} on ${selectedDate.value}`)
  console.log(`⏰ Generated ${availableTimeSlots.value.length} time slots`)
}

// Select a specific time slot
const selectTimeSlot = (time: string) => {
  selectedTime.value = time
  selectedScheduleSlot.value = {
    ...selectedDay.value,
    selectedTime: time
  }
  console.log(`✅ Selected time: ${time} on ${selectedDate.value}`)
}

/* ---------------- Availability ---------------- */

const triggerAvailabilityCheck = async () => {
  if (selectedDoctorId.value && selectedDate.value) {
    const params: GetAvailableTimeSlots = {
      doctorId: selectedDoctorId.value,
      date: selectedDate.value,
    }
    await appointmentStore.getAvailableTimeSlots(params)
  } else {
    appointmentStore.clearAvailabilityData()
  }
}

const checkAppointmentAvailability = async () => {
  // Clear previous messages
  availabilityMessage.value = ""
  isAvailable.value = true

  if (!selectedDoctorId.value || !selectedDate.value || !selectedTime.value) {
    return
  }

  try {
    checkingAvailability.value = true

    // Check if appointment is in the past
    const now = new Date()
    const sel = new Date(`${selectedDate.value}T${selectedTime.value}`)
    if (sel.getTime() <= now.getTime()) {
      availabilityMessage.value = "Cannot book appointments in the past"
      isAvailable.value = false
      checkingAvailability.value = false
      return
    }

    // Check availability via API
    const res = await appointmentStore.checkAvailability({
      doctorId: selectedDoctorId.value,
      date: selectedDate.value,
      time: selectedTime.value,
    })

    if (res?.success && res.data) {
      isAvailable.value = res.data.available
      if (!res.data.available) {
        availabilityMessage.value = res.data.reason || "Time slot is not available"
      }
    } else {
      // Don't fail silently - but don't block booking if check fails
      console.warn("Could not verify availability")
    }
  } catch (e) {
    console.error("Availability check error:", e)
    // Don't block booking if availability check fails
  } finally {
    checkingAvailability.value = false
  }
}

/* ---------------- Form submit ---------------- */

const onSubmit = async (data: CreatePatientAppointment) => {
  // Validate schedule slot selection
  if (!selectedScheduleSlot.value) {
    useToast("error", "Appointment", "Please select an available time slot from the doctor's schedule")
    return
  }

  if (!selectedDoctorId.value || !selectedDate.value || !selectedTime.value) {
    useToast("error", "Appointment", "Please select a doctor and time slot")
    return
  }

  // Ensure normalized values are submitted
  const payload: CreatePatientAppointment = {
    name: data.name?.trim() || undefined,
    doctorId: selectedDoctorId.value,
    date: selectedDate.value,
    time: selectedTime.value,
  }

  const res = await appointmentStore.bookAppointment(payload)
  if (res?.success) {
    useToast("success", "Appointment", "Your appointment has been booked and marked as PENDING.")
    navigateTo("/patient/appointments")
  } else {
    useToast("error", "Appointment", res?.message || "Failed to book appointment")
  }
}

/* ---------------- Field handlers ---------------- */

const handleDoctorChange = async (v: string | number) => {
  selectedDoctorId.value = String(v)
  selectedScheduleSlot.value = null
  selectedDay.value = null
  selectedDate.value = ''
  selectedTime.value = ''
  availableTimeSlots.value = []
  await fetchDoctorSchedule()
}

const handleDateChange = (v: string | number) => {
  selectedDate.value = toISODate(String(v))
}

const handleTimeChange = (v: string | number) => {
  selectedTime.value = toHHMM(String(v))
}

/* ---------------- Watches ---------------- */

// Only check availability after user selects a complete time slot
watch([selectedDoctorId, selectedDate, selectedTime], () => {
  // Only check if all fields are filled
  if (selectedDoctorId.value && selectedDate.value && selectedTime.value) {
    checkAppointmentAvailability()
  }
})

// Trigger availability check for time slot display
watch([selectedDoctorId, selectedDate], () => {
  if (selectedDoctorId.value && selectedDate.value) {
    triggerAvailabilityCheck()
  }
})

onMounted(async () => {
  await staffStore.getStaffProfiles("DOCTOR")
})
</script>

<template>
  <div class="space-y-4">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Book New Appointment</h2>
      <p class="text-sm text-gray-600 mt-1">
        Select your preferred doctor, date, and time. Hospital staff will assign a room and confirm your appointment.
      </p>
    </div>

    <TypedForm
      :schema="createPatientAppointmentSchema"
      @submit="onSubmit"
      class="space-y-6"
    >
      <TypedInput
        name="name"
        label="Name"
        placeholder="Enter Surname, Firstname"
        type="text"
      />

      <TypedSelect
        name="doctorId"
        label="Doctor"
        :options="doctorOptions"
        placeholder="Select Doctor"
        @update:model-value="handleDoctorChange"
      />

      <!-- Loading Schedule -->
      <div v-if="loadingSchedule" class="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-center gap-2 text-blue-700">
          <Icon name="mdi:loading" class="animate-spin" />
          <span class="text-sm">Loading doctor's schedule...</span>
        </div>
      </div>

      <!-- Doctor's Available Schedule -->
      <div v-else-if="selectedDoctorId && doctorSchedule.length > 0" class="space-y-4">
        <!-- Step 1: Select Day -->
        <div>
          <div class="flex items-center gap-2 mb-2">
            <Icon name="mdi:calendar-check" class="text-green-600" />
            <h3 class="text-sm font-semibold text-gray-900">Step 1: Choose Available Day</h3>
          </div>
          <p class="text-xs text-gray-600 mb-3">Select a day when the doctor is available</p>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <button
              v-for="schedule in doctorSchedule"
              :key="schedule.id"
              type="button"
              @click="selectDay(schedule)"
              :class="[
                'p-4 rounded-lg border-2 transition-all text-left hover:shadow-md',
                selectedDay?.id === schedule.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              ]"
            >
              <div class="flex items-center gap-2 mb-2">
                <Icon name="mdi:calendar" :class="selectedDay?.id === schedule.id ? 'text-blue-600' : 'text-gray-600'" class="w-5 h-5" />
                <p :class="[
                  'text-sm font-semibold',
                  selectedDay?.id === schedule.id ? 'text-blue-900' : 'text-gray-900'
                ]">
                  {{ schedule.day.charAt(0) + schedule.day.slice(1).toLowerCase() }}
                </p>
              </div>
              <div class="flex items-center gap-1 text-xs" :class="selectedDay?.id === schedule.id ? 'text-blue-700' : 'text-gray-600'">
                <Icon name="mdi:clock-outline" class="w-4 h-4" />
                <span>{{ schedule.startTime }} - {{ schedule.endTime }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Step 2: Select Time Slot (20-minute intervals) -->
        <div v-if="selectedDay" class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon name="mdi:clock-time-four" class="text-blue-600" />
            <h3 class="text-sm font-semibold text-gray-900">Step 2: Choose Time (20-min intervals)</h3>
          </div>
          <p class="text-xs text-gray-600">Available times on {{ selectedDay.day.charAt(0) + selectedDay.day.slice(1).toLowerCase() }}, {{ selectedDate }}</p>
          
          <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <button
              v-for="timeSlot in availableTimeSlots"
              :key="timeSlot"
              type="button"
              @click="selectTimeSlot(timeSlot)"
              :class="[
                'p-3 rounded-md border-2 transition-all text-center hover:shadow-sm font-medium text-sm',
                selectedTime === timeSlot
                  ? 'border-green-500 bg-green-50 text-green-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
              ]"
            >
              {{ timeSlot }}
            </button>
          </div>
        </div>

        <!-- Selected Appointment Summary -->
        <div v-if="selectedScheduleSlot" class="p-4 bg-green-50 rounded-lg border border-green-200">
          <div class="flex items-start gap-3">
            <Icon name="mdi:check-circle" class="text-green-600 mt-0.5 flex-shrink-0 w-6 h-6" />
            <div>
              <p class="font-semibold text-green-900 mb-1">✓ Appointment Selected</p>
              <div class="text-sm text-green-800 space-y-1">
                <p><strong>Day:</strong> {{ selectedDay.day.charAt(0) + selectedDay.day.slice(1).toLowerCase() }}</p>
                <p><strong>Date:</strong> {{ selectedDate }}</p>
                <p><strong>Time:</strong> {{ selectedTime }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Schedule Available -->
      <div v-else-if="selectedDoctorId && doctorSchedule.length === 0 && !loadingSchedule" class="p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div class="flex items-start gap-3">
          <Icon name="mdi:alert" class="text-amber-600 mt-1 flex-shrink-0" />
          <div>
            <p class="font-medium text-amber-900">No Schedule Available</p>
            <p class="text-sm text-amber-700 mt-1">This doctor has not set their availability yet. Please contact the hospital or select another doctor.</p>
          </div>
        </div>
      </div>

      <div class="space-y-2" v-if="selectedScheduleSlot">

        <!-- Appointment Guidelines -->
        <div class="text-xs text-gray-600 p-3 bg-blue-50 rounded-md border border-blue-200">
          <div class="flex items-start gap-2">
            <Icon name="mdi:information-outline" class="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p class="font-medium text-blue-900 mb-1">Appointment Booking</p>
              <p><strong>Note:</strong> Your appointment status will be "PENDING" until hospital staff assigns a room and confirms it.</p>
              <p class="mt-1">You will be notified once your appointment is confirmed.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- What happens after booking -->
      <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div class="flex items-start gap-3">
          <Icon name="mdi:calendar-clock" class="text-gray-600 mt-1 flex-shrink-0" />
          <div class="text-sm text-gray-700">
            <p class="font-medium mb-2">What happens after booking:</p>
            <ul class="space-y-1 text-sm">
              <li>• Your appointment will be marked as <span class="font-medium text-orange-600">PENDING</span></li>
              <li>• Hospital staff will assign a clinic room</li>
              <li>• You'll be notified when your appointment is <span class="font-medium text-green-600">SCHEDULED</span></li>
              <li>• You can cancel your appointment anytime before it's completed</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="flex gap-3 pt-4">
        <Button type="submit" variant="outline" :disabled="!selectedScheduleSlot">
          <Icon name="mdi:floppy" class="mr-2" /> Book Appointment
        </Button>
        <Button type="button" variant="outline" @click="navigateTo('/patient/appointments')">
          <Icon name="mdi:arrow-left" class="mr-2" /> Back to My Appointments
        </Button>
      </div>
    </TypedForm>
  </div>
</template>
