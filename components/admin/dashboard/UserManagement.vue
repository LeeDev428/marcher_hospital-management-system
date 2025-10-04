<script setup lang="ts">
// Mock user management data
const userOverview = ref({
  totalUsers: 1247,
  activeToday: 89,
  newThisWeek: 23,
  pendingApproval: 7
})

const usersByRole = ref([
  { role: 'Patients', count: 867, percentage: 69.6, color: 'bg-blue-500' },
  { role: 'Staff', count: 245, percentage: 19.6, color: 'bg-green-500' },
  { role: 'Doctors', count: 98, percentage: 7.9, color: 'bg-purple-500' },
  { role: 'Admins', count: 37, percentage: 3.0, color: 'bg-orange-500' }
])

const recentUsers = ref([
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    email: "s.wilson@hospital.com",
    role: "Doctor",
    status: "Active",
    joinDate: "2024-01-15"
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@patient.com",
    role: "Patient", 
    status: "Pending",
    joinDate: "2024-01-14"
  },
  {
    id: 3,
    name: "Nurse Amanda Rodriguez",
    email: "a.rodriguez@hospital.com",
    role: "Staff",
    status: "Active",
    joinDate: "2024-01-13"
  }
])

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'text-green-700 bg-green-100'
    case 'Pending':
      return 'text-yellow-700 bg-yellow-100'
    case 'Inactive':
      return 'text-gray-700 bg-gray-100'
    default:
      return 'text-blue-700 bg-blue-100'
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Doctor':
      return 'text-purple-700 bg-purple-100'
    case 'Staff':
      return 'text-green-700 bg-green-100'
    case 'Patient':
      return 'text-blue-700 bg-blue-100'
    case 'Admin':
      return 'text-orange-700 bg-orange-100'
    default:
      return 'text-gray-700 bg-gray-100'
  }
}
</script>

<template>
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
    <!-- User Statistics Overview -->
    <div class="xl:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">User Management</h3>
        <Button variant="outline" size="sm" @click="navigateTo('/admin/users')">
          Manage Users
          <Icon name="lucide:users" class="w-4 h-4 ml-2" />
        </Button>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div class="text-2xl font-bold text-blue-900">{{ userOverview.totalUsers.toLocaleString() }}</div>
          <div class="text-sm text-blue-700">Total Users</div>
        </div>
        <div class="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <div class="text-2xl font-bold text-green-900">{{ userOverview.activeToday }}</div>
          <div class="text-sm text-green-700">Active Today</div>
        </div>
        <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <div class="text-2xl font-bold text-purple-900">{{ userOverview.newThisWeek }}</div>
          <div class="text-sm text-purple-700">New This Week</div>
        </div>
        <div class="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
          <div class="text-2xl font-bold text-orange-900">{{ userOverview.pendingApproval }}</div>
          <div class="text-sm text-orange-700">Pending Approval</div>
        </div>
      </div>

      <!-- Users by Role Distribution -->
      <div class="space-y-4">
        <h4 class="text-md font-semibold text-gray-800">Users by Role</h4>
        <div class="space-y-3">
          <div 
            v-for="roleData in usersByRole" 
            :key="roleData.role"
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <div :class="[roleData.color, 'w-3 h-3 rounded-full']"></div>
              <span class="text-sm font-medium text-gray-700">{{ roleData.role }}</span>
            </div>
            
            <div class="flex items-center space-x-4">
              <div class="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  :class="[roleData.color, 'h-2 rounded-full']"
                  :style="`width: ${roleData.percentage}%`"
                ></div>
              </div>
              <div class="text-right min-w-[4rem]">
                <div class="text-sm font-semibold text-gray-900">{{ roleData.count }}</div>
                <div class="text-xs text-gray-500">{{ roleData.percentage }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent User Registrations -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Recent Users</h3>
        <Button variant="ghost" size="sm">
          <Icon name="lucide:refresh-cw" class="w-4 h-4" />
        </Button>
      </div>

      <div class="space-y-4">
        <div 
          v-for="user in recentUsers" 
          :key="user.id"
          class="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between mb-2">
            <div>
              <h4 class="text-sm font-semibold text-gray-900">{{ user.name }}</h4>
              <p class="text-xs text-gray-600">{{ user.email }}</p>
            </div>
            <span :class="[getStatusColor(user.status), 'text-xs px-2 py-1 rounded-full font-medium']">
              {{ user.status }}
            </span>
          </div>
          
          <div class="flex items-center justify-between mt-3">
            <span :class="[getRoleColor(user.role), 'text-xs px-2 py-1 rounded-full font-medium']">
              {{ user.role }}
            </span>
            <span class="text-xs text-gray-500">{{ user.joinDate }}</span>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-gray-100">
        <Button variant="outline" size="sm" class="w-full" @click="navigateTo('/admin/users/new')">
          <Icon name="lucide:user-plus" class="w-4 h-4 mr-2" />
          Add New User
        </Button>
      </div>
    </div>
  </div>
</template>