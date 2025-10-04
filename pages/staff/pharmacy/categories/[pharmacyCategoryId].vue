<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PharmacyCategoryForm from "../components/PharmacyCategoryForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { pharmacyCategoryId } = useRoute().params as { pharmacyCategoryId: string }

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacy" },
		{ label: "Pharmacy Categories", link: "/pharmacy/categories" },
		{ label: "Pharmacy Category", link: `/pharmacy/categories/${pharmacyCategoryId}` },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="Pharmacy">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<PharmacyCategoryForm :pharmacy-category-id="pharmacyCategoryId" />
		</div>
	</NuxtLayout>
</template>