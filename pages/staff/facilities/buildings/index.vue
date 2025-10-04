<script setup lang="ts">
import { ref } from "vue"
import { useBreadcrumbsStore } from "@/stores/app"
import { Button } from "@/components/ui/button"
import BuildingsTable from "../components/BuildingsTable.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const buildingsTableRef = ref()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Facilities", link: "/facilities" },
		{ label: "Buildings", link: "/facilities/buildings" },
	])
})

// Connect the search input to the table's search functionality
const search = computed({
	get: () => buildingsTableRef.value?.search || '',
	set: (value: string) => {
		if (buildingsTableRef.value) {
			buildingsTableRef.value.search = value
		}
	}
})

function clearSearch() {
	buildingsTableRef.value?.clearSearch()
}
</script>

<template>
	<NuxtLayout name="staff" title="Buildings">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<div class="w-full flex gap-2 justify-between">
				<div class="w-full flex items-center gap-2">
					<div class="relative max-w-xs">
						<input
							v-model="search"
							type="text"
							placeholder="Search buildings..."
							class="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300 bg-white"
							aria-label="Search buildings"
							@keydown.esc.prevent="clearSearch"
						>
						
						<button
							v-if="search"
							type="button"
							class="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 text-sm text-gray-600 hover:bg-gray-100"
							aria-label="Clear search"
							title="Clear"
							@click="clearSearch"
						>✕</button>
					</div>
				</div>
				<div class="flex gap-2">
					<NuxtLink to="/facilities">
						<Button variant="outline">
							<Icon name="mdi:bed" />
							Rooms
						</Button>
					</NuxtLink>
					<NuxtLink to="/facilities/buildings/new">
						<Button variant="outline" size="icon">
							<Icon name="mdi:plus" />
						</Button>
					</NuxtLink>
				</div>
			</div>
			<BuildingsTable ref="buildingsTableRef" />
		</div>
	</NuxtLayout>
</template>