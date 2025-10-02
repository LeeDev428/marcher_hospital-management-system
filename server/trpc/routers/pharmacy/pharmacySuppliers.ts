import { createTRPCRouter, protectedProcedure } from "../../init"
import { createPharmacySupplierSchema, deletePharmacySupplierSchema, getPharmacySupplierSchema, updatePharmacySupplierSchema } from "~/types/pharmacy"

const getPharmacySuppliers = protectedProcedure.query(async ({ ctx }) => {
	const { instancePrisma } = ctx

	try {
		const pharmacySuppliers = await instancePrisma.pharmacySupplier.findMany()

		return {
			success: true,
			message: "Pharmacy suppliers fetched successfully",
			data: pharmacySuppliers,
		}
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: "Failed to fetch pharmacy suppliers",
			data: null,
		}
	}
})

const getPharmacySupplier = protectedProcedure
	.input(getPharmacySupplierSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const pharmacySupplier = await instancePrisma.pharmacySupplier.findUnique({
				where: { id },
			})

			return {
				success: true,
				message: "Pharmacy supplier fetched successfully",
				data: pharmacySupplier,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to fetch pharmacy supplier",
				data: null,
			}
		}
	})

const createPharmacySupplier = protectedProcedure
	.input(createPharmacySupplierSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { name, email, contact, address, notes } = input

		try {
			const pharmacySupplier = await instancePrisma.pharmacySupplier.create({
				data: {
					name,
					email,
					contact,
					address,
				}
			})

			return {
				success: true,
				message: "Pharmacy supplier created successfully",
				data: pharmacySupplier,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to create pharmacy supplier",
				data: null,
			}
		}
	})

const updatePharmacySupplier = protectedProcedure
	.input(updatePharmacySupplierSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id, name, email, contact, address, notes } = input

		try {
			const pharmacySupplier = await instancePrisma.pharmacySupplier.update({
				where: { id },
				data: {
					name,
					email,
					contact,
					address,
					notes,
				}
			})

			return {
				success: true,
				message: "Pharmacy supplier updated successfully",
				data: pharmacySupplier,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to update pharmacy supplier",
				data: null,
			}
		}
	})

const deletePharmacySupplier = protectedProcedure
	.input(deletePharmacySupplierSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const pharmacySupplier = await instancePrisma.pharmacySupplier.delete({
				where: { id },
			})

			return {
				success: true,
				message: "Pharmacy supplier deleted successfully",
				data: pharmacySupplier,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to delete pharmacy supplier",
				data: null,
			}
		}
	})

export const pharmacySuppliersRouter = createTRPCRouter({
	getPharmacySuppliers,
	getPharmacySupplier,
	createPharmacySupplier,
	updatePharmacySupplier,
	deletePharmacySupplier,
})