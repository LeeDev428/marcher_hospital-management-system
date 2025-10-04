<script setup lang="ts">
import { useRoomStore } from "@/stores/facilities"
import { useBuildingStore } from "@/stores/facilities/useBuildingStore"
import { createRoomSchema, updateRoomSchema, roomTypeOptions, roomStatusOptions } from "@/types/facilities"
import type { CreateRoom, UpdateRoom } from "@/types/facilities"
import { TypedForm, TypedInput, TypedSelect, TypedNumber, TypedTextarea } from "@/components/app/form"
import { QRCodeDisplay } from "@/components/app/qrcode"
import { Button } from "@/components/ui/button"

const roomStore = useRoomStore()
const buildingStore = useBuildingStore()
const props = defineProps<{
	roomId?: string
}>()

const onSubmit = async (data: CreateRoom | UpdateRoom) => {
	if (props.roomId) {
		await roomStore.updateRoom({
			id: props.roomId,
			...data,
		})
	} else {
		await roomStore.createRoom(data)
	}
}

onMounted(async () => {
	await buildingStore.getBuildings()
	if (props.roomId) {
		await roomStore.getRoom(props.roomId)
	}
})
</script>

<template>
	<TypedForm
		:schema="props.roomId ? updateRoomSchema : createRoomSchema"
		:initial-values="props.roomId ? roomStore.room || {} : {}"
		@submit="onSubmit"
	>
		<div class="mb-4">
			<QRCodeDisplay
				v-if="roomStore.room && props.roomId"
				:data="{ entity: 'facility', id: props.roomId }"
			/>
		</div>
		<TypedInput type="text" name="identifier" label="Identifier" placeholder="Room Identifier" />
		<TypedSelect name="buildingId" label="Building" :options="buildingStore.buildings.map((building) => ({ label: building.name, value: building.id }))" placeholder="Select Building" />
		<TypedSelect name="type" label="Type" :options="roomTypeOptions" placeholder="Select Type" />
		<TypedNumber name="capacity" label="Capacity" placeholder="Room Capacity" />
		<TypedSelect name="status" label="Status" :options="roomStatusOptions" placeholder="Select Status" />
		<TypedTextarea name="description" label="Description" placeholder="Room Description" />
		<div class="flex gap-2">
			<Button type="submit" variant="outline">
				<Icon name="mdi:floppy" />
				Save
			</Button>
			<Button type="button" variant="outline" @click="navigateTo('/facilities')">
				<Icon name="mdi:arrow-left" />
				Back
			</Button>
		</div>
	</TypedForm>
</template>