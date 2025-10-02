import { createTRPCRouter, protectedProcedure } from "@/server/trpc/init"
import { getBuildingSchema, createBuildingSchema, updateBuildingSchema, deleteBuildingSchema } from "@/types/facilities"
import { TRPCError } from "@trpc/server"
import { v4 as uuidv4 } from "uuid"
import { createLog } from "@/util/logs"

const getBuildings = protectedProcedure.query(async ({ ctx }) => {
	const { instancePrisma } = ctx

	try {
		const buildings = await instancePrisma.building.findMany()

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

const getBuilding = protectedProcedure
	.input(getBuildingSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const building = await instancePrisma.building.findUnique({
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

const createBuilding = protectedProcedure
	.input(createBuildingSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma, event } = ctx
		const { name } = input

		try {
			const building = await instancePrisma.building.create({
				data: { name },
			})

			await createLog({
				user: `${ctx.user.firstName} ${ctx.user.lastName}`,
				action: "Created",
				entity: "building",
				ipAddress: event.headers.get("x-forwarded-for") ?? "Unknown",
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

const updateBuilding = protectedProcedure
	.input(updateBuildingSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma, event } = ctx
		const { id, name } = input

		try {
			const building = await instancePrisma.building.update({
				where: { id },
				data: { name },
			})

			await createLog({
				user: `${ctx.user.firstName} ${ctx.user.lastName}`,
				action: "Updated",
				entity: "building",
				ipAddress: event.headers.get("x-forwarded-for") ?? "Unknown",
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

const deleteBuilding = protectedProcedure
	.input(deleteBuildingSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma, event } = ctx
		const { id } = input

		try {
			const building = await instancePrisma.building.delete({
				where: { id },
			})

			await createLog({
				user: `${ctx.user.firstName} ${ctx.user.lastName}`,
				action: "Deleted",
				entity: "building",
				ipAddress: event.headers.get("x-forwarded-for") ?? "Unknown",
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
