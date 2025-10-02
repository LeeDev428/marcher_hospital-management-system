import { createTRPCRouter } from "../../init"
import { medicalRecordRequestsRouter } from "./medicalRecordRequests"

export const medicalRecordsRouter = createTRPCRouter({
  requests: medicalRecordRequestsRouter,
})