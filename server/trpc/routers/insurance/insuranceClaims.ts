import { createInsuranceClaimSchema, deleteInsuranceClaimSchema, getInsuranceClaimSchema, updateInsuranceClaimSchema } from "~/types/insurance"
import { createTRPCRouter, protectedProcedure } from "../../init"

const getInsuranceClaims = protectedProcedure.query(async ({ ctx }) => {
	const { instancePrisma } = ctx

	try {
		const insuranceClaims = await instancePrisma.insuranceClaim.findMany({
			include: {
				provider: true,
				items: true,
			},
		})

		return {
			success: true,
			message: "Insurance claims fetched successfully",
			data: insuranceClaims,
		}
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: "Failed to fetch insurance claims",
			data: null,
		}
	}
})

const getInsuranceClaim = protectedProcedure
	.input(getInsuranceClaimSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const insuranceClaim = await instancePrisma.insuranceClaim.findUnique({
				where: { id },
				include: {
					provider: true,
					items: true,
				},
			})

			return {
				success: true,
				message: "Insurance claim fetched successfully",
				data: insuranceClaim,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to fetch insurance claim",
				data: null,
			}
		}
	})

const createInsuranceClaim = protectedProcedure
	.input(createInsuranceClaimSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { providerId, status, message, amount } = input

		try {
			const insuranceClaim = await instancePrisma.insuranceClaim.create({
				data: {
					providerId,
					status,
					message,
					amount,
				},
				include: {
					provider: true,
				},
			})

			return {
				success: true,
				message: "Insurance claim created successfully",
				data: insuranceClaim,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to create insurance claim",
				data: null,
			}
		}
	})

const updateInsuranceClaim = protectedProcedure
	.input(updateInsuranceClaimSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id, providerId, status, message, amount } = input

		try {
			const insuranceClaim = await instancePrisma.insuranceClaim.update({
				where: { id },
				data: {
					providerId,
					status,
					message,
					amount,
				},
				include: {
					provider: true,
				},
			})

			return {
				success: true,
				message: "Insurance claim updated successfully",
				data: insuranceClaim,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to update insurance claim",
				data: null,
			}
		}
	})

const deleteInsuranceClaim = protectedProcedure
	.input(deleteInsuranceClaimSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const insuranceClaim = await instancePrisma.insuranceClaim.delete({
				where: { id },
			})

			return {
				success: true,
				message: "Insurance claim deleted successfully",
				data: insuranceClaim,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to delete insurance claim",
				data: null,
			}
		}
	})

export const insuranceClaimsRouter = createTRPCRouter({
	getInsuranceClaims,
	getInsuranceClaim,
	createInsuranceClaim,
	updateInsuranceClaim,
	deleteInsuranceClaim,
})