<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import BillingTransactionForm from "../components/BillingTransactionForm.vue"
import { useRoute } from "vue-router"
import { onMounted } from "vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { transactionId } = useRoute().params as { transactionId: string }

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Billing", link: "/billing" },
    { label: "Transactions", link: "/billing/transactions" },
    { label: "Transaction", link: `/billing/transactions/${transactionId}` },
  ])
})
</script>

<template>
  <NuxtLayout name="staff" title="Billing">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <BillingTransactionForm :transaction-id="transactionId" />
    </div>
  </NuxtLayout>
</template>