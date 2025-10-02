<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useBreadcrumbsStore } from "@/stores/app"
import { Button } from "@/components/ui/button"
import MedicalRecordsTable from "./components/MedicalRecordsTable.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const recordsTableRef = ref()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Medical Records", link: "/patient/medical-records" },
  ])
})

const search = computed({
  get: () => recordsTableRef.value?.search || "",
  set: (v: string) => {
    if (recordsTableRef.value) recordsTableRef.value.search = v
  }
})

function clearSearch() {
  recordsTableRef.value?.clearSearch()
}
</script>

<template>
  <NuxtLayout name="patient" title="Medical Records">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <div class="w-full flex gap-2 justify-between">
        <div class="relative max-w-xs">
          <input
            v-model="search"
            type="text"
            placeholder="Search patient or record type..."
            class="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300 bg-white"
            @keydown.esc.prevent="clearSearch"
          >
          <button
            v-if="search"
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 text-sm text-gray-600 hover:bg-gray-100"
            @click="clearSearch"
          >✕</button>
        </div>
        <NuxtLink to="/patient/medical-records/new">
          <Button variant="outline" size="icon">
            <Icon name="mdi:plus" />
          </Button>
        </NuxtLink>
      </div>
      <MedicalRecordsTable ref="recordsTableRef" />
    </div>
  </NuxtLayout>
</template>
