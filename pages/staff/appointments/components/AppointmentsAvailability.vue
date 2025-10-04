<script setup lang="ts">
import { useAppointmentStore } from "@/stores/appointments"
import { useStaffStore } from "@/stores/staff"
import { Skeleton } from "@/components/ui/skeleton"

const appointmentStore = useAppointmentStore()
const staffStore = useStaffStore()

// Format time to 12-hour format
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":")
  const h = parseInt(hours, 10)
  const ampm = h >= 12 ? "PM" : "AM"
  const hour12 = h % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

const slotClass = (available: boolean) =>
  [
    "justify-center p-2 text-xs text-center rounded-md border",
    available ? "cursor-pointer hover:bg-primary/10" : "cursor-not-allowed opacity-60 bg-muted",
  ].join(" ")

onMounted(async () => {
  await staffStore.getStaffProfiles("DOCTOR")
})
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold">Doctor Availability</h2>

    <!-- Loading -->
    <div v-if="appointmentStore.checkingAvailability" class="space-y-2">
      <p class="text-sm text-muted-foreground">Checking availability...</p>
      <Skeleton v-for="i in 4" :key="i" class="h-8 w-full" />
    </div>

    <!-- Results -->
    <div v-else-if="appointmentStore.availabilityData" class="space-y-4">
      <div class="p-3 bg-muted rounded-lg">
        <h3 class="font-medium">Selected Appointment</h3>
        <p class="text-sm text-muted-foreground">
          {{
            new Date(appointmentStore.availabilityData.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }}
        </p>
      </div>

      <div
        v-if="appointmentStore.availabilityData.isFullyBooked"
        class="p-3 bg-red-50 border border-red-200 rounded-lg"
      >
        <div class="flex items-center gap-2">
          <Icon name="mdi:calendar-remove" class="text-red-500" />
          <span class="text-red-700 font-medium">
            {{
              new Date(appointmentStore.availabilityData.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            }}
            is already fully booked, try other date and time.
          </span>
        </div>
      </div>

      <div
        v-else-if="appointmentStore.availabilityData.timeSlots.some((s) => s.available)"
        class="p-3 bg-green-50 border border-green-200 rounded-lg"
      >
        <div class="flex items-center gap-2">
          <Icon name="mdi:calendar-check" class="text-green-500" />
          <span class="text-green-700 font-medium">Doctor is available on this date</span>
        </div>
      </div>

      <!-- Office Hours -->
      <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 class="font-medium text-blue-900 mb-1">Office Hours</h4>
        <p class="text-sm text-blue-700">8:00 AM - 6:00 PM (Lunch break: 12:00 PM - 1:00 PM)</p>
        <p class="text-sm text-blue-700">Appointments available in 20-minute intervals</p>
      </div>

      <!-- Time Slots -->
      <div class="space-y-3">
        <h4 class="font-medium">Available Time Slots</h4>

        <!-- Morning -->
        <div>
          <h5 class="text-sm font-medium text-muted-foreground mb-2">Morning (8:00 AM - 12:00 PM)</h5>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="slot in appointmentStore.availabilityData.timeSlots.filter((s) => {
                const hour = parseInt(s.time.split(':')[0])
                return hour >= 8 && hour < 12
              })"
              :key="slot.time"
              :class="slotClass(slot.available)"
            >
              <span class="font-mono">{{ formatTime(slot.time) }}</span>
              <span v-if="!slot.available" class="ml-1 text-[10px] opacity-75 block">
                ({{ slot.reason === 'Already booked' ? 'Booked' : 'Passed' }})
              </span>
            </div>
          </div>
        </div>

        <!-- Afternoon -->
        <div>
          <h5 class="text-sm font-medium text-muted-foreground mb-2">Afternoon (1:00 PM - 6:00 PM)</h5>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="slot in appointmentStore.availabilityData.timeSlots.filter((s) => {
                const hour = parseInt(s.time.split(':')[0])
                return hour >= 13 && hour < 18
              })"
              :key="slot.time"
              :class="slotClass(slot.available)"
            >
              <span class="font-mono">{{ formatTime(slot.time) }}</span>
              <span v-if="!slot.available" class="ml-1 text-[10px] opacity-75 block">
                ({{ slot.reason === 'Already booked' ? 'Booked' : 'Passed' }})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="p-4 bg-muted/50 rounded-lg text-center">
      <Icon name="mdi:information-outline" class="mx-auto mb-2 text-muted-foreground" size="24" />
      <p class="text-sm text-muted-foreground">Select a doctor and date in the form to view availability</p>
    </div>
  </div>
</template>
