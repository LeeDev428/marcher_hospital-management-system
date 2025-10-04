<script setup lang="ts">
import { usePatientProfileStore } from "~/stores/patients/usePatientProfileStore"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

const patientProfileStore = usePatientProfileStore()
const activeTab = ref("all")

const handleArchive = async (id: string) => {
	if (activeTab.value === "all") {
		await patientProfileStore.archivePatientProfile(id)
	} else {
		await patientProfileStore.unarchivePatientProfile(id)
	}
}

watch(activeTab, async () => {
	if (activeTab.value === "all") {
		await patientProfileStore.getActivePatientProfiles({
			search: "",
			page: 1,
			limit: 10,
		})
	} else {
		await patientProfileStore.getArchivedPatientProfiles({
			search: "",
			page: 1,
			limit: 10,
		})
	}
})

onMounted(async () => {
	await patientProfileStore.getActivePatientProfiles({
		search: "",
		page: 1,
		limit: 10,
	})
})
</script>

<template>
	<div class="h-full w-full flex flex-col gap-4">
		<Tabs v-model="activeTab">
			<TabsList class="mb-4 gap-1">
				<TabsTrigger value="all" class="hover:bg-zinc-200">All</TabsTrigger>
				<TabsTrigger value="archived" class="hover:bg-zinc-200"
					>Archived</TabsTrigger
				>
			</TabsList>
		</Tabs>
		<div v-if="patientProfileStore.loading" class="flex flex-col gap-2">
			<Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
		</div>
		<div v-else>
			<Table v-if="patientProfileStore.patientProfiles.length > 0">
				<TableHeader>
					<TableRow>
						<!-- <TableHead>ID</TableHead> -->
						<TableHead>Name</TableHead>
						<TableHead>Birthdate</TableHead>
						<TableHead>Sex</TableHead>
						<TableHead>Marital Status</TableHead>
						<TableHead>Created At</TableHead>
						<TableHead>Updated At</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow
						v-for="patient in patientProfileStore.patientProfiles"
						:key="patient.id"
					>
						<!-- <TableCell>{{ patient.id }}</TableCell> -->
						<TableCell
							>{{ patient.lastName }}, {{ patient.firstName }}
							{{ patient.middleName }} {{ patient.suffix }}</TableCell
						>
						<TableCell>{{ patient.birthdate }}</TableCell>
						<TableCell>{{ patient.sex }}</TableCell>
						<TableCell>{{ patient.maritalStatus }}</TableCell>
						<TableCell>{{
							`${new Date(patient.createdAt).toLocaleDateString()} ${new Date(patient.createdAt).toLocaleTimeString()}`
						}}</TableCell>
						<TableCell>{{
							`${new Date(patient.updatedAt).toLocaleDateString()} ${new Date(patient.updatedAt).toLocaleTimeString()}`
						}}</TableCell>
						<TableCell class="flex gap-2">
							<Button variant="outline" size="icon" as-child>
								<NuxtLink :to="`/patients/${patient.id}`">
									<Icon name="mdi:eye" />
								</NuxtLink>
							</Button>
							<Button variant="outline" size="icon" as-child>
								<NuxtLink :to="`/patients/${patient.id}/edit`">
									<Icon name="mdi:pencil" />
								</NuxtLink>
							</Button>
							<Button
								variant="outline"
								size="icon"
								@click="handleArchive(patient.id)"
							>
								<Icon name="mdi:delete" />
							</Button>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
			<div
				v-else
				class="flex flex-col gap-2 justify-center items-center h-full"
			>
				<p class="text-sm text-gray-500">No Patients Found</p>
				<Button variant="outline" as-child class="flex items-center gap-2">
					<NuxtLink to="/patients/new">
						Add Patient
						<Icon name="mdi:plus" class="w-4 h-4" />
					</NuxtLink>
				</Button>
			</div>
		</div>
	</div>
</template>
