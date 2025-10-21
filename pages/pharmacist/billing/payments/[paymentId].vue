<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import BillingPaymentForm from "../components/BillingPaymentForm.vue"
import { useRoute } from "vue-router"
import { onMounted } from "vue"

definePageMeta({
  layout: 'pharmacist',
  middleware: ['staff-type']
})

const breadcrumbsStore = useBreadcrumbsStore()
const { paymentId } = useRoute().params as { paymentId: string }

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Billing", link: "/pharmacist/billing" },
    { label: "Payments", link: "/pharmacist/billing/payments" },
    { label: "Payment", link: `/pharmacist/billing/payments/${paymentId}` },
  ])
})
</script>

<template>
  <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
    <BillingPaymentForm :payment-id="paymentId" />
  </div>
</template>