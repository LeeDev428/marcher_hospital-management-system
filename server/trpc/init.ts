import type { H3Event } from "h3"
import { getCookie } from "h3"
import { initTRPC, TRPCError } from "@trpc/server"
import { PrismaClient as GlobalPrismaClient } from "@/prisma/generated/global/client"
import { PrismaClient as InstancePrismaClient } from "@/prisma/generated/instance/client"
import {
	verifyRefreshToken,
	verifyAccessToken,
} from "@/util/token"

const globalPrisma = new GlobalPrismaClient()
const instancePrisma = new InstancePrismaClient()

export const createTRPCContext = async (event: H3Event) => {
	return {
		event,
		globalPrisma,
		instancePrisma,
	}
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

const tRPC = initTRPC.context<Context>().create({})

export const createTRPCRouter = tRPC.router
export const createCallerFactory = tRPC.createCallerFactory
export const publicProcedure = tRPC.procedure
export const protectedProcedure = tRPC.procedure.use(
	async (opts) => {
		const { ctx, next } = opts
		const refreshToken = getCookie(ctx.event, "refreshToken")
		const accessToken = getCookie(ctx.event, "accessToken")

		console.log('🔍 Debug Auth:', {
			hasRefreshToken: !!refreshToken,
			hasAccessToken: !!accessToken,
			refreshTokenLength: refreshToken?.length || 0,
		})

		if (!refreshToken) {
			console.log('❌ No refresh token found')
			throw new TRPCError({ code: "UNAUTHORIZED", message: "You are not logged in." })
		}

		const decodedRefreshToken = verifyRefreshToken(refreshToken)

		if (!decodedRefreshToken) {
			console.log('❌ Invalid refresh token')
			throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid session. Please login again." })
		}

		console.log('✅ Auth successful:', decodedRefreshToken)

		return next({
			ctx: {
				...ctx,
				refreshToken,
				accessToken,
				user: decodedRefreshToken as { id: string; email: string; role: string; firstName: string; lastName: string },
			}
		})
	}
)