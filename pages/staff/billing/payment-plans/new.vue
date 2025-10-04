<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import BillingPaymentPlanForm from "../components/BillingPaymentPlanForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Billing", link: "/billing" },
    { label: "Payment Plans", link: "/billing/payment-plans" },
    { label: "New Payment Plan", link: "/billing/payment-plans/new" },
  ])
})
</script>

<template>
  <NuxtLayout name="staff" title="Billing">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <BillingPaymentPlanForm />
    </div>
  </NuxtLayout>
</template>