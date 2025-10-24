<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PharmacyBrandForm from "../components/PharmacyBrandForm.vue"

definePageMeta({
  layout: 'pharmacist',
  middleware: ['staff-type']
})

const breadcrumbsStore = useBreadcrumbsStore()

useHead({
  title: 'New Brand'
})

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacist/pharmacy" },
		{ label: "Brands", link: "/pharmacist/pharmacy/brands" },
		{ label: "New Brand", link: "/pharmacist/pharmacy/brands/new" },
	])
})
</script>

<template>
	<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
		<PharmacyBrandForm />
	</div>
</template>
