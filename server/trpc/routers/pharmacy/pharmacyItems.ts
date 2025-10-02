import { createTRPCRouter, protectedProcedure } from "../../init"
import { createPharmacyItemSchema, deletePharmacyItemSchema, getPharmacyItemSchema, updatePharmacyItemSchema } from "~/types/pharmacy/pharmacyItem"

const getPharmacyItems = protectedProcedure.query(async ({ ctx }) => {
	const { instancePrisma } = ctx

	try {
		const pharmacyItems = await instancePrisma.pharmacyItem.findMany({
			include: {
				brand: true,
				category: true,
			}
		})

		return {
			success: true,
			message: "Pharmacy items fetched successfully",
			data: pharmacyItems,
		}
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: "Failed to fetch pharmacy items",
			data: null,
		}
	}
})

const getPharmacyItem = protectedProcedure
	.input(getPharmacyItemSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx

		try {
			const pharmacyItem = await instancePrisma.pharmacyItem.findUnique({
				where: { id: input.id },
			})

			return {
				success: true,
				message: "Pharmacy item fetched successfully",
				data: pharmacyItem,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to fetch pharmacy item",
				data: null,
			}
		}
	})

const createPharmacyItem = protectedProcedure
	.input(createPharmacyItemSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { brandId, categoryId, name, form, route, strength, stock, unit, sku } = input

		try {
			const pharmacyItem = await instancePrisma.pharmacyItem.create({
				data: {
					brandId,
					categoryId,
					name,
					form,
					route,
					strength,
					stock,
					unit,
					sku,
				}
			})

			return {
				success: true,
				message: "Pharmacy item created successfully",
				data: pharmacyItem,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to create pharmacy item",
				data: null,
			}
		}
	})

const updatePharmacyItem = protectedProcedure
	.input(updatePharmacyItemSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id, brandId, categoryId, name, form, route, strength, stock, unit, sku } = input

		try {
			const pharmacyItem = await instancePrisma.pharmacyItem.update({
				where: { id },
				data: {
					brandId,
					categoryId,
					name,
					form,
					route,
					strength,
					stock,
					unit,
					sku,
				}
			})

			return {
				success: true,
				message: "Pharmacy item updated successfully",
				data: pharmacyItem,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to update pharmacy item",
				data: null,
			}
		}
	})

const deletePharmacyItem = protectedProcedure
	.input(deletePharmacyItemSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const pharmacyItem = await instancePrisma.pharmacyItem.delete({
				where: { id },
			})

			return {
				success: true,
				message: "Pharmacy item deleted successfully",
				data: pharmacyItem,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to delete pharmacy item",
				data: null,
			}
		}
	})

export const pharmacyItemsRouter = createTRPCRouter({
	getPharmacyItems,
	getPharmacyItem,
	createPharmacyItem,
	updatePharmacyItem,
	deletePharmacyItem,
})