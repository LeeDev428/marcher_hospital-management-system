import { createTRPCRouter, protectedProcedure, publicProcedure } from "../../init"
import { staffRoleSchema, getStaffProfileSchema, createStaffProfileSchema, updateStaffProfileSchema, deleteStaffProfileSchema } from "@/types/staff"
import { z } from "zod"

const getStaffProfiles = publicProcedure
	.input(staffRoleSchema.optional())
	.query(async ({ ctx, input }) => {
		const { globalPrisma } = ctx
		const role = input ?? undefined

		try {
			const staff = await globalPrisma.staffProfile.findMany({
				where: {
					role,
				}
			})

			return {
				success: true,
				message: "Staff fetched successfully.",
				data: staff,
			}
		} catch(error) {
			console.log(error)
			return {
				success: false,
				message: "Failed to fetch staff.",
				data: null,
			}
		}
	})

const getStaffProfile = protectedProcedure
	.input(getStaffProfileSchema)
	.query(async ({ ctx, input }) => {
		const { globalPrisma } = ctx
		const { id } = input

		try {
			const staff = await globalPrisma.staffProfile.findUnique({
				where: {
					id,
				}
			})

			return {
				success: true,
				message: "Staff fetched successfully.",
				data: staff,
			}
		} catch(error) {
			console.log(error)
			return {
				success: false,
				message: "Failed to fetch staff.",
				data: null,
			}
		}
	})

const createStaffProfile = protectedProcedure
	.input(createStaffProfileSchema)
	.mutation(async ({ ctx, input }) => {
		const { globalPrisma } = ctx
		const { lastName, firstName, middleName, suffix, role, profession } = input

		try {
			const staff = await globalPrisma.staffProfile.create({
				data: {
					lastName,
					firstName,
					middleName,
					suffix,
					role,
					profession,
				}
			})

			return {
				success: true,
				message: "Staff created successfully.",
				data: staff,
			}
		} catch(error) {
			console.log(error)
			return {
				success: false,
				message: "Failed to create staff.",
				data: null,
			}
		}
	})

const updateStaffProfile = protectedProcedure
	.input(updateStaffProfileSchema)
	.mutation(async ({ ctx, input }) => {
		const { globalPrisma } = ctx
		const { id, lastName, firstName, middleName, suffix, role, profession } = input

		try {
			const staff = await globalPrisma.staffProfile.update({
				where: {
					id,
				},
				data: {
					lastName,
					firstName,
					middleName,
					suffix,
					role,
					profession,
				}
			})

			return {
				success: true,
				message: "Staff updated successfully.",
				data: staff,
			}
		} catch(error) {
			console.log(error)
			return {
				success: false,
				message: "Failed to update staff.",
				data: null,
			}
		}
	})

const deleteStaffProfile = protectedProcedure
	.input(deleteStaffProfileSchema)
	.mutation(async ({ ctx, input }) => {
		const { globalPrisma } = ctx
		const { id } = input

		try {
			const staff = await globalPrisma.staffProfile.delete({
				where: {
					id,
				}
			})

			return {
				success: true,
				message: "Staff deleted successfully.",
				data: staff,
			}
		} catch(error) {
			console.log(error)
			return {
				success: false,
				message: "Failed to delete staff.",
				data: null,
			}
		}
	})

// New endpoint to get staff by type from instance database
const getStaffByType = publicProcedure
	.input(z.enum(["DOCTOR", "NURSE", "STAFF", "ADMISSIONS_STAFF", "BILLING_STAFF", "PHARMACIST"]).optional())
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const staffType = input ?? undefined

		try {
			const staff = await instancePrisma.user.findMany({
				where: {
					staffCredentials: {
						...(staffType && { staffType }),
					},
				},
				include: {
					staffCredentials: true,
				},
			})

			return {
				success: true,
				message: "Staff fetched successfully.",
				data: staff,
			}
		} catch(error) {
			console.log(error)
			return {
				success: false,
				message: "Failed to fetch staff.",
				data: null,
			}
		}
	})

export const staffProfilesRouter = createTRPCRouter({
	getStaffProfiles,
	getStaffProfile,
	getStaffByType,
	createStaffProfile,
	updateStaffProfile,
	deleteStaffProfile,
})