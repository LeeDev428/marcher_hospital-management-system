<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PharmacyBrandForm from "../components/PharmacyBrandForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { pharmacyBrandId } = useRoute().params as { pharmacyBrandId: string }

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacy" },
		{ label: "Pharmacy Brands", link: "/pharmacy/brands" },
		{ label: "Pharmacy Brand", link: `/pharmacy/brands/${pharmacyBrandId}` },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="Pharmacy">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<PharmacyBrandForm :pharmacy-brand-id="pharmacyBrandId" />
		</div>
	</NuxtLayout>
</template>