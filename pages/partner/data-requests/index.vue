<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import DataRequestsTable from "../components/DataRequestsTable.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Partners", link: "/partner" },
    { label: "Data Requests", link: "/partner/data-requests" },
  ])
})
</script>

<template>
  <NuxtLayout name="partner" title="Data Requests">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <div class="w-full flex gap-2 justify-between">
        <div class="w-full flex items-center gap-2">
          <Input type="text" placeholder="Search data requests" class="bg-white max-w-xs" />
        </div>
        <NuxtLink to="/partner/data-requests/new">
          <Button variant="outline" size="icon">
            <Icon name="mdi:plus" />
          </Button>
        </NuxtLink>
      </div>
      <DataRequestsTable />
    </div>
  </NuxtLayout>
</template>