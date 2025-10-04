<script setup lang="ts">
import { useInsuranceProviderStore } from "@/stores/insurance"
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

const insuranceProviderStore = useInsuranceProviderStore()

const onEdit = async (id: string) => {
  await navigateTo(`/insurance/providers/${id}`)
}

onMounted(async () => {
  await insuranceProviderStore.getInsuranceProviders()
})
</script>

<template>
  <div v-if="insuranceProviderStore.loading" class="flex flex-col gap-2">
    <Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
  </div>
  <div v-else>
    <Table>
      <TableHeader>
        <TableRow>
          <!-- <TableHead>ID</TableHead> -->
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Claims Count</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="provider in insuranceProviderStore.providers" :key="provider.id">
          <!-- <TableCell>{{ provider.id }}</TableCell> -->
          <TableCell>{{ provider.name }}</TableCell>
          <TableCell>{{ provider.email || 'N/A' }}</TableCell>
          <TableCell>{{ provider.phone || 'N/A' }}</TableCell>
          <TableCell>{{ provider.city || 'N/A' }}</TableCell>
          <TableCell>{{ provider._count?.claims || 0 }}</TableCell>
          <TableCell class="flex gap-2">
            <Button variant="outline" size="icon" @click="onEdit(provider.id)">
              <Icon name="mdi:pencil" />
            </Button>
            <Button variant="outline" size="icon" @click="insuranceProviderStore.deleteInsuranceProvider(provider.id)">
              <Icon name="mdi:trash" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>