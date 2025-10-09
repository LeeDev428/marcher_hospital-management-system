import type { MailTemplate } from "~/types/app"

export const getPasswordResetTemplate = (resetLink: string, userEmail: string): MailTemplate => {
	return {
		from: "Marcher Healthcare <marcher.csb@gmail.com>",
		subject: "Reset Your Password - Marcher Healthcare",
		html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #0d9488 0%, #06b6d4 100%); border-radius: 16px 16px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                                🔐 Password Reset Request
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                                Hello,
                            </p>
                            
                            <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                                We received a request to reset the password for your Marcher Healthcare account associated with <strong>${userEmail}</strong>.
                            </p>
                            
                            <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                                Click the button below to create a new password. This link will expire in <strong>1 hour</strong> for security reasons.
                            </p>
                            
                            <!-- Reset Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td align="center" style="padding: 0 0 30px;">
                                        <a href="${resetLink}" style="display: inline-block; padding: 16px 40px; background-color: #0d9488; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(13, 148, 136, 0.3);">
                                            Reset My Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 20px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                Or copy and paste this link into your browser:
                            </p>
                            
                            <p style="margin: 0 0 30px; padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; color: #4b5563; font-size: 13px; word-break: break-all;">
                                ${resetLink}
                            </p>
                            
                            <!-- Security Notice -->
                            <div style="padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                                    <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact our support team immediately. Your password will remain unchanged.
                                </p>
                            </div>
                            
                            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                This link will expire in 1 hour. If you need to reset your password after that, please request a new password reset link.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 16px 16px; text-align: center;">
                            <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                                Need help? Contact us at <a href="mailto:marcher.csb@gmail.com" style="color: #0d9488; text-decoration: none;">marcher.csb@gmail.com</a>
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                © 2025 Marcher Healthcare. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
		`,
		text: `
Password Reset Request - Marcher Healthcare

Hello,

We received a request to reset the password for your Marcher Healthcare account associated with ${userEmail}.

Click the link below to create a new password. This link will expire in 1 hour for security reasons:

${resetLink}

SECURITY NOTICE: If you didn't request this password reset, please ignore this email or contact our support team immediately. Your password will remain unchanged.

This link will expire in 1 hour. If you need to reset your password after that, please request a new password reset link.

Need help? Contact us at marcher.csb@gmail.com

© 2025 Marcher Healthcare. All rights reserved.
		`
	}
}
