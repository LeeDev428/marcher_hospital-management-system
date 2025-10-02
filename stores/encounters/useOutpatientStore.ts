import { defineStore } from "pinia"
import type {
	TableOutpatientEncounter,
	CreateOutpatientEncounter,
	UpdateOutpatientEncounter,
} from "~/types/encounters"

export const useOutpatientStore = defineStore("outpatient", {
	state: () => ({
		loading: false,
		outpatientEncounter: null as
			| CreateOutpatientEncounter
			| UpdateOutpatientEncounter
			| null,
		outpatientEncounters: [] as TableOutpatientEncounter[],
	}),

	actions: {
		async getOutpatientEncounters(patientProfileId: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const response =
					await $trpc.encounters.outpatient.getOutpatientEncounters.query({
						patientProfileId,
					})

				if (response.success && response.data) {
					this.outpatientEncounters = response.data
				}

				this.loading = false
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Outpatient Encounter",
					"Failed to fetch outpatient encounters."
				)
			}
		},

		async getOutpatientEncounter(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const response =
					await $trpc.encounters.outpatient.getOutpatientEncounter.query({
						id,
					})

				if (response.success && response.data) {
					this.outpatientEncounter = response.data
				}

				this.loading = false
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Outpatient Encounter",
					"Failed to fetch outpatient encounter."
				)
			}
		},

		async createOutpatientEncounter(
			outpatientEncounter: CreateOutpatientEncounter
		) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const response =
					await $trpc.encounters.outpatient.createOutpatientEncounter.mutate(
						outpatientEncounter
					)

				if (response.success && response.data) {
					useToast(
						"success",
						"Outpatient Encounter",
						"Outpatient encounter created successfully."
					)
					await navigateTo(`/patients/${outpatientEncounter.patientProfileId}/encounters/outpatient/${response.data.id}#encounters`)
				}

				this.loading = false
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Outpatient Encounter",
					"Failed to create outpatient encounter."
				)
			}
		},

		async updateOutpatientEncounter(
			outpatientEncounter: UpdateOutpatientEncounter
		) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const response =
					await $trpc.encounters.outpatient.updateOutpatientEncounter.mutate(
						outpatientEncounter
					)

				if (response.success && response.data) {
					useToast(
						"success",
						"Outpatient Encounter",
						"Outpatient encounter updated successfully."
					)
					await navigateTo(`/patients/${outpatientEncounter.patientProfileId}/encounters/outpatient/${response.data.id}#encounters`)
				}

				this.loading = false
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Outpatient Encounter",
					"Failed to update outpatient encounter."
				)
			}
		},

		async deleteOutpatientEncounter(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const response =
					await $trpc.encounters.outpatient.deleteOutpatientEncounter.mutate({
						id,
					})

				if (response.success) {
					this.outpatientEncounters = this.outpatientEncounters.filter(
						(encounter) => encounter.id !== id
					)
					useToast(
						"success",
						"Outpatient Encounter",
						"Outpatient encounter deleted successfully."
					)
					// await navigateTo(`/patients/${this.outpatientEncounter?.patientProfileId}/encounters/outpatient`)
				}

				this.loading = false
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Outpatient Encounter",
					"Failed to delete outpatient encounter."
				)
			}
		},
	},
})
