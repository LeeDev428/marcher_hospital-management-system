<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '~/components/ui/badge'

interface Props {
  refreshTrigger?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  staffUpdated: []
}>()

// TRPC Client
const { $trpc } = useNuxtApp()

// State
const staff = ref<any[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

// Fetch staff data
const fetchStaff = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const response = await $trpc.staff.list.query()
    
    if (response.success) {
      staff.value = response.data
    } else {
      error.value = response.message || 'Failed to fetch staff'
    }
  } catch (err) {
    console.error('Error fetching staff:', err)
    error.value = 'Failed to load staff data'
  } finally {
    isLoading.value = false
  }
}

// Watch for refresh trigger
watch(() => props.refreshTrigger, () => {
  fetchStaff()
}, { immediate: true })

// Helper functions
const getRoleBadgeColor = (staffType: string) => {
  switch (staffType) {
    case 'DOCTOR': return 'bg-blue-100 text-blue-800'
    case 'NURSE': return 'bg-green-100 text-green-800'
    case 'TECHNICIAN': return 'bg-purple-100 text-purple-800'
    case 'PHARMACIST': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-800'
    case 'INACTIVE': return 'bg-red-100 text-red-800'
    case 'SUSPENDED': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStaffName = (member: any) => {
  return `${member.firstName} ${member.lastName}`
}

const getStaffType = (member: any) => {
  return member.staffCredentials?.staffType || 'STAFF'
}

// Actions
const viewStaff = (member: any) => {
  // TODO: Navigate to staff detail page
  console.log('View staff:', member)
}

const editStaff = (member: any) => {
  // TODO: Open edit modal
  console.log('Edit staff:', member)
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Staff Members</CardTitle>
      <CardDescription>Manage your hospital's medical staff</CardDescription>
    </CardHeader>
    <CardContent>
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-4">
        <div v-for="i in 5" :key="i" class="animate-pulse">
          <div class="flex items-center space-x-4 p-3">
            <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <Icon name="lucide:alert-circle" class="w-5 h-5 text-red-500 mr-2" />
          <p class="text-red-700">{{ error }}</p>
        </div>
        <Button @click="fetchStaff" variant="outline" size="sm" class="mt-2">
          <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>

      <!-- Staff Table -->
      <div v-else class="overflow-x-auto">
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
                    <p class="font-medium">{{ getStaffName(member) }}</p>
                    <p class="text-sm text-muted-foreground">{{ member.email }}</p>
                  </div>
                </div>
              </td>
              <td class="p-3">
                <Badge :class="getRoleBadgeColor(getStaffType(member))">
                  {{ getStaffType(member) }}
                </Badge>
              </td>
              <td class="p-3">{{ member.department || 'N/A' }}</td>
              <td class="p-3">
                <Badge :class="getStatusBadgeColor(member.status)">
                  {{ member.status }}
                </Badge>
              </td>
              <td class="p-3">
                <div class="flex space-x-2">
                  <Button @click="viewStaff(member)" variant="outline" size="sm">
                    <Icon name="lucide:eye" class="w-4 h-4" />
                  </Button>
                  <Button @click="editStaff(member)" variant="outline" size="sm">
                    <Icon name="lucide:edit" class="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div v-if="staff.length === 0" class="p-8 text-center text-muted-foreground">
          <Icon name="lucide:users" class="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>No staff members found</p>
          <p class="text-sm">Add staff members to get started</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>