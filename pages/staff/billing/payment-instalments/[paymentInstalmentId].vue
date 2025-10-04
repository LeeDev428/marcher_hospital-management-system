<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import BillingPaymentInstalmentForm from "../components/BillingPaymentInstalmentForm.vue"
import { useRoute } from "vue-router"
import { onMounted } from "vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { paymentInstalmentId } = useRoute().params as { paymentInstalmentId: string }

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Billing", link: "/billing" },
    { label: "Payment Instalments", link: "/billing/payment-instalments" },
    { label: "Payment Instalment", link: `/billing/payment-instalments/${paymentInstalmentId}` },
  ])
})
</script>

<template>
  <NuxtLayout name="staff" title="Billing">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <BillingPaymentInstalmentForm :payment-instalment-id="paymentInstalmentId" />
    </div>
  </NuxtLayout>
</template>