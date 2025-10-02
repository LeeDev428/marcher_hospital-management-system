import { defineStore } from "pinia"
import { useToast } from "@/composables/useToast"
import type { 
  DashboardStats, 
  DashboardData, 
  AppointmentsList,
  DashboardAppointment,
} from "~/types/dashboard/dashboard"

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    loading: false,
    dashboardData: null as DashboardData | null,
    appointmentsList: [] as DashboardAppointment[], // Fixed: Renamed for clarity
    filters: {
      doctorId: undefined as string | undefined,
      facilityId: undefined as string | undefined,
      dateFrom: undefined as string | undefined,
      dateTo: undefined as string | undefined,
      status: undefined as "PENDING" | "SCHEDULED" | "COMPLETED" | "CANCELLED" | undefined,
    },
  }),

  getters: {
    // Summary getters
    todayAppointmentCount: (state) => state.dashboardData?.summary.todayAppointments || 0,
    todayPendingAppointmentCount: (state) => state.dashboardData?.summary.todayPendingAppointments || 0, // Fixed
    thisMonthAppointmentCount: (state) => state.dashboardData?.summary.thisMonthAppointments || 0,
    totalPatientsCount: (state) => state.dashboardData?.summary.totalPatients || 0,
    
    // Status breakdown - Fixed to use correct property
    todayPendingCount: (state) => state.dashboardData?.summary.todayByStatus?.PENDING || 0,
    todayScheduledCount: (state) => state.dashboardData?.summary.todayByStatus?.SCHEDULED || 0,
    todayCancelledCount: (state) => state.dashboardData?.summary.todayByStatus?.CANCELLED || 0,
    todayCompletedCount: (state) => state.dashboardData?.summary.todayByStatus?.COMPLETED || 0,

    statusDistributionData: (state) => {
      if (!state.dashboardData?.summary.todayByStatus) return null
      
      const statuses = state.dashboardData.summary.todayByStatus
      const labels = Object.keys(statuses)
      const data = Object.values(statuses)
      
      if (data.every(val => val === 0)) return null
      
      return {
        labels: labels.map(status => status.charAt(0) + status.slice(1).toLowerCase()),
        datasets: [{
          data,
          backgroundColor: [
            '#f59e0b', // PENDING - amber
            '#10b981', // SCHEDULED - emerald
            '#ef4444', // CANCELLED - red
            '#6366f1', // COMPLETED - indigo
          ],
          borderWidth: 0,
        }],
      }
    },

    // Filtered appointments by status
    pendingAppointments: (state) => state.appointmentsList.filter(apt => apt.status === 'PENDING'),
    scheduledAppointments: (state) => state.appointmentsList.filter(apt => apt.status === 'SCHEDULED'),
    completedAppointments: (state) => state.appointmentsList.filter(apt => apt.status === 'COMPLETED'),
    cancelledAppointments: (state) => state.appointmentsList.filter(apt => apt.status === 'CANCELLED'),

    // All appointments for display
    filteredAppointments: (state) => state.appointmentsList,
  },

  actions: {
    setFilters(filters: Partial<AppointmentsList>) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {
        doctorId: undefined,
        facilityId: undefined,
        dateFrom: undefined,
        dateTo: undefined,
        status: undefined,
      }
    },

    async fetchDashboardStats(params?: Partial<DashboardStats>) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        
        const queryParams = {
          ...this.filters,
          ...params,
        }

        const { success, message, data } = await $trpc.dashboard.getDashboardStats.query(queryParams)

        if (success && data) {
          this.dashboardData = data
          return { success, message, data }
        }

        return { success, message, data }
      } catch (error) {
        console.error("Dashboard stats error:", error)
        useToast("error", "Dashboard", "Failed to fetch dashboard statistics.")
        return { success: false, message: "Failed to fetch dashboard statistics.", data: null }
      } finally {
        this.loading = false
      }
    },

    // Fixed: Single method to fetch appointments with filters
    async fetchAppointmentsList(params?: Partial<AppointmentsList>) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        
        const queryParams = {
          ...this.filters,
          ...params,
        }

        const { success, message, data } = await $trpc.dashboard.getAppointmentsList.query(queryParams)

        if (success && data) {
          this.appointmentsList = data.map((item: any) => ({
            ...item,
            patientName: `${item.patient.lastName}, ${item.patient.firstName}${item.patient.middleName ? ` ${item.patient.middleName}` : ""}${item.patient.suffix ? ` ${item.patient.suffix}` : ""}`,
            doctorName: `Dr. ${item.doctor.firstName} ${item.doctor.lastName}${item.doctor.middleName ? ` ${item.doctor.middleName}` : ""}${item.doctor.suffix ? ` ${item.doctor.suffix}` : ""}`,
          }))
          return { success, message, data }
        }

        return { success, message, data }
      } catch (error) {
        console.error("Appointments list error:", error)
        useToast("error", "Dashboard", "Failed to fetch appointments list.")
        return { success: false, message: "Failed to fetch appointments list.", data: null }
      } finally {
        this.loading = false
      }
    },

    async refreshDashboard() {
      await Promise.all([
        this.fetchDashboardStats(),
        this.fetchAppointmentsList(),
      ])
    },

    async applyFilters(filters: Partial<AppointmentsList>) {
      this.setFilters(filters)
      await this.refreshDashboard()
    },

    // Quick filter methods
    async setTodayFilter() {
      const today = new Date().toISOString().split('T')[0]
      await this.applyFilters({
        dateFrom: today,
        dateTo: today,
      })
    },

    async setTomorrowFilter() {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]
      
      await this.applyFilters({
        dateFrom: tomorrowStr,
        dateTo: tomorrowStr,
      })
    },

    async setUpcomingWeekFilter() {
      const today = new Date()
      const nextWeek = new Date()
      nextWeek.setDate(today.getDate() + 7)
      
      const todayStr = today.toISOString().split('T')[0]
      const nextWeekStr = nextWeek.toISOString().split('T')[0]
      
      await this.applyFilters({
        dateFrom: todayStr,
        dateTo: nextWeekStr,
      })
    },
  },
})