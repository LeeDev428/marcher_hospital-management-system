<script setup lang="ts">
import { usePharmacySupplierStore } from "@/stores/pharmacy"
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

const pharmacySupplierStore = usePharmacySupplierStore()

const onEdit = async (id: string) => {
	await navigateTo(`/pharmacy/suppliers/${id}`)
}

onMounted(async () => {
	await pharmacySupplierStore.getPharmacySuppliers()
})
</script>

<template>
	<div v-if="pharmacySupplierStore.loading" class="flex flex-col gap-2">
		<Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
	</div>
	<div v-else>
		<Table>
			<TableHeader>
				<TableRow>
					<!-- <TableHead>ID</TableHead> -->
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Contact</TableHead>
					<TableHead>Address</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow v-for="supplier in pharmacySupplierStore.suppliers" :key="supplier.id">
					<!-- <TableCell>{{ supplier.id }}</TableCell> -->
					<TableCell>{{ supplier.name }}</TableCell>
					<TableCell>{{ supplier.email }}</TableCell>
					<TableCell>{{ supplier.contact }}</TableCell>
					<TableCell>{{ supplier.address }}</TableCell>
					<TableCell class="flex gap-2">
						<Button variant="outline" size="icon" @click="onEdit(supplier.id)">
							<Icon name="mdi:pencil" />
						</Button>
						<Button variant="outline" size="icon" @click="pharmacySupplierStore.deletePharmacySupplier(supplier.id)">
							<Icon name="mdi:trash" />
						</Button>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</div>
</template>