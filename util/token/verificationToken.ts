import jwt from "jsonwebtoken"
import type { SignOptions, VerifyOptions } from "jsonwebtoken"

const JWT_VERIFICATION_KEY = process.env.JWT_VERIFICATION_KEY

const jwtVerificationTokenSignOptions = {
	algorithm: "HS256",
	expiresIn: "10m",
	issuer: "marcher.com",
	audience: "marcher.com",
} as SignOptions

const jwtVerificationTokenVerifyOptions = {
	issuer: "marcher.com",
	audience: "marcher.com",
	clockTolerance: 5,
} as VerifyOptions

export const signVerificationToken = (payload: Record<string, string>, subject: string) => {
	if (!JWT_VERIFICATION_KEY) throw new Error("JWT_VERIFICATION_KEY is not defined")

	return jwt.sign(payload, JWT_VERIFICATION_KEY, {
		...jwtVerificationTokenSignOptions,
		subject,
	})
}

export const verifyVerificationToken = (token: string) => {
	if (!JWT_VERIFICATION_KEY) throw new Error("JWT_VERIFICATION_KEY is not defined")

	try {
		return jwt.verify(token, JWT_VERIFICATION_KEY, jwtVerificationTokenVerifyOptions)
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			return false
		}
	}
}
