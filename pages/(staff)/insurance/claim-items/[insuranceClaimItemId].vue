<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import InsuranceClaimItemsForm from "../components/InsuranceClaimItemForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { insuranceClaimItemId } = useRoute().params as { insuranceClaimItemId: string }

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Insurance", link: "/insurance" },
    { label: "Insurance Claim Items", link: "/insurance/claim-items" },
    { label: "Insurance Claim Item", link: `/insurance/claim-items/${insuranceClaimItemId}` },
  ])
})
</script>

<template>
  <NuxtLayout name="staff" title="Insurance">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <InsuranceClaimItemsForm :insurance-claim-item-id="insuranceClaimItemId" />
    </div>
  </NuxtLayout>
</template>