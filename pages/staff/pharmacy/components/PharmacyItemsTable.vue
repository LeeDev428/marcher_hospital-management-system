<script setup lang="ts">
import { usePharmacyItemStore } from "@/stores/pharmacy"
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

const pharmacyItemStore = usePharmacyItemStore()

const onEdit = async (id: string) => {
	await navigateTo(`/pharmacy/${id}`)
}

onMounted(async () => {
	await pharmacyItemStore.getPharmacyItems()
})
</script>

<template>
	<div v-if="pharmacyItemStore.loading" class="flex flex-col gap-2">
		<Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
	</div>
	<div v-else>
		<Table>
			<TableHeader>
				<TableRow>
					<!-- <TableHead>ID</TableHead> -->
					<TableHead>Name</TableHead>
					<TableHead>Brand</TableHead>
					<TableHead>Category</TableHead>
					<TableHead>Form</TableHead>
					<TableHead>Route</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow v-for="item in pharmacyItemStore.items" :key="item.id">
					<!-- <TableCell>{{ item.id }}</TableCell> -->
					<TableCell>{{ item.name }}</TableCell>
					<TableCell>{{ item.brand.name }}</TableCell>
					<TableCell>{{ item.category.name }}</TableCell>
					<TableCell>{{ item.form }}</TableCell>
					<TableCell>{{ item.route }}</TableCell>
					<TableCell class="flex gap-2">
						<Button variant="outline" size="icon" @click="onEdit(item.id)">
							<Icon name="mdi:pencil" />
						</Button>
						<Button variant="outline" size="icon" @click="pharmacyItemStore.deletePharmacyItem(item.id)">
							<Icon name="mdi:trash" />
						</Button>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</div>
</template>