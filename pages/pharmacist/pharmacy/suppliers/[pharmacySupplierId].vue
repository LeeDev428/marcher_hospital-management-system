<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PharmacySupplierForm from "../components/PharmacySupplierForm.vue"

definePageMeta({
  layout: 'pharmacist',
  middleware: ['staff-type']
})

const breadcrumbsStore = useBreadcrumbsStore()
const { pharmacySupplierId } = useRoute().params as { pharmacySupplierId: string }

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacist/pharmacy" },
		{ label: "Pharmacy Suppliers", link: "/pharmacist/pharmacy/suppliers" },
		{ label: "Pharmacy Supplier", link: `/pharmacist/pharmacy/suppliers/${pharmacySupplierId}` },
	])
})
</script>

<template>
	<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
		<PharmacySupplierForm :pharmacy-supplier-id="pharmacySupplierId" />
	</div>
</template>