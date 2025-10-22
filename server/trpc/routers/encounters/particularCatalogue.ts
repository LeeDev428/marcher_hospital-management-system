import {
	createParticularCatalogueSchema,
	updateParticularCatalogueSchema,
	deleteParticularCatalogueSchema,
	getParticularCatalogueSchema,
	getParticularCataloguesSchema,
} from "@/types/encounters"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../../init"
import { TRPCError } from "@trpc/server"

// Get all catalogue items with filters (all staff can view)
const getParticularCatalogues = publicProcedure
	.input(getParticularCataloguesSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { type, isActive, search } = input

		try {
			const items = await instancePrisma.particularCatalogue.findMany({
				where: {
					...(type && { type }),
					...(isActive !== undefined && { isActive }),
					...(search && {
						OR: [
							{ name: { contains: search, mode: 'insensitive' } },
							{ description: { contains: search, mode: 'insensitive' } },
						],
					}),
				},
				orderBy: [
					{ isActive: 'desc' }, // Active first
					{ name: 'asc' },
				],
			})

			return {
				success: true,
				message: "Catalogue items fetched successfully.",
				data: items,
			}
		} catch (error) {
			console.error("Get catalogue items error:", error)
			return {
				success: false,
				message: "Failed to fetch catalogue items.",
				data: null,
			}
		}
	})

// Get single catalogue item
const getParticularCatalogue = protectedProcedure
	.input(getParticularCatalogueSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const item = await instancePrisma.particularCatalogue.findUnique({
				where: { id },
				include: {
					orders: {
						take: 10, // Show last 10 uses
						orderBy: { createdAt: 'desc' },
					},
				},
			})

			if (!item) {
				return {
					success: false,
					message: "Catalogue item not found.",
					data: null,
				}
			}

			return {
				success: true,
				message: "Catalogue item fetched successfully.",
				data: item,
			}
		} catch (error) {
			console.error("Get catalogue item error:", error)
			return {
				success: false,
				message: "Failed to fetch catalogue item.",
				data: null,
			}
		}
	})

// Create catalogue item (BILLING_STAFF only)
const createParticularCatalogue = protectedProcedure
	.input(createParticularCatalogueSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma, user } = ctx

		// Check user role - only billing staff can create
		if (!user || user.role !== 'STAFF') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only billing staff can manage catalogue items',
			})
		}

		const staffUser = await instancePrisma.user.findUnique({
			where: { id: user.id },
			include: { staffCredentials: true },
		})

		if (!staffUser?.staffCredentials || staffUser.staffCredentials.staffType !== 'BILLING_STAFF') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only billing staff can manage catalogue items',
			})
		}

		const { type, name, description, cost, isActive } = input

		try {
			const item = await instancePrisma.particularCatalogue.create({
				data: {
					type,
					name,
					description,
					cost,
					isActive: isActive !== undefined ? isActive : true,
				},
			})

			return {
				success: true,
				message: "Catalogue item created successfully.",
				data: item,
			}
		} catch (error) {
			console.error("Create catalogue item error:", error)
			return {
				success: false,
				message: "Failed to create catalogue item.",
				data: null,
			}
		}
	})

// Update catalogue item (BILLING_STAFF only)
const updateParticularCatalogue = protectedProcedure
	.input(updateParticularCatalogueSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma, user } = ctx

		// Check user role - only billing staff can update
		if (!user || user.role !== 'STAFF') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only billing staff can manage catalogue items',
			})
		}

		const staffUser = await instancePrisma.user.findUnique({
			where: { id: user.id },
			include: { staffCredentials: true },
		})

		if (!staffUser?.staffCredentials || staffUser.staffCredentials.staffType !== 'BILLING_STAFF') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only billing staff can manage catalogue items',
			})
		}

		const { id, type, name, description, cost, isActive } = input

		try {
			const item = await instancePrisma.particularCatalogue.update({
				where: { id },
				data: {
					...(type !== undefined && { type }),
					...(name !== undefined && { name }),
					...(description !== undefined && { description }),
					...(cost !== undefined && { cost }),
					...(isActive !== undefined && { isActive }),
				},
			})

			return {
				success: true,
				message: "Catalogue item updated successfully.",
				data: item,
			}
		} catch (error) {
			console.error("Update catalogue item error:", error)
			return {
				success: false,
				message: "Failed to update catalogue item.",
				data: null,
			}
		}
	})

// Delete catalogue item (BILLING_STAFF only)
const deleteParticularCatalogue = protectedProcedure
	.input(deleteParticularCatalogueSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma, user } = ctx

		// Check user role - only billing staff can delete
		if (!user || user.role !== 'STAFF') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only billing staff can manage catalogue items',
			})
		}

		const staffUser = await instancePrisma.user.findUnique({
			where: { id: user.id },
			include: { staffCredentials: true },
		})

		if (!staffUser?.staffCredentials || staffUser.staffCredentials.staffType !== 'BILLING_STAFF') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only billing staff can manage catalogue items',
			})
		}

		const { id } = input

		try {
			// Check if item is being used in any orders
			const itemWithOrders = await instancePrisma.particularCatalogue.findUnique({
				where: { id },
				include: {
					orders: {
						take: 1,
					},
				},
			})

			if (itemWithOrders && itemWithOrders.orders.length > 0) {
				return {
					success: false,
					message: "Cannot delete catalogue item that is being used in orders. Consider disabling it instead.",
					data: null,
				}
			}

			await instancePrisma.particularCatalogue.delete({
				where: { id },
			})

			return {
				success: true,
				message: "Catalogue item deleted successfully.",
				data: null,
			}
		} catch (error) {
			console.error("Delete catalogue item error:", error)
			return {
				success: false,
				message: "Failed to delete catalogue item.",
				data: null,
			}
		}
	})

export const particularCatalogueRouter = createTRPCRouter({
	getParticularCatalogues,
	getParticularCatalogue,
	createParticularCatalogue,
	updateParticularCatalogue,
	deleteParticularCatalogue,
})
