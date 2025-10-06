<script setup lang="ts">
import { useAppointmentStore } from "@/stores/appointments"
import { useStaffStore } from "@/stores/staff"
import { useMedicalServiceStore } from "@/stores/medical-services/useMedicalServiceStore"
import { createPatientAppointmentSchema } from "@/types/appointments"
import type { CreatePatientAppointment } from "@/types/appointments"
import type { TableMedicalService } from "@/types/medical-services"
import {
  TypedForm,
  TypedInput,
} from "@/components/app/form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import PatientPagination from "@/pages/patient/components/PatientPagination.vue"
import { useToast } from "@/composables/useToast"

const staffStore = useStaffStore()
const appointmentStore = useAppointmentStore()
const medicalServiceStore = useMedicalServiceStore()

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

const selectedServiceId = ref<string>("")
const selectedDoctorId = ref("")
const selectedDate = ref("")
const selectedTime = ref("")
const doctorSchedule = ref<any[]>([])
const loadingSchedule = ref(false)
const selectedScheduleSlot = ref<any>(null)
const selectedDay = ref<any>(null)
const availableTimeSlots = ref<string[]>([])

// Filter states
const doctorSearchQuery = ref("")
const serviceSearchQuery = ref("")
const currentPage = ref(1)
const itemsPerPage = 20

// Form data
const patientName = ref("")

/* ---------------- Computed ---------------- */

const allServices = computed(() => medicalServiceStore.medicalServices.filter(s => s.isActive))
const loadingServices = computed(() => medicalServiceStore.loading)

const selectedService = computed(() => 
  allServices.value.find(s => s.id === selectedServiceId.value)
)

const allDoctors = computed(() => staffStore.staffProfiles)

// Filtered services based on search
const filteredServices = computed(() => {
  let filtered = allServices.value

  // Filter by doctor name
  if (doctorSearchQuery.value.trim()) {
    const query = doctorSearchQuery.value.toLowerCase()
    filtered = filtered.filter(s => {
      if (!s.staff) return false
      const fullName = `${s.staff.firstName} ${s.staff.lastName} ${s.staff.middleName || ''}`.toLowerCase()
      return fullName.includes(query)
    })
  }

  // Filter by service name
  if (serviceSearchQuery.value.trim()) {
    const query = serviceSearchQuery.value.toLowerCase()
    filtered = filtered.filter(s => s.name.toLowerCase().includes(query))
  }

  return filtered
})

// Paginated services
const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredServices.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredServices.value.length / itemsPerPage))

const handlePageChange = (page: number) => {
  currentPage.value = page
}

/* ---------------- Format helpers ---------------- */

const formatPrice = (price: string) => {
  return `₱${parseFloat(price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatDuration = (duration: number) => {
  if (duration < 60) return `${duration} mins`
  const hours = Math.floor(duration / 60)
  const mins = duration % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

const formatServiceType = (type: string) => {
  return type.split('_').map(word => 
    word.charAt(0) + word.slice(1).toLowerCase()
  ).join(' ')
}

/* ---------------- Service Selection ---------------- */

const selectService = async (service: TableMedicalService) => {
  selectedServiceId.value = service.id
  selectedDoctorId.value = service.staffId
  selectedScheduleSlot.value = null
  selectedDay.value = null
  selectedDate.value = ''
  selectedTime.value = ''
  availableTimeSlots.value = []
  await fetchDoctorSchedule()
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

/* ---------------- Form submit ---------------- */

const onSubmit = async () => {
  // Validate service selection
  if (!selectedServiceId.value) {
    useToast("error", "Appointment", "Please select a medical service")
    return
  }

  // Validate schedule slot selection
  if (!selectedScheduleSlot.value) {
    useToast("error", "Appointment", "Please select an available time slot from the doctor's schedule")
    return
  }

  if (!selectedDoctorId.value || !selectedDate.value || !selectedTime.value) {
    useToast("error", "Appointment", "Please select a doctor and time slot")
    return
  }

  if (!patientName.value.trim()) {
    useToast("error", "Appointment", "Please enter your name")
    return
  }

  // Build the payload matching the schema exactly
  const payload: CreatePatientAppointment = {
    name: patientName.value.trim(),
    doctorId: selectedDoctorId.value,
    date: selectedDate.value,
    time: selectedTime.value,
  }

  console.log("📤 Submitting appointment:", payload)

  const res = await appointmentStore.bookAppointment(payload)
  if (res?.success) {
    useToast("success", "Appointment", "Your appointment has been booked and marked as PENDING.")
    navigateTo("/patient/appointments")
  } else {
    useToast("error", "Appointment", res?.message || "Failed to book appointment")
  }
}

/* ---------------- Lifecycle ---------------- */

onMounted(async () => {
  await staffStore.getStaffProfiles("DOCTOR")
  await medicalServiceStore.getMedicalServices({ page: 1, limit: 100, isActive: true })
})
</script>

<template>
  <div class="space-y-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Book New Appointment</h2>
      <p class="text-sm text-gray-600 mt-1">
        Select a medical service, then choose your preferred date and time. Hospital staff will assign a room and confirm your appointment.
      </p>
    </div>

    <!-- Main Layout: Full Width / Landscape -->
    <div class="space-y-6">
      
      <!-- Step 1: Select Medical Service -->
      <div class="bg-white rounded-lg border-2 border-gray-200 p-4">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
          <h3 class="text-base font-bold text-gray-900">Select Medical Service</h3>
        </div>
        <p class="text-xs text-gray-600 mb-4">Choose the service you need</p>

        <!-- Search Filters -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label class="text-xs font-medium text-gray-700 mb-1 block">Search by Doctor Name</label>
            <Input
              v-model="doctorSearchQuery"
              placeholder="e.g., Dr. Smith"
              class="h-9 text-sm"
            />
          </div>
          <div>
            <label class="text-xs font-medium text-gray-700 mb-1 block">Search by Service Name</label>
            <Input
              v-model="serviceSearchQuery"
              placeholder="e.g., Consultation"
              class="h-9 text-sm"
            />
          </div>
        </div>

        <!-- Loading Services -->
        <div v-if="loadingServices" class="p-8 text-center">
          <Icon name="mdi:loading" class="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p class="text-sm text-gray-600">Loading medical services...</p>
        </div>

        <!-- Services Grid -->
        <div v-else-if="paginatedServices.length > 0" class="space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <button
              v-for="service in paginatedServices"
              :key="service.id"
              type="button"
              @click="selectService(service)"
              :class="[
                'p-3 rounded-md border-2 transition-all text-left hover:shadow-md',
                selectedServiceId === service.id
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              ]"
            >
              <div class="space-y-2">
                <!-- Service Name & Icon -->
                <div>
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <h4 :class="[
                      'font-semibold text-sm',
                      selectedServiceId === service.id ? 'text-blue-900' : 'text-gray-900'
                    ]">
                      {{ service.name }}
                    </h4>
                    <Icon 
                      v-if="selectedServiceId === service.id" 
                      name="mdi:check-circle" 
                      class="text-blue-600 w-5 h-5 flex-shrink-0" 
                    />
                  </div>
                  <Badge variant="outline" class="text-xs py-0 px-2 h-5">
                    {{ formatServiceType(service.type) }}
                  </Badge>
                </div>

                <!-- Description -->
                <p v-if="service.description" class="text-xs text-gray-600 line-clamp-1">
                  {{ service.description }}
                </p>

                <!-- Doctor -->
                <div class="flex items-center gap-1 text-xs text-gray-700">
                  <Icon name="mdi:doctor" class="w-3.5 h-3.5" />
                  <span v-if="service.staff" class="truncate">
                    Dr. {{ service.staff.firstName }} {{ service.staff.lastName }}
                  </span>
                </div>

                <!-- Price & Duration -->
                <div class="flex items-center justify-between pt-1.5 border-t border-gray-200">
                  <div class="flex items-center gap-1 text-green-700 font-semibold text-xs">
                    <Icon name="mdi:cash" class="w-3.5 h-3.5" />
                    {{ formatPrice(service.price) }}
                  </div>
                  <div class="flex items-center gap-1 text-gray-600 text-xs">
                    <Icon name="mdi:clock-outline" class="w-3.5 h-3.5" />
                    {{ formatDuration(service.duration) }}
                  </div>
                </div>
              </div>
            </button>
          </div>

          <!-- Pagination -->
          <PatientPagination
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-items="filteredServices.length"
            :items-per-page="itemsPerPage"
            @page-change="handlePageChange"
          />
        </div>

        <!-- No Services -->
        <div v-else class="p-8 text-center">
          <Icon name="mdi:alert-circle-outline" class="text-4xl text-gray-300 mx-auto mb-3" />
          <p class="text-sm text-gray-600">
            {{ doctorSearchQuery || serviceSearchQuery ? 'No services match your search' : 'No active medical services available at the moment.' }}
          </p>
        </div>
      </div>

      <!-- Step 2: Select Date & Time (Only show if service is selected) -->
      <div v-if="selectedServiceId" class="bg-white rounded-lg border-2 border-gray-200 p-4">
        <form @submit.prevent="onSubmit" class="space-y-4">
          <!-- Patient Name -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <h3 class="text-base font-bold text-gray-900">Enter Your Details</h3>
            </div>

            <div class="space-y-1.5">
              <label for="patientName" class="text-sm font-medium text-gray-700">Full Name</label>
              <Input
                id="patientName"
                v-model="patientName"
                placeholder="Enter Surname, Firstname"
                required
                class="h-9 text-sm"
              />
              <p class="text-xs text-gray-500">Enter your full name as it appears on your ID</p>
            </div>
          </div>

          <!-- Doctor Auto-Selected -->
          <div v-if="selectedService" class="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-center gap-3">
              <Icon name="mdi:doctor" class="text-blue-600 w-6 h-6" />
              <div>
                <p class="text-sm font-medium text-blue-900">Assigned Doctor</p>
                <p class="text-sm text-blue-700">
                  <span v-if="selectedService.staff">
                    Dr. {{ selectedService.staff.firstName }} {{ selectedService.staff.lastName }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Loading Schedule -->
          <div v-if="loadingSchedule" class="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-center gap-2 text-blue-700">
              <Icon name="mdi:loading" class="animate-spin" />
              <span class="text-sm">Loading doctor's schedule...</span>
            </div>
          </div>

          <!-- Step 3: Doctor's Available Schedule -->
          <div v-else-if="selectedDoctorId && doctorSchedule.length > 0" class="space-y-6">
            <!-- Step 3A: Select Day -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <div class="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <h3 class="text-base font-bold text-gray-900">Choose Available Day</h3>
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

            <!-- Step 3B: Select Time Slot (20-minute intervals) -->
            <div v-if="selectedDay" class="space-y-3">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <h3 class="text-base font-bold text-gray-900">Choose Time (20-min intervals)</h3>
              </div>
              <p class="text-xs text-gray-600 mb-3">Available times on {{ selectedDay.day.charAt(0) + selectedDay.day.slice(1).toLowerCase() }}, {{ selectedDate }}</p>
          
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
            <div v-if="selectedScheduleSlot" class="p-4 bg-green-50 rounded-lg border-2 border-green-500">
              <div class="flex items-start gap-3">
                <Icon name="mdi:check-circle" class="text-green-600 mt-0.5 flex-shrink-0 w-6 h-6" />
                <div class="flex-1">
                  <p class="font-bold text-green-900 mb-3 text-lg">✓ Appointment Ready to Book</p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-green-700 font-medium mb-1">SERVICE</p>
                      <p class="text-sm text-green-900 font-semibold">{{ selectedService?.name }}</p>
                      <p class="text-xs text-green-700">{{ formatPrice(selectedService?.price || '0') }} • {{ formatDuration(selectedService?.duration || 0) }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-green-700 font-medium mb-1">APPOINTMENT</p>
                      <p class="text-sm text-green-900 font-semibold">{{ selectedDay.day.charAt(0) + selectedDay.day.slice(1).toLowerCase() }}, {{ selectedDate }}</p>
                      <p class="text-xs text-green-700">{{ selectedTime }}</p>
                    </div>
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
                <p class="text-sm text-amber-700 mt-1">This doctor has not set their availability yet. Please contact the hospital or select another service.</p>
              </div>
            </div>
          </div>

          <!-- Important Notes -->
          <div v-if="selectedScheduleSlot" class="space-y-4">
            <!-- Appointment Guidelines -->
            <div class="text-sm text-gray-700 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-start gap-3">
                <Icon name="mdi:information-outline" class="text-blue-600 mt-0.5 flex-shrink-0 w-5 h-5" />
                <div>
                  <p class="font-semibold text-blue-900 mb-2">Appointment Booking Process</p>
                  <ul class="space-y-1 text-sm">
                    <li>• Your appointment will be marked as <span class="font-medium text-orange-600">PENDING</span></li>
                    <li>• Hospital staff will assign a clinic room</li>
                    <li>• You'll be notified when your appointment is <span class="font-medium text-green-600">SCHEDULED</span></li>
                    <li>• You can cancel your appointment anytime before it's completed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <Button type="submit" :disabled="!selectedScheduleSlot || !patientName.trim()" class="flex-1 md:flex-none">
              <Icon name="mdi:calendar-check" class="mr-2" /> Book Appointment
            </Button>
            <Button type="button" variant="outline" @click="navigateTo('/patient/appointments')">
              <Icon name="mdi:arrow-left" class="mr-2" /> Cancel
            </Button>
          </div>
        </form>
      </div>

      <!-- Select Service First Message -->
      <div v-else class="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <Icon name="mdi:arrow-up" class="text-4xl text-gray-400 mx-auto mb-4" />
        <p class="text-gray-600 font-medium">Please select a medical service above to continue</p>
      </div>
    </div>
  </div>
</template>
