import { PrismaClient as InstancePrismaClient } from "@/prisma/generated/instance/client"
import type { CreateLog } from "@/types/logs"

export const createLog = async (log: CreateLog) => {
	try {
		const instancePrisma = new InstancePrismaClient()

		await instancePrisma.log.create({
			data: {
				user: log.user,
				action: log.action,
				entity: log.entity,
				data: {}, 
				ipAddress: log.ipAddress,
			}
		})
	} catch (error) {
		console.log(error)
	}
}
