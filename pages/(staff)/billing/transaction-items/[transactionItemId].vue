<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import BillingTransactionItemForm from "../components/BillingTransactionItemForm.vue"
import { useRoute } from "vue-router"
import { onMounted } from "vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { transactionItemId } = useRoute().params as { transactionItemId: string }

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Billing", link: "/billing" },
    { label: "Transaction Items", link: "/billing/transaction-items" },
    { label: "Transaction Item", link: `/billing/transaction-items/${transactionItemId}` },
  ])
})
</script>

<template>
  <NuxtLayout name="staff" title="Billing">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <BillingTransactionItemForm :transaction-item-id="transactionItemId" />
    </div>
  </NuxtLayout>
</template>