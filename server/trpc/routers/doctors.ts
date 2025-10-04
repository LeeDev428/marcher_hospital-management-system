import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init"

// Input schemas
const createDoctorSchema = z.object({
  // User data
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  
  // Staff data
  department: z.string().optional(),
  position: z.string().optional(),
  
  // Doctor-specific data
  medicalLicense: z.string().min(1),
  specialization: z.string().min(1),
  subSpecialization: z.string().optional(),
  boardCertification: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  education: z.string().optional(),
  hospitalAffiliation: z.string().optional(),
  consultationFee: z.number().optional(),
  isAvailable: z.boolean().default(true),
  workingHours: z.string().optional(),
})

const getDoctorSchema = z.object({
  id: z.string(),
})

const updateDoctorSchema = z.object({
  id: z.string(),
  medicalLicense: z.string().optional(),
  specialization: z.string().optional(),
  subSpecialization: z.string().optional(),
  boardCertification: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  education: z.string().optional(),
  hospitalAffiliation: z.string().optional(),
  consultationFee: z.number().optional(),
  isAvailable: z.boolean().optional(),
  workingHours: z.string().optional(),
})

export const doctorsRouter = createTRPCRouter({
  // Get all doctors
  list: publicProcedure.query(async ({ ctx }) => {
    try {
      const doctors = await ctx.instancePrisma.doctor.findMany({
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              status: true,
            },
          },
          staff: {
            select: {
              id: true,
              staffNumber: true,
              department: true,
              position: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return {
        success: true,
        message: "Doctors fetched successfully.",
        data: doctors,
      }
    } catch (error) {
      console.error("Error fetching doctors:", error)
      return {
        success: false,
        message: "Failed to fetch doctors.",
        data: [],
      }
    }
  }),

  // Get doctor by ID
  getById: publicProcedure
    .input(getDoctorSchema)
    .query(async ({ ctx, input }) => {
      try {
        const doctor = await ctx.instancePrisma.doctor.findUnique({
          where: { id: input.id },
          include: {
            user: true,
            staff: true,
          },
        })

        if (!doctor) {
          return {
            success: false,
            message: "Doctor not found.",
            data: null,
          }
        }

        return {
          success: true,
          message: "Doctor fetched successfully.",
          data: doctor,
        }
      } catch (error) {
        console.error("Error fetching doctor:", error)
        return {
          success: false,
          message: "Failed to fetch doctor.",
          data: null,
        }
      }
    }),

  // Create new doctor
  create: publicProcedure
    .input(createDoctorSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        firstName,
        lastName,
        email,
        phone,
        department,
        position,
        medicalLicense,
        specialization,
        subSpecialization,
        boardCertification,
        yearsOfExperience,
        education,
        hospitalAffiliation,
        consultationFee,
        isAvailable,
        workingHours,
      } = input

      try {
        // Check if user with email already exists
        const existingUser = await ctx.instancePrisma.user.findUnique({
          where: { email },
        })

        if (existingUser) {
          return {
            success: false,
            message: "User with this email already exists.",
            data: null,
          }
        }

        // Generate unique numbers
        const userCount = await ctx.instancePrisma.user.count()
        const staffCount = await ctx.instancePrisma.staff.count()
        const doctorCount = await ctx.instancePrisma.doctor.count()

        const staffNumber = `STF${String(staffCount + 1).padStart(6, '0')}`
        const doctorNumber = `DOC${String(doctorCount + 1).padStart(6, '0')}`

        // Create user, staff, and doctor in a transaction
        const result = await ctx.instancePrisma.$transaction(async (prisma) => {
          // Create user
          const user = await prisma.user.create({
            data: {
              email,
              password: 'temporary123', // TODO: Generate temporary password
              firstName,
              lastName,
              phone,
              role: 'STAFF',
              status: 'ACTIVE',
            },
          })

          // Create staff profile
          const staff = await prisma.staff.create({
            data: {
              userId: user.id,
              staffNumber,
              department,
              position: position || 'Doctor',
            },
          })

          // Create doctor profile
          const doctor = await prisma.doctor.create({
            data: {
              userId: user.id,
              staffId: staff.id,
              doctorNumber,
              medicalLicense,
              specialization,
              subSpecialization,
              boardCertification,
              yearsOfExperience,
              education,
              hospitalAffiliation,
              consultationFee,
              isAvailable,
              workingHours,
            },
          })

          return { user, staff, doctor }
        })

        return {
          success: true,
          message: "Doctor created successfully.",
          data: result.doctor,
        }
      } catch (error) {
        console.error("Error creating doctor:", error)
        return {
          success: false,
          message: "Failed to create doctor.",
          data: null,
        }
      }
    }),

  // Update doctor
  update: publicProcedure
    .input(updateDoctorSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input

      try {
        const doctor = await ctx.instancePrisma.doctor.update({
          where: { id },
          data: updateData,
          include: {
            user: true,
            staff: true,
          },
        })

        return {
          success: true,
          message: "Doctor updated successfully.",
          data: doctor,
        }
      } catch (error) {
        console.error("Error updating doctor:", error)
        return {
          success: false,
          message: "Failed to update doctor.",
          data: null,
        }
      }
    }),

  // Delete doctor
  delete: publicProcedure
    .input(getDoctorSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.instancePrisma.$transaction(async (prisma) => {
          // Delete doctor profile
          await prisma.doctor.delete({
            where: { id: input.id },
          })
          
          // Note: Staff and User will be handled based on your business logic
          // You might want to keep the staff record but remove doctor profile
        })

        return {
          success: true,
          message: "Doctor deleted successfully.",
          data: null,
        }
      } catch (error) {
        console.error("Error deleting doctor:", error)
        return {
          success: false,
          message: "Failed to delete doctor.",
          data: null,
        }
      }
    }),
})