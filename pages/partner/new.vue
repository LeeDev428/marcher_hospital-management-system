<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PartnerForm from "./components/PartnerForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Partners", link: "/partner" },
    { label: "New Partner", link: "/partner/new" },
  ])
})
</script>

<template>
  <NuxtLayout name="partner" title="New Partner">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <PartnerForm />
    </div>
  </NuxtLayout>
</template>