import { createTRPCRouter } from "@/server/trpc/init"
import { roomsRouter } from "./rooms"
import { buildingsRouter } from "./buildings"

export const facilitiesRouter = createTRPCRouter({
	rooms: roomsRouter,
	buildings: buildingsRouter,
})