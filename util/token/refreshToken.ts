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
		console.log('❌ JWT_REFRESH_KEY is not defined')
		throw new Error("JWT_REFRESH_KEY is not defined")
	}

	try {
		console.log('🔍 Verifying refresh token with key:', JWT_REFRESH_KEY.substring(0, 10) + '...')
		const result = jwt.verify(token, JWT_REFRESH_KEY, jwtRefreshTokenVerifyOptions)
		console.log('✅ Token verification successful:', result)
		return result
	} catch (error) {
		console.log('❌ Token verification failed:', error instanceof Error ? error.message : error)
		if (error instanceof jwt.JsonWebTokenError) {
			return false
		}
		throw error
	}
}
