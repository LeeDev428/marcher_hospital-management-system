<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import BillingPaymentPlanForm from "../components/BillingPaymentPlanForm.vue"
import { useRoute } from "vue-router"
import { onMounted } from "vue"

definePageMeta({
  layout: 'pharmacist',
  middleware: ['staff-type']
})

const breadcrumbsStore = useBreadcrumbsStore()
const { paymentPlanId } = useRoute().params as { paymentPlanId: string }

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Billing", link: "/pharmacist/billing" },
    { label: "Payment Plans", link: "/pharmacist/billing/payment-plans" },
    { label: "Payment Plan", link: `/pharmacist/billing/payment-plans/${paymentPlanId}` },
  ])
})
</script>

<template>
  <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
    <BillingPaymentPlanForm :payment-plan-id="paymentPlanId" />
  </div>
</template>