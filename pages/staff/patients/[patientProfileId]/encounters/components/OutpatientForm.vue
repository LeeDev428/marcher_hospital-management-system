<script setup lang="ts">
import { useOutpatientStore } from "@/stores/encounters"
import {
    createOutpatientEncounterFormSchema,
    updateOutpatientEncounterFormSchema,
	outpatientEncounterTypeOptions,
} from "@/types/encounters"
import type { CreateOutpatientEncounterForm, UpdateOutpatientEncounterForm } from "@/types/encounters"
import {
	TypedForm,
	TypedInput,
	TypedSelect,
	TypedDate,
	TypedTime,
} from "@/components/app/form"
import { Button } from "@/components/ui/button"

const outpatientStore = useOutpatientStore()
const { patientProfileId } = useRoute().params as { patientProfileId: string }

const props = defineProps<{
	encounterId?: string
}>()

const onSubmit = async (
    data: CreateOutpatientEncounterForm | UpdateOutpatientEncounterForm
) => {
    if (props.encounterId) {
        await outpatientStore.updateOutpatientEncounter({
            id: props.encounterId,
            ...data,
            patientProfileId,
        })
    } else {
		await outpatientStore.createOutpatientEncounter({
			...data,
			patientProfileId,
		})
	}
}

onMounted(() => {
	if (props.encounterId) {
		outpatientStore.getOutpatientEncounter(props.encounterId)
	}
})
</script>

<template>
	<TypedForm
        :schema="
            props.encounterId
                ? updateOutpatientEncounterFormSchema
                : createOutpatientEncounterFormSchema
        "
		:initial-values="
			props.encounterId
				? { patientProfileId, ...(outpatientStore.outpatientEncounter || {}) }
				: { patientProfileId }
		"
		@submit="onSubmit"
	>
		<TypedDate name="date" label="Date" />
		<TypedTime name="time" label="Time" />
		<TypedInput type="text" name="chiefComplaint" label="Chief Complaint" />
		<TypedInput type="text" name="doctorDiagnosis" label="Doctor Diagnosis" />
		<TypedSelect
			name="type"
			label="Type"
			:options="outpatientEncounterTypeOptions"
			placeholder="Select Type"
		/>
		<div class="flex gap-2">
			<Button type="submit" variant="outline">
				<Icon name="mdi:floppy" />
				Save
			</Button>
		</div>
	</TypedForm>
</template>
