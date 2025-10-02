<script setup lang="ts">
import { useStaffStore } from "@/stores/staff/useStaffStore"
import { createStaffProfileSchema, updateStaffProfileSchema, staffRoleOptions } from "@/types/staff"
import type { CreateStaffProfile, UpdateStaffProfile } from "@/types/staff"
import { TypedForm, TypedInput, TypedSelect, TypedNumber, TypedTextarea } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const staffStore = useStaffStore()
const props = defineProps<{
	staffId?: string
}>()

const onSubmit = async (data: CreateStaffProfile | UpdateStaffProfile) => {
	if (props.staffId) {
		await staffStore.updateStaffProfile({
			id: props.staffId,
			...data,
		})
	} else {
		await staffStore.createStaffProfile(data)
	}
}

onMounted(async () => {
	await staffStore.getStaffProfiles()
	if (props.staffId) {
		await staffStore.getStaffProfile({ id: props.staffId })
	}
})
</script>

<template>
	<TypedForm
		:schema="props.staffId ? updateStaffProfileSchema : createStaffProfileSchema"
		:initial-values="props.staffId ? staffStore.staffProfile || {} : {}"
		@submit="onSubmit"
	>
		<TypedInput name="lastName" label="Last Name" type="text" placeholder="Last Name" />
		<TypedInput name="firstName" label="First Name" type="text" placeholder="First Name" />
		<TypedInput name="middleName" label="Middle Name" type="text" placeholder="Middle Name" />
		<TypedInput name="suffix" label="Suffix" type="text" placeholder="Suffix" />
		<TypedSelect name="role" label="Role" :options="staffRoleOptions" placeholder="Select Role" />
		<TypedInput name="profession" label="Profession" type="text" placeholder="Profession" />
		<div class="flex gap-2">
			<Button type="submit" variant="outline">
				<Icon name="mdi:floppy" />
				Save
			</Button>
			<Button type="button" variant="outline" @click="navigateTo('/staff')">
				<Icon name="mdi:arrow-left" />
				Back
			</Button>
		</div>
	</TypedForm>
</template>