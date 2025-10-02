<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PharmacySupplierForm from "../components/PharmacySupplierForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacy" },
		{ label: "Pharmacy Suppliers", link: "/pharmacy/suppliers" },
		{ label: "New Pharmacy Supplier", link: "/pharmacy/suppliers/new" },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="Pharmacy">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<PharmacySupplierForm />
		</div>
	</NuxtLayout>
</template>