<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import BillingPaymentForm from "../components/BillingPaymentForm.vue"
import { useRoute } from "vue-router"
import { onMounted } from "vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { paymentId } = useRoute().params as { paymentId: string }

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Billing", link: "/billing" },
    { label: "Payments", link: "/billing/payments" },
    { label: "Payment", link: `/billing/payments/${paymentId}` },
  ])
})
</script>

<template>
  <NuxtLayout name="staff" title="Billing">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <BillingPaymentForm :payment-id="paymentId" />
    </div>
  </NuxtLayout>
</template>