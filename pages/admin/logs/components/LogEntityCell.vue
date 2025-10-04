<script setup lang="ts">
import { Button } from "@/components/ui/button"

const props = defineProps<{
	entity: string
	entityId: string
}>()

const entities: Record<string, { label: string, link: string }> = {
	patient: {
		label: "Patient",
		link: "/patients",
	},
}

const logEntity = computed(() => {
	if (entities[props.entity]) {
		return entities[props.entity]
	} else {
		return {
			label: props.entity,
			link: "",
		}
	}
})
</script>

<template>
	<Button variant="ghost" as-child>
		<NuxtLink :to="`${logEntity.link}/${props.entityId}`">
			{{ logEntity.label }}
		</NuxtLink>
	</Button>
</template>