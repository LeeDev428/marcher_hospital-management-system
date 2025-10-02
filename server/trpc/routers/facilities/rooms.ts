import { createTRPCRouter, protectedProcedure } from "@/server/trpc/init"
import { 
  getRoomSchema, 
  createRoomSchema, 
  updateRoomSchema, 
  deleteRoomSchema 
} from "@/types/facilities"

// 🔹 Helper to log actions to FacilityLog
async function logFacilityAction(instancePrisma: any, {
  action,
  roomIdentifier,
  type,
  oldStatus,
  newStatus,
}: {
  action: string
  roomIdentifier: string
  type: string
  oldStatus?: string | null
  newStatus?: string | null
}) {
  await instancePrisma.facilityLog.create({
    data: {
      user: "System",       // Replace with session.user.name if available
      role: "Admin",        // Replace with session.user.role if available
      action,
      roomIdentifier,
      type,
      oldStatus,
      newStatus,
      timestamp: new Date(),
    },
  })
}

const getRooms = protectedProcedure.query(async ({ ctx }) => {
  const { instancePrisma } = ctx

  try {
    const rooms = await instancePrisma.room.findMany({
      include: { building: true },
    })

    return { success: true, message: "Rooms fetched successfully.", data: rooms }
  } catch (error) {
    console.log(error)
    return { success: false, message: "Failed to fetch rooms.", data: null }
  }
})

const getRoom = protectedProcedure
  .input(getRoomSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input

    try {
      const room = await instancePrisma.room.findUnique({ where: { id } })

      if (!room) {
        return { success: false, message: "Room not found.", data: null }
      }

      return { success: true, message: "Room fetched successfully.", data: room }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to fetch room.", data: null }
    }
  })

const createRoom = protectedProcedure
  .input(createRoomSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { buildingId, type, identifier, description, capacity, status } = input

    try {
      const room = await instancePrisma.room.create({
        data: { buildingId, type, identifier, description, capacity, status },
      })

      // ✅ Log creation to Audit Trail
      await logFacilityAction(instancePrisma, {
        action: "Created Room",
        roomIdentifier: identifier,
        type,
        newStatus: status,
      })

      return { success: true, message: "Room created successfully.", data: room }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to create room.", data: null }
    }
  })

const updateRoom = protectedProcedure
  .input(updateRoomSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id, type, identifier, description, capacity, status } = input

    try {
      const oldRoom = await instancePrisma.room.findUnique({ where: { id } })

      const room = await instancePrisma.room.update({
        where: { id },
        data: { type, identifier, description, capacity, status },
      })

      // ✅ Log update to Audit Trail
      await logFacilityAction(instancePrisma, {
        action: "Updated Room",
        roomIdentifier: identifier,
        type,
        oldStatus: oldRoom?.status ?? null,
        newStatus: status,
      })

      return { success: true, message: "Room updated successfully.", data: room }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to update room.", data: null }
    }
  })

const deleteRoom = protectedProcedure
  .input(deleteRoomSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input

    try {
      const oldRoom = await instancePrisma.room.findUnique({ where: { id } })
      const room = await instancePrisma.room.delete({ where: { id } })

      // ✅ Log deletion to Audit Trail
      await logFacilityAction(instancePrisma, {
        action: "Deleted Room",
        roomIdentifier: oldRoom?.identifier ?? "",
        type: oldRoom?.type ?? "",
        oldStatus: oldRoom?.status ?? null,
      })

      return { success: true, message: "Room deleted successfully.", data: room }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to delete room.", data: null }
    }
  })

export const roomsRouter = createTRPCRouter({
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
})
