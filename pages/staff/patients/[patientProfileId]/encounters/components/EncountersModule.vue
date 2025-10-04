<script setup lang="ts">
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import EncountersTable from "./components/EncountersTable.vue"

const { patientProfileId } = useRoute().params as { patientProfileId: string }
</script>

<template>
	<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
		<div class="w-full flex gap-2 justify-between">
			<div class="w-full flex items-center gap-2">
				<Input type="text" placeholder="Search" class="bg-white max-w-xs" />
			</div>
			<div class="flex gap-2">
				<NuxtLink
					:to="`/patients/${patientProfileId}/encounters/inpatient/new`"
				>
					<Button variant="outline">
						<span>New Inpatient</span>
						<Icon name="mdi:plus" />
					</Button>
				</NuxtLink>
				<NuxtLink
					:to="`/patients/${patientProfileId}/encounters/outpatient/new`"
				>
					<Button variant="outline">
						<span>New Outpatient</span>
						<Icon name="mdi:plus" />
					</Button>
				</NuxtLink>
			</div>
		</div>
		<EncountersTable />
	</div>
</template>
