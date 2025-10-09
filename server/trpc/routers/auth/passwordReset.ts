import { z } from "zod"
import { publicProcedure, createTRPCRouter } from "../../init"
import { sendEmail } from "~/util/email"
import { getPasswordResetTemplate } from "~/util/email/templates/passwordReset"
import { hashPassword } from "~/util/hash"
import crypto from "crypto"

// Request password reset
export const requestPasswordReset = publicProcedure
	.input(
		z.object({
			email: z.string().email(),
		})
	)
	.mutation(async ({ input, ctx }) => {
		const { email } = input
		const { instancePrisma } = ctx

		console.log(`🔐 Password reset requested for: ${email}`)

		// Find user by email
		const user = await instancePrisma.user.findUnique({
			where: { email: email.toLowerCase() },
		})

		// Always return success to prevent email enumeration attacks
		if (!user) {
			console.log(`⚠️ User not found for email: ${email}, but returning success`)
			return { 
				success: true, 
				message: "If an account exists with this email, you will receive a password reset link shortly." 
			}
		}

		// Check if user account is disabled
		if (user.status === "INACTIVE") {
			console.log(`⚠️ User account is disabled: ${email}`)
			return { 
				success: true, 
				message: "If an account exists with this email, you will receive a password reset link shortly." 
			}
		}

		try {
			// Generate secure random token
			const resetToken = crypto.randomBytes(32).toString("hex")
			const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

			// Save token to database
			await instancePrisma.passwordResetToken.create({
				data: {
					userId: user.id,
					token: resetToken,
					expiresAt,
					used: false,
				},
			})

			// Create reset link
			const resetLink = `${process.env.APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`

			// Send email
			const template = getPasswordResetTemplate(resetLink, email)
			await sendEmail(email, template)

			console.log(`✅ Password reset email sent to: ${email}`)
			console.log(`🔗 Reset token: ${resetToken} (expires at ${expiresAt.toISOString()})`)

			return { 
				success: true, 
				message: "If an account exists with this email, you will receive a password reset link shortly." 
			}
		} catch (error) {
			console.error("❌ Error sending password reset email:", error)
			throw new Error("Failed to send password reset email. Please try again later.")
		}
	})

// Reset password with token
export const resetPassword = publicProcedure
	.input(
		z.object({
			token: z.string(),
			newPassword: z.string().min(8, "Password must be at least 8 characters"),
		})
	)
	.mutation(async ({ input, ctx }) => {
		const { token, newPassword } = input
		const { instancePrisma } = ctx

		console.log(`🔐 Password reset attempt with token: ${token.substring(0, 8)}...`)

		// Find valid token
		const resetToken = await instancePrisma.passwordResetToken.findUnique({
			where: { token },
			include: { user: true },
		})

		// Validate token
		if (!resetToken) {
			console.log(`❌ Invalid token: ${token.substring(0, 8)}...`)
			throw new Error("Invalid or expired reset link. Please request a new password reset.")
		}

		if (resetToken.used) {
			console.log(`❌ Token already used: ${token.substring(0, 8)}...`)
			throw new Error("This reset link has already been used. Please request a new password reset.")
		}

		if (new Date() > resetToken.expiresAt) {
			console.log(`❌ Token expired: ${token.substring(0, 8)}... (expired at ${resetToken.expiresAt.toISOString()})`)
			throw new Error("This reset link has expired. Please request a new password reset.")
		}

		try {
			// Hash new password
			const passwordHash = await hashPassword(newPassword)

			// Update user password and mark token as used in a transaction
			await instancePrisma.$transaction([
				instancePrisma.user.update({
					where: { id: resetToken.userId },
					data: { password: passwordHash },
				}),
				instancePrisma.passwordResetToken.update({
					where: { id: resetToken.id },
					data: { used: true },
				}),
			])

			console.log(`✅ Password reset successful for user: ${resetToken.user.email}`)

			return { 
				success: true, 
				message: "Your password has been reset successfully. You can now log in with your new password." 
			}
		} catch (error) {
			console.error("❌ Error resetting password:", error)
			throw new Error("Failed to reset password. Please try again.")
		}
	})

// Verify reset token validity (for UI validation)
export const verifyResetToken = publicProcedure
	.input(
		z.object({
			token: z.string(),
		})
	)
	.query(async ({ input, ctx }) => {
		const { token } = input
		const { instancePrisma } = ctx

		const resetToken = await instancePrisma.passwordResetToken.findUnique({
			where: { token },
		})

		if (!resetToken || resetToken.used || new Date() > resetToken.expiresAt) {
			return { valid: false }
		}

		return { valid: true }
	})

export const passwordResetRouter = createTRPCRouter({
	requestPasswordReset,
	resetPassword,
	verifyResetToken,
})
