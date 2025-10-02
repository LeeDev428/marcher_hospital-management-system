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

/* ---------------- Derived options ---------------- */

const doctorOptions = computed(() =>
  staffStore.staffProfiles.map((s) => ({
    label: `Dr. ${s.firstName} ${s.lastName}${s.middleName ? ` ${s.middleName}` : ""}${s.suffix ? ` ${s.suffix}` : ""}`,
    value: s.id,
  })),
)

/* ---------------- Business rules ---------------- */

const isWithinOfficeHours = (time: string): boolean => {
  const [hS, mS] = time.split(":")
  const h = Number(hS), m = Number(mS)
  const t = h * 60 + m
  const morning = t >= 480 && t < 720    // 08:00–12:00
  const afternoon = t >= 780 && t < 1080 // 13:00–18:00
  return morning || afternoon
}

const isValidInterval = (time: string): boolean => {
  const minutes = Number(time.split(":")[1] || 0)
  return minutes % 20 === 0
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
  if (!selectedDoctorId.value || !selectedDate.value || !selectedTime.value) {
    availabilityMessage.value = ""
    isAvailable.value = true
    return
  }

  try {
    checkingAvailability.value = true

    if (!isWithinOfficeHours(selectedTime.value)) {
      availabilityMessage.value =
        "Appointment time must be within office hours (8:00 AM - 6:00 PM, excluding lunch 12:00 PM - 1:00 PM)"
      isAvailable.value = false
      return
    }

    if (!isValidInterval(selectedTime.value)) {
      availabilityMessage.value =
        "Appointments must be scheduled in 20-minute intervals (e.g., 8:00, 8:20, 8:40)"
      isAvailable.value = false
      return
    }

    // No past times
    const now = new Date()
    const sel = new Date(`${selectedDate.value}T${selectedTime.value}`)
    if (sel.getTime() <= now.getTime()) {
      availabilityMessage.value = "Cannot book appointments in the past"
      isAvailable.value = false
      return
    }

    const res = await appointmentStore.checkAvailability({
      doctorId: selectedDoctorId.value,
      date: selectedDate.value,
      time: selectedTime.value,
    })

    if (res?.success && res.data) {
      isAvailable.value = res.data.available
      availabilityMessage.value = res.data.available ? "✓ Time slot is available" : `✗ ${res.data.reason}`
    } else {
      isAvailable.value = false
      availabilityMessage.value = "Failed to check availability"
    }
  } catch (e) {
    console.error(e)
    isAvailable.value = false
    availabilityMessage.value = "Failed to check availability"
  } finally {
    checkingAvailability.value = false
  }
}

/* ---------------- Form submit ---------------- */

const onSubmit = async (data: CreatePatientAppointment) => {
  // Ensure normalized values are submitted
  const payload: CreatePatientAppointment = {
    name: data.name?.trim() || undefined,
    doctorId: selectedDoctorId.value || data.doctorId,
    date: selectedDate.value || toISODate(data.date as any),
    time: selectedTime.value || toHHMM(data.time as any),
  }

  if (!isAvailable.value) {
    useToast("error", "Appointment", availabilityMessage.value || "Selected time slot is not available")
    return
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

const handleDoctorChange = (v: string | number) => {
  selectedDoctorId.value = String(v)
}

const handleDateChange = (v: string | number) => {
  selectedDate.value = toISODate(String(v))
}

const handleTimeChange = (v: string | number) => {
  selectedTime.value = toHHMM(String(v))
}

/* ---------------- Watches ---------------- */

watch([selectedDoctorId, selectedDate, selectedTime], () => {
  checkAppointmentAvailability()
})
watch([selectedDoctorId, selectedDate], () => {
  triggerAvailabilityCheck()
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

      <TypedDate
        name="date"
        label="Preferred Date"
        placeholder="Select Date"
        :min="new Date().toISOString().split('T')[0]"
        @update:model-value="handleDateChange"
      />

      <div class="space-y-2">
        <TypedTime
          name="time"
          label="Preferred Time"
          placeholder="Select Time (e.g., 08:00, 08:20, 08:40)"
          @update:model-value="handleTimeChange"
        />

        <!-- Availability -->
        <div v-if="checkingAvailability" class="text-sm text-muted-foreground">
          <Icon name="mdi:loading" class="animate-spin inline mr-1" />
          Checking availability...
        </div>

        <div
          v-else-if="availabilityMessage"
          :class="[
            'text-sm p-3 rounded-md border',
            isAvailable
              ? 'text-green-800 bg-green-50 border-green-200'
              : 'text-red-800 bg-red-50 border-red-200'
          ]"
        >
          {{ availabilityMessage }}
        </div>

        <!-- Office Hours note -->
        <div class="text-xs text-gray-600 p-3 bg-blue-50 rounded-md border border-blue-200">
          <div class="flex items-start gap-2">
            <Icon name="mdi:information-outline" class="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p class="font-medium text-blue-900 mb-1">Office Hours & Appointment Guidelines</p>
              <p><strong>Hours:</strong> 8:00 AM - 6:00 PM (Lunch break: 12:00 PM - 1:00 PM)</p>
              <p><strong>Intervals:</strong> Appointments every 20 minutes (e.g., 8:00, 8:20, 8:40)</p>
              <p><strong>Note:</strong> Your appointment status will be "PENDING" until hospital staff assigns a room and confirms it.</p>
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
        <Button type="submit" variant="outline" :disabled="!isAvailable || checkingAvailability">
          <Icon name="mdi:floppy" class="mr-2" /> Save
        </Button>
        <Button type="button" variant="outline" @click="navigateTo('/patient/appointments')">
          <Icon name="mdi:arrow-left" class="mr-2" /> Back to My Appointments
        </Button>
      </div>
    </TypedForm>
  </div>
</template>
