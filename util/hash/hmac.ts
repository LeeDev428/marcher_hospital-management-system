import crypto from "crypto"

const key = Buffer.from(process.env.HMAC_KEY, "utf-8")

export const hmacSha256 = (data: string) => {
	return crypto
		.createHmac("sha256", key)
		.update(data)
		.digest("hex")
}
