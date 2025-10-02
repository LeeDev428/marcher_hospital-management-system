<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import AppointmentsTable from "./components/AppointmentsTable.vue"
import AppointmentFilters from "./components/AppointmentFilters.vue"
import { refDebounced } from "@vueuse/core"

const breadcrumbsStore = useBreadcrumbsStore()

// Search functionality
const searchQuery = ref("")
const debouncedSearch = refDebounced(searchQuery, 300)

// Watch for search changes
watch(debouncedSearch, () => {
  // You can implement text search here if needed
  // For now, we'll focus on the filters
})

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Appointments", link: "/appointments" },
  ])
})
</script>

<template> 
  <NuxtLayout name="staff" title="Appointments">

    <!-- Table and Filters in a Row -->
    <div class="h-full w-full flex gap-4">
      <div class="flex-1 bg-white p-4 rounded-lg gap-2">
        <!-- Header Row -->
        <div class="w-full flex justify-end">
          <NuxtLink to="/appointments/new">
            <Button variant="outline">
              <Icon name="mdi:calendar" /> Book Appointment
            </Button>
          </NuxtLink>
        </div>

        <!-- Appointments Table -->
        <AppointmentsTable />
      </div>

      <!-- Filters on the right -->
      <div class="w-[300px] bg-white p-4 rounded-lg">
        <AppointmentFilters />
      </div>
    </div>
  </NuxtLayout>
</template>