import { createTRPCRouter, protectedProcedure } from "../../init"

const getUsers = protectedProcedure.query(async ({ ctx }) => {})

const getUser = protectedProcedure
	.input()
	.query(async ({ ctx, input }) => {})

const createUser = protectedProcedure
	.input(createUserSchema)
	.mutation(async ({ ctx, input }) => {})

const updateUser = protectedProcedure
	.input(updateUserSchema)
	.mutation(async ({ ctx, input }) => {})

const deleteUser = protectedProcedure
	.input(deleteUserSchema)
	.mutation(async ({ ctx, input }) => {})

export const usersRouter = createTRPCRouter({
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser
})
