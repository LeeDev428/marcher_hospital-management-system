<script setup lang="ts">
import { useOutpatientStore } from "@/stores/encounters"
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const outpatientStore = useOutpatientStore()
const { patientProfileId } = useRoute().params as { patientProfileId: string }

onMounted(() => {
	outpatientStore.getOutpatientEncounters(patientProfileId)
})
</script>

<template>
	<div v-if="outpatientStore.loading" class="flex flex-col gap-2">
		<Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
	</div>
	<div v-else>
		<Table v-if="outpatientStore.outpatientEncounters.length > 0">
			<TableHeader>
				<TableRow>
					<!-- <TableHead>ID</TableHead> -->
					<TableHead>Patient</TableHead>
					<TableHead>Date</TableHead>
					<TableHead>Time</TableHead>
					<TableHead>Type</TableHead>
					<TableHead>Created At</TableHead>
					<TableHead>Updated At</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow
					v-for="encounter in outpatientStore.outpatientEncounters"
					:key="encounter.id"
				>
					<!-- <TableCell>{{ encounter.id }}</TableCell> -->
					<TableCell
						>{{ encounter.patientProfile.firstName }}
						{{ encounter.patientProfile.lastName }}</TableCell
					>
					<TableCell>{{ encounter.date }}</TableCell>
					<TableCell>{{ encounter.time }}</TableCell>
					<TableCell>{{ encounter.type }}</TableCell>
					<TableCell>{{
						`${new Date(encounter.createdAt).toLocaleDateString()} ${new Date(encounter.createdAt).toLocaleTimeString()}`
					}}</TableCell>
					<TableCell>{{
						`${new Date(encounter.updatedAt).toLocaleDateString()} ${new Date(encounter.updatedAt).toLocaleTimeString()}`
					}}</TableCell>
					<TableCell class="flex gap-2">
						<Button variant="outline" size="icon" as-child>
							<NuxtLink :to="`/patients/${patientProfileId}/encounters/outpatient/${encounter.id}`">
								<Icon name="mdi:pencil" />
							</NuxtLink>
						</Button>
						<Button
							variant="outline"
							size="icon"
							@click="outpatientStore.deleteOutpatientEncounter(encounter.id)"
						>
							<Icon name="mdi:delete" />
						</Button>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
		<div v-else class="flex flex-col gap-2 justify-center items-center h-full">
			<p class="text-sm text-gray-500">No Outpatient Encounters Found</p>
		</div>
	</div>
</template>
