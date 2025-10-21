<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PharmacyBrandForm from "../components/PharmacyBrandForm.vue"

definePageMeta({
  layout: 'pharmacist',
  middleware: ['staff-type']
})

const breadcrumbsStore = useBreadcrumbsStore()
const { pharmacyBrandId } = useRoute().params as { pharmacyBrandId: string }

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacist/pharmacy" },
		{ label: "Pharmacy Brands", link: "/pharmacist/pharmacy/brands" },
		{ label: "Pharmacy Brand", link: `/pharmacist/pharmacy/brands/${pharmacyBrandId}` },
	])
})
</script>

<template>
	<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
		<PharmacyBrandForm :pharmacy-brand-id="pharmacyBrandId" />
	</div>
</template>