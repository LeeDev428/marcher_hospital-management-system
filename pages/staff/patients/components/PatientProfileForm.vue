<script setup lang="ts">
import {
	createPatientProfileSchema,
	updatePatientProfileSchema,
	type CreatePatientProfile,
	type UpdatePatientProfile,
} from "@/types/patients"
import { usePatientProfileStore } from "~/stores/patients/usePatientProfileStore"

import { TypedForm } from "@/components/app/form"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { OCRDialog } from "@/components/app/ocr"

const props = defineProps<{
	patientProfileId?: string
}>()

const patientProfileStore = usePatientProfileStore()
const router = useRouter()
const activeTab = ref("profile")

const onSubmit = async (
	values: CreatePatientProfile | UpdatePatientProfile
) => {
	if (props.patientProfileId) {
		const result = await patientProfileStore.updatePatientProfile({
			id: props.patientProfileId,
			...values,
		} as UpdatePatientProfile)

		if (result) {
			if (!result.success) return
			await navigateTo(`/patients/${result.id}`)
		}
	} else {
		const result = await patientProfileStore.createPatientProfile({
			...values,
		} as CreatePatientProfile)

		if (result) {
			if (!result.success) return
			await navigateTo(`/patients/${result.id}`)
		}
	}
}

onMounted(async () => {
	if (props.patientProfileId) {
		await patientProfileStore.getPatientProfile(props.patientProfileId)

		if (!patientProfileStore.patientProfile) {
			await navigateTo("/patients")
		}
	}
})

onUnmounted(() => {
	patientProfileStore.patientProfile = null
})
</script>

<template>
	<TypedForm
		:schema="
			props.patientProfileId
				? updatePatientProfileSchema
				: createPatientProfileSchema
		"
		:initial-values="
			props.patientProfileId ? patientProfileStore.patientProfile || {} : {}
		"
		@submit="onSubmit"
	>
		<OCRDialog />
		<Tabs v-model="activeTab">
			<TabsList class="mb-4 gap-1">
				<TabsTrigger value="profile" class="hover:bg-zinc-200"
					>Profile</TabsTrigger
				>
				<TabsTrigger value="addresses" class="hover:bg-zinc-200"
					>Addresses</TabsTrigger
				>
				<TabsTrigger value="contacts" class="hover:bg-zinc-200"
					>Contacts</TabsTrigger
				>
				<TabsTrigger value="employment" class="hover:bg-zinc-200"
					>Employment</TabsTrigger
				>
				<TabsTrigger value="emergency-contacts" class="hover:bg-zinc-200"
					>Emergency Contacts</TabsTrigger
				>
				<TabsTrigger value="consent" class="hover:bg-zinc-200"
					>Consent</TabsTrigger
				>
			</TabsList>
			<TabsContent
				value="profile"
				:hidden="activeTab !== 'profile'"
				force-mount
			>
				<ProfileFields />
			</TabsContent>
			<TabsContent
				value="addresses"
				:hidden="activeTab !== 'addresses'"
				force-mount
			>
				<AddressFields />
			</TabsContent>
			<TabsContent
				value="contacts"
				:hidden="activeTab !== 'contacts'"
				force-mount
			>
				<ContactFields />
			</TabsContent>
			<TabsContent
				value="employment"
				:hidden="activeTab !== 'employment'"
				force-mount
			>
				<EmploymentFields />
			</TabsContent>
			<TabsContent
				value="emergency-contacts"
				:hidden="activeTab !== 'emergency-contacts'"
				force-mount
			>
				<EmergencyContactFields />
			</TabsContent>
			<TabsContent
				value="consent"
				:hidden="activeTab !== 'consent'"
				force-mount
			>
				<ConsentFields />
			</TabsContent>
		</Tabs>
		<div class="flex justify-start gap-2">
			<Button type="submit">Save</Button>
			<Button type="button" variant="outline" @click="router.back()"
				>Cancel</Button
			>
		</div>
	</TypedForm>
</template>
