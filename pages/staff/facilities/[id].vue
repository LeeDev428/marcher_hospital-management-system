<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { useRoomStore } from "@/stores/facilities"
import { Button } from "@/components/ui/button"
import { QRCodeDisplay } from "@/components/app/qrcode"

const breadcrumbsStore = useBreadcrumbsStore()
const roomStore = useRoomStore()
const route = useRoute()
const { id } = route.params as { id: string }

onMounted(async () => {
	await roomStore.getRoom(id)

	if (!roomStore.room) {
		return navigateTo("/staff/facilities")
	}

	breadcrumbsStore.setBreadcrumbs([
		{ label: "Facilities", link: "/staff/facilities" },
		{ label: "Room Details", link: `/staff/facilities/${id}` },
	])
})

const formatRoomType = (type: string) => {
	return type.split('_').map(word => 
		word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
	).join(' ')
}

const formatRoomStatus = (status: string) => {
	return status.split('_').map(word => 
		word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
	).join(' ')
}
</script>

<template>
	<NuxtLayout name="staff" title="Facility Details">
		<div class="flex flex-col gap-6 bg-white p-6 rounded-lg">
			<div
				v-if="roomStore.room"
				class="h-full w-full flex flex-col gap-6"
			>
				<!-- Header with QR Code -->
				<div class="flex justify-between items-start border-b pb-4">
					<div>
						<h2 class="text-2xl font-bold text-gray-800">
							{{ roomStore.room.identifier }}
						</h2>
						<p class="text-gray-600">{{ formatRoomType(roomStore.room.type) }}</p>
					</div>
					<div class="flex flex-col items-center gap-2">
						<QRCodeDisplay
							:data="{ entity: 'facility', id: id }"
						/>
						<p class="text-sm text-gray-500">Scan to view facility</p>
					</div>
				</div>

				<!-- Facility Information -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div class="space-y-1">
						<p class="text-sm font-medium text-gray-500">Room Identifier</p>
						<p class="text-base text-gray-900">{{ roomStore.room.identifier || 'N/A' }}</p>
					</div>
					<div class="space-y-1">
						<p class="text-sm font-medium text-gray-500">Building</p>
						<p class="text-base text-gray-900">{{ roomStore.room.building || 'N/A' }}</p>
					</div>
					<div class="space-y-1">
						<p class="text-sm font-medium text-gray-500">Room Type</p>
						<p class="text-base text-gray-900">{{ formatRoomType(roomStore.room.type) }}</p>
					</div>
					<div class="space-y-1">
						<p class="text-sm font-medium text-gray-500">Capacity</p>
						<p class="text-base text-gray-900">{{ roomStore.room.capacity || 'N/A' }}</p>
					</div>
					<div class="space-y-1">
						<p class="text-sm font-medium text-gray-500">Status</p>
						<p class="text-base text-gray-900">
							<span :class="{
								'text-green-600 font-medium': roomStore.room.status === 'AVAILABLE',
								'text-red-600 font-medium': roomStore.room.status === 'OCCUPIED',
								'text-yellow-600 font-medium': roomStore.room.status === 'RESERVED',
								'text-orange-600 font-medium': roomStore.room.status === 'MAINTENANCE',
								'text-blue-600 font-medium': roomStore.room.status === 'CLEANING',
								'text-gray-600 font-medium': roomStore.room.status === 'OUT_OF_SERVICE'
							}">
								{{ formatRoomStatus(roomStore.room.status) }}
							</span>
						</p>
					</div>
				</div>

				<!-- Description -->
				<div v-if="roomStore.room.description" class="border-t pt-4">
					<h3 class="text-lg font-semibold text-gray-800 mb-2">Description</h3>
					<p class="text-gray-700">{{ roomStore.room.description }}</p>
				</div>

				<!-- Action Buttons -->
				<div class="flex justify-start gap-2 mt-4 border-t pt-4">
					<NuxtLink :to="`/staff/facilities/${id}/edit`">
						<Button type="button">
							<Icon name="mdi:pencil" class="mr-2" />
							Edit Facility
						</Button>
					</NuxtLink>
					<NuxtLink to="/staff/facilities">
						<Button type="button" variant="outline">
							<Icon name="mdi:arrow-left" class="mr-2" />
							Back to List
						</Button>
					</NuxtLink>
				</div>
			</div>

			<!-- Loading State -->
			<div v-else-if="roomStore.loading" class="flex justify-center items-center h-64">
				<p class="text-gray-500">Loading facility information...</p>
			</div>

			<!-- Error State -->
			<div v-else class="flex justify-center items-center h-64">
				<p class="text-red-500">Failed to load facility information.</p>
			</div>
		</div>
	</NuxtLayout>
</template>
