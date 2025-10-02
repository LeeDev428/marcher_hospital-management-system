<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import BillingTransactionForm from "../components/BillingTransactionForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Billing", link: "/billing" },
    { label: "Transactions", link: "/billing/transactions" },
    { label: "New Transaction", link: "/billing/transactions/new" },
  ])
})
</script>

<template>
  <NuxtLayout name="staff" title="Billing">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <BillingTransactionForm />
    </div>
  </NuxtLayout>
</template>