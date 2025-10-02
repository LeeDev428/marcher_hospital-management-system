<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from "@/components/ui/tabs"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Settings", link: "/settings" },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="Settings">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<Tabs default-value="general">
				<TabsList class="mb-4 gap-1">
					<TabsTrigger value="general" class="hover:bg-zinc-200">General</TabsTrigger>
					<TabsTrigger value="access" class="hover:bg-zinc-200">Access</TabsTrigger>
					<TabsTrigger value="security" class="hover:bg-zinc-200">Security</TabsTrigger>
					<TabsTrigger value="communication" class="hover:bg-zinc-200">Communication</TabsTrigger>
				</TabsList>
				<TabsContent value="general">

				</TabsContent>
			</Tabs>
		</div>
	</NuxtLayout>
</template>
