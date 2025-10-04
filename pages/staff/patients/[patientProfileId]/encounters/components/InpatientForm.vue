<script setup lang="ts">
import { useInpatientStore } from "@/stores/encounters"
import {
    createInpatientEncounterFormSchema,
    updateInpatientEncounterFormSchema,
	inpatientTriageOptions,
	inpatientDispositionOptions,
} from "@/types/encounters"
import type { CreateInpatientEncounterForm, UpdateInpatientEncounterForm } from "@/types/encounters"
import { ICDBrowser } from "@/components/app/icd"
import {
	TypedForm,
	TypedSelect,
	TypedDate,
	TypedTime,
	TypedTextarea,
} from "@/components/app/form"
import { Button } from "@/components/ui/button"

const inpatientStore = useInpatientStore()
const { patientProfileId } = useRoute().params as { patientProfileId: string }

const props = defineProps<{
	encounterId?: string
}>()

const doctorDiagnosis = ref<string>("")
type ICDItem = { code: string; title: string }
const onSelectICD = (data: ICDItem) => {
	doctorDiagnosis.value =
		doctorDiagnosis.value + `\n${data.code} - ${data.title}`
}

const onSubmit = async (
    data: CreateInpatientEncounterForm | UpdateInpatientEncounterForm
) => {
    if (props.encounterId) {
        await inpatientStore.updateInpatientEncounter({
            id: props.encounterId,
            ...data,
            patientProfileId,
        })
    } else {
		await inpatientStore.createInpatientEncounter({
			...data,
			patientProfileId,
		})
	}
}

onMounted(() => {
	if (props.encounterId) {
		inpatientStore.getInpatientEncounter(props.encounterId)
	}
})
</script>

<template>
	<TypedForm
        :schema="
            props.encounterId
                ? updateInpatientEncounterFormSchema
                : createInpatientEncounterFormSchema
        "
		:initial-values="
			props.encounterId
				? { patientProfileId, ...(inpatientStore.inpatientEncounter || {}) }
				: { patientProfileId }
		"
		@submit="onSubmit"
	>
		<TypedDate name="date" label="Date" />
		<TypedTime name="time" label="Time" />
		<TypedTextarea name="chiefComplaint" label="Chief Complaint" />
		<TypedTextarea
			v-model:text="doctorDiagnosis"
			name="doctorDiagnosis"
			label="Doctor Diagnosis"
		/>
		<ICDBrowser @select="onSelectICD" />
		<TypedSelect
			name="triage"
			label="Triage"
			:options="inpatientTriageOptions"
			placeholder="Select Triage"
		/>
		<TypedSelect
			name="disposition"
			label="Disposition"
			:options="inpatientDispositionOptions"
			placeholder="Select Disposition"
		/>
		<TypedDate name="dispositionDate" label="Disposition Date" />
		<TypedTime name="dispositionTime" label="Disposition Time" />
		<TypedTextarea name="dispositionNote" label="Disposition Note" />
		<div class="flex gap-2">
			<Button type="submit" variant="outline">
				<Icon name="mdi:floppy" />
				Save
			</Button>
		</div>
	</TypedForm>
</template>
