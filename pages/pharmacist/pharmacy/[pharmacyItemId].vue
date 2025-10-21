<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PharmacyItemForm from "./components/PharmacyItemForm.vue"

definePageMeta({
  layout: 'pharmacist',
  middleware: ['staff-type']
})

const breadcrumbsStore = useBreadcrumbsStore()
const { pharmacyItemId } = useRoute().params as { pharmacyItemId: string }

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacist/pharmacy" },
		{ label: "Pharmacy Item", link: `/pharmacist/pharmacy/${pharmacyItemId}` },
	])
})
</script>

<template>
	<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
		<PharmacyItemForm :pharmacy-item-id="pharmacyItemId" />
	</div>
</template>
