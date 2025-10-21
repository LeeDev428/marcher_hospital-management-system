<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PharmacyCategoryForm from "../components/PharmacyCategoryForm.vue"

definePageMeta({
  layout: 'pharmacist',
  middleware: ['staff-type']
})

const breadcrumbsStore = useBreadcrumbsStore()
const { pharmacyCategoryId } = useRoute().params as { pharmacyCategoryId: string }

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacist/pharmacy" },
		{ label: "Pharmacy Categories", link: "/pharmacist/pharmacy/categories" },
		{ label: "Pharmacy Category", link: `/pharmacist/pharmacy/categories/${pharmacyCategoryId}` },
	])
})
</script>

<template>
	<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
		<PharmacyCategoryForm :pharmacy-category-id="pharmacyCategoryId" />
	</div>
</template>