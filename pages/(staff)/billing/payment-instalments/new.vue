<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import BillingPaymentInstalmentForm from "../components/BillingPaymentInstalmentForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Billing", link: "/billing" },
    { label: "Payment Instalments", link: "/billing/payment-instalments" },
    { label: "New Payment Instalment", link: "/billing/payment-instalments/new" },
  ])
})
</script>

<template>
  <NuxtLayout name="staff" title="Billing">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <BillingPaymentInstalmentForm />
    </div>
  </NuxtLayout>
</template>