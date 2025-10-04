<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import BillingPaymentForm from "../components/BillingPaymentForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Billing", link: "/billing" },
    { label: "Payments", link: "/billing/payments" },
    { label: "New Payment", link: "/billing/payments/new" },
  ])
})
</script>

<template>
  <NuxtLayout name="staff" title="Billing">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <BillingPaymentForm />
    </div>
  </NuxtLayout>
</template>