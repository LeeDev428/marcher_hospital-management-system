<script setup lang="ts">
import { usePartnerStore } from "@/stores/partner"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { PartnerType } from "@/types/partner"

const partnerStore = usePartnerStore()
const activeTab = ref("ALL")

const onEdit = (id: string) => {
  navigateTo(`/partner/${id}`)
}

watch(activeTab, async () => {
  if (activeTab.value === "ALL") {
    await partnerStore.getPartners()
    return
  }
  await partnerStore.getPartners(activeTab.value as PartnerType)
})

onMounted(async () => {
  await partnerStore.getPartners()
})
</script>

<template>
  <div v-if="partnerStore.loading" class="flex flex-col gap-2">
    <Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
  </div>
  <div v-else>
    <Tabs v-model="activeTab">
      <TabsList class="mb-4 gap-1">
        <TabsTrigger value="ALL" class="hover:bg-zinc-200">All</TabsTrigger>
        <TabsTrigger value="INSURANCE_COMPANY" class="hover:bg-zinc-200">Insurance</TabsTrigger>
        <TabsTrigger value="HOSPITAL" class="hover:bg-zinc-200">Hospital</TabsTrigger>
        <TabsTrigger value="CLINIC" class="hover:bg-zinc-200">Clinic</TabsTrigger>
      </TabsList>
    </Tabs>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Organization Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Representative</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="partner in partnerStore.partners" :key="partner.id">
          <TableCell>{{ partner.organizationName }}</TableCell>
          <TableCell>
            <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ partner.type.replace('_', ' ') }}
            </span>
          </TableCell>
          <TableCell>{{ partner.representativeName }}</TableCell>
          <TableCell>{{ partner.representativeEmail }}</TableCell>
          <TableCell>{{ partner.representativePhone }}</TableCell>
          <TableCell class="flex gap-2">
            <Button variant="outline" size="icon" @click="onEdit(partner.id)">
              <Icon name="mdi:pencil" />
            </Button>
            <Button variant="outline" size="icon" @click="partnerStore.deletePartner({ id: partner.id })">
              <Icon name="mdi:trash" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>