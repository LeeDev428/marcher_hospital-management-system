import { z } from "zod"
import { publicProcedure, protectedProcedure, createTRPCRouter } from "../../init"
import { loginSchema } from "@/types/app"

// Auth router that communicates with Express backend
export const authRouter = createTRPCRouter({
	// Login procedure - calls Express backend
	login: publicProcedure
		.input(loginSchema)
		.mutation(async ({ input }) => {
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
		.mutation(async () => {
			try {
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