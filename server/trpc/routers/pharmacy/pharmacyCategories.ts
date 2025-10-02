import { createPharmacyCategorySchema, deletePharmacyCategorySchema, getPharmacyCategorySchema, updatePharmacyCategorySchema } from "~/types/pharmacy"
import { createTRPCRouter, protectedProcedure } from "../../init"

const getPharmacyCategories = protectedProcedure.query(async ({ ctx }) => {
	const { instancePrisma } = ctx

	try {
		const pharmacyCategories = await instancePrisma.pharmacyItemCategory.findMany()

		return {
			success: true,
			message: "Pharmacy categories fetched successfully",
			data: pharmacyCategories,
		}
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: "Failed to fetch pharmacy categories",
			data: null,
		}
	}
})

const getPharmacyCategory = protectedProcedure
	.input(getPharmacyCategorySchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const pharmacyCategory = await instancePrisma.pharmacyItemCategory.findUnique({
				where: { id },
			})

			return {
				success: true,
				message: "Pharmacy category fetched successfully",
				data: pharmacyCategory,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to fetch pharmacy category",
				data: null,
			}
		}
	})

const createPharmacyCategory = protectedProcedure
	.input(createPharmacyCategorySchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { name } = input

		try {
			const pharmacyCategory = await instancePrisma.pharmacyItemCategory.create({
				data: {
					name,
				}
			})

			return {
				success: true,
				message: "Pharmacy category created successfully",
				data: pharmacyCategory,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to create pharmacy category",
				data: null,
			}
		}
	})

const updatePharmacyCategory = protectedProcedure
	.input(updatePharmacyCategorySchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id, name } = input

		try {
			const pharmacyCategory = await instancePrisma.pharmacyItemCategory.update({
				where: { id },
				data: {
					name,
				}
			})
			
			return {
				success: true,
				message: "Pharmacy category updated successfully",
				data: pharmacyCategory,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to update pharmacy category",
				data: null,
			}
		}
	})

const deletePharmacyCategory = protectedProcedure
	.input(deletePharmacyCategorySchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const pharmacyCategory = await instancePrisma.pharmacyItemCategory.delete({
				where: { id },
			})

			return {
				success: true,
				message: "Pharmacy category deleted successfully",
				data: pharmacyCategory,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to delete pharmacy category",
				data: null,
			}
		}
	})

export const pharmacyCategoriesRouter = createTRPCRouter({
	getPharmacyCategories,
	getPharmacyCategory,
	createPharmacyCategory,
	updatePharmacyCategory,
	deletePharmacyCategory,
})