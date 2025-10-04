<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import InsuranceClaimsTable from "./components/InsuranceClaimsTable.vue"
import { onMounted } from "vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Insurance", link: "/insurance" },
  ])
})
</script>

<template>
  <NuxtLayout name="staff" title="Insurance">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <div class="w-full flex gap-2 justify-between">
        <div class="w-full flex items-center gap-2">
          <Input type="text" placeholder="Search" class="bg-white max-w-xs" />
        </div>
        <div class="flex gap-2">
          <NuxtLink to="/insurance/providers">
            <Button variant="outline">
              <Icon name="mdi:domain" />
              Providers
            </Button>
          </NuxtLink>
          <NuxtLink to="/insurance/claim-items">
            <Button variant="outline">
              <Icon name="mdi:format-list-bulleted" />
              Claim Items
            </Button>
          </NuxtLink>
          <NuxtLink to="/insurance/claims/new">
            <Button variant="outline" size="icon">
              <Icon name="mdi:plus" />
            </Button>
          </NuxtLink>
        </div>
      </div>
      <InsuranceClaimsTable />
    </div>
  </NuxtLayout>
</template>