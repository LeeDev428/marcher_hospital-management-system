<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PharmacyItemForm from "./components/PharmacyItemForm.vue"

definePageMeta({
  layout: 'pharmacist',
  middleware: ['staff-type']
})

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacist/pharmacy" },
		{ label: "New Pharmacy Item", link: "/pharmacist/pharmacy/new" },
	])
})

useHead({
  title: 'Staff Pharmacy'
})

</script>

<template>
	<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg overflow-y-auto">
			<PharmacyItemForm />
		</div></template>
