import jwt from "jsonwebtoken"
import type { SignOptions, VerifyOptions } from "jsonwebtoken"

const JWT_REFRESH_KEY = process.env.REFRESH_TOKEN_SECRET

const jwtRefreshTokenSignOptions = {
	algorithm: "HS256",
	expiresIn: "7d",
	issuer: "marcher.com",
	audience: "marcher.com",
} as SignOptions

const jwtRefreshTokenVerifyOptions = {
	issuer: "marcher.com",
	audience: "marcher.com",
	clockTolerance: 5,
} as VerifyOptions

export const signRefreshToken = (payload: Record<string, string>, subject: string) => {
	if (!JWT_REFRESH_KEY) throw new Error("JWT_REFRESH_KEY is not defined")

	return jwt.sign(payload, JWT_REFRESH_KEY, {
		...jwtRefreshTokenSignOptions,
		subject,
	})
}

export const verifyRefreshToken = (token: string) => {
	if (!JWT_REFRESH_KEY) {
		console.error("❌ JWT_REFRESH_KEY is not defined")
		throw new Error("JWT_REFRESH_KEY is not defined")
	}

	try {
		console.log("🔍 Attempting to verify token...")
		console.log("🔍 Token preview:", token.substring(0, 50) + "...")
		console.log("🔍 JWT_REFRESH_KEY preview:", JWT_REFRESH_KEY.substring(0, 20) + "...")
		console.log("🔍 JWT_REFRESH_KEY length:", JWT_REFRESH_KEY.length)
		
		const decoded = jwt.verify(token, JWT_REFRESH_KEY, jwtRefreshTokenVerifyOptions)
		console.log("✅ Token verified successfully!")
		console.log("🔍 Decoded token:", JSON.stringify(decoded, null, 2))
		return decoded
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			console.error("❌ Token verification failed!")
			console.error("❌ Error name:", error.name)
			console.error("❌ Error message:", error.message)
			console.error("❌ Token options used:", JSON.stringify(jwtRefreshTokenVerifyOptions, null, 2))
			return false
		}
		console.error("❌ Unexpected error during token verification:", error)
		throw error
	}
}
