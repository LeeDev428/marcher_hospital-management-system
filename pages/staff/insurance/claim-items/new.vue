<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import InsuranceClaimItemForm from "../components/InsuranceClaimItemForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Insurance", link: "/insurance" },
    { label: "Insurance Claim Items", link: "/insurance/claim-items" },
    { label: "New Insurance Claim Item", link: "/insurance/claim-items/new" },
  ])
})
</script>

<template>
  <NuxtLayout name="staff" title="Insurance">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <InsuranceClaimItemForm />
    </div>
  </NuxtLayout>
</template>