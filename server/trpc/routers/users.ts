import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init"
import bcrypt from "bcrypt"

// Input schemas
const createUserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  middleName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'STAFF', 'PATIENT', 'PARTNER']),
  
  // Staff-specific fields (when role is STAFF)
  staffType: z.enum(['DOCTOR', 'NURSE', 'STAFF', 'ADMISSIONS_STAFF', 'BILLING_STAFF', 'PHARMACIST']).optional(),
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
  emergencyPhone: z.string().optional(),
  bloodType: z.enum(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE']).optional(),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
})

const getUserSchema = z.object({
  id: z.string(),
})

const updateUserSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  
  // Staff-specific fields
  staffType: z.enum(['DOCTOR', 'NURSE', 'STAFF', 'ADMISSIONS_STAFF', 'BILLING_STAFF', 'PHARMACIST']).optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  
  // Common fields
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  address: z.string().optional(),
})

export const usersRouter = createTRPCRouter({
  // Get all users with their profiles
  list: publicProcedure.query(async ({ ctx }) => {
    try {
      const users = await ctx.instancePrisma.user.findMany({
        include: {
          staffCredentials: true,
          partnerProfile: true,
          patientProfile: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      // Fetch staff schedules separately for staff members
      const staffIds = users.filter(u => u.role === 'STAFF').map(u => u.id)
      const schedules = staffIds.length > 0 
        ? await ctx.instancePrisma.staffSchedule.findMany({
            where: {
              staffId: { in: staffIds },
              isAvailable: true,
            },
            orderBy: {
              day: 'asc',
            },
          })
        : []

      // Map schedules to users
      const usersWithSchedules = users.map(user => ({
        ...user,
        schedules: user.role === 'STAFF' 
          ? schedules.filter(s => s.staffId === user.id)
          : [],
      }))

      return {
        success: true,
        message: "Users fetched successfully.",
        data: usersWithSchedules,
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
            staffCredentials: true,
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
          middleName,
          email,
          password,
          phone,
          role,
          staffType,
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
          emergencyPhone,
          bloodType,
          allergies,
          medicalHistory,
          insuranceProvider,
          insuranceNumber,
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
            const staffCount = await prisma.staffCredentials.count()
            const staffNumber = `STF${String(staffCount + 1).padStart(6, '0')}`

            // For staff users, update the user record with staff-specific fields
            const updatedUser = await prisma.user.update({
              where: { id: user.id },
              data: {
                staffNumber,
                department,
                position,
              },
            })

            // Create staff credentials profile
            if (staffType) {
              profile = await prisma.staffCredentials.create({
                data: {
                  userId: user.id,
                  staffType: staffType as any, // DOCTOR, NURSE, etc.
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
                emergencyPhone,
                bloodType,
                allergies,
                medicalHistory,
                insuranceProvider,
                insuranceNumber,
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

  // Update user
  update: publicProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        id,
        firstName,
        lastName,
        email,
        phone,
        staffType,
        position,
        department,
        specialization,
        licenseNumber,
        dateOfBirth,
        gender,
        address,
      } = input

      try {
        // Get current user to check role
        const currentUser = await ctx.instancePrisma.user.findUnique({
          where: { id },
          include: { staffCredentials: true },
        })

        if (!currentUser) {
          return {
            success: false,
            message: "User not found.",
            data: null,
          }
        }

        // Update user in a transaction
        const result = await ctx.instancePrisma.$transaction(async (prisma) => {
          // Update basic user information
          const user = await prisma.user.update({
            where: { id },
            data: {
              ...(firstName && { firstName }),
              ...(lastName && { lastName }),
              ...(email && { email }),
              ...(phone && { phone }),
              ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
              ...(gender && { gender }),
              ...(address && { address }),
              ...(department && { department }),
              ...(position && { position }),
            },
          })

          // Update staff credentials if user is staff and has credentials
          if (currentUser.role === 'STAFF' && currentUser.staffCredentials) {
            if (staffType || specialization || licenseNumber) {
              await prisma.staffCredentials.update({
                where: { userId: id },
                data: {
                  ...(staffType && { staffType: staffType as any }),
                  ...(specialization && { specialization }),
                  ...(licenseNumber && { licenseNumber }),
                },
              })
            }
          }

          return user
        })

        return {
          success: true,
          message: "User updated successfully.",
          data: result,
        }
      } catch (error) {
        console.error("Error updating user:", error)
        return {
          success: false,
          message: "Failed to update user.",
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