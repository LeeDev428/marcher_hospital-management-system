<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import MedicalRecordForm from "./components/MedicalRecordForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { recordId } = useRoute().params as { recordId: string }

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Medical Records", link: "/patient" },
    { label: "Medical Record Request", link: `/medical-records/${recordId}` },
  ])
})
</script>

<template>
  <NuxtLayout name="patient" title="Medical Record Request">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <MedicalRecordForm :record-id="recordId" />
    </div>
  </NuxtLayout>
</template>