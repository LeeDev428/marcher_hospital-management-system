<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '~/components/ui/badge'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: 'Staff Management - Admin Portal'
})

// State
const staff = ref<any[]>([
  { id: 1, name: "Dr. Sarah Johnson", email: "sarah.johnson@hospital.com", role: "DOCTOR", department: "Cardiology", status: "ACTIVE" },
  { id: 2, name: "Mary Wilson", email: "mary.wilson@hospital.com", role: "NURSE", department: "Emergency", status: "ACTIVE" },
  { id: 3, name: "Dr. James Brown", email: "james.brown@hospital.com", role: "DOCTOR", department: "Pediatrics", status: "ACTIVE" },
  { id: 4, name: "Lisa Davis", email: "lisa.davis@hospital.com", role: "NURSE", department: "Surgery", status: "ACTIVE" },
  { id: 5, name: "Dr. Michael Chen", email: "michael.chen@hospital.com", role: "DOCTOR", department: "Radiology", status: "INACTIVE" }
])

// Statistics
const staffStats = computed(() => ({
  total: staff.value.length,
  doctors: staff.value.filter(s => s.role === 'DOCTOR').length,
  nurses: staff.value.filter(s => s.role === 'NURSE').length,
  active: staff.value.filter(s => s.status === 'ACTIVE').length
}))

// Helper functions
const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'DOCTOR': return 'bg-blue-100 text-blue-800'
    case 'NURSE': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-800'
    case 'INACTIVE': return 'bg-red-100 text-red-800'
    case 'ON_LEAVE': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Staff are already loaded from the ref above - no TRPC calls needed
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Staff Management</h1>
        <p class="text-gray-600">Manage doctors and nurses in your hospital</p>
      </div>
      
      <Button>
        <Icon name="lucide:user-plus" class="w-4 h-4 mr-2" />
        Add Staff Member
      </Button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Staff</p>
              <p class="text-2xl font-bold">{{ staffStats.total }}</p>
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
              <p class="text-sm font-medium text-muted-foreground">Doctors</p>
              <p class="text-2xl font-bold">{{ staffStats.doctors }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:stethoscope" class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Nurses</p>
              <p class="text-2xl font-bold">{{ staffStats.nurses }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:heart-pulse" class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Active Staff</p>
              <p class="text-2xl font-bold">{{ staffStats.active }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:user-check" class="w-6 h-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Staff Table -->
    <Card>
      <CardHeader>
        <CardTitle>Staff Members</CardTitle>
        <CardDescription>Manage your hospital's medical staff</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left p-3 font-medium">Name</th>
                <th class="text-left p-3 font-medium">Role</th>
                <th class="text-left p-3 font-medium">Department</th>
                <th class="text-left p-3 font-medium">Status</th>
                <th class="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in staff" :key="member.id" class="border-b hover:bg-muted/50">
                <td class="p-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Icon name="lucide:user" class="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p class="font-medium">{{ member.name }}</p>
                      <p class="text-sm text-muted-foreground">{{ member.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="p-3">
                  <Badge :class="getRoleBadgeColor(member.role)">
                    {{ member.role }}
                  </Badge>
                </td>
                <td class="p-3">{{ member.department }}</td>
                <td class="p-3">
                  <Badge :class="getStatusBadgeColor(member.status)">
                    {{ member.status }}
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
          
          <div v-if="staff.length === 0" class="p-8 text-center text-muted-foreground">
            <Icon name="lucide:users" class="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No staff members found</p>
            <p class="text-sm">Add staff members to get started</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>