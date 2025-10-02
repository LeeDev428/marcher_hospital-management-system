import { createTRPCRouter, protectedProcedure } from "../../init"

const getProfiles = protectedProcedure.query(async ({ ctx }) => {})

const getProfile = protectedProcedure
	.input()
	.query(async ({ ctx, input }) => {})

const createProfile = protectedProcedure
	.input(createProfileSchema)
	.mutation(async ({ ctx, input }) => {})

const updateProfile = protectedProcedure
	.input(updateProfileSchema)
	.mutation(async ({ ctx, input }) => {})

const deleteProfile = protectedProcedure
	.input(deleteProfileSchema)
	.mutation(async ({ ctx, input }) => {})

export const profilesRouter = createTRPCRouter({
	getProfiles,
	getProfile,
	createProfile,
	updateProfile,
	deleteProfile
})
