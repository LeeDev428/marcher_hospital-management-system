import { publicProcedure } from "../../init"
import { loginSchema } from "@/types/app"

export const login = publicProcedure
	.input(loginSchema)
	.mutation(async ({ ctx, input }) => {

	})
