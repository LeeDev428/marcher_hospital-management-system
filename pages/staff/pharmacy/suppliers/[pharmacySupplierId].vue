<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PharmacySupplierForm from "../components/PharmacySupplierForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { pharmacySupplierId } = useRoute().params as { pharmacySupplierId: string }

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacy" },
		{ label: "Pharmacy Suppliers", link: "/pharmacy/suppliers" },
		{ label: "Pharmacy Supplier", link: `/pharmacy/suppliers/${pharmacySupplierId}` },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="Pharmacy">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<PharmacySupplierForm :pharmacy-supplier-id="pharmacySupplierId" />
		</div>
	</NuxtLayout>
</template>