<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import PharmacyItemsTable from "./components/PharmacyItemsTable.vue"

definePageMeta({
  layout: 'pharmacist',
  middleware: ['staff-type']
})

const breadcrumbsStore = useBreadcrumbsStore()

useHead({
  title: 'Pharmacist Pharmacy Inventory'
})

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacist/pharmacy" },
	])
})
</script>


<template>
	<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
		<div class="w-full flex gap-2 justify-between">
			<div class="w-full flex items-center gap-2">
				<Input type="text" placeholder="Search" class="bg-white max-w-xs" />
			</div>
			<div class="flex gap-2">
				<NuxtLink to="/pharmacist/billing">
					<Button variant="default" class="bg-blue-600 hover:bg-blue-700">
						<Icon name="mdi:cash-register" class="mr-2" />
						POS
					</Button>
				</NuxtLink>
				<!-- <NuxtLink to="/pharmacist/billing/sales">
					<Button variant="outline">
						<Icon name="mdi:receipt" class="mr-2" />
						Sales
					</Button>
				</NuxtLink> -->
				<NuxtLink to="/pharmacist/pharmacy/suppliers">
					<Button variant="outline">
						<Icon name="mdi:package" />
						Suppliers
					</Button>
				</NuxtLink>
				<NuxtLink to="/pharmacist/pharmacy/brands">
					<Button variant="outline">
						<Icon name="mdi:octagram" />
						Brands
					</Button>
				</NuxtLink>
				<NuxtLink to="/pharmacist/pharmacy/categories">
					<Button variant="outline">
						<Icon name="mdi:tag" />
						Categories
					</Button>
				</NuxtLink>
				<NuxtLink to="/pharmacist/pharmacy/new">
					<Button variant="outline" size="icon">
						<Icon name="mdi:plus" />
					</Button>
				</NuxtLink>
			</div>
		</div>
		<PharmacyItemsTable />
	</div>
</template>
