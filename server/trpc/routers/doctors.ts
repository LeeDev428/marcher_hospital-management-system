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
});