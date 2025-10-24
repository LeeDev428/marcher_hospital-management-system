<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import PharmacyCategoriesTable from "../components/PharmacyCategoriesTable.vue"

definePageMeta({
  layout: 'pharmacist',
  middleware: ['staff-type']
})

const breadcrumbsStore = useBreadcrumbsStore()

useHead({
  title: 'Pharmacy Categories'
})

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacist/pharmacy" },
		{ label: "Categories", link: "/pharmacist/pharmacy/categories" },
	])
})
</script>

<template>
	<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
		<div class="w-full flex gap-2 justify-between">
			<div class="w-full flex items-center gap-2">
				<Input type="text" placeholder="Search categories" class="bg-white max-w-xs" />
			</div>
			<div class="flex gap-2">
				<NuxtLink to="/pharmacist/pharmacy">
					<Button variant="outline">
						<Icon name="mdi:arrow-left" class="mr-2" />
						Back to Pharmacy
					</Button>
				</NuxtLink>
				<NuxtLink to="/pharmacist/pharmacy/categories/new">
					<Button variant="default" class="bg-blue-600 hover:bg-blue-700">
						<Icon name="mdi:plus" class="mr-2" />
						Add Category
					</Button>
				</NuxtLink>
			</div>
		</div>
		<PharmacyCategoriesTable />
	</div>
</template>
