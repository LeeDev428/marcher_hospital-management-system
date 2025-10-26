import crypto from 'crypto'

/**
 * Generate a secure random token for insurance company access
 * @returns A secure URL-safe token string
 */
export function generateSecureToken(): string {
  // Generate 32 bytes (256 bits) of random data
  const randomBytes = crypto.randomBytes(32)
  
  // Convert to URL-safe base64 string
  const token = randomBytes
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
  
  return token
}

/**
 * Generate a shorter token for verification codes (e.g., 6 digits)
 * @param length Length of the numeric code
 * @returns A numeric verification code
 */
export function generateVerificationCode(length: number = 6): string {
  const digits = '0123456789'
  let code = ''
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length)
    code += digits[randomIndex]
  }
  
  return code
}
