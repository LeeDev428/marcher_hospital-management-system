<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import BillingTransactionItemForm from "../components/BillingTransactionItemForm.vue"
import { useRoute } from "vue-router"
import { onMounted } from "vue"

definePageMeta({
  layout: 'pharmacist',
  middleware: ['staff-type']
})

const breadcrumbsStore = useBreadcrumbsStore()
const { transactionItemId } = useRoute().params as { transactionItemId: string }

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Billing", link: "/pharmacist/billing" },
    { label: "Transaction Items", link: "/pharmacist/billing/transaction-items" },
    { label: "Transaction Item", link: `/pharmacist/billing/transaction-items/${transactionItemId}` },
  ])
})
</script>

<template>
  <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
    <BillingTransactionItemForm :transaction-item-id="transactionItemId" />
  </div>
</template>