<script setup lang="ts">
import { useAppointmentStore } from "@/stores/appointments"
import { usePatientProfileStore } from "@/stores/patients"
import { useStaffStore } from "@/stores/staff"
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  appointmentStatusOptions,
} from "@/types/appointments"
import type { CreateAppointment, UpdateAppointment, GetAvailableTimeSlots } from "@/types/appointments"
import { TypedForm, TypedSelect, TypedDate, TypedTime } from "@/components/app/form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/composables/useToast"

const patientStore = usePatientProfileStore()
const staffStore = useStaffStore()
const appointmentStore = useAppointmentStore()

const props = defineProps<{ appointmentId?: string }>()

type Room = {
  id: string
  status: string
  type: string
  identifier: string
  building: { id: string; name: string; createdAt: string; updatedAt: string }
  createdAt: string
  updatedAt: string
  description: string | null
  buildingId: string
  capacity: number | null
}

const availableRooms = ref<Room[]>([])
const selectedDate = ref("")
const selectedTime = ref("")
const selectedDoctorId = ref("")
const loadingRooms = ref(false)
const checkingAvailability = ref(false)
const availabilityMessage = ref("")
const isAvailable = ref(true)

const patientOptions = computed(() =>
  patientStore.patientProfiles.map((p) => ({
    label: `${p.lastName}, ${p.firstName}${p.middleName ? ` ${p.middleName}` : ""} ${p.suffix ? ` ${p.suffix}` : ""}`,
    value: p.id,
  })),
)

const doctorOptions = computed(() =>
  staffStore.staffProfiles.map((s) => ({
    label: `Dr. ${s.firstName} ${s.lastName}${s.middleName ? ` ${s.middleName}` : ""} ${s.suffix ? ` ${s.suffix}` : ""}`,
    value: s.id,
  })),
)

const facilityOptions = computed(() => availableRooms.value.map((r) => ({ label: `${r.building.name} - ${r.identifier}`, value: r.id })))

const isWithinOfficeHours = (time: string) => {
  const [h, m] = time.split(":").map(Number)
  const t = h * 60 + m
  return (t >= 480 && t < 720) || (t >= 780 && t < 1080)
}
const isValidInterval = (time: string) => Number(time.split(":")[1]) % 20 === 0

const triggerAvailabilityCheck = async () => {
  if (selectedDoctorId.value && selectedDate.value) {
    const params: GetAvailableTimeSlots = { doctorId: selectedDoctorId.value, date: selectedDate.value }
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
      availabilityMessage.value = "Appointment time must be within office hours (8:00 AM - 6:00 PM, excluding lunch 12:00 PM - 1:00 PM)"
      isAvailable.value = false
      return
    }
    if (!isValidInterval(selectedTime.value)) {
      availabilityMessage.value = "Appointments must be scheduled in 20-minute intervals (e.g., 8:00, 8:20, 8:40)"
      isAvailable.value = false
      return
    }
    const today = new Date()
    const dt = new Date(`${selectedDate.value}T${selectedTime.value}`)
    if (dt < today) {
      availabilityMessage.value = "Cannot book appointments in the past"
      isAvailable.value = false
      return
    }

    const result = await appointmentStore.checkAvailability({
      doctorId: selectedDoctorId.value,
      date: selectedDate.value,
      time: selectedTime.value,
      // ✅ Ignore self when editing (lets you update status even if booked)
      excludeAppointmentId: props.appointmentId,
    } as any)

    if (result && result.success && result.data) {
      isAvailable.value = result.data.available
      availabilityMessage.value = result.data.available ? "✓ Time slot is available" : `✗ ${result.data.reason}`
    }
  } catch (e) {
    console.error(e)
    availabilityMessage.value = "Failed to check availability"
    isAvailable.value = false
  } finally {
    checkingAvailability.value = false
  }
}

const fetchAvailableRooms = async () => {
  if (!selectedDate.value || !selectedTime.value) {
    availableRooms.value = []
    return
  }
  try {
    loadingRooms.value = true
    const { $trpc } = useNuxtApp()
    const { success, data } = await $trpc.appointments.getAvailableRooms.query({
      timestamp: new Date(`${selectedDate.value}T${selectedTime.value}`).toISOString(),
      excludeAppointmentId: props.appointmentId, // ✅ don’t block our own room
    })
    if (success && data) availableRooms.value = data
  } catch (e) {
    console.error("Failed to fetch available rooms:", e)
  } finally {
    loadingRooms.value = false
  }
}

watch([selectedDoctorId, selectedDate, selectedTime], () => {
  checkAppointmentAvailability()
  fetchAvailableRooms()
})
watch([selectedDoctorId, selectedDate], () => {
  triggerAvailabilityCheck()
})

const onSubmit = async (data: CreateAppointment | UpdateAppointment) => {
  if (!isAvailable.value) {
    useToast("error", "Appointment", availabilityMessage.value || "Selected time slot is not available")
    return
  }
  if (props.appointmentId) {
    await appointmentStore.updateAppointment({ id: props.appointmentId, ...data })
  } else {
    await appointmentStore.createAppointment(data as CreateAppointment)
  }
}

const handlePatientChange = (_: string | number) => {}
const handleDoctorChange = (v: string | number) => { selectedDoctorId.value = v as string }
const handleDateChange = (v: string | number) => { selectedDate.value = v as string }
const handleTimeChange = (v: string | number) => { selectedTime.value = v as string }

onMounted(async () => {
  await patientStore.getActivePatientProfiles({ page: 1, limit: 20 })
  await staffStore.getStaffProfiles("DOCTOR")
  if (props.appointmentId) {
    await appointmentStore.getAppointment(props.appointmentId)
    if (appointmentStore.appointment) {
      selectedDate.value = appointmentStore.appointment.date
      selectedTime.value = appointmentStore.appointment.time
      selectedDoctorId.value = appointmentStore.appointment.doctorId
      await checkAppointmentAvailability()
      await fetchAvailableRooms()
      await triggerAvailabilityCheck()
    }
  }
})
</script>

<template>
  <div class="space-y-4">
    <TypedForm
      :schema="props.appointmentId ? updateAppointmentSchema : createAppointmentSchema"
      :initial-values="props.appointmentId ? appointmentStore.appointment || {} : {}"
      @submit="onSubmit"
      class="space-y-4"
    >
      <TypedSelect name="patientId" label="Patient" :options="patientOptions" placeholder="Select Patient" @update:model-value="handlePatientChange" />
      <TypedSelect name="doctorId" label="Doctor" :options="doctorOptions" placeholder="Select Doctor" @update:model-value="handleDoctorChange" />
      <TypedDate name="date" label="Date" placeholder="Select Date" :min="new Date().toISOString().split('T')[0]" @update:model-value="handleDateChange" />

      <div class="space-y-2">
        <TypedTime name="time" label="Time" placeholder="Select Time (e.g., 08:00, 08:20, 08:40)" @update:model-value="handleTimeChange" />
        <div v-if="checkingAvailability" class="text-sm text-muted-foreground"><Icon name="mdi:loading" class="animate-spin inline mr-1" /> Checking availability...</div>
        <div v-else-if="availabilityMessage"
          :class="['text-sm p-2 rounded-md', isAvailable ? 'text-green-700 bg-green-50 border border-green-200' : 'text-red-700 bg-red-50 border border-red-200']">
          {{ availabilityMessage }}
        </div>
        <div class="text-xs text-muted-foreground p-2 bg-muted/50 rounded-md">
          <strong>Office Hours:</strong> 8:00 AM - 6:00 PM (Lunch: 12:00 PM - 1:00 PM)<br />
          <strong>Intervals:</strong> 20‑minute slots (e.g., 8:00, 8:20, 8:40)
        </div>
      </div>

      <div class="space-y-2">
        <TypedSelect name="facilityId" label="Clinic Room" :options="facilityOptions" placeholder="Select Clinic Room" />
        <p v-if="!selectedDate || !selectedTime" class="text-sm text-muted-foreground">Please select date and time first to see available rooms</p>
        <p v-else-if="loadingRooms" class="text-sm text-muted-foreground"><Icon name="mdi:loading" class="animate-spin inline mr-1" /> Loading available rooms...</p>
        <p v-else-if="availableRooms.length === 0" class="text-sm text-orange-600"><Icon name="mdi:alert" class="inline mr-1" /> No clinic rooms available for the selected date and time</p>
        <p v-else class="text-sm text-green-600"><Icon name="mdi:check-circle" class="inline mr-1" /> {{ availableRooms.length }} clinic room(s) available</p>
      </div>

      <TypedSelect name="status" label="Status" :options="appointmentStatusOptions" placeholder="Select Status" />

      <div class="flex gap-2">
        <Button type="submit" variant="outline" :disabled="!isAvailable || checkingAvailability"><Icon name="mdi:floppy" /> Save</Button>
        <Button type="button" variant="outline" @click="navigateTo('/appointments')"><Icon name="mdi:arrow-left" /> Back</Button>
      </div>
    </TypedForm>
  </div>
</template>
