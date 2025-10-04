<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import InsuranceProviderForm from "../components/InsuranceProviderForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Insurance", link: "/insurance" },
    { label: "Insurance Providers", link: "/insurance/providers" },
    { label: "New Insurance Provider", link: "/insurance/providers/new" },
  ])
})
</script>

<template>
  <NuxtLayout name="staff" title="Insurance">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <InsuranceProviderForm />
    </div>
  </NuxtLayout>
</template>