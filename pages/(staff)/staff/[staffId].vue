<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import StaffForm from "./components/StaffForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { staffId } = useRoute().params as { staffId: string }

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Staff", link: "/staff" },
		{ label: "Staff Profile", link: `/staff/${staffId}` },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="Staff Profile">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<StaffForm :staff-id="staffId" />
		</div>
	</NuxtLayout>
</template>