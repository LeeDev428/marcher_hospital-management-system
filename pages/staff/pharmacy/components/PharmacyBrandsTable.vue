<script setup lang="ts">
import { usePharmacyBrandStore } from "@/stores/pharmacy"
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

const pharmacyBrandStore = usePharmacyBrandStore()

const onEdit = async (id: string) => {
	await navigateTo(`/pharmacy/brands/${id}`)
}

onMounted(async () => {
	await pharmacyBrandStore.getPharmacyBrands()
})
</script>

<template>
	<div v-if="pharmacyBrandStore.loading" class="flex flex-col gap-2">
		<Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
	</div>
	<div v-else>
		<Table>
			<TableHeader>
				<TableRow>
					<!-- <TableHead>ID</TableHead> -->
					<TableHead>Name</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow v-for="brand in pharmacyBrandStore.brands" :key="brand.id">
					<!-- <TableCell>{{ brand.id }}</TableCell> -->
					<TableCell>{{ brand.name }}</TableCell>
					<TableCell class="flex gap-2">
						<Button variant="outline" size="icon" @click="onEdit(brand.id)">
							<Icon name="mdi:pencil" />
						</Button>
						<Button variant="outline" size="icon" @click="pharmacyBrandStore.deletePharmacyBrand(brand.id)">
							<Icon name="mdi:trash" />
						</Button>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</div>
</template>