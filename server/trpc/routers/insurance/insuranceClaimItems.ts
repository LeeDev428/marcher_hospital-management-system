import { createInsuranceClaimItemSchema, deleteInsuranceClaimItemSchema, getInsuranceClaimItemSchema, updateInsuranceClaimItemSchema } from "~/types/insurance"
import { createTRPCRouter, protectedProcedure } from "../../init"

const getInsuranceClaimItems = protectedProcedure.query(async ({ ctx }) => {
	const { instancePrisma } = ctx

	try {
		const insuranceClaimItems = await instancePrisma.insuranceClaimItem.findMany({
			include: {
				claim: {
					include: {
						provider: true,
					},
				},
			},
		})

		return {
			success: true,
			message: "Insurance claim items fetched successfully",
			data: insuranceClaimItems,
		}
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: "Failed to fetch insurance claim items",
			data: null,
		}
	}
})

const getInsuranceClaimItem = protectedProcedure
	.input(getInsuranceClaimItemSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const insuranceClaimItem = await instancePrisma.insuranceClaimItem.findUnique({
				where: { id },
				include: {
					claim: {
						include: {
							provider: true,
						},
					},
				},
			})

			return {
				success: true,
				message: "Insurance claim item fetched successfully",
				data: insuranceClaimItem,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to fetch insurance claim item",
				data: null,
			}
		}
	})

const createInsuranceClaimItem = protectedProcedure
	.input(createInsuranceClaimItemSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { claimId, name, description, amount } = input

		try {
			const insuranceClaimItem = await instancePrisma.insuranceClaimItem.create({
				data: {
					claimId,
					name,
					description,
					amount,
				},
				include: {
					claim: {
						include: {
							provider: true,
						},
					},
				},
			})

			return {
				success: true,
				message: "Insurance claim item created successfully",
				data: insuranceClaimItem,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to create insurance claim item",
				data: null,
			}
		}
	})

const updateInsuranceClaimItem = protectedProcedure
	.input(updateInsuranceClaimItemSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id, claimId, name, description, amount } = input

		try {
			const insuranceClaimItem = await instancePrisma.insuranceClaimItem.update({
				where: { id },
				data: {
					claimId,
					name,
					description,
					amount,
				},
				include: {
					claim: {
						include: {
							provider: true,
						},
					},
				},
			})

			return {
				success: true,
				message: "Insurance claim item updated successfully",
				data: insuranceClaimItem,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to update insurance claim item",
				data: null,
			}
		}
	})

const deleteInsuranceClaimItem = protectedProcedure
	.input(deleteInsuranceClaimItemSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const insuranceClaimItem = await instancePrisma.insuranceClaimItem.delete({
				where: { id },
			})

			return {
				success: true,
				message: "Insurance claim item deleted successfully",
				data: insuranceClaimItem,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to delete insurance claim item",
				data: null,
			}
		}
	})

export const insuranceClaimItemsRouter = createTRPCRouter({
	getInsuranceClaimItems,
	getInsuranceClaimItem,
	createInsuranceClaimItem,
	updateInsuranceClaimItem,
	deleteInsuranceClaimItem,
})