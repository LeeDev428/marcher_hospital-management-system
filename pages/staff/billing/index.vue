<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import BillingTransactionsTable from "./components/BillingTransactionsTable.vue"
import { onMounted } from "vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Billing", link: "/billing" },
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
          <NuxtLink to="/billing/payments">
            <Button variant="outline">
              <Icon name="mdi:credit-card" />
              Payments
            </Button>
          </NuxtLink>
          <NuxtLink to="/billing/payment-plans">
            <Button variant="outline">
              <Icon name="mdi:calendar-check" />
              Payment Plans
            </Button>
          </NuxtLink>
          <NuxtLink to="/billing/payment-instalments">
            <Button variant="outline">
              <Icon name="mdi:calendar-multiple" />
              Instalments
            </Button>
          </NuxtLink>
          <NuxtLink to="/billing/transaction-items">
            <Button variant="outline">
              <Icon name="mdi:format-list-bulleted" />
              Items
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