import { defineStore } from "pinia"
import type {
	TableInpatientEncounter,
	CreateInpatientEncounter,
	UpdateInpatientEncounter,
} from "~/types/encounters"

export const useInpatientStore = defineStore("inpatient", {
	state: () => ({
		loading: false,
		inpatientEncounter: null as
			| CreateInpatientEncounter
			| UpdateInpatientEncounter
			| null,
		inpatientEncounters: [] as TableInpatientEncounter[],
	}),

	actions: {
		async getInpatientEncounters(patientProfileId: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } =
					await $trpc.encounters.inpatient.getInpatientEncounters.query({
						patientProfileId,
					})

				if (success && data) {
					this.inpatientEncounters = data
				}

				this.loading = false
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Inpatient Encounter",
					"Failed to fetch inpatient encounters."
				)
			}
		},

		async getInpatientEncounter(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } =
					await $trpc.encounters.inpatient.getInpatientEncounter.query({
						id,
					})

				if (success && data) {
					this.inpatientEncounter = data
				}

				this.loading = false
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Inpatient Encounter",
					"Failed to fetch inpatient encounter."
				)
			}
		},

		async createInpatientEncounter(
			inpatientEncounter: CreateInpatientEncounter
		) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } =
					await $trpc.encounters.inpatient.createInpatientEncounter.mutate(
						inpatientEncounter
					)

				if (success && data) {
					useToast(
						"success",
						"Inpatient Encounter",
						"Inpatient encounter created successfully."
					)
					await navigateTo(`/patients/${inpatientEncounter.patientProfileId}/encounters/inpatient/${data.id}#encounters`)
				}

				this.loading = false
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Inpatient Encounter",
					"Failed to create inpatient encounter."
				)
			}
		},

		async updateInpatientEncounter(
			inpatientEncounter: UpdateInpatientEncounter
		) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } =
					await $trpc.encounters.inpatient.updateInpatientEncounter.mutate(
						inpatientEncounter
					)

				if (success && data) {
					useToast(
						"success",
						"Inpatient Encounter",
						"Inpatient encounter updated successfully."
					)
					await navigateTo(`/patients/${inpatientEncounter.patientProfileId}/encounters/inpatient/${data.id}#encounters`)
				}

				this.loading = false
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Inpatient Encounter",
					"Failed to update inpatient encounter."
				)
			}
		},

		async deleteInpatientEncounter(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } =
					await $trpc.encounters.inpatient.deleteInpatientEncounter.mutate({
						id,
					})

				if (success) {
					this.inpatientEncounters = this.inpatientEncounters.filter(
						(encounter) => encounter.id !== id
					)
					useToast(
						"success",
						"Inpatient Encounter",
						"Inpatient encounter deleted successfully."
					)
					// await navigateTo(`/patients/${this.inpatientEncounter?.patientProfileId}/encounters/inpatient`)
				}

				this.loading = false
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Inpatient Encounter",
					"Failed to delete inpatient encounter."
				)
			}
		},
	},
})
