import { z } from "zod"
import { publicProcedure, protectedProcedure, createTRPCRouter } from "../../init"
import { loginSchema } from "@/types/app"
import { passwordResetRouter } from "./passwordReset"
import { setCookie, deleteCookie } from "h3"
import { signRefreshToken, signAccessToken } from "@/util/token"

// Auth router that communicates with Express backend
export const authRouter = createTRPCRouter({
	// Password reset routes
	passwordReset: passwordResetRouter,
	// Login procedure - calls Express backend
	login: publicProcedure
		.input(loginSchema)
		.mutation(async ({ input, ctx }) => {
			try {
				// Call Express backend authentication endpoint
				const response = await fetch('http://localhost:5000/api/auth/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(input),
				})

				const result = await response.json()

				if (!response.ok) {
					return {
						success: false,
						message: result.message || 'Login failed',
						user: null
					}
				}

				// Generate and set cookies for the authenticated user
				if (result.success && result.user) {
					console.log('🔐 Setting auth cookies for user:', result.user.email)
					
					const tokenPayload = {
						id: result.user.id,
						email: result.user.email,
						role: result.user.role,
						firstName: result.user.firstName,
						lastName: result.user.lastName,
					}

					try {
						const accessToken = signAccessToken(tokenPayload, result.user.id)
						const refreshToken = signRefreshToken(tokenPayload, result.user.id)

						console.log('✅ Tokens generated successfully')

						// Set HTTP-only cookies
						setCookie(ctx.event, 'accessToken', accessToken, {
							httpOnly: true,
							secure: process.env.NODE_ENV === 'production',
							sameSite: 'lax',
							maxAge: 15 * 60, // 15 minutes
							path: '/'
						})

						setCookie(ctx.event, 'refreshToken', refreshToken, {
							httpOnly: true,
							secure: process.env.NODE_ENV === 'production',
							sameSite: 'lax',
							maxAge: 7 * 24 * 60 * 60, // 7 days
							path: '/'
						})

						console.log('✅ Cookies set successfully')
					} catch (error) {
						console.error('❌ Error generating tokens or setting cookies:', error)
					}
				} else {
					console.log('⚠️ Login response missing user data:', result)
				}

				return {
					success: true,
					message: 'Login successful',
					user: result.user,
					token: result.token
				}
			} catch (error) {
				console.error('Login error:', error)
				return {
					success: false,
					message: 'Network error during login',
					user: null
				}
			}
		}),

	// Logout procedure
	logout: publicProcedure
		.mutation(async ({ ctx }) => {
			try {
				// Clear HTTP-only cookies
				deleteCookie(ctx.event, 'accessToken')
				deleteCookie(ctx.event, 'refreshToken')

				// Call Express backend logout endpoint if needed
				// For now, just return success as logout is mostly client-side
				return {
					success: true,
					message: 'Logged out successfully'
				}
			} catch (error) {
				console.error('Logout error:', error)
				return {
					success: false,
					message: 'Error during logout'
				}
			}
		}),

	// Get current user - protected route
	getCurrentUser: protectedProcedure
		.query(async ({ ctx }) => {
			try {
				// In a real implementation, you would verify the token here
				// and get user data from the Express backend
				return {
					success: true,
					user: ctx.user || null
				}
			} catch (error) {
				console.error('Get current user error:', error)
				return {
					success: false,
					user: null
				}
			}
		}),

	// Test endpoint for debugging
	test: publicProcedure
		.input(z.object({ message: z.string().optional() }))
		.query(({ input }) => {
			return {
				success: true,
				message: `Auth endpoint working! Input: ${input.message || "none"}`,
				timestamp: new Date().toISOString()
			}
		})
})