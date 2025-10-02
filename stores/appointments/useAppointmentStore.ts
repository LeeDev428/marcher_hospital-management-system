import { defineStore } from "pinia"
import { useToast } from "@/composables/useToast"
import type {
  TableAppointment,
  CreateAppointment,
  UpdateAppointment,
  CreatePatientAppointment,
  UpdatePatientAppointment,
  GetAppointments,
  GetPatientAppointments,
  AppointmentFilters,
  PatientAppointmentFilters,
  CheckAvailability,
  GetAvailableTimeSlots,
  AvailabilityResponse,
  AssignRoom,
  UpdateAppointmentStatus
} from "@/types/appointments"

export const useAppointmentStore = defineStore("appointment", {
  state: () => ({
    loading: true,
    appointment: null as CreateAppointment | UpdateAppointment | null,
    patientAppointment: null as CreatePatientAppointment | null,
    appointments: [] as TableAppointment[],

    filters: {
      doctorId: undefined,
      facilityId: undefined,
      date: undefined,
      status: undefined,
    } as AppointmentFilters,

    patientFilters: {
      doctorId: undefined,
      date: undefined,
      status: undefined,
    } as PatientAppointmentFilters,

    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },

    availabilityData: null as AvailabilityResponse | null,
    checkingAvailability: false,
  }),

  getters: {
    filteredAppointments: (s) => s.appointments,
    hasFilters: (s) => !!(s.filters.doctorId || s.filters.facilityId || s.filters.date || s.filters.status),
    hasPatientFilters: (s) => !!(s.patientFilters.doctorId || s.patientFilters.date || s.patientFilters.status),
    upcomingAppointments: (s) => s.appointments.filter(a => a.status === "PENDING" || a.status === "SCHEDULED"),
    cancellableAppointments: (s) => s.appointments.filter(a => a.status === "PENDING" || a.status === "SCHEDULED"),
  },

  actions: {
    // === STAFF ===
    setFilters(filters: Partial<AppointmentFilters>) {
      this.filters = { ...this.filters, ...filters }
    },
    clearFilters() {
      this.filters = { doctorId: undefined, facilityId: undefined, date: undefined, status: undefined }
    },

    async getAppointments(params?: Partial<GetAppointments>) {
      const { $trpc } = useNuxtApp()
      try {
        this.loading = true
        const queryParams = { ...this.filters, page: this.pagination.page, limit: this.pagination.limit, ...params }
        const { success, message, data } = await $trpc.appointments.getAppointments.query(queryParams)
        if (success && data) {
          this.appointments = data.appointments.map(a => ({
            ...a,
            facilityId: a.facilityId === null ? undefined : a.facilityId
          }))
          this.pagination = data.pagination
          this.loading = false
          return { success, message, data }
        }
        this.loading = false
        return { success, message, data }
      } catch (error) {
        this.loading = false
        console.log(error)
        useToast("error", "Appointments", "Failed to fetch appointments.")
      }
    },

    async filterAppointments(filters: Partial<AppointmentFilters>) {
      this.setFilters(filters)
      this.pagination.page = 1
      await this.getAppointments()
    },

    async getAppointment(id: string) {
      const { $trpc } = useNuxtApp()
      try {
        this.loading = true
        const { success, message, data } = await $trpc.appointments.getAppointment.query({ id })
        if (success && data) {
          this.appointment = { ...data, facilityId: data.facilityId === null ? undefined : data.facilityId }
          this.loading = false
          return { success, message, data }
        }
        this.loading = false
        return { success, message, data }
      } catch (error) {
        this.loading = false
        console.log(error)
        useToast("error", "Appointments", "Failed to fetch appointment.")
      }
    },

    async createAppointment(appointment: CreateAppointment) {
      const { $trpc } = useNuxtApp()
      try {
        this.loading = true
        const { success, message, data } = await $trpc.appointments.createAppointment.mutate(appointment)
        if (success && data) {
          this.appointment = { ...data, facilityId: data.facilityId === null ? undefined : data.facilityId }
          this.loading = false
          useToast("success", "Appointments", "Appointment created successfully.")
          await navigateTo("/appointments")
        }
        this.loading = false
        return { success, message, data }
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },

    async updateAppointment(appointment: UpdateAppointment) {
      const { $trpc } = useNuxtApp()
      try {
        this.loading = true
        const { success, message, data } = await $trpc.appointments.updateAppointment.mutate(appointment)
        if (success && data) {
          this.appointment = { ...data, facilityId: data.facilityId === null ? undefined : data.facilityId }
          this.loading = false
          useToast("success", "Appointments", "Appointment updated successfully.")
          await navigateTo("/appointments")
        }
        this.loading = false
        return { success, message, data }
      } catch (error) {
        this.loading = false
        console.log(error)
        useToast("error", "Appointments", "Failed to update appointment.")
      }
    },

    async deleteAppointment(id: string) {
      const { $trpc } = useNuxtApp()
      try {
        this.loading = true
        const { success, message, data } = await $trpc.appointments.deleteAppointment.mutate({ id })
        if (success && data) {
          this.appointments = this.appointments.filter((a) => a.id !== id)
          this.loading = false
          useToast("success", "Appointments", "Appointment deleted successfully.")
        }
        this.loading = false
        return { success, message, data }
      } catch (error) {
        this.loading = false
        console.log(error)
        useToast("error", "Appointments", "Failed to delete appointment.")
      }
    },

    async assignRoom(params: AssignRoom) {
      const { $trpc } = useNuxtApp()
      try {
        this.loading = true
        const { success, message, data } = await $trpc.appointments.assignRoom.mutate(params)
        if (success && data) {
          const idx = this.appointments.findIndex(a => a.id === params.id)
          if (idx !== -1 && data.facility) this.appointments[idx].facility = data.facility
          this.loading = false
          useToast("success", "Appointments", "Room assigned successfully.")
        }
        this.loading = false
        return { success, message, data }
      } catch (error) {
        this.loading = false
        console.log(error)
        useToast("error", "Appointments", "Failed to assign room.")
      }
    },

    async updateAppointmentStatus(params: UpdateAppointmentStatus) {
      const { $trpc } = useNuxtApp()
      try {
        this.loading = true
        const { success, message, data } = await $trpc.appointments.updateAppointmentStatus.mutate(params)
        if (success && data) {
          const idx = this.appointments.findIndex(a => a.id === params.id)
          if (idx !== -1) this.appointments[idx].status = params.status
          this.loading = false
          useToast("success", "Appointments", "Appointment status updated successfully.")
        }
        this.loading = false
        return { success, message, data }
      } catch (error) {
        this.loading = false
        console.log(error)
        useToast("error", "Appointments", "Failed to update appointment status.")
      }
    },

    // === PATIENT ===
    setPatientFilters(filters: Partial<PatientAppointmentFilters>) {
      this.patientFilters = { ...this.patientFilters, ...filters }
    },
    clearPatientFilters() {
      this.patientFilters = { doctorId: undefined, date: undefined, status: undefined }
    },

    async getPatientAppointments(params?: Partial<GetPatientAppointments>) {
      const { $trpc } = useNuxtApp()
      try {
        this.loading = true
        const queryParams = { ...this.patientFilters, page: this.pagination.page, limit: this.pagination.limit, ...params }
        const { success, message, data } = await $trpc.appointments.getPatientAppointments.query(queryParams)
        if (success && data) {
          this.appointments = data.appointments.map(a => ({
            ...a,
            facilityId: a.facilityId === null ? undefined : a.facilityId
          }))
          this.pagination = data.pagination
          this.loading = false
          return { success, message, data }
        }
        this.loading = false
        return { success, message, data }
      } catch (error) {
        this.loading = false
        console.log(error)
        useToast("error", "Appointments", "Failed to fetch appointments.")
      }
    },

    async filterPatientAppointments(filters: Partial<PatientAppointmentFilters>) {
      this.setPatientFilters(filters)
      this.pagination.page = 1
      await this.getPatientAppointments()
    },

    async bookAppointment(appointment: CreatePatientAppointment) {
      const { $trpc } = useNuxtApp()
      try {
        this.loading = true
        const { success, message, data } = await $trpc.appointments.createPatientAppointment.mutate(appointment)
        if (success && data) {
          this.loading = false
          useToast("success", "Appointment Booked", "Your appointment has been booked successfully! Status is pending - hospital staff will assign a room and confirm your appointment.")
          await navigateTo("/patient/appointments")
        }
        this.loading = false
        return { success, message, data }
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },

    async cancelAppointment(id: string) {
      const { $trpc } = useNuxtApp()
      try {
        this.loading = true
        const { success, message, data } = await $trpc.appointments.cancelPatientAppointment.mutate({ id, status: "CANCELLED" as UpdatePatientAppointment["status"] })
        if (success && data) {
          const idx = this.appointments.findIndex(a => a.id === id)
          if (idx !== -1) this.appointments[idx].status = "CANCELLED"
          this.loading = false
          useToast("success", "Appointments", "Appointment cancelled successfully.")
        }
        this.loading = false
        return { success, message, data }
      } catch (error) {
        this.loading = false
        console.log(error)
        useToast("error", "Appointments", "Failed to cancel appointment.")
      }
    },

    // === SHARED ===
    async changePage(page: number) {
      this.pagination.page = page
      const route = useRoute()
      if (route.path.startsWith("/patient/")) {
        await this.getPatientAppointments()
      } else {
        await this.getAppointments()
      }
    },

    async checkAvailability(params: CheckAvailability) {
      const { $trpc } = useNuxtApp()
      try {
        this.checkingAvailability = true
        const { success, message, data } = await $trpc.appointments.checkAvailability.query(params)
        this.checkingAvailability = false
        return { success, message, data }
      } catch (error) {
        this.checkingAvailability = false
        console.log(error)
        useToast("error", "Availability", "Failed to check availability.")
      }
    },

    async getAvailableTimeSlots(params: GetAvailableTimeSlots) {
      const { $trpc } = useNuxtApp()
      try {
        this.checkingAvailability = true
        const { success, message, data } = await $trpc.appointments.getAvailableTimeSlots.query(params)
        if (success && data) this.availabilityData = data
        this.checkingAvailability = false
        return { success, message, data }
      } catch (error) {
        this.checkingAvailability = false
        console.log(error)
        useToast("error", "Availability", "Failed to fetch available time slots.")
      }
    },

    clearAvailabilityData() {
      this.availabilityData = null
    },
  },
})
