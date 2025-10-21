import { defineStore } from 'pinia'
import type {
	OutpatientEncounter,
	CreateOutpatientEncounterInput,
	UpdateOutpatientEncounterInput,
} from '~/types/encounters/outpatientEncounter'

interface OutpatientEncountersState {
	encounters: OutpatientEncounter[]
	currentEncounter: OutpatientEncounter | null
	loading: boolean
	error: string | null
}

export const useOutpatientEncountersStore = defineStore('outpatientEncounters', {
	state: (): OutpatientEncountersState => ({
		encounters: [],
		currentEncounter: null,
		loading: false,
		error: null,
	}),

	actions: {
		// Create new outpatient encounter (DOCTOR only)
		async createEncounter(data: CreateOutpatientEncounterInput) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.outpatient.createOutpatientEncounter.mutate(data)

				if (response.success && response.data) {
					this.encounters.unshift(response.data)
					useToast().toast({
						title: 'Success',
						description: response.message || 'Outpatient encounter created successfully',
					})
					return { success: true, data: response.data }
				} else {
					this.error = response.message || 'Failed to create encounter'
					useToast().toast({
						title: 'Error',
						description: this.error,
						variant: 'destructive',
					})
					return { success: false, message: this.error }
				}
			} catch (error: any) {
				this.error = error.message || 'An error occurred'
				useToast().toast({
					title: 'Error',
					description: this.error,
					variant: 'destructive',
				})
				return { success: false, message: this.error }
			} finally {
				this.loading = false
			}
		},

		// Update encounter (DOCTOR only)
		async updateEncounter(data: UpdateOutpatientEncounterInput) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.outpatient.updateOutpatientEncounter.mutate(data)

				if (response.success && response.data) {
					const index = this.encounters.findIndex((e) => e.id === response.data!.id)
					if (index !== -1) {
						this.encounters[index] = response.data
					}
					if (this.currentEncounter?.id === response.data.id) {
						this.currentEncounter = response.data
					}
					useToast().toast({
						title: 'Success',
						description: response.message || 'Encounter updated successfully',
					})
					return { success: true, data: response.data }
				} else {
					this.error = response.message || 'Failed to update encounter'
					useToast().toast({
						title: 'Error',
						description: this.error,
						variant: 'destructive',
					})
					return { success: false, message: this.error }
				}
			} catch (error: any) {
				this.error = error.message || 'An error occurred'
				useToast().toast({
					title: 'Error',
					description: this.error,
					variant: 'destructive',
				})
				return { success: false, message: this.error }
			} finally {
				this.loading = false
			}
		},

		// Get encounter by ID
		async getEncounterById(id: string) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.outpatient.getOutpatientEncounterById.query({ id })

				if (response.success && response.data) {
					this.currentEncounter = response.data
					return { success: true, data: response.data }
				} else {
					this.error = response.message || 'Encounter not found'
					return { success: false, message: this.error }
				}
			} catch (error: any) {
				this.error = error.message || 'An error occurred'
				return { success: false, message: this.error }
			} finally {
				this.loading = false
			}
		},

		// Get all encounters with filters
		async getAllEncounters(filters?: {
			paymentStatus?: string
			startDate?: string
			endDate?: string
		}) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.outpatient.getAllOutpatientEncounters.query(filters || {})

				if (response.success && response.data) {
					this.encounters = response.data
					return { success: true, data: response.data }
				} else {
					this.error = response.message || 'Failed to fetch encounters'
					return { success: false, message: this.error }
				}
			} catch (error: any) {
				this.error = error.message || 'An error occurred'
				return { success: false, message: this.error }
			} finally {
				this.loading = false
			}
		},

		// Get encounters by patient
		async getEncountersByPatient(patientId: string) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.outpatient.getOutpatientEncountersByPatient.query({ patientId })

				if (response.success && response.data) {
					return { success: true, data: response.data }
				} else {
					this.error = response.message || 'Failed to fetch patient encounters'
					return { success: false, message: this.error }
				}
			} catch (error: any) {
				this.error = error.message || 'An error occurred'
				return { success: false, message: this.error }
			} finally {
				this.loading = false
			}
		},

		// Clear current encounter
		clearCurrentEncounter() {
			this.currentEncounter = null
		},
	},
})
