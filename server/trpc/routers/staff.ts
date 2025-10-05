import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init"
import bcrypt from "bcrypt"

// Input schemas
const createStaffSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  
  // Staff credentials
  staffType: z.enum(['DOCTOR', 'NURSE', 'TECHNICIAN', 'PHARMACIST', 'RADIOLOGIST', 'THERAPIST', 'ADMINISTRATOR', 'SECURITY', 'MAINTENANCE', 'OTHER']),
  specialization: z.string().optional(),
  subSpecialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseExpiryDate: z.string().optional(),
  education: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  consultationFee: z.number().optional(),
  workingHours: z.any().optional(),
  hospitalAffiliation: z.string().optional(),
})

export const staffRouter = createTRPCRouter({
  // Get all staff members (users with role = STAFF)
  list: publicProcedure.query(async ({ ctx }) => {
    try {
      const staff = await ctx.instancePrisma.user.findMany({
        where: {
          role: 'STAFF',
        },
        include: {
          staffCredentials: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return {
        success: true,
        message: "Staff fetched successfully.",
        data: staff,
      }
    } catch (error) {
      console.error("Error fetching staff:", error)
      return {
        success: false,
        message: "Failed to fetch staff.",
        data: [],
      }
    }
  }),

  // Create new staff member with credentials
  create: protectedProcedure
    .input(createStaffSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, 12)

        // Generate staff number
        const staffCount = await ctx.instancePrisma.user.count({
          where: { role: 'STAFF' }
        })
        const staffNumber = `STAFF${String(staffCount + 1).padStart(4, '0')}`

        // Create user with staff role
        const newStaff = await ctx.instancePrisma.user.create({
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            password: hashedPassword,
            phone: input.phone,
            role: 'STAFF',
            staffNumber,
            department: input.department,
            position: input.position,
            hireDate: new Date(),
            
            // Create staff credentials
            staffCredentials: {
              create: {
                staffType: input.staffType,
                specialization: input.specialization,
                subSpecialization: input.subSpecialization,
                licenseNumber: input.licenseNumber,
                licenseExpiryDate: input.licenseExpiryDate ? new Date(input.licenseExpiryDate) : undefined,
                education: input.education,
                yearsOfExperience: input.yearsOfExperience,
                consultationFee: input.consultationFee,
                workingHours: input.workingHours,
                hospitalAffiliation: input.hospitalAffiliation,
                isAvailable: true,
              }
            }
          },
          include: {
            staffCredentials: true,
          },
        })

        return {
          success: true,
          message: "Staff member created successfully.",
          data: newStaff,
        }
      } catch (error) {
        console.error("Error creating staff:", error)
        return {
          success: false,
          message: "Failed to create staff member.",
          data: null,
        }
      }
    }),

  // Get staff statistics
  getStats: publicProcedure.query(async ({ ctx }) => {
    try {
      const totalStaff = await ctx.instancePrisma.user.count({
        where: { role: 'STAFF' }
      })

      const doctors = await ctx.instancePrisma.user.count({
        where: {
          role: 'STAFF',
          staffCredentials: {
            staffType: 'DOCTOR'
          }
        }
      })

      const nurses = await ctx.instancePrisma.user.count({
        where: {
          role: 'STAFF',
          staffCredentials: {
            staffType: 'NURSE'
          }
        }
      })

      const activeStaff = await ctx.instancePrisma.user.count({
        where: {
          role: 'STAFF',
          status: 'ACTIVE'
        }
      })

      return {
        success: true,
        data: {
          total: totalStaff,
          doctors,
          nurses,
          active: activeStaff,
        },
      }
    } catch (error) {
      console.error("Error fetching staff stats:", error)
      return {
        success: false,
        message: "Failed to fetch staff statistics.",
        data: { total: 0, doctors: 0, nurses: 0, active: 0 },
      }
    }
  }),
})