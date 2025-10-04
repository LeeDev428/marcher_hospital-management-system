<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import PharmacySuppliersTable from "../components/PharmacySuppliersTable.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacy" },
		{ label: "Pharmacy Suppliers", link: "/pharmacy/suppliers" },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="Pharmacy">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<div class="w-full flex gap-2 justify-between">
				<div class="w-full flex items-center gap-2">
					<Input type="text" placeholder="Search" class="bg-white max-w-xs" />
				</div>
				<div class="flex gap-2">
					<NuxtLink to="/pharmacy">
						<Button variant="outline">
							<Icon name="mdi:arrow-left" />
							Back
						</Button>
					</NuxtLink>
					<NuxtLink to="/pharmacy/suppliers/new">
						<Button variant="outline" size="icon">
							<Icon name="mdi:plus" />
						</Button>
					</NuxtLink>
				</div>
			</div>
			<PharmacySuppliersTable />
		</div>
	</NuxtLayout>
</template>