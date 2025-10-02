import { hash, compare } from "bcrypt"

const saltRounds = 10

export const hashPassword = async (password: string) => {
	return await hash(password, saltRounds)
}

export const verifyPassword = async (password: string, hash: string) => {
	return await compare(password, hash)
}
