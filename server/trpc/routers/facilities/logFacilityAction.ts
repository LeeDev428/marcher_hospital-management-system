// utils/logFacilityAction.ts (or inline in rooms.ts if small project)
export async function logFacilityAction(instancePrisma: any, {
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
      user: "System", // Replace with session.user?.name if available
      role: "Admin",  // Replace with session.user?.role if available
      action,
      roomIdentifier,
      type,
      oldStatus,
      newStatus,
      timestamp: new Date(),
    },
  })
}
