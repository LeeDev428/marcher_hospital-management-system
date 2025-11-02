import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/trpc/init"
import { getBuildingSchema, createBuildingSchema, updateBuildingSchema, deleteBuildingSchema } from "@/types/facilities"
import { TRPCError } from "@trpc/server"
import { v4 as uuidv4 } from "uuid"
import { createLog } from "@/util/logs"

const getBuildings = publicProcedure.query(async ({ ctx }) => {
	try {
		const buildings = await ctx.instancePrisma.building.findMany()

		return {
			success: true,
			message: "Buildings fetched successfully.",
			data: buildings,
		}
	} catch (error) {
		console.log(error)
		return {
			success: false,
			message: "Failed to fetch buildings.",
			data: null,
		}
	}
})

const getBuilding = publicProcedure
	.input(getBuildingSchema)
	.query(async ({ ctx, input }) => {
		const { id } = input

		try {
			const building = await ctx.instancePrisma.building.findUnique({
				where: { id },
			})

			if (!building) {
				return {
					success: false,
					message: "Building not found.",
					data: null,
				}
			}

			return {
				success: true,
				message: "Building fetched successfully.",
				data: building,
			}
		} catch (error) {
			console.log(error)
			return {
				success: false,
				message: "Failed to fetch building.",
				data: null,
			}
		}
	})

const createBuilding = publicProcedure
	.input(createBuildingSchema)
	.mutation(async ({ ctx, input }) => {
		const { name } = input

		try {
			const building = await ctx.instancePrisma.building.create({
				data: { name },
			})

			await createLog({
				user: "Staff User",
				action: "Created",
				entity: "building",
				ipAddress: ctx.event.headers.get("x-forwarded-for") ?? "Unknown",
			})

			return {
				success: true,
				message: "Building created successfully.",
				data: building,
			}
		} catch (error) {
			console.log(error)
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to create building.",
			})
		}
	})

const updateBuilding = publicProcedure
	.input(updateBuildingSchema)
	.mutation(async ({ ctx, input }) => {
		const { id, name } = input

		try {
			const building = await ctx.instancePrisma.building.update({
				where: { id },
				data: { name },
			})

			await createLog({
				user: "Staff User",
				action: "Updated",
				entity: "building",
				ipAddress: ctx.event.headers.get("x-forwarded-for") ?? "Unknown",
			})

			return {
				success: true,
				message: "Building updated successfully.",
				data: building,
			}
		} catch (error) {
			console.log(error)
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to update building.",
			})
		}
	})

const deleteBuilding = publicProcedure
	.input(deleteBuildingSchema)
	.mutation(async ({ ctx, input }) => {
		const { id } = input

		try {
			const building = await ctx.instancePrisma.building.delete({
				where: { id },
			})

			await createLog({
				user: "Staff User",
				action: "Deleted",
				entity: "building",
				ipAddress: ctx.event.headers.get("x-forwarded-for") ?? "Unknown",
			})

			return {
				success: true,
				message: "Building deleted successfully.",
				data: building,
			}
		} catch (error) {
			console.log(error)
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to delete building.",
			})
		}
	})

export const buildingsRouter = createTRPCRouter({
	getBuildings,
	getBuilding,
	createBuilding,
	updateBuilding,
	deleteBuilding,
})
