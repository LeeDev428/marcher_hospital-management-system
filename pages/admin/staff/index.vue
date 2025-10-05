<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: 'Staff Management - Admin Portal'
})

// State
const staff = ref<any[]>([])
const isLoading = ref(true)
const showAddModal = ref(false)
const isSubmitting = ref(false)

// Form state
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  department: '',
  position: '',
  staffType: 'DOCTOR',
  specialization: ''
})

// Statistics
const staffStats = computed(() => ({
  total: staff.value.length,
  doctors: staff.value.filter(s => s.staffCredentials?.staffType === 'DOCTOR').length,
  nurses: staff.value.filter(s => s.staffCredentials?.staffType === 'NURSE').length,
  active: staff.value.filter(s => s.status === 'ACTIVE').length
}))

// Helper functions
const getRoleBadgeColor = (staffType: string) => {
  switch (staffType) {
    case 'DOCTOR': return 'bg-blue-100 text-blue-800'
    case 'NURSE': return 'bg-green-100 text-green-800'
    case 'TECHNICIAN': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusBadgeColor = (status: string) => {
  return status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
}

// Load staff members
const loadStaff = async () => {
  try {
    isLoading.value = true
    const { $trpc } = useNuxtApp()
    const response = await $trpc.users.list.query()
    
    if (response.success && response.data) {
      staff.value = response.data.filter(user => user.role === 'STAFF')
    }
  } catch (error) {
    console.error('Error loading staff:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadStaff()
})

// Add staff member
const addStaffMember = () => {
  showAddModal.value = true
}

// Reset form
const resetForm = () => {
  form.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    position: '',
    staffType: 'DOCTOR',
    specialization: ''
  }
}

// Submit form
const submitForm = async () => {
  try {
    isSubmitting.value = true
    const { $trpc } = useNuxtApp()
    
    const response = await $trpc.users.create.mutate({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      phone: form.value.phone,
      role: 'STAFF',
      department: form.value.department,
      position: form.value.position,
      staffType: form.value.staffType,
      specialization: form.value.specialization
    })
    
    if (response.success) {
      showAddModal.value = false
      resetForm()
      loadStaff() // Refresh the list
      // Show success message
      useToast().add({
        title: 'Success',
        description: 'Staff member created successfully',
        color: 'green'
      })
    }
  } catch (error) {
    console.error('Error creating staff:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to create staff member',
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Close modal
const closeModal = () => {
  showAddModal.value = false
  resetForm()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Staff Management</h1>
        <p class="mt-2 text-gray-600">Manage hospital medical staff and their credentials</p>
      </div>
      <Button @click="addStaffMember" class="bg-blue-600 hover:bg-blue-700">
        <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
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
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:stethoscope" class="w-6 h-6 text-green-600" />
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

    <!-- Loading State -->
    <Card v-if="isLoading">
      <CardContent class="p-6">
        <div class="flex items-center justify-center">
          <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mr-2" />
          Loading staff...
        </div>
      </CardContent>
    </Card>

    <!-- Staff Table -->
    <Card v-else>
      <CardHeader>
        <CardTitle>Medical Staff</CardTitle>
        <CardDescription>Doctors, nurses, and medical technicians</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left p-3 font-medium">Staff Member</th>
                <th class="text-left p-3 font-medium">Type</th>
                <th class="text-left p-3 font-medium">Department</th>
                <th class="text-left p-3 font-medium">Specialization</th>
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
                      <p class="font-medium">{{ member.firstName }} {{ member.lastName }}</p>
                      <p class="text-sm text-muted-foreground">{{ member.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="p-3">
                  <Badge :class="getRoleBadgeColor(member.staffCredentials?.staffType || 'STAFF')">
                    {{ member.staffCredentials?.staffType || 'STAFF' }}
                  </Badge>
                </td>
                <td class="p-3">{{ member.department || 'N/A' }}</td>
                <td class="p-3">{{ member.staffCredentials?.specialization || 'N/A' }}</td>
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
            <p class="text-sm">Add medical staff to get started</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Add Staff Modal -->
    <Dialog v-model:open="showAddModal">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Create a new staff account with credentials
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="firstName">First Name *</Label>
              <Input 
                id="firstName" 
                v-model="form.firstName" 
                required 
                placeholder="Enter first name"
              />
            </div>
            <div class="space-y-2">
              <Label for="lastName">Last Name *</Label>
              <Input 
                id="lastName" 
                v-model="form.lastName" 
                required 
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="email">Email *</Label>
              <Input 
                id="email" 
                v-model="form.email" 
                type="email" 
                required 
                placeholder="Enter email address"
              />
            </div>
            <div class="space-y-2">
              <Label for="phone">Phone</Label>
              <Input 
                id="phone" 
                v-model="form.phone" 
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="password">Password *</Label>
            <Input 
              id="password" 
              v-model="form.password" 
              type="password" 
              required 
              placeholder="Enter password"
            />
          </div>

          <!-- Professional Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="staffType">Staff Type *</Label>
              <Select v-model="form.staffType">
                <SelectTrigger>
                  <SelectValue placeholder="Select staff type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DOCTOR">Doctor</SelectItem>
                  <SelectItem value="NURSE">Nurse</SelectItem>
                  <SelectItem value="TECHNICIAN">Technician</SelectItem>
                  <SelectItem value="PHARMACIST">Pharmacist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label for="department">Department</Label>
              <Input 
                id="department" 
                v-model="form.department" 
                placeholder="e.g., Cardiology, Emergency"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="position">Position</Label>
              <Input 
                id="position" 
                v-model="form.position" 
                placeholder="Job position"
              />
            </div>
            <div class="space-y-2">
              <Label for="specialization">Specialization</Label>
              <Input 
                id="specialization" 
                v-model="form.specialization" 
                placeholder="Medical specialization"
              />
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button @click="closeModal" variant="outline" :disabled="isSubmitting">
            Cancel
          </Button>
          <Button @click="submitForm" :disabled="isSubmitting">
            <Icon v-if="isSubmitting" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
            Create Staff Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>