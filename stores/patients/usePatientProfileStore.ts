import { defineStore } from "pinia"
import type { Query } from "@/types/app/query"
import type { TablePatientProfile, CreatePatientProfile, UpdatePatientProfile } from "@/types/patients/patientProfile"

export const usePatientProfileStore = defineStore("patientProfile", {
	state: () => ({
		loading: true,
		error: false,
		patientProfile: null as CreatePatientProfile | UpdatePatientProfile | null,
		patientProfiles: [] as TablePatientProfile[],
	}),

	actions: {
		async getPatientProfile(id: string) {
			const { $trpc } = useNuxtApp()
			
			try {
				this.loading = true
				this.error = false
				const { success, message, data } = await $trpc.patients.profiles.getPatientProfile.query({ id })
			
				if (success && data) {
					this.patientProfile = {
						...data,
					}
				}

				this.loading = false
				return {
					success,
					message,
				}
			} catch (error) {
				console.error(error)
				this.loading = false
				this.error = true
				useToast(
					"error",
					"Patient",
					"Failed to get patient profile"
				)
			}
		},

		async getActivePatientProfiles(query: Query) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				this.error = false
				const { success, message, data } = await $trpc.patients.profiles.getActivePatientProfiles.query({
					search: query.search,
					page: query.page,
					limit: query.limit,
				})
	
				if (success) {
					this.patientProfiles = data
				}
	
				this.loading = false
				return {
					success,
					message,
				}
			} catch (error) {
				console.error(error)
				this.loading = false
				this.error = true
				useToast(
					"error",
					"Patient",
					"Failed to get active patient profiles"
				)
			}
		},

		async getArchivedPatientProfiles(query: Query) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				this.error = false
				const { success, message, data } = await $trpc.patients.profiles.getArchivedPatientProfiles.query({
					search: query.search,
					page: query.page,
					limit: query.limit,
				})
	
				if (success) {
					this.patientProfiles = data
				}

				this.loading = false
				return {
					success,
					message,
				}
			} catch (error) {
				console.error(error)
				this.loading = false
				this.error = true
				useToast(
					"error",
					"Patient",
					"Failed to get archived patient profiles"
				)
			}
		},

		async createPatientProfile(patient: CreatePatientProfile) {
			const { $trpc } = useNuxtApp()

			try {
				const { success, message, id } = await $trpc.patients.profiles.createPatientProfile.mutate(patient)

				if (success) {
					useToast(
						"success",
						"Patient",
						"Profile successfully created"
					)
					return {
						success: true,
						message,
						id,
					}
				}

				return {
					success: false,
					message,
					id,
				}
			} catch (error) {
				console.error(error)
				useToast(
					"error",
					"Patient",
					"Failed to create patient profile"
				)
			}
		},

		async updatePatientProfile(patient: UpdatePatientProfile) {
			const { $trpc } = useNuxtApp()

			try {
				const { success, message, id } = await $trpc.patients.profiles.updatePatientProfile.mutate({
					...patient,
				})
	
				if (success) {
					useToast(
						"success",
						"Patient",
						"Profile successfully updated"
					)

					return {
						success: true,
						message,
						id,
					}
				}

				return {
					success: false,
					message,
					id,
				}
			} catch (error) {
				console.error(error)
				useToast(
					"error",
					"Patient",
					"Failed to update patient profile"
				)
			} 
		},

		async archivePatientProfile(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				const { success, message } = await $trpc.patients.profiles.archivePatientProfile.mutate({ id })

				if (success) {
					await this.getActivePatientProfiles({
						search: "",
						page: 1,
						limit: 10,
					})

					useToast(
						"success",
						"Patient",
						"Profile successfully archived"
					)
				}
			} catch (error) {
				console.error(error)
				useToast(
					"error",
					"Patient",
					"Failed to archive patient profile"
				)
			}
		},

		async unarchivePatientProfile(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				const { success, message } = await $trpc.patients.profiles.unarchivePatientProfile.mutate({ id })

				if (success) {
					await this.getArchivedPatientProfiles({
						search: "",
						page: 1,
						limit: 10,
					})

					useToast(
						"success",
						"Patient",
						"Profile successfully unarchived"
					)
				}
			} catch (error) {
				console.error(error)
				useToast(
					"error",
					"Patient",
					"Failed to unarchive patient profile"
				)
			}
		}
	},
})
