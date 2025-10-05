<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '~/components/ui/badge'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'User Management - Admin Portal'
})

// State
const users = ref<any[]>([])

// Statistics
const userStats = computed(() => ({
  total: users.value.length,
  partners: users.value.filter(u => u.role === 'PARTNER').length,
  patients: users.value.filter(u => u.role === 'PATIENT').length,
  admins: users.value.filter(u => u.role === 'ADMIN').length
}))

// Helper functions
const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'ADMIN': return 'bg-red-100 text-red-800'
    case 'PARTNER': return 'bg-purple-100 text-purple-800'
    case 'PATIENT': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusBadgeColor = (status: string) => {
  return status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
}

// Load users (excluding staff)
const loadUsers = async () => {
  try {
    const { $trpc } = useNuxtApp()
    const response = await $trpc.users.list.query()
    
    if (response.success && response.data) {
      users.value = response.data.filter(user => user.role !== 'STAFF')
    }
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
        <p class="text-gray-600">Manage administrators, partners, and patients (Staff managed separately)</p>
      </div>
      
      <Button>
        <Icon name="lucide:user-plus" class="w-4 h-4 mr-2" />
        Create User
      </Button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Users</p>
              <p class="text-2xl font-bold">{{ userStats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:users" class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Partners</p>
              <p class="text-2xl font-bold">{{ userStats.partners }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:building" class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Patients</p>
              <p class="text-2xl font-bold">{{ userStats.patients }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:user" class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Admins</p>
              <p class="text-2xl font-bold">{{ userStats.admins }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:shield" class="w-6 h-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Users Table -->
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>Manage user accounts (Staff managed in Staff Management)</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left p-3 font-medium">User</th>
                <th class="text-left p-3 font-medium">Role</th>
                <th class="text-left p-3 font-medium">Details</th>
                <th class="text-left p-3 font-medium">Status</th>
                <th class="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" class="border-b hover:bg-muted/50">
                <td class="p-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Icon name="lucide:user" class="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p class="font-medium">{{ user.firstName }} {{ user.lastName }}</p>
                      <p class="text-sm text-muted-foreground">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="p-3">
                  <Badge :class="getRoleBadgeColor(user.role)">
                    {{ user.role }}
                  </Badge>
                </td>
                <td class="p-3">
                  <div v-if="user.role === 'PARTNER'">
                    <p class="font-medium">{{ user.partnerProfile?.institutionName || 'N/A' }}</p>
                    <p class="text-sm text-muted-foreground">{{ user.partnerProfile?.institutionType || 'N/A' }}</p>
                  </div>
                  <div v-else-if="user.role === 'PATIENT'">
                    <p class="font-medium">Patient</p>
                    <p class="text-sm text-muted-foreground">{{ user.patientProfile?.patientNumber || 'N/A' }}</p>
                  </div>
                  <div v-else-if="user.role === 'ADMIN'">
                    <p class="font-medium">Administrator</p>
                    <p class="text-sm text-muted-foreground">System Admin</p>
                  </div>
                </td>
                <td class="p-3">
                  <Badge :class="getStatusBadgeColor(user.status)">
                    {{ user.status }}
                  </Badge>
                </td>
                <td class="p-3">
                  <div class="flex space-x-2">
                    <Button variant="outline" size="sm">View</Button>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="users.length === 0" class="p-8 text-center text-muted-foreground">
            <Icon name="lucide:users" class="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No users found</p>
            <p class="text-sm">Staff members are managed in the Staff Management section</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>