<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PartnerForm from "./components/PartnerForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { partnerId } = useRoute().params as { partnerId: string }

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Partners", link: "/partner" },
    { label: "Partner Details", link: `/partner/${partnerId}` },
  ])
})
</script>

<template>
  <NuxtLayout name="partner" title="Partner Details">
    <div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
      <PartnerForm :partner-id="partnerId" />
    </div>
  </NuxtLayout>
</template>