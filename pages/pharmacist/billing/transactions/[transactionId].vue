<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import BillingTransactionForm from "../components/BillingTransactionForm.vue"
import { useRoute } from "vue-router"
import { onMounted } from "vue"

definePageMeta({
  layout: 'pharmacist',
  middleware: ['staff-type']
})

const breadcrumbsStore = useBreadcrumbsStore()
const { transactionId } = useRoute().params as { transactionId: string }

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Billing", link: "/pharmacist/billing" },
    { label: "Transactions", link: "/pharmacist/billing/transactions" },
    { label: "Transaction", link: `/pharmacist/billing/transactions/${transactionId}` },
  ])
})
</script>

<template>
  <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
    <BillingTransactionForm :transaction-id="transactionId" />
  </div>
</template>