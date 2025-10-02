import crypto from "crypto"

const algorithm: crypto.CipherGCMTypes = "aes-256-gcm"
const key = crypto.createHash("sha256").update(process.env.ENCRYPTION_KEY!).digest()

export const decrypt = (hex: string) => {
	const [ivHex, tagHex, encryptedHex] = hex.split(":")
	if (!ivHex || !tagHex || !encryptedHex) throw new Error("Malformed Encrypted Data")

	const iv = Buffer.from(ivHex, 'hex')
	const tag = Buffer.from(tagHex, 'hex')

	const decipher = crypto.createDecipheriv(algorithm, key, iv).setAuthTag(tag)
	const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedHex, 'hex')), decipher.final()])

	return decrypted.toString("utf-8")
}
