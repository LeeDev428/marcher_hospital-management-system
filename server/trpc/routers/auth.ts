import {
	publicProcedure,
	protectedProcedure,
	createTRPCRouter,
} from "../init"
import { loginSchema } from "@/types/app"
import {
	signAccessToken,
	signRefreshToken,
	signVerificationToken,
	verifyRefreshToken,
	verifyVerificationToken,
} from "@/util/token"
import type { CookieOptions } from "nuxt/app"
import { set } from "zod"

const users = [
	{
		id: "1",
		role: "admin",
		email: "dev@marcher.com",
		password: "Marcher2025!",
		firstName: "Dev",
		lastName: "User"
	},
	{
		id: "2",
		role: "doctor",
		email: "doctor@marcher.com",
		password: "Marcher2025!",
		firstName: "Doctor",
		lastName: "User"
	},
	{
		id: "3",
		role: "secretary",
		email: "secretary@marcher.com",
		password: "Marcher2025!",
		firstName: "Secretary",
		lastName: "User"
	},
	{
		id: "4",
		role: "patient",
		email: "patient@marcher.com",
		password: "Marcher2025!",
		firstName: "Nicole Ashley",
		lastName: "Jimenez"
	},
]

const refreshTokenCookieOptions = {
	secure: process.env.NODE_ENV === "production",
	httpOnly: true,
	sameSite: "strict",
} as CookieOptions

const accessTokencookieOptions = {
	secure: process.env.NODE_ENV === "production",
	httpOnly: true,
	sameSite: "strict",
} as CookieOptions

const login = publicProcedure
	.input(loginSchema)
	.mutation(async ({ ctx, input }) => {
		try {
			const user = users.find(u => u.email === input.email)

			if (user) {
				if (input.password !== user.password) {
					return {
						success: false,
						message: "Invalid credentials",
						user: null
					}
				}

				setCookie(ctx.event, "refreshToken", signRefreshToken(user, user.email), {
					...refreshTokenCookieOptions,
					expires: input.remember ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
				})

				setCookie(ctx.event, "accessToken", signAccessToken(user, user.email), {
					...accessTokencookieOptions,
					expires: new Date(Date.now() + 1000 * 60 * 15),
				})

				return {
					success: true,
					message: "Login successful",
					user: {
						id: user.id,
						role: user.role,
						email: user.email,
						firstName: user.firstName,
						lastName: user.lastName
					}
				}
			}
			
			return {
				success: false,
				message: "User not found",
				user: null
			}
		} catch (error) {
			console.error("Login error:", error)
			return {
				success: false,
				message: "Invalid credentials",
				user: null
			}
		}
	})

// const refresh = protectedProcedure
// 	.mutation(async ({ ctx }) => {
// 		try {
// 			const refreshToken = getCookie(ctx.event, "refreshToken")

// 			if (!refreshToken) {
// 				return {
// 					success: false,
// 					message: "Refresh token not found"
// 				}
// 			}

// 			const decoded = verifyRefreshToken(refreshToken)

// 			if (!decoded) {
// 				return {
// 					success: false,
// 					message: "Invalid refresh token"
// 				}
// 			}

// 			const accessToken = signAccessToken(user, user.email)

// 			setCookie(ctx.event, "accessToken", accessToken, accessTokencookieOptions)

// 			return {
// 				success: true,
// 				message: "Refresh token successful"
// 			}
// 		} catch (error) {
// 			return {
// 				success: false,
// 				message: "Refresh token failed"
// 			}
// 		}
// 	})

const logout = protectedProcedure
	.mutation(async ({ ctx }) => {
		try {
			deleteCookie(ctx.event, "refreshToken", refreshTokenCookieOptions)
			deleteCookie(ctx.event, "accessToken", accessTokencookieOptions)

			return {
				success: true,
				message: "Logout successful"
			}
		} catch (error) {
			return {
				success: false,
				message: "Logout failed"
			}
		}
	})

export const authRouter = createTRPCRouter({
	login,
	// refresh,
	logout,
})