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
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

const pharmacyItemStore = usePharmacyItemStore()

const onEdit = async (id: string) => {
	await navigateTo(`/pharmacist/pharmacy/${id}`)
}

// Format currency
const formatCurrency = (amount: number | string) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(num || 0)
}

// Stock badge
const getStockBadge = (stock: number) => {
  if (stock === 0) return { text: "Out", class: "bg-red-500 text-white" }
  if (stock < 10) return { text: "Low", class: "bg-yellow-500 text-white" }
  if (stock < 50) return { text: "Medium", class: "bg-blue-500 text-white" }
  return { text: "High", class: "bg-green-500 text-white" }
}

onMounted(async () => {
	await pharmacyItemStore.getPharmacyItems()
})
</script>

<template>
	<div v-if="pharmacyItemStore.loading" class="flex flex-col gap-2">
		<Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
	</div>
	<div v-else class="overflow-x-auto">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>SKU</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Brand</TableHead>
					<TableHead>Category</TableHead>
					<TableHead>Strength</TableHead>
					<TableHead>Form</TableHead>
					<TableHead>Route</TableHead>
					<TableHead>Unit</TableHead>
					<TableHead class="text-right">Stock</TableHead>
					<TableHead class="text-right">Price</TableHead>
					<TableHead>Status</TableHead>
					<TableHead class="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow v-for="item in pharmacyItemStore.items" :key="item.id">
					<TableCell class="font-mono text-xs text-gray-600">{{ item.sku || 'N/A' }}</TableCell>
					<TableCell class="font-medium">{{ item.name }}</TableCell>
					<TableCell>{{ item.brand.name }}</TableCell>
					<TableCell>{{ item.category.name }}</TableCell>
					<TableCell>{{ item.strength }}</TableCell>
					<TableCell>{{ item.form }}</TableCell>
					<TableCell>{{ item.route }}</TableCell>
					<TableCell>{{ item.unit }}</TableCell>
					<TableCell class="text-right">
						<Badge :class="getStockBadge(item.stock).class">
							{{ item.stock }}
						</Badge>
					</TableCell>
					<TableCell class="text-right font-semibold text-blue-600">
						{{ formatCurrency(item.price || 0) }}
					</TableCell>
					<TableCell>
						<Badge :class="item.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
							{{ item.stock > 0 ? 'Available' : 'Out of Stock' }}
						</Badge>
					</TableCell>
					<TableCell class="text-right">
						<div class="flex gap-2 justify-end">
							<Button variant="outline" size="sm" @click="onEdit(item.id)">
								<Icon name="mdi:pencil" class="mr-1" />
								Edit
							</Button>
							<Button variant="destructive" size="sm" @click="pharmacyItemStore.deletePharmacyItem(item.id)">
								<Icon name="mdi:trash" class="mr-1" />
								Delete
							</Button>
						</div>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</div>
</template>
