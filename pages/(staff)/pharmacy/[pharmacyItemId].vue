<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PharmacyItemForm from "./components/PharmacyItemForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { pharmacyItemId } = useRoute().params as { pharmacyItemId: string }

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/pharmacy" },
		{ label: "Pharmacy Item", link: `/pharmacy/${pharmacyItemId}` },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="Pharmacy Item">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<PharmacyItemForm :pharmacy-item-id="pharmacyItemId" />
		</div>
	</NuxtLayout>
</template>
