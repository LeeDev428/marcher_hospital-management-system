<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import BillingTransactionItemForm from "../components/BillingTransactionItemForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Billing", link: "/billing" },
    { label: "Transaction Items", link: "/billing/transaction-items" },
    { label: "New Transaction Item", link: "/billing/transaction-items/new" },
  ])
})
</script>

<template>
  <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <BillingTransactionItemForm />
    </div></template>
