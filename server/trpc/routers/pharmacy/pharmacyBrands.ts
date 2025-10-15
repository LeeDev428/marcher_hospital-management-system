import { createPharmacyBrandSchema, deletePharmacyBrandSchema, getPharmacyBrandSchema, updatePharmacyBrandSchema } from "~/types/pharmacy"
import { createTRPCRouter, publicProcedure } from "../../init"

const getPharmacyBrands = publicProcedure.query(async ({ ctx }) => {
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

const getPharmacyBrand = publicProcedure
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

const createPharmacyBrand = publicProcedure
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

const updatePharmacyBrand = publicProcedure
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

const deletePharmacyBrand = publicProcedure
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
