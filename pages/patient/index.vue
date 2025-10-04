<script setup lang="ts">
import { useAuthStore } from '~/stores/app/useAuthStore'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Mock data for demonstration
const upcomingAppointments = ref([
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    date: "2025-10-10",
    time: "10:00 AM",
    type: "Consultation",
    status: "confirmed"
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialty: "Dermatology", 
    date: "2025-10-15",
    time: "2:30 PM",
    type: "Follow-up",
    status: "pending"
  }
])

const healthMetrics = ref({
  lastCheckup: "2025-09-15",
  bloodPressure: "120/80",
  heartRate: "72 bpm",
  weight: "70 kg"
})

const quickActions = [
  {
    title: "Book Appointment",
    description: "Schedule a new appointment",
    icon: "lucide:calendar-plus",
    link: "/patient/appointments",
    color: "bg-teal-500"
  },
  {
    title: "View Medical Records",
    description: "Access your health history",
    icon: "lucide:file-text",
    link: "/patient/medical-records",
    color: "bg-blue-500"
  },
  {
    title: "Find Doctor",
    description: "Search for specialists",
    icon: "lucide:user-search",
    link: "/patient/doctor",
    color: "bg-indigo-500"
  },
  {
    title: "Billing & Payments",
    description: "Manage your payments",
    icon: "lucide:credit-card",
    link: "/patient/billing",
    color: "bg-green-500"
  }
]
</script>

<template>
  <NuxtLayout name="patient" title="Patient Dashboard">
    <div class="min-h-screen bg-gray-50 p-6">
      <!-- Welcome Header -->
      <div class="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8 mb-8">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div class="space-y-2">
            <h1 class="text-3xl font-bold text-gray-900">
              Welcome back, {{ user?.firstName || 'Patient' }}! 👋
            </h1>
            <p class="text-lg text-gray-600">
              Here's your health overview for today
            </p>
          </div>
          <div class="mt-4 md:mt-0 bg-white p-4 rounded-xl shadow-sm">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Icon name="lucide:heart-pulse" class="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <div class="font-semibold text-gray-900">Health Score</div>
                <div class="text-2xl font-bold text-teal-600">Good</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          v-for="action in quickActions"
          :key="action.title"
          class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          @click="navigateTo(action.link)"
        >
          <div class="flex items-start space-x-4">
            <div :class="[action.color, 'w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform']">
              <Icon :name="action.icon" class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 mb-1">{{ action.title }}</h3>
              <p class="text-sm text-gray-600">{{ action.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Upcoming Appointments -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
              <Button variant="ghost" size="sm" @click="navigateTo('/patient/appointments')">
                View All
                <Icon name="lucide:arrow-right" class="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
          <div class="p-6">
            <div v-if="upcomingAppointments.length > 0" class="space-y-4">
              <div
                v-for="appointment in upcomingAppointments"
                :key="appointment.id"
                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <Icon name="lucide:user-check" class="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900">{{ appointment.doctor }}</h3>
                      <p class="text-sm text-gray-600">{{ appointment.specialty }}</p>
                      <p class="text-sm text-gray-500">{{ appointment.type }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold text-gray-900">{{ appointment.date }}</div>
                    <div class="text-sm text-gray-600">{{ appointment.time }}</div>
                    <span
                      :class="[
                        'inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1',
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      ]"
                    >
                      {{ appointment.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12">
              <Icon name="lucide:calendar-x" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">No upcoming appointments</h3>
              <p class="text-gray-600 mb-4">Schedule your next appointment with a healthcare provider</p>
              <Button @click="navigateTo('/patient/appointments')">
                Book Appointment
              </Button>
            </div>
          </div>
        </div>

        <!-- Health Overview -->
        <div class="space-y-6">
          <!-- Health Metrics -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Health Metrics</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Icon name="lucide:heart" class="w-4 h-4 text-red-600" />
                  </div>
                  <span class="text-gray-700">Blood Pressure</span>
                </div>
                <span class="font-semibold text-gray-900">{{ healthMetrics.bloodPressure }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon name="lucide:activity" class="w-4 h-4 text-blue-600" />
                  </div>
                  <span class="text-gray-700">Heart Rate</span>
                </div>
                <span class="font-semibold text-gray-900">{{ healthMetrics.heartRate }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon name="lucide:weight" class="w-4 h-4 text-green-600" />
                  </div>
                  <span class="text-gray-700">Weight</span>
                </div>
                <span class="font-semibold text-gray-900">{{ healthMetrics.weight }}</span>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100">
              <p class="text-sm text-gray-600">
                Last checkup: {{ healthMetrics.lastCheckup }}
              </p>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                <div>
                  <p class="text-sm text-gray-900">Lab results uploaded</p>
                  <p class="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p class="text-sm text-gray-900">Appointment completed with Dr. Johnson</p>
                  <p class="text-xs text-gray-500">5 days ago</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p class="text-sm text-gray-900">Prescription refilled</p>
                  <p class="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Emergency Contact -->
          <div class="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6">
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <Icon name="lucide:phone" class="w-5 h-5 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Emergency</h3>
            </div>
            <p class="text-sm text-gray-600 mb-4">
              24/7 emergency hotline available
            </p>
            <Button variant="outline" class="w-full border-red-300 text-red-700 hover:bg-red-50">
              Call Emergency: 911
            </Button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>