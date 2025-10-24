<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PharmacyCategoryForm from "../components/PharmacyCategoryForm.vue"

definePageMeta({
  layout: 'pharmacist',
  middleware: ['staff-type']
})

const breadcrumbsStore = useBreadcrumbsStore()

useHead({
  title: 'New Category'
})

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacist/pharmacy" },
		{ label: "Categories", link: "/pharmacist/pharmacy/categories" },
		{ label: "New Category", link: "/pharmacist/pharmacy/categories/new" },
	])
})
</script>

<template>
	<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
		<PharmacyCategoryForm />
	</div>
</template>
