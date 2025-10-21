<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import BillingPaymentInstalmentForm from "../components/BillingPaymentInstalmentForm.vue"
import { useRoute } from "vue-router"
import { onMounted } from "vue"

definePageMeta({
  layout: 'pharmacist',
  middleware: ['staff-type']
})

const breadcrumbsStore = useBreadcrumbsStore()
const { paymentInstalmentId } = useRoute().params as { paymentInstalmentId: string }

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Billing", link: "/pharmacist/billing" },
    { label: "Payment Instalments", link: "/pharmacist/billing/payment-instalments" },
    { label: "Payment Instalment", link: `/pharmacist/billing/payment-instalments/${paymentInstalmentId}` },
  ])
})
</script>

<template>
  <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
    <BillingPaymentInstalmentForm :payment-instalment-id="paymentInstalmentId" />
  </div>
</template>