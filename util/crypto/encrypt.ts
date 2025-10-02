import crypto from "crypto"

const algorithm: crypto.CipherGCMTypes = "aes-256-gcm"
const key = crypto.createHash("sha256").update(process.env.ENCRYPTION_KEY!).digest()

export const encrypt = (data: string) => {
	const iv = crypto.randomBytes(12)
	const cipher = crypto.createCipheriv(algorithm, key, iv)

	const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
	const tag = cipher.getAuthTag()

	return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`
}
