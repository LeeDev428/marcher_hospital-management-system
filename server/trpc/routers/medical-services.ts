import { createTRPCRouter, publicProcedure } from "../init"
import {
  createMedicalServiceSchema,
  updateMedicalServiceSchema,
  getMedicalServiceSchema,
  getMedicalServicesSchema,
  deleteMedicalServiceSchema,
} from "@/types/medical-services"
import { Prisma } from "@/prisma/generated/instance/client"

export const medicalServicesRouter = createTRPCRouter({
  // Get all medical services with filters and pagination
  getMedicalServices: publicProcedure
    .input(getMedicalServicesSchema)
    .query(async ({ input, ctx }) => {
      try {
        const { staffId, type, category, isActive, search, page, limit } = input
        const { instancePrisma } = ctx

        // Build where clause
        const where: Prisma.MedicalServiceWhereInput = {}

        if (staffId) where.staffId = staffId
        if (type) where.type = type
        if (category) where.category = category
        if (isActive !== undefined) where.isActive = isActive

        // Search by name or description
        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        }

        // Get total count
        const total = await instancePrisma.medicalService.count({ where })

        // Get paginated data with staff info
        const services = await instancePrisma.medicalService.findMany({
          where,
          include: {
            staff: {
              select: {
                firstName: true,
                lastName: true,
                middleName: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        })

        // Convert Decimal and Date types to JSON-safe formats
        const servicesData = services.map(service => ({
          id: service.id,
          staffId: service.staffId,
          name: service.name,
          type: service.type,
          category: service.category,
          description: service.description,
          price: service.price.toString(),
          duration: service.duration,
          isActive: service.isActive,
          requirements: service.requirements,
          notes: service.notes,
          createdAt: service.createdAt.toISOString(),
          updatedAt: service.updatedAt.toISOString(),
          staff: service.staff,
        }))

        return {
          success: true,
          data: servicesData,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        }
      } catch (error) {
        console.error("❌ Error fetching medical services:", error)
        return {
          success: false,
          message: "Failed to fetch medical services",
          data: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        }
      }
    }),

  // Get single medical service by ID
  getMedicalService: publicProcedure
    .input(getMedicalServiceSchema)
    .query(async ({ input, ctx }) => {
      try {
        const { id } = input
        const { instancePrisma } = ctx

        const service = await instancePrisma.medicalService.findUnique({
          where: { id },
          include: {
            staff: {
              select: {
                firstName: true,
                lastName: true,
                middleName: true,
                email: true,
              },
            },
          },
        })

        if (!service) {
          return {
            success: false,
            message: "Medical service not found",
            data: null,
          }
        }

        // Convert Decimal and Date types to JSON-safe formats
        const serviceData = {
          id: service.id,
          staffId: service.staffId,
          name: service.name,
          type: service.type,
          category: service.category,
          description: service.description,
          price: service.price.toString(),
          duration: service.duration,
          isActive: service.isActive,
          requirements: service.requirements,
          notes: service.notes,
          createdAt: service.createdAt.toISOString(),
          updatedAt: service.updatedAt.toISOString(),
          staff: service.staff,
        }

        return {
          success: true,
          data: serviceData,
        }
      } catch (error) {
        console.error("❌ Error fetching medical service:", error)
        return {
          success: false,
          message: "Failed to fetch medical service",
          data: null,
        }
      }
    }),

  // Create new medical service
  createMedicalService: publicProcedure
    .input(createMedicalServiceSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { instancePrisma } = ctx

        console.log("📝 Creating medical service:", input)

        // Verify staff exists
        const staffExists = await instancePrisma.user.findUnique({
          where: { id: input.staffId },
        })

        if (!staffExists) {
          return {
            success: false,
            message: "Staff member not found",
            data: null,
          }
        }

        // Create service
        const service = await instancePrisma.medicalService.create({
          data: {
            staffId: input.staffId,
            name: input.name,
            type: input.type,
            category: input.category,
            description: input.description,
            price: input.price,
            duration: input.duration,
            isActive: input.isActive ?? true,
            requirements: input.requirements,
            notes: input.notes,
          },
          include: {
            staff: {
              select: {
                firstName: true,
                lastName: true,
                middleName: true,
                email: true,
              },
            },
          },
        })

        console.log("✅ Medical service created successfully:", service.id)

        // Convert Decimal and Date types to JSON-safe formats
        const serviceData = {
          id: service.id,
          staffId: service.staffId,
          name: service.name,
          type: service.type,
          category: service.category,
          description: service.description,
          price: service.price.toString(),
          duration: service.duration,
          isActive: service.isActive,
          requirements: service.requirements,
          notes: service.notes,
          createdAt: service.createdAt.toISOString(),
          updatedAt: service.updatedAt.toISOString(),
          staff: service.staff,
        }

        return {
          success: true,
          message: "Medical service created successfully",
          data: serviceData,
        }
      } catch (error) {
        console.error("❌ Error creating medical service:", error)
        return {
          success: false,
          message: "Failed to create medical service",
          data: null,
        }
      }
    }),

  // Update medical service
  updateMedicalService: publicProcedure
    .input(updateMedicalServiceSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id, ...updateData } = input
        const { instancePrisma } = ctx

        console.log("📝 Updating medical service:", id)

        // Check if service exists
        const existingService = await instancePrisma.medicalService.findUnique({
          where: { id },
        })

        if (!existingService) {
          return {
            success: false,
            message: "Medical service not found",
            data: null,
          }
        }

        // Update service
        const service = await instancePrisma.medicalService.update({
          where: { id },
          data: {
            staffId: updateData.staffId,
            name: updateData.name,
            type: updateData.type,
            category: updateData.category,
            description: updateData.description,
            price: updateData.price,
            duration: updateData.duration,
            isActive: updateData.isActive,
            requirements: updateData.requirements,
            notes: updateData.notes,
          },
          include: {
            staff: {
              select: {
                firstName: true,
                lastName: true,
                middleName: true,
                email: true,
              },
            },
          },
        })

        console.log("✅ Medical service updated successfully:", id)

        // Convert Decimal and Date types to JSON-safe formats
        const serviceData = {
          id: service.id,
          staffId: service.staffId,
          name: service.name,
          type: service.type,
          category: service.category,
          description: service.description,
          price: service.price.toString(),
          duration: service.duration,
          isActive: service.isActive,
          requirements: service.requirements,
          notes: service.notes,
          createdAt: service.createdAt.toISOString(),
          updatedAt: service.updatedAt.toISOString(),
          staff: service.staff,
        }

        return {
          success: true,
          message: "Medical service updated successfully",
          data: serviceData,
        }
      } catch (error) {
        console.error("❌ Error updating medical service:", error)
        return {
          success: false,
          message: "Failed to update medical service",
          data: null,
        }
      }
    }),

  // Delete medical service
  deleteMedicalService: publicProcedure
    .input(deleteMedicalServiceSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id } = input
        const { instancePrisma } = ctx

        console.log("🗑️ Deleting medical service:", id)

        // Check if service exists
        const existingService = await instancePrisma.medicalService.findUnique({
          where: { id },
        })

        if (!existingService) {
          return {
            success: false,
            message: "Medical service not found",
          }
        }

        // Delete service
        await instancePrisma.medicalService.delete({
          where: { id },
        })

        console.log("✅ Medical service deleted successfully:", id)

        return {
          success: true,
          message: "Medical service deleted successfully",
        }
      } catch (error) {
        console.error("❌ Error deleting medical service:", error)
        return {
          success: false,
          message: "Failed to delete medical service",
        }
      }
    }),
})
