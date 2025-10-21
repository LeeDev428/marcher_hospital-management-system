import { defineStore } from 'pinia'
import type {
	ParticularCatalogue,
	CreateParticularInput,
	UpdateParticularInput,
} from '~/types/encounters/particularCatalogue'

interface ParticularCatalogueState {
	particulars: ParticularCatalogue[]
	currentParticular: ParticularCatalogue | null
	loading: boolean
	error: string | null
}

export const useParticularCatalogueStore = defineStore('particularCatalogue', {
	state: (): ParticularCatalogueState => ({
		particulars: [],
		currentParticular: null,
		loading: false,
		error: null,
	}),

	getters: {
		activeParticulars: (state) => state.particulars.filter((p) => p.isActive),
		particularsByType: (state) => (type: string) =>
			state.particulars.filter((p) => p.type === type && p.isActive),
	},

	actions: {
		// Create new particular (BILLING_STAFF only)
		async createParticular(data: CreateParticularInput) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.particulars.createParticular.mutate(data)

				if (response.success && response.data) {
					this.particulars.unshift(response.data)
					useToast().toast({
						title: 'Success',
						description: 'Particular added successfully',
					})
					return { success: true, data: response.data }
				} else {
					this.error = response.message || 'Failed to create particular'
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

		// Update particular (BILLING_STAFF only)
		async updateParticular(data: UpdateParticularInput) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.particulars.updateParticular.mutate(data)

				if (response.success && response.data) {
					const index = this.particulars.findIndex((p) => p.id === response.data!.id)
					if (index !== -1) {
						this.particulars[index] = response.data
					}
					if (this.currentParticular?.id === response.data.id) {
						this.currentParticular = response.data
					}
					useToast().toast({
						title: 'Success',
						description: 'Particular updated successfully',
					})
					return { success: true, data: response.data }
				} else {
					this.error = response.message || 'Failed to update particular'
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

		// Delete particular (BILLING_STAFF only)
		async deleteParticular(id: string) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.particulars.deleteParticular.mutate({ id })

				if (response.success) {
					this.particulars = this.particulars.filter((p) => p.id !== id)
					useToast().toast({
						title: 'Success',
						description: 'Particular deleted successfully',
					})
					return { success: true }
				} else {
					this.error = response.message || 'Failed to delete particular'
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

		// Get particular by ID
		async getParticularById(id: string) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.particulars.getParticularById.query({ id })

				if (response.success && response.data) {
					this.currentParticular = response.data
					return { success: true, data: response.data }
				} else {
					this.error = response.message || 'Particular not found'
					return { success: false, message: this.error }
				}
			} catch (error: any) {
				this.error = error.message || 'An error occurred'
				return { success: false, message: this.error }
			} finally {
				this.loading = false
			}
		},

		// Get all particulars with filters
		async getAllParticulars(filters?: {
			type?: string
			isActive?: boolean
			search?: string
		}) {
			this.loading = true
			this.error = null
			try {
				const { $trpc } = useNuxtApp()
				const response = await $trpc.encounters.particulars.getAllParticulars.query(filters || {})

				if (response.success && response.data) {
					this.particulars = response.data
					return { success: true, data: response.data }
				} else {
					this.error = response.message || 'Failed to fetch particulars'
					return { success: false, message: this.error }
				}
			} catch (error: any) {
				this.error = error.message || 'An error occurred'
				return { success: false, message: this.error }
			} finally {
				this.loading = false
			}
		},

		// Clear current particular
		clearCurrentParticular() {
			this.currentParticular = null
		},
	},
})
