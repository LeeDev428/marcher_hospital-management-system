<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PharmacyCategoryForm from "../components/PharmacyCategoryForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacy" },
		{ label: "Pharmacy Categories", link: "/pharmacy/categories" },
		{ label: "New Pharmacy Category", link: "/pharmacy/categories/new" },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="Pharmacy">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<PharmacyCategoryForm />
		</div>
	</NuxtLayout>
</template>