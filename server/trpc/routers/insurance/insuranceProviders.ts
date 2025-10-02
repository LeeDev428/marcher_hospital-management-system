import { createInsuranceProviderSchema, deleteInsuranceProviderSchema, getInsuranceProviderSchema, updateInsuranceProviderSchema } from "~/types/insurance"
import { createTRPCRouter, protectedProcedure } from "../../init"

const getInsuranceProviders = protectedProcedure.query(async ({ ctx }) => {
	const { instancePrisma } = ctx

	try {
		const insuranceProviders = await instancePrisma.insuranceProvider.findMany({
			include: {
				_count: {
					select: {
						claims: true,
					},
				},
			},
		})

		return {
			success: true,
			message: "Insurance providers fetched successfully",
			data: insuranceProviders,
		}
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: "Failed to fetch insurance providers",
			data: null,
		}
	}
})

const getInsuranceProvider = protectedProcedure
	.input(getInsuranceProviderSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const insuranceProvider = await instancePrisma.insuranceProvider.findUnique({
				where: { id },
				include: {
					claims: {
						include: {
							items: true,
						},
					},
				},
			})

			return {
				success: true,
				message: "Insurance provider fetched successfully",
				data: insuranceProvider,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to fetch insurance provider",
				data: null,
			}
		}
	})

const createInsuranceProvider = protectedProcedure
	.input(createInsuranceProviderSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { name, description, email, phone, address, city, state, zip, country } = input

		try {
			const insuranceProvider = await instancePrisma.insuranceProvider.create({
				data: {
					name,
					description,
					email,
					phone,
					address,
					city,
					state,
					zip,
					country,
				}
			})

			return {
				success: true,
				message: "Insurance provider created successfully",
				data: insuranceProvider,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to create insurance provider",
				data: null,
			}
		}
	})

const updateInsuranceProvider = protectedProcedure
	.input(updateInsuranceProviderSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id, name, description, email, phone, address, city, state, zip, country } = input

		try {
			const insuranceProvider = await instancePrisma.insuranceProvider.update({
				where: { id },
				data: {
					name,
					description,
					email,
					phone,
					address,
					city,
					state,
					zip,
					country,
				}
			})
			
			return {
				success: true,
				message: "Insurance provider updated successfully",
				data: insuranceProvider,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to update insurance provider",
				data: null,
			}
		}
	})

const deleteInsuranceProvider = protectedProcedure
	.input(deleteInsuranceProviderSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input
		
		try {
			const insuranceProvider = await instancePrisma.insuranceProvider.delete({
				where: { id },
			})

			return {
				success: true,
				message: "Insurance provider deleted successfully",
				data: insuranceProvider,
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: "Failed to delete insurance provider",
				data: null,
			}
		}
	})

export const insuranceProvidersRouter = createTRPCRouter({
	getInsuranceProviders,
	getInsuranceProvider,
	createInsuranceProvider,
	updateInsuranceProvider,
	deleteInsuranceProvider,
})