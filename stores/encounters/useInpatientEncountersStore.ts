import { defineStore } from 'pinia'
import type {
	InpatientEncounter,
	InpatientEncounterChart,
	InpatientEncounterOrder,
	CreateInpatientEncounterInput,
	UpdateInpatientEncounterInput,
	CreateInpatientChartInput,
	CreateInpatientOrderInput,
	UpdateInpatientOrderInput,
} from '~/types/encounters/inpatientEncounter'

interface InpatientEncountersState {
	encounters: InpatientEncounter[]
	currentEncounter: InpatientEncounter | null
	charts: InpatientEncounterChart[]
	orders: InpatientEncounterOrder[]
	loading: boolean
	error: string | null
	statistics: {
		total: number
		admitted: number
		discharged: number
		transferred: number
	} | null
}

export const useInpatientEncountersStore = defineStore('inpatientEncounters', {
	state: (): InpatientEncountersState => ({
		encounters: [],
		currentEncounter: null,
		charts: [],
		orders: [],
		loading: false,
		error: null,
		statistics: null,
	}),

	actions: {
		// Create new inpatient encounter (ADMISSIONS_STAFF only)
		async createEncounter(data: CreateInpatientEncounterInput) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.inpatient.createInpatientEncounter.mutate(data)

				if (response.success && response.data) {
					this.encounters.unshift(response.data)
					useToast().toast({
						title: 'Success',
						description: response.message || 'Inpatient encounter created successfully',
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
		async updateEncounter(data: UpdateInpatientEncounterInput) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.inpatient.updateInpatientEncounter.mutate(data)

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
				const response = await $trpc.encounters.inpatient.getInpatientEncounterById.query({ id })

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
			disposition?: string
			triage?: string
			startDate?: string
			endDate?: string
		}) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.inpatient.getAllInpatientEncounters.query(filters || {})

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
				const response = await $trpc.encounters.inpatient.getInpatientEncountersByPatient.query({ patientId })

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

		// Check if patient has active encounter
		async checkActiveEncounter(patientId: string) {
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.inpatient.getActiveInpatientEncounterByPatient.query({ patientId })

				if (response.success && response.data) {
					return { hasActive: true, encounter: response.data }
				}
				return { hasActive: false, encounter: null }
			} catch (error: any) {
				return { hasActive: false, encounter: null }
			}
		},

		// Create chart/progress note (DOCTOR only)
		async createChart(data: CreateInpatientChartInput) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.inpatient.createInpatientChart.mutate(data)

				if (response.success && response.data) {
					this.charts.unshift(response.data)
					useToast().toast({
						title: 'Success',
						description: 'Chart entry added successfully',
					})
					return { success: true, data: response.data }
				} else {
					this.error = response.message || 'Failed to create chart'
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

		// Get charts by encounter
		async getChartsByEncounter(encounterId: string) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.inpatient.getInpatientChartsByEncounter.query({ encounterId })

				if (response.success && response.data) {
					this.charts = response.data
					return { success: true, data: response.data }
				} else {
					this.error = response.message || 'Failed to fetch charts'
					return { success: false, message: this.error }
				}
			} catch (error: any) {
				this.error = error.message || 'An error occurred'
				return { success: false, message: this.error }
			} finally {
				this.loading = false
			}
		},

		// Create order (DOCTOR only)
		async createOrder(data: CreateInpatientOrderInput) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.inpatient.createInpatientOrder.mutate(data)

				if (response.success && response.data) {
					this.orders.unshift(response.data)
					useToast().toast({
						title: 'Success',
						description: 'Order added successfully',
					})
					return { success: true, data: response.data }
				} else {
					this.error = response.message || 'Failed to create order'
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

		// Get orders by encounter
		async getOrdersByEncounter(encounterId: string) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.inpatient.getInpatientOrdersByEncounter.query({ encounterId })

				if (response.success && response.data) {
					this.orders = response.data
					return { success: true, data: response.data }
				} else {
					this.error = response.message || 'Failed to fetch orders'
					return { success: false, message: this.error }
				}
			} catch (error: any) {
				this.error = error.message || 'An error occurred'
				return { success: false, message: this.error }
			} finally {
				this.loading = false
			}
		},

		// Update order status (DOCTOR only)
		async updateOrder(data: UpdateInpatientOrderInput) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.inpatient.updateInpatientOrder.mutate(data)

				if (response.success && response.data) {
					const index = this.orders.findIndex((o) => o.id === response.data!.id)
					if (index !== -1) {
						this.orders[index] = response.data
					}
					useToast().toast({
						title: 'Success',
						description: 'Order updated successfully',
					})
					return { success: true, data: response.data }
				} else {
					this.error = response.message || 'Failed to update order'
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

		// Delete order (DOCTOR only)
		async deleteOrder(id: string) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.inpatient.deleteInpatientOrder.mutate({ id })

				if (response.success) {
					this.orders = this.orders.filter((o) => o.id !== id)
					useToast().toast({
						title: 'Success',
						description: 'Order deleted successfully',
					})
					return { success: true }
				} else {
					this.error = response.message || 'Failed to delete order'
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

		// Get statistics
		async getStatistics() {
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.inpatient.getInpatientStatistics.query()

				if (response.success && response.data) {
					this.statistics = response.data
					return { success: true, data: response.data }
				}
				return { success: false, message: response.message }
			} catch (error: any) {
				return { success: false, message: error.message }
			}
		},

		// Clear current encounter
		clearCurrentEncounter() {
			this.currentEncounter = null
			this.charts = []
			this.orders = []
		},
	},
})
