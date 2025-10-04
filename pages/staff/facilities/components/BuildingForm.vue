<script setup lang="ts">
import { useBuildingStore } from "@/stores/facilities/useBuildingStore"
import { createBuildingSchema, updateBuildingSchema } from "@/types/facilities"
import type { CreateBuilding, UpdateBuilding } from "@/types/facilities"
import { TypedForm, TypedInput } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const buildingStore = useBuildingStore()
const props = defineProps<{
	buildingId?: string
}>()

const onSubmit = async (data: CreateBuilding | UpdateBuilding) => {
	if (props.buildingId) {
		await buildingStore.updateBuilding({
			id: props.buildingId,
			...data,
		})
	} else {
		await buildingStore.createBuilding(data)
	}
}

onMounted(() => {
	if (props.buildingId) {
		buildingStore.getBuilding(props.buildingId)
	}
})
</script>

<template>
	<TypedForm
		:schema="props.buildingId ? updateBuildingSchema : createBuildingSchema"
		:initial-values="props.buildingId ? buildingStore.building || {} : {}"
		@submit="onSubmit"
	>
		<TypedInput type="text" name="name" label="Name" placeholder="Building Name" />
		<div class="flex gap-2">
			<Button type="submit" variant="outline">
				<Icon name="mdi:floppy" />
				Save
			</Button>
		</div>
	</TypedForm>
</template>