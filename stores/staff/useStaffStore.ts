import { defineStore } from "pinia"
import type { CreateStaffProfile, UpdateStaffProfile, TableStaffProfile, GetStaffProfile, DeleteStaffProfile, StaffRole } from "@/types/staff"

export const useStaffStore = defineStore("staff", {
	state: () => ({
		loading: true,
		staffProfile: null as CreateStaffProfile | UpdateStaffProfile | null,
		staffProfiles: [] as TableStaffProfile[],
	}),

	actions: {
		async getStaffProfiles(input?: StaffRole) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.users.list.query()

				if (success && data) {
					// Filter for staff members only and map to expected format
					const staffMembers = data
						.filter(user => user.role === 'STAFF')
						.map(user => ({
							id: user.id,
							firstName: user.firstName,
							lastName: user.lastName,
							middleName: user.middleName || null,
							suffix: null, // Not stored in user table, so default to null
							email: user.email,
							phone: user.phone,
							role: user.staffCredentials?.staffType || 'OTHER',
							department: user.staffCredentials?.department || '',
							specialization: user.staffCredentials?.specialization || '',
							position: user.staffCredentials?.position || '',
							licenseNumber: user.staffCredentials?.licenseNumber || '',
							profession: user.staffCredentials?.specialization || '', // Use specialization as profession
							createdAt: user.createdAt,
							updatedAt: user.updatedAt,
						}))

					// Filter by specific staff role if provided
					this.staffProfiles = input ? staffMembers.filter(staff => staff.role === input) : staffMembers
					this.loading = false
					return {
						success: true,
						message: "Staff profiles fetched successfully.",
						data: this.staffProfiles,
					}
				}

				this.loading = false
				return {
					success,
					message,
					data: [],
				}
			} catch(error) {
				console.log(error)
				this.loading = false
				return {
					success: false,
					message: "Failed to fetch staff profiles.",
					data: null,
				}
			}
		},

		async getStaffProfile(input: GetStaffProfile) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.staff.profiles.getStaffProfile.query(input)

				if (success && data) {
					this.staffProfile = data
					this.loading = false
					return {
						success,
						message,
						data,
					}
				}

				this.loading = false
				return {
					success,
					message,
					data,
				}
			} catch(error) {
				console.log(error)
				this.loading = false
				return {
					success: false,
					message: "Failed to fetch staff profile.",
					data: null,
				}
			}
		},

		async createStaffProfile(input: CreateStaffProfile) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.staff.profiles.createStaffProfile.mutate(input)

				if (success && data) {
					this.staffProfile = data
					this.loading = false
					useToast(
						"success",
						"Staff",
						"Profile created successfully.",
					)
					await navigateTo("/staff")
				}

				this.loading = false
				return {
					success,
					message,
					data,
				}
			} catch(error) {
				console.log(error)
				this.loading = false
				useToast(
					"error",
					"Staff",
					"Failed to create staff profile.",
				)
			}
		},

		async updateStaffProfile(input: UpdateStaffProfile) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.staff.profiles.updateStaffProfile.mutate(input)

				if (success && data) {
					this.staffProfile = data
					this.loading = false
					useToast(
						"success",
						"Staff",
						"Profile updated successfully.",
					)
					await navigateTo("/staff")
				}

				this.loading = false
				return {
					success,
					message,
					data,
				}
			} catch(error) {
				console.log(error)
				this.loading = false
				useToast(
					"error",
					"Staff",
					"Failed to update staff profile.",
				)
			}
		},

		async deleteStaffProfile(input: DeleteStaffProfile) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.staff.profiles.deleteStaffProfile.mutate(input)

				if (success && data) {
					this.staffProfiles = this.staffProfiles.filter((staff) => staff.id !== input.id)
					this.loading = false
					useToast(
						"success",
						"Staff",
						"Profile deleted successfully.",
					)
				}

				this.loading = false
				return {
					success,
					message,
					data,
				}
			} catch(error) {
				console.log(error)
				this.loading = false
				useToast(
					"error",
					"Staff",
					"Failed to delete staff profile.",
				)
			}
		},
	},
})