import { createPharmacyBrandSchema, deletePharmacyBrandSchema, getPharmacyBrandSchema, updatePharmacyBrandSchema } from "~/types/pharmacy"
import { createTRPCRouter, protectedProcedure } from "../../init"

const getPharmacyBrands = protectedProcedure.query(async ({ ctx }) => {
	const { instancePrisma } = ctx

	try {
		const pharmacyBrands = await instancePrisma.pharmacyBrand.findMany()

		return {
			success: true,
			message: "Pharmacy brands fetched successfully",
			data: pharmacyBrands,
		}
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: "Failed to fetch pharmacy brands",
			data: null,
		}
	}
})

const getPharmacyBrand = protectedProcedure
	.input(getPharmacyBrandSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const pharmacyBrand = await instancePrisma.pharmacyBrand.findUnique({
				where: { id },
			})

			return {
				success: true,
				message: "Pharmacy brand fetched successfully",
				data: pharmacyBrand,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to fetch pharmacy brand",
				data: null,
			}
		}
	})

const createPharmacyBrand = protectedProcedure
	.input(createPharmacyBrandSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { name } = input

		try {
			const pharmacyBrand = await instancePrisma.pharmacyBrand.create({
				data: {
					name,
				}
			})

			return {
				success: true,
				message: "Pharmacy brand created successfully",
				data: pharmacyBrand,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to create pharmacy brand",
				data: null,
			}
		}
	})

const updatePharmacyBrand = protectedProcedure
	.input(updatePharmacyBrandSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id, name } = input

		try {
			const pharmacyBrand = await instancePrisma.pharmacyBrand.update({
				where: { id },
				data: {
					name,
				}
			})
			
			return {
				success: true,
				message: "Pharmacy brand updated successfully",
				data: pharmacyBrand,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to update pharmacy brand",
				data: null,
			}
		}
	})

const deletePharmacyBrand = protectedProcedure
	.input(deletePharmacyBrandSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input
		
		try {
			const pharmacyBrand = await instancePrisma.pharmacyBrand.delete({
				where: { id },
			})

			return {
				success: true,
				message: "Pharmacy brand deleted successfully",
				data: pharmacyBrand,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to delete pharmacy brand",
				data: null,
			}
		}
	})

export const pharmacyBrandsRouter = createTRPCRouter({
	getPharmacyBrands,
	getPharmacyBrand,
	createPharmacyBrand,
	updatePharmacyBrand,
	deletePharmacyBrand,
})