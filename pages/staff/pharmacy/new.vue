<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PharmacyItemForm from "./components/PharmacyItemForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Pharmacy", link: "/staff/pharmacy" },
		{ label: "New Pharmacy Item", link: "/staff/pharmacy/new" },
	])
})

useHead({
  title: 'Staff Pharmacy'
})

</script>

<template>
	<NuxtLayout name="staff" title="Pharmacy">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg overflow-y-auto">
			<PharmacyItemForm />
		</div>
	</NuxtLayout>
</template>