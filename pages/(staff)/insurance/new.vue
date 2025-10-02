<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import InsuranceClaimForm from "./components/InsuranceClaimForm.vue"
import { onMounted } from "vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Insurance", link: "/insurance" },
    { label: "New Insurance Claim", link: "/insurance/new" },
  ])
})
</script>

<template>
  <NuxtLayout name="staff" title="Insurance">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg overflow-y-auto">
      <InsuranceClaimForm />
    </div>
  </NuxtLayout>
</template>