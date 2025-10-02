<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import DataRequestForm from "../components/DataRequestForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Partners", link: "/partner" },
    { label: "Data Requests", link: "/partner/data-requests" },
    { label: "New Data Request", link: "/partner/data-requests/new" },
  ])
})
</script>

<template>
  <NuxtLayout name="partner" title="New Data Request">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <DataRequestForm />
    </div>
  </NuxtLayout>
</template>