<script setup lang="ts">
import { useAuthStore } from '~/stores/app/useAuthStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const authStore = useAuthStore()

// Set page title and meta
definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'User Management - Admin Portal'
})

// State for user management
const showCreateDialog = ref(false)
const loading = ref(false)
const users = ref([])

// Form state for creating new users
const createForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  role: 'STAFF',
  staffType: 'new', // 'existing' or 'new'
  // Staff-specific fields
  selectedDoctorId: '', // Link to existing doctor profile
  position: '',
  department: '',
  specialization: '',
  licenseNumber: '',
  // Partner-specific fields
  institutionName: '',
  institutionType: 'CLINIC',
  contactPerson: ''
})

// User roles and their options
const userRoles = [
  { value: 'STAFF', label: 'Staff Member (includes Doctors)' },
  { value: 'PARTNER', label: 'Partner Institution' }
]

// Available doctors from doctor management
const availableDoctors = ref([])

// Load available doctors for staff role
const loadDoctors = async () => {
  try {
    const { $trpc } = useNuxtApp()
    const response = await $trpc.doctors.list.query()
    
    if (response.success && response.data) {
      availableDoctors.value = response.data.map(doctor => ({
        id: doctor.id,
        label: `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`,
        specialization: doctor.specialization || 'General Practice'
      }))
    }
  } catch (error) {
    console.error('Error loading doctors:', error)
  }
}

const institutionTypes = [
  { value: 'CLINIC', label: 'Clinic' },
  { value: 'HOSPITAL', label: 'Hospital' },
  { value: 'LABORATORY', label: 'Laboratory' },
  { value: 'PHARMACY', label: 'Pharmacy' },
  { value: 'DIAGNOSTIC_CENTER', label: 'Diagnostic Center' }
]

const departments = [
  'General Medicine',
  'Cardiology', 
  'Pediatrics',
  'Surgery',
  'Emergency',
  'Radiology',
  'Laboratory',
  'Pharmacy',
  'Administration'
]

// Real users data (loaded from API)
const users = ref([])

// Validation functions
const validateForm = () => {
  if (!createForm.value.firstName || !createForm.value.lastName || !createForm.value.email) {
    useToast('error', 'Validation Error', 'Please fill in all required fields')
    return false
  }
  
  if (createForm.value.password !== createForm.value.confirmPassword) {
    useToast('error', 'Validation Error', 'Passwords do not match')
    return false
  }
  
  if (createForm.value.password.length < 6) {
    useToast('error', 'Validation Error', 'Password must be at least 6 characters long')
    return false
  }
  
  return true
}

// Create new user
const createUser = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // Prepare data for new users router
    const userData = {
      firstName: createForm.value.firstName,
      lastName: createForm.value.lastName,
      email: createForm.value.email,
      password: createForm.value.password,
      phone: createForm.value.phone,
      role: createForm.value.role,
      staffType: createForm.value.staffType,
      selectedDoctorId: createForm.value.selectedDoctorId,
      position: createForm.value.position,
      department: createForm.value.department,
      specialization: createForm.value.specialization,
      licenseNumber: createForm.value.licenseNumber,
      institutionName: createForm.value.institutionName,
      institutionType: createForm.value.institutionType,
      contactPerson: createForm.value.contactPerson
    }
    
    // Call the new users creation API
    const { $trpc } = useNuxtApp()
    const response = await $trpc.users.create.mutate(userData)
    
    if (response.success) {
      useToast('success', 'User Created', 'User account created successfully')
      showCreateDialog.value = false
      resetForm()
      await loadUsers()
    } else {
      useToast('error', 'Creation Failed', response.message || 'Failed to create user')
    }
  } catch (error) {
    console.error('Error creating user:', error)
    useToast('error', 'Creation Failed', 'An error occurred while creating the user')
  } finally {
    loading.value = false
  }
}

// Load users
const loadUsers = async () => {
  try {
    const { $trpc } = useNuxtApp()
    const response = await $trpc.users.list.query()
    
    if (response.success && response.data) {
      users.value = response.data
    } else {
      useToast('error', 'Load Failed', 'Failed to load users')
    }
  } catch (error) {
    console.error('Error loading users:', error)
    useToast('error', 'Load Failed', 'Failed to load users')
  }
}

// Reset form
const resetForm = () => {
  createForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'STAFF',
    staffType: 'new',
    selectedDoctorId: '',
    position: '',
    department: '',
    specialization: '',
    licenseNumber: '',
    institutionName: '',
    institutionType: 'CLINIC',
    contactPerson: ''
  }
}

// Toggle user status
const toggleUserStatus = async (userId: string, currentStatus: string) => {
  const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE'
  
  try {
    // API call to update user status
    // For now, just update locally
    const userIndex = users.value.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      users.value[userIndex].status = newStatus
      useToast('success', 'Status Updated', `User status changed to ${newStatus}`)
    }
  } catch (error) {
    console.error('Error updating user status:', error)
    useToast('error', 'Update Failed', 'Failed to update user status')
  }
}

// Initialize data
onMounted(() => {
  loadUsers()
  loadDoctors()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
        <p class="text-gray-600">Create and manage staff and partner accounts</p>
      </div>
      
      <Dialog v-model:open="showCreateDialog">
        <DialogTrigger as-child>
          <Button>
            <Icon name="lucide:user-plus" class="w-4 h-4 mr-2" />
            Create User
          </Button>
        </DialogTrigger>
        <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Create a new staff or partner account with appropriate credentials
            </DialogDescription>
          </DialogHeader>
          
          <div class="space-y-4">
            <!-- Basic Information -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="firstName">First Name *</Label>
                <Input v-model="createForm.firstName" id="firstName" placeholder="Enter first name" />
              </div>
              <div class="space-y-2">
                <Label for="lastName">Last Name *</Label>
                <Input v-model="createForm.lastName" id="lastName" placeholder="Enter last name" />
              </div>
            </div>
            
            <div class="space-y-2">
              <Label for="email">Email Address *</Label>
              <Input v-model="createForm.email" id="email" type="email" placeholder="Enter email address" />
            </div>
            
            <div class="space-y-2">
              <Label for="phone">Phone Number</Label>
              <Input v-model="createForm.phone" id="phone" placeholder="Enter phone number" />
            </div>
            
            <!-- Password -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="password">Password *</Label>
                <Input v-model="createForm.password" id="password" type="password" placeholder="Enter password" />
              </div>
              <div class="space-y-2">
                <Label for="confirmPassword">Confirm Password *</Label>
                <Input v-model="createForm.confirmPassword" id="confirmPassword" type="password" placeholder="Confirm password" />
              </div>
            </div>
            
            <!-- Role Selection -->
            <div class="space-y-2">
              <Label for="role">User Role *</Label>
              <Select v-model="createForm.role">
                <SelectTrigger>
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="role in userRoles" :key="role.value" :value="role.value">
                    {{ role.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <!-- Staff-specific fields -->
            <div v-if="createForm.role === 'STAFF'" class="space-y-4 p-4 bg-blue-50 rounded-lg">
              <h3 class="font-medium text-blue-900">Staff Information</h3>
              
              <!-- Choose existing doctor or create new staff -->
              <div class="space-y-2">
                <Label>Staff Type</Label>
                <div class="space-y-3">
                  <div class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="existing-doctor" 
                      name="staffType" 
                      value="existing"
                      v-model="createForm.staffType"
                    />
                    <Label for="existing-doctor">Link to Existing Doctor</Label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="new-staff" 
                      name="staffType" 
                      value="new"
                      v-model="createForm.staffType"
                    />
                    <Label for="new-staff">Create New Staff Member</Label>
                  </div>
                </div>
              </div>
              
              <!-- Existing doctor selection -->
              <div v-if="createForm.staffType === 'existing'" class="space-y-2">
                <Label for="selectedDoctor">Select Doctor</Label>
                <Select v-model="createForm.selectedDoctorId">
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="doctor in availableDoctors" :key="doctor.id" :value="doctor.id">
                      <div>
                        <div class="font-medium">{{ doctor.label }}</div>
                        <div class="text-sm text-muted-foreground">{{ doctor.specialization }}</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p class="text-sm text-muted-foreground">
                  This will create a user account for an existing doctor from Doctor Management
                </p>
              </div>
              
              <!-- New staff fields -->
              <div v-if="createForm.staffType === 'new'" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="position">Position</Label>
                    <Input v-model="createForm.position" id="position" placeholder="e.g., Nurse, Technician, Admin" />
                  </div>
                  <div class="space-y-2">
                    <Label for="department">Department</Label>
                    <Select v-model="createForm.department">
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="dept in departments" :key="dept" :value="dept">
                          {{ dept }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="specialization">Specialization</Label>
                    <Input v-model="createForm.specialization" id="specialization" placeholder="Area of expertise" />
                  </div>
                  <div class="space-y-2">
                    <Label for="licenseNumber">License Number</Label>
                    <Input v-model="createForm.licenseNumber" id="licenseNumber" placeholder="Professional license number" />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Partner-specific fields -->
            <div v-if="createForm.role === 'PARTNER'" class="space-y-4 p-4 bg-green-50 rounded-lg">
              <h3 class="font-medium text-green-900">Partner Institution Information</h3>
              
              <div class="space-y-2">
                <Label for="institutionName">Institution Name</Label>
                <Input v-model="createForm.institutionName" id="institutionName" placeholder="Name of the institution" />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="institutionType">Institution Type</Label>
                  <Select v-model="createForm.institutionType">
                    <SelectTrigger>
                      <SelectValue placeholder="Select institution type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="type in institutionTypes" :key="type.value" :value="type.value">
                        {{ type.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="space-y-2">
                  <Label for="contactPerson">Contact Person</Label>
                  <Input v-model="createForm.contactPerson" id="contactPerson" placeholder="Primary contact person" />
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex justify-end space-x-2 pt-4">
              <Button variant="outline" @click="showCreateDialog = false">Cancel</Button>
              <Button @click="createUser" :disabled="loading">
                <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
                Create User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Users</p>
              <p class="text-2xl font-bold">{{ users.length }}</p>
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
              <p class="text-sm font-medium text-muted-foreground">Staff Members</p>
              <p class="text-2xl font-bold">{{ users.filter(u => u.role === 'STAFF').length }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:user-check" class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Partners</p>
              <p class="text-2xl font-bold">{{ users.filter(u => u.role === 'PARTNER').length }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:building" class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Users Table -->
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>Manage user accounts and their permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left p-3 font-medium">User</th>
                <th class="text-left p-3 font-medium">Role</th>
                <th class="text-left p-3 font-medium">Department/Institution</th>
                <th class="text-left p-3 font-medium">Status</th>
                <th class="text-left p-3 font-medium">Created</th>
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
                  <span :class="`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'STAFF' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'PARTNER' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`">
                    {{ user.role }}
                  </span>
                </td>
                <td class="p-3">
                  <div v-if="user.role === 'STAFF'">
                    <p class="font-medium">{{ user.staffProfile?.department || 'N/A' }}</p>
                    <p class="text-sm text-muted-foreground">{{ user.staffProfile?.position || 'Staff Member' }}</p>
                    <p v-if="user.staffProfile?.doctorProfile" class="text-xs text-blue-600 font-medium">Doctor Profile Available</p>
                  </div>
                  <div v-else-if="user.role === 'PARTNER'">
                    <p class="font-medium">{{ user.partnerProfile?.institutionName || 'N/A' }}</p>
                    <p class="text-sm text-muted-foreground">{{ user.partnerProfile?.institutionType || 'N/A' }}</p>
                  </div>
                  <div v-else-if="user.role === 'PATIENT'">
                    <p class="font-medium">Patient</p>
                    <p class="text-sm text-muted-foreground">{{ user.patientProfile?.patientNumber || 'N/A' }}</p>
                  </div>
                </td>
                <td class="p-3">
                  <span :class="`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`">
                    {{ user.status }}
                  </span>
                </td>
                <td class="p-3 text-sm text-muted-foreground">
                  {{ new Date(user.createdAt).toLocaleDateString() }}
                </td>
                <td class="p-3">
                  <div class="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      @click="toggleUserStatus(user.id, user.status)"
                    >
                      {{ user.status === 'ACTIVE' ? 'Disable' : 'Enable' }}
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>