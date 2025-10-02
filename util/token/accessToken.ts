import jwt from "jsonwebtoken"
import type { SignOptions, VerifyOptions } from "jsonwebtoken"

const JWT_ACCESS_KEY = process.env.ACCESS_TOKEN_SECRET

const jwtAccessTokenSignOptions = {
	algorithm: "HS256",
	expiresIn: "15m",
	issuer: "marcher.com",
	audience: "marcher.com",
} as SignOptions

const jwtAccessTokenVerifyOptions = {
	issuer: "marcher.com",
	audience: "marcher.com",
	clockTolerance: 5,
} as VerifyOptions

export const signAccessToken = (payload: Record<string, string>, subject: string) => {
	if (!JWT_ACCESS_KEY) throw new Error("JWT_ACCESS_KEY is not defined")

	return jwt.sign(payload, JWT_ACCESS_KEY, {
		...jwtAccessTokenSignOptions,
		subject,
	})
}

export const verifyAccessToken = (token: string) => {
	if (!JWT_ACCESS_KEY) throw new Error("JWT_ACCESS_KEY is not defined")

	try {
		return jwt.verify(token, JWT_ACCESS_KEY, jwtAccessTokenVerifyOptions)
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			return false
		}
	}
}
