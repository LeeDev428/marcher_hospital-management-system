<script setup lang="ts">
import { usePharmacyCategoryStore } from "@/stores/pharmacy"
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

const pharmacyCategoryStore = usePharmacyCategoryStore()

const onEdit = async (id: string) => {
	await navigateTo(`/pharmacy/categories/${id}`)
}

onMounted(async () => {
	await pharmacyCategoryStore.getPharmacyCategories()
})
</script>

<template>
	<div v-if="pharmacyCategoryStore.loading" class="flex flex-col gap-2">
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
				<TableRow v-for="category in pharmacyCategoryStore.categories" :key="category.id">
					<!-- <TableCell>{{ category.id }}</TableCell> -->
					<TableCell>{{ category.name }}</TableCell>
					<TableCell class="flex gap-2">
						<Button variant="outline" size="icon" @click="onEdit(category.id)">
							<Icon name="mdi:pencil" />
						</Button>
						<Button variant="outline" size="icon" @click="pharmacyCategoryStore.deletePharmacyCategory(category.id)">
							<Icon name="mdi:trash" />
						</Button>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</div>
</template>