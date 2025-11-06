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

const emit = defineEmits<{
	(e: 'saved'): void
	(e: 'cancel'): void
}>()

const onSubmit = async (data: CreateRoom | UpdateRoom) => {
	if (props.roomId) {
		await roomStore.updateRoom({
			id: props.roomId,
			...data,
		})
		emit('saved')
	} else {
		await roomStore.createRoom(data)
		// For new rooms, navigate to list
		navigateTo('/staff/facilities')
	}
}

const onCancel = () => {
	if (props.roomId) {
		emit('cancel')
	} else {
		navigateTo('/staff/facilities')
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
		<TypedInput type="text" name="building" label="Building" placeholder="Building Name" />
		<TypedSelect name="type" label="Type" :options="roomTypeOptions" placeholder="Select Type" />
		<TypedNumber name="capacity" label="Capacity" placeholder="Room Capacity" />
		<TypedSelect name="status" label="Status" :options="roomStatusOptions" placeholder="Select Status" />
		<TypedTextarea name="description" label="Description" placeholder="Room Description" />
		<div class="flex gap-2">
			<Button type="submit" variant="outline">
				<Icon name="mdi:floppy" class="mr-2" />
				Save
			</Button>
			<Button type="button" variant="outline" @click="onCancel">
				<Icon name="mdi:close" class="mr-2" />
				{{ props.roomId ? 'Cancel' : 'Back' }}
			</Button>
		</div>
	</TypedForm>
</template>