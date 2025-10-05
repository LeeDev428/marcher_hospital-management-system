import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../init";
import { TRPCError } from "@trpc/server";
import { staffProfilesRouter } from "./staffProfiles";

// Enhanced staff router for doctors and nurses
export const staffRouter = createTRPCRouter({
	profiles: staffProfilesRouter,

	// Get all staff (doctors and nurses)
	getAll: protectedProcedure
		.input(
			z.object({
				staffType: z.enum(['DOCTOR', 'NURSE']).optional(),
			}).optional()
		)
		.query(async ({ ctx, input }) => {
			try {
				const whereClause: any = {
					role: "STAFF",
					staffCredentials: {
						staffType: input?.staffType ? input.staffType : { in: ['DOCTOR', 'NURSE'] },
					},
				};

				const staff = await ctx.instancePrisma.user.findMany({
					where: whereClause,
					include: {
						staffCredentials: true,
					},
					orderBy: {
						createdAt: "desc",
					},
				});

				return staff.map((member) => ({
					id: member.id,
					email: member.email,
					firstName: member.firstName,
					lastName: member.lastName,
					phone: member.phone,
					role: member.role,
					status: member.status,
					staffNumber: member.staffNumber,
					department: member.department,
					position: member.position,
					hireDate: member.hireDate,
					salary: member.salary,
					employmentType: member.employmentType,
					createdAt: member.createdAt,
					updatedAt: member.updatedAt,
					// Staff credentials
					staffType: member.staffCredentials?.staffType,
					licenseNumber: member.staffCredentials?.licenseNumber,
					specialization: member.staffCredentials?.specialization,
					subSpecialization: member.staffCredentials?.subSpecialization,
					boardCertification: member.staffCredentials?.boardCertification,
					education: member.staffCredentials?.education,
					yearsOfExperience: member.staffCredentials?.yearsOfExperience,
					consultationFee: member.staffCredentials?.consultationFee,
					isAvailable: member.staffCredentials?.isAvailable,
					workingHours: member.staffCredentials?.workingHours,
					hospitalAffiliation: member.staffCredentials?.hospitalAffiliation,
				}));
			} catch (error) {
				console.error("Error fetching staff:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch staff",
				});
			}
		}),

	// Create new staff member (doctor or nurse)
	create: protectedProcedure
		.input(
			z.object({
				email: z.string().email(),
				password: z.string().min(8),
				firstName: z.string().min(1),
				lastName: z.string().min(1),
				phone: z.string().optional(),
				department: z.string().optional(),
				position: z.string().optional(),
				hireDate: z.date().optional(),
				salary: z.number().optional(),
				staffType: z.enum(['DOCTOR', 'NURSE']),
				// Common fields
				licenseNumber: z.string().optional(),
				education: z.string().optional(),
				yearsOfExperience: z.number().int().min(0).optional(),
				// Doctor-specific fields
				specialization: z.string().optional(),
				subSpecialization: z.string().optional(),
				consultationFee: z.number().optional(),
				// Nurse-specific fields
				nursingSpecialty: z.string().optional(),
				certificationLevel: z.string().optional(),
				shiftPreference: z.string().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const bcrypt = await import("bcrypt");
				const hashedPassword = await bcrypt.hash(input.password, 10);

				const result = await ctx.instancePrisma.$transaction(async (tx) => {
					// Create the user as a staff member
					const user = await tx.user.create({
						data: {
							email: input.email,
							password: hashedPassword,
							firstName: input.firstName,
							lastName: input.lastName,
							phone: input.phone,
							role: "STAFF",
							status: "ACTIVE",
							department: input.department,
							position: input.position || (input.staffType === 'DOCTOR' ? 'Doctor' : 'Nurse'),
							hireDate: input.hireDate,
							salary: input.salary,
							employmentType: "FULL_TIME",
						},
					});

					// Create staff credentials based on type
					const credentialsData: any = {
						userId: user.id,
						staffType: input.staffType,
						licenseNumber: input.licenseNumber,
						education: input.education,
						yearsOfExperience: input.yearsOfExperience,
						isAvailable: true,
					};

					// Add type-specific fields
					if (input.staffType === 'DOCTOR') {
						credentialsData.specialization = input.specialization;
						credentialsData.subSpecialization = input.subSpecialization;
						credentialsData.consultationFee = input.consultationFee;
					} else if (input.staffType === 'NURSE') {
						credentialsData.specialization = input.nursingSpecialty;
						// Store nurse-specific data in workingHours as JSON for now
						credentialsData.workingHours = {
							certificationLevel: input.certificationLevel,
							shiftPreference: input.shiftPreference,
						};
					}

					const staffCredentials = await tx.staffCredentials.create({
						data: credentialsData,
					});

					return { user, staffCredentials };
				});

				return {
					id: result.user.id,
					email: result.user.email,
					firstName: result.user.firstName,
					lastName: result.user.lastName,
					phone: result.user.phone,
					role: result.user.role,
					staffNumber: result.user.staffNumber,
					department: result.user.department,
					position: result.user.position,
					staffType: result.staffCredentials.staffType,
					licenseNumber: result.staffCredentials.licenseNumber,
					specialization: result.staffCredentials.specialization,
				};
			} catch (error) {
				console.error("Error creating staff member:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create staff member",
				});
			}
		}),

	// Get staff statistics
	getStats: protectedProcedure.query(async ({ ctx }) => {
		try {
			const [totalStaff, totalDoctors, totalNurses, activeStaff] = await Promise.all([
				ctx.instancePrisma.user.count({
					where: {
						role: "STAFF",
						staffCredentials: {
							staffType: { in: ['DOCTOR', 'NURSE'] },
						},
					},
				}),
				ctx.instancePrisma.user.count({
					where: {
						role: "STAFF",
						staffCredentials: {
							staffType: "DOCTOR",
						},
					},
				}),
				ctx.instancePrisma.user.count({
					where: {
						role: "STAFF",
						staffCredentials: {
							staffType: "NURSE",
						},
					},
				}),
				ctx.instancePrisma.user.count({
					where: {
						role: "STAFF",
						status: "ACTIVE",
						staffCredentials: {
							staffType: { in: ['DOCTOR', 'NURSE'] },
						},
					},
				}),
			]);

			return {
				total: totalStaff,
				doctors: totalDoctors,
				nurses: totalNurses,
				active: activeStaff,
			};
		} catch (error) {
			console.error("Error fetching staff stats:", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch staff statistics",
			});
		}
	}),
});