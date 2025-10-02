<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import BillingTransactionsTable from "../components/BillingTransactionsTable.vue"
import { onMounted } from "vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Billing", link: "/billing" },
    { label: "Transactions", link: "/billing/transactions" },
  ])
})
</script>

<template>
  <NuxtLayout name="staff" title="Billing">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <div class="w-full flex gap-2 justify-between">
        <div class="w-full flex items-center gap-2">
          <Input type="text" placeholder="Search" class="bg-white max-w-xs" />
        </div>
        <div class="flex gap-2">
          <NuxtLink to="/billing">
            <Button variant="outline">
              <Icon name="mdi:arrow-left" />
              Back
            </Button>
          </NuxtLink>
          <NuxtLink to="/billing/transactions/new">
            <Button variant="outline" size="icon">
              <Icon name="mdi:plus" />
            </Button>
          </NuxtLink>
        </div>
      </div>
      <BillingTransactionsTable />
    </div>
  </NuxtLayout>
</template>