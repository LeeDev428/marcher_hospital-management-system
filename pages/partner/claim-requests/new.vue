<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import ClaimRequestForm from "../components/ClaimRequestForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Partners", link: "/partner" },
    { label: "Claim Requests", link: "/partner/claim-requests" },
    { label: "New Claim Request", link: "/partner/claim-requests/new" },
  ])
})
</script>

<template>
  <NuxtLayout name="partner" title="New Claim Request">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <ClaimRequestForm />
    </div>
  </NuxtLayout>
</template>