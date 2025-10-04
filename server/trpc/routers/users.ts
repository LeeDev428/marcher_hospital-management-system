import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init"
import bcrypt from "bcrypt"

// Input schemas
const createUserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'STAFF', 'PATIENT', 'PARTNER']),
  
  // Staff-specific fields (when role is STAFF)
  staffType: z.enum(['new', 'existing']).optional(),
  selectedDoctorId: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  
  // Partner-specific fields (when role is PARTNER)
  institutionName: z.string().optional(),
  institutionType: z.enum(['HOSPITAL', 'CLINIC', 'LABORATORY', 'PHARMACY', 'DIAGNOSTIC_CENTER']).optional(),
  contactPerson: z.string().optional(),
  
  // Patient-specific fields (when role is PATIENT)
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  bloodType: z.enum(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE']).optional(),
})

const getUserSchema = z.object({
  id: z.string(),
})

export const usersRouter = createTRPCRouter({
  // Get all users with their profiles
  list: publicProcedure.query(async ({ ctx }) => {
    try {
      const users = await ctx.instancePrisma.user.findMany({
        include: {
          staffProfile: {
            include: {
              doctorProfile: true,
            },
          },
          partnerProfile: true,
          patientProfile: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return {
        success: true,
        message: "Users fetched successfully.",
        data: users,
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      return {
        success: false,
        message: "Failed to fetch users.",
        data: [],
      }
    }
  }),

  // Get user by ID
  getById: publicProcedure
    .input(getUserSchema)
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.instancePrisma.user.findUnique({
          where: { id: input.id },
          include: {
            staffProfile: {
              include: {
                doctorProfile: true,
              },
            },
            partnerProfile: true,
            patientProfile: true,
          },
        })

        if (!user) {
          return {
            success: false,
            message: "User not found.",
            data: null,
          }
        }

        return {
          success: true,
          message: "User fetched successfully.",
          data: user,
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        return {
          success: false,
          message: "Failed to fetch user.",
          data: null,
        }
      }
    }),

  // Create new user with role-specific profile
  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        firstName,
        lastName,
        email,
        password,
        phone,
        role,
        staffType,
        selectedDoctorId,
        position,
        department,
        specialization,
        licenseNumber,
        institutionName,
        institutionType,
        contactPerson,
        dateOfBirth,
        gender,
        address,
        emergencyContact,
        bloodType,
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

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Generate unique numbers based on role
        const userCount = await ctx.instancePrisma.user.count()
        
        // Create user and role-specific profile in a transaction
        const result = await ctx.instancePrisma.$transaction(async (prisma) => {
          // Create user
          const user = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              firstName,
              lastName,
              phone,
              role,
              status: 'ACTIVE',
              dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
              gender,
              address,
            },
          })

          let profile = null

          // Create role-specific profile
          if (role === 'STAFF') {
            const staffCount = await prisma.staff.count()
            const staffNumber = `STF${String(staffCount + 1).padStart(6, '0')}`

            if (staffType === 'existing' && selectedDoctorId) {
              // Link to existing doctor - get the doctor's staff profile
              const existingDoctor = await prisma.doctor.findUnique({
                where: { id: selectedDoctorId },
                include: { staff: true },
              })

              if (existingDoctor) {
                // Update the existing staff record with new user
                profile = await prisma.staff.update({
                  where: { id: existingDoctor.staffId },
                  data: {
                    userId: user.id,
                  },
                })
              }
            } else {
              // Create new staff profile
              profile = await prisma.staff.create({
                data: {
                  userId: user.id,
                  staffNumber,
                  position,
                  department,
                  specialization,
                  licenseNumber,
                },
              })
            }
          } else if (role === 'PARTNER') {
            profile = await prisma.partner.create({
              data: {
                userId: user.id,
                institutionName: institutionName || '',
                institutionType: institutionType || 'CLINIC',
                contactPerson,
                licenseNumber,
              },
            })
          } else if (role === 'PATIENT') {
            const patientCount = await prisma.patient.count()
            const patientNumber = `PAT${String(patientCount + 1).padStart(6, '0')}`

            profile = await prisma.patient.create({
              data: {
                userId: user.id,
                patientNumber,
                emergencyContact,
                bloodType,
              },
            })
          }

          return { user, profile }
        })

        return {
          success: true,
          message: "User created successfully.",
          data: result.user,
        }
      } catch (error) {
        console.error("Error creating user:", error)
        return {
          success: false,
          message: "Failed to create user.",
          data: null,
        }
      }
    }),

  // Delete user
  delete: publicProcedure
    .input(getUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Delete user (profiles will be cascade deleted)
        await ctx.instancePrisma.user.delete({
          where: { id: input.id },
        })

        return {
          success: true,
          message: "User deleted successfully.",
          data: null,
        }
      } catch (error) {
        console.error("Error deleting user:", error)
        return {
          success: false,
          message: "Failed to delete user.",
          data: null,
        }
      }
    }),
})