import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/trpc/init"
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

const getRooms = publicProcedure.query(async ({ ctx }) => {
  console.log('🔍 getRooms called')
  console.log('🔍 ctx keys:', Object.keys(ctx))
  console.log('🔍 ctx.instancePrisma exists?', !!ctx.instancePrisma)
  
  try {
    const rooms = await ctx.instancePrisma.room.findMany({})

    return { success: true, message: "Rooms fetched successfully.", data: rooms }
  } catch (error) {
    console.log("getRooms error:", error)
    return { success: false, message: "Failed to fetch rooms.", data: null }
  }
})

const getRoom = publicProcedure
  .input(getRoomSchema)
  .query(async ({ ctx, input }) => {
    console.log('🔍 getRoom called with input:', input)
    const { id } = input

    try {
      console.log('🔍 Attempting to find room with id:', id)
      const room = await ctx.instancePrisma.room.findUnique({ 
        where: { id }
      })

      console.log('🔍 Room found:', !!room)

      if (!room) {
        console.log('❌ Room not found')
        return { success: false, message: "Room not found.", data: null }
      }

      console.log('✅ Room fetched successfully:', room.identifier)
      return { success: true, message: "Room fetched successfully.", data: room }
    } catch (error) {
      console.error('❌ getRoom error:', error)
      return { success: false, message: "Failed to fetch room.", data: null }
    }
  })

const createRoom = publicProcedure
  .input(createRoomSchema)
  .mutation(async ({ ctx, input }) => {
    const { building, type, identifier, description, capacity, status } = input

    try {
      const room = await ctx.instancePrisma.room.create({
        data: { 
          building, 
          type, 
          identifier, 
          description, 
          capacity: capacity ?? undefined, 
          status 
        },
      })

      // ✅ Log creation to Audit Trail
      await logFacilityAction(ctx.instancePrisma, {
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

const updateRoom = publicProcedure
  .input(updateRoomSchema)
  .mutation(async ({ ctx, input }) => {
    const { id, type, identifier, description, capacity, status } = input

    try {
      const oldRoom = await ctx.instancePrisma.room.findUnique({ where: { id } })

      const room = await ctx.instancePrisma.room.update({
        where: { id },
        data: { 
          type, 
          identifier, 
          description, 
          capacity: capacity ?? undefined, 
          status 
        },
      })

      // ✅ Log update to Audit Trail
      await logFacilityAction(ctx.instancePrisma, {
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

const deleteRoom = publicProcedure
  .input(deleteRoomSchema)
  .mutation(async ({ ctx, input }) => {
    console.log('🗑️ deleteRoom called with input:', input)
    const { id } = input

    try {
      console.log('🔍 Attempting to find room with id:', id)
      const oldRoom = await ctx.instancePrisma.room.findUnique({ where: { id } })
      
      if (!oldRoom) {
        console.log('❌ Room not found for deletion')
        return { success: false, message: "Room not found.", data: null }
      }

      console.log('🔍 Deleting room:', oldRoom.identifier)
      const room = await ctx.instancePrisma.room.delete({ where: { id } })

      // ✅ Log deletion to Audit Trail
      await logFacilityAction(ctx.instancePrisma, {
        action: "Deleted Room",
        roomIdentifier: oldRoom?.identifier ?? "",
        type: oldRoom?.type ?? "",
        oldStatus: oldRoom?.status ?? null,
      })

      console.log('✅ Room deleted successfully')
      return { success: true, message: "Room deleted successfully.", data: room }
    } catch (error) {
      console.error('❌ deleteRoom error:', error)
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
