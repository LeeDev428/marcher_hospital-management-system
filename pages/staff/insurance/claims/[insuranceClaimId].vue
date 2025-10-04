<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import InsuranceClaimForm from "../components/InsuranceClaimForm.vue"
import { useRoute } from "vue-router"
import { onMounted } from "vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { insuranceClaimId } = useRoute().params as { insuranceClaimId: string }

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Insurance", link: "/insurance" },
    { label: "Insurance Claims", link: "/insurance/claims" },
    { label: "Insurance Claim", link: `/insurance/claims/${insuranceClaimId}` },
  ])
})
</script>

<template>
  <NuxtLayout name="staff" title="Insurance">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <InsuranceClaimForm :insurance-claim-id="insuranceClaimId" />
    </div>
  </NuxtLayout>
</template>