<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PharmacyBrandForm from "../components/PharmacyBrandForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacy" },
		{ label: "Pharmacy Brands", link: "/pharmacy/brands" },
		{ label: "New Pharmacy Brand", link: "/pharmacy/brands/new" },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="Pharmacy">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<PharmacyBrandForm />
		</div>
	</NuxtLayout>
</template>