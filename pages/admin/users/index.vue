<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Users", link: "/users" },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="Users">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<div class="w-full flex gap-2 justify-between">
				<div class="w-full flex items-center gap-2">
					<Input type="text" placeholder="Search" class="bg-white max-w-xs" />
				</div>
				<NuxtLink to="/users/new">
					<Button variant="outline" size="icon">
						<Icon name="mdi:plus" />
					</Button>
				</NuxtLink>
			</div>
		</div>
	</NuxtLayout>
</template>
