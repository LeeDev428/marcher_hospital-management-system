<script setup lang="ts">
import type { Breadcrumb } from "@/types/app"
import {
	Breadcrumb as BreadcrumbBase,
	BreadcrumbList,
	BreadcrumbSeparator,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb"

const props = defineProps<{
	items: Breadcrumb[]
}>()
</script>

<template>
	<BreadcrumbBase>
		<BreadcrumbList>
			<template v-for="(item, index) in props.items" :key="item.label">
				<BreadcrumbItem>
					<BreadcrumbLink v-if="index < props.items.length - 1" as-child>
						<NuxtLink :to="item.link">
							{{ item.label }}
						</NuxtLink>
					</BreadcrumbLink>
					<BreadcrumbPage v-else class="text-zinc-900 font-medium">
						{{ item.label }}
					</BreadcrumbPage>
				</BreadcrumbItem>
				<BreadcrumbSeparator v-if="index < props.items.length - 1" />
			</template>
		</BreadcrumbList>
	</BreadcrumbBase>
</template>