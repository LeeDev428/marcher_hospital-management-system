<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import InsuranceClaimForm from "../components/InsuranceClaimForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Insurance", link: "/insurance" },
    { label: "Insurance Claims", link: "/insurance/claims" },
    { label: "New Insurance Claim", link: "/insurance/claims/new" },
  ])
})
</script>

<template>
  <NuxtLayout name="staff" title="Insurance">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <InsuranceClaimForm />
    </div>
  </NuxtLayout>
</template>