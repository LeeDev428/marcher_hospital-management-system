import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { TRPCError } from "@trpc/server";

// Backward compatibility router that maps to the new User + StaffCredentials structure
export const doctorsRouter = createTRPCRouter({
	// Get all doctors (users with StaffCredentials.staffType = DOCTOR)
	getAll: protectedProcedure.query(async ({ ctx }) => {
		try {
			const doctors = await ctx.instancePrisma.user.findMany({
				where: {
					role: "STAFF",
					staffCredentials: {
						staffType: "DOCTOR",
					},
				},
				include: {
					staffCredentials: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			});

			return doctors.map((doctor) => ({
				id: doctor.id,
				email: doctor.email,
				firstName: doctor.firstName,
				lastName: doctor.lastName,
				phone: doctor.phone,
				role: doctor.role,
				status: doctor.status,
				staffNumber: doctor.staffNumber,
				department: doctor.department,
				position: doctor.position,
				hireDate: doctor.hireDate,
				salary: doctor.salary,
				employmentType: doctor.employmentType,
				createdAt: doctor.createdAt,
				updatedAt: doctor.updatedAt,
				// Staff credentials
				staffType: doctor.staffCredentials?.staffType,
				licenseNumber: doctor.staffCredentials?.licenseNumber,
				specialization: doctor.staffCredentials?.specialization,
				subSpecialization: doctor.staffCredentials?.subSpecialization,
				boardCertification: doctor.staffCredentials?.boardCertification,
				education: doctor.staffCredentials?.education,
				yearsOfExperience: doctor.staffCredentials?.yearsOfExperience,
				consultationFee: doctor.staffCredentials?.consultationFee,
				isAvailable: doctor.staffCredentials?.isAvailable,
				workingHours: doctor.staffCredentials?.workingHours,
				hospitalAffiliation: doctor.staffCredentials?.hospitalAffiliation,
			}));
		} catch (error) {
			console.error("Error fetching doctors:", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch doctors",
			});
		}
	}),

	// Create a new doctor
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
				licenseNumber: z.string().optional(),
				specialization: z.string().optional(),
				subSpecialization: z.string().optional(),
				education: z.string().optional(),
				yearsOfExperience: z.number().int().min(0).optional(),
				consultationFee: z.number().optional(),
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
							position: input.position,
							hireDate: input.hireDate,
							salary: input.salary,
							employmentType: "FULL_TIME",
						},
					});

					// Create staff credentials
					const staffCredentials = await tx.staffCredentials.create({
						data: {
							userId: user.id,
							staffType: "DOCTOR",
							licenseNumber: input.licenseNumber,
							specialization: input.specialization,
							subSpecialization: input.subSpecialization,
							education: input.education,
							yearsOfExperience: input.yearsOfExperience,
							consultationFee: input.consultationFee,
							isAvailable: true,
						},
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
				console.error("Error creating doctor:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create doctor",
				});
			}
		}),

	// Get doctor statistics
	getStats: protectedProcedure.query(async ({ ctx }) => {
		try {
			const [totalDoctors, activeDoctors, availableDoctors] = await Promise.all([
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
						status: "ACTIVE",
						staffCredentials: {
							staffType: "DOCTOR",
						},
					},
				}),
				ctx.instancePrisma.user.count({
					where: {
						role: "STAFF",
						status: "ACTIVE",
						staffCredentials: {
							staffType: "DOCTOR",
							isAvailable: true,
						},
					},
				}),
			]);

			return {
				total: totalDoctors,
				active: activeDoctors,
				available: availableDoctors,
			};
		} catch (error) {
			console.error("Error fetching doctor stats:", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch doctor statistics",
			});
		}
	}),
});