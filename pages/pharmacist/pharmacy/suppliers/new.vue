<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PharmacySupplierForm from "../components/PharmacySupplierForm.vue"

definePageMeta({
  layout: 'pharmacist',
  middleware: ['staff-type']
})

const breadcrumbsStore = useBreadcrumbsStore()

useHead({
  title: 'New Supplier'
})

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacist/pharmacy" },
		{ label: "Suppliers", link: "/pharmacist/pharmacy/suppliers" },
		{ label: "New Supplier", link: "/pharmacist/pharmacy/suppliers/new" },
	])
})
</script>

<template>
	<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
		<PharmacySupplierForm />
	</div>
</template>
