<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import PartnerTable from "./components/PartnerTable.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Partners", link: "/partner" },
  ])
})
</script>

<template>
  <NuxtLayout name="partner" title="Partners">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <div class="w-full flex gap-2 justify-between">
        <div class="w-full flex items-center gap-2">
          <Input type="text" placeholder="Search partners" class="bg-white max-w-xs" />
        </div>
        <div class="flex gap-2">
          <NuxtLink to="/partner/claim-requests">
            <Button variant="outline">
              <Icon name="mdi:file-document" />
              Claim Requests
            </Button>
          </NuxtLink>
          <NuxtLink to="/partner/data-requests">
            <Button variant="outline">
              <Icon name="mdi:database" />
              Data Requests
            </Button>
          </NuxtLink>
          <NuxtLink to="/partner/new">
            <Button variant="outline" size="icon">
              <Icon name="mdi:plus" />
            </Button>
          </NuxtLink>
        </div>
      </div>
      <PartnerTable />
    </div>
  </NuxtLayout>
</template>