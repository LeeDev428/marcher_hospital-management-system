<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import MedicalRecordForm from "./components/MedicalRecordForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Medical Records", link: "/patient/medical-records" },
    { label: "New Medical Record Request", link: "/patient/medical-records/new" },
  ])
})
</script>

<template>
  <NuxtLayout name="patient" title="New Medical Record Request">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <MedicalRecordForm />
    </div>
  </NuxtLayout>
</template>