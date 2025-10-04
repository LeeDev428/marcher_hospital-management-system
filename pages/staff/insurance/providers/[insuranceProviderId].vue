<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import InsuranceProviderForm from "../components/InsuranceProviderForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { insuranceProviderId } = useRoute().params as { insuranceProviderId: string }

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Insurance", link: "/insurance" },
    { label: "Insurance Providers", link: "/insurance/providers" },
    { label: "Insurance Provider", link: `/insurance/providers/${insuranceProviderId}` },
  ])
})
</script>

<template>
  <NuxtLayout name="staff" title="Insurance">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <InsuranceProviderForm :insurance-provider-id="insuranceProviderId" />
    </div>
  </NuxtLayout>
</template>