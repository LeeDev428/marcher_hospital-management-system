<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useBreadcrumbsStore } from "@/stores/app"
import { Button } from "@/components/ui/button"
import DoctorTable from "./components/DoctorTable.vue"

const breadcrumbsStore = useBreadcrumbsStore()


onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Doctors Directory", link: "/doctors" },
  ])
})

// Connect the search input to the table's search functionality

</script>

<template>
  <!-- Reuse the same layout for consistency; change if you have a dedicated doctors layout -->
  <NuxtLayout name="patient" title="Doctors Directory">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <DoctorTable />
    </div>
  </NuxtLayout>
</template>
