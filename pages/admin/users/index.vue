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
})

useHead({
  title: 'User Management - Admin Portal'
})

// State
const users = ref<any[]>([])
const isLoading = ref(true)
const showCreateDialog = ref(false)
const showViewDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const isSubmitting = ref(false)
const selectedUser = ref<any>(null)

// Form state for Create
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  role: 'PATIENT',
  
  // Partner fields
  institutionName: '',
  institutionType: 'CLINIC',
  contactPerson: '',
  
  // Patient fields
  dateOfBirth: '',
  gender: 'MALE',
  address: '',
  emergencyContact: '',
  bloodType: 'O_POSITIVE',
})

// Edit form state
const editForm = ref({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: 'MALE',
  address: '',
})

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
    isLoading.value = true
    const { $trpc } = useNuxtApp()
    const response = await $trpc.users.list.query()
    
    if (response.success && response.data) {
      users.value = response.data.filter(user => user.role !== 'STAFF')
    }
  } catch (error) {
    console.error('Error loading users:', error)
  } finally {
    isLoading.value = false
  }
}

// Create user
const handleCreateUser = async () => {
  try {
    isSubmitting.value = true
    const { $trpc } = useNuxtApp()
    
    const response = await $trpc.users.create.mutate({
      ...form.value,
      role: form.value.role as any,
      institutionType: form.value.institutionType as any,
      gender: form.value.gender as any,
      bloodType: form.value.bloodType as any,
    })
    
    if (response.success) {
      useToast('success', 'User Created', 'User account created successfully')
      showCreateDialog.value = false
      resetForm()
      await loadUsers()
    } else {
      useToast('error', 'Error', response.message || 'Failed to create user')
    }
  } catch (error) {
    console.error('Error creating user:', error)
    useToast('error', 'Error', 'Failed to create user')
  } finally {
    isSubmitting.value = false
  }
}

// View user details
const viewUser = (user: any) => {
  selectedUser.value = user
  showViewDialog.value = true
}

// Edit user
const editUser = (user: any) => {
  editForm.value = {
    id: user.id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    dateOfBirth: user.dateOfBirth || '',
    gender: user.gender || 'MALE',
    address: user.address || '',
  }
  showEditDialog.value = true
}

const handleEditUser = async () => {
  try {
    isSubmitting.value = true
    const { $trpc } = useNuxtApp()
    
    const response = await $trpc.users.update.mutate({
      id: editForm.value.id,
      firstName: editForm.value.firstName,
      lastName: editForm.value.lastName,
      email: editForm.value.email,
      phone: editForm.value.phone,
      dateOfBirth: editForm.value.dateOfBirth,
      gender: editForm.value.gender as 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY',
      address: editForm.value.address,
    })
    
    if (response.success) {
      useToast('success', 'Success', response.message || 'User updated successfully')
      showEditDialog.value = false
      await loadUsers()
    } else {
      useToast('error', 'Error', response.message || 'Failed to update user')
    }
  } catch (error: any) {
    useToast('error', 'Error', error.message || 'Failed to update user')
  } finally {
    isSubmitting.value = false
  }
}

// Delete user
const confirmDelete = (user: any) => {
  selectedUser.value = user
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  try {
    isSubmitting.value = true
    const { $trpc } = useNuxtApp()
    
    const response = await $trpc.users.delete.mutate({ id: selectedUser.value.id })
    
    if (response.success) {
      useToast('success', 'User Deleted', 'User account deleted successfully')
      showDeleteDialog.value = false
      await loadUsers()
    } else {
      useToast('error', 'Error', response.message || 'Failed to delete user')
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    useToast('error', 'Error', 'Failed to delete user')
  } finally {
    isSubmitting.value = false
  }
}

// Reset form
const resetForm = () => {
  form.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'PATIENT',
    institutionName: '',
    institutionType: 'CLINIC',
    contactPerson: '',
    dateOfBirth: '',
    gender: 'MALE',
    address: '',
    emergencyContact: '',
    bloodType: 'O_POSITIVE',
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
      
      <Button @click="showCreateDialog = true">
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
                    <Button variant="outline" size="sm" @click="viewUser(user)">
                      <Icon name="lucide:eye" class="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" @click="editUser(user)">
                      <Icon name="lucide:pencil" class="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" @click="confirmDelete(user)">
                      <Icon name="lucide:trash-2" class="w-4 h-4 mr-1" />
                      Delete
                    </Button>
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

    <!-- Create User Dialog -->
    <Dialog v-model:open="showCreateDialog">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>Add a new user account to the system</DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-4">
          <!-- Basic Information -->
          <div class="space-y-2">
            <h3 class="font-semibold text-sm">Basic Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label for="firstName">First Name *</Label>
                <Input id="firstName" v-model="form.firstName" placeholder="John" required />
              </div>
              <div>
                <Label for="lastName">Last Name *</Label>
                <Input id="lastName" v-model="form.lastName" placeholder="Doe" required />
              </div>
              <div class="col-span-2">
                <Label for="email">Email *</Label>
                <Input id="email" v-model="form.email" type="email" placeholder="user@example.com" required />
              </div>
              <div class="col-span-2">
                <Label for="password">Password *</Label>
                <Input id="password" v-model="form.password" type="password" placeholder="Minimum 6 characters" required />
              </div>
              <div class="col-span-2">
                <Label for="phone">Phone</Label>
                <Input id="phone" v-model="form.phone" placeholder="+63 123 456 7890" />
              </div>
              <div class="col-span-2">
                <Label for="role">Role *</Label>
                <Select v-model="form.role">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrator</SelectItem>
                    <SelectItem value="PATIENT">Patient</SelectItem>
                    <SelectItem value="PARTNER">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <!-- Partner-specific fields -->
          <div v-if="form.role === 'PARTNER'" class="space-y-2">
            <h3 class="font-semibold text-sm border-t pt-4">Partner Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <Label for="institutionName">Institution Name</Label>
                <Input id="institutionName" v-model="form.institutionName" placeholder="Medical Center" />
              </div>
              <div>
                <Label for="institutionType">Institution Type</Label>
                <Select v-model="form.institutionType">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOSPITAL">Hospital</SelectItem>
                    <SelectItem value="CLINIC">Clinic</SelectItem>
                    <SelectItem value="LABORATORY">Laboratory</SelectItem>
                    <SelectItem value="PHARMACY">Pharmacy</SelectItem>
                    <SelectItem value="DIAGNOSTIC_CENTER">Diagnostic Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label for="contactPerson">Contact Person</Label>
                <Input id="contactPerson" v-model="form.contactPerson" placeholder="Contact name" />
              </div>
            </div>
          </div>

          <!-- Patient-specific fields -->
          <div v-if="form.role === 'PATIENT'" class="space-y-2">
            <h3 class="font-semibold text-sm border-t pt-4">Patient Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label for="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" v-model="form.dateOfBirth" type="date" />
              </div>
              <div>
                <Label for="gender">Gender</Label>
                <Select v-model="form.gender">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                    <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="col-span-2">
                <Label for="address">Address</Label>
                <Input id="address" v-model="form.address" placeholder="Complete address" />
              </div>
              <div>
                <Label for="emergencyContact">Emergency Contact</Label>
                <Input id="emergencyContact" v-model="form.emergencyContact" placeholder="+63 123 456 7890" />
              </div>
              <div>
                <Label for="bloodType">Blood Type</Label>
                <Select v-model="form.bloodType">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A_POSITIVE">A+</SelectItem>
                    <SelectItem value="A_NEGATIVE">A-</SelectItem>
                    <SelectItem value="B_POSITIVE">B+</SelectItem>
                    <SelectItem value="B_NEGATIVE">B-</SelectItem>
                    <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                    <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                    <SelectItem value="O_POSITIVE">O+</SelectItem>
                    <SelectItem value="O_NEGATIVE">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showCreateDialog = false" :disabled="isSubmitting">
            Cancel
          </Button>
          <Button @click="handleCreateUser" :disabled="isSubmitting">
            <Icon v-if="isSubmitting" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
            {{ isSubmitting ? 'Creating...' : 'Create User' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- View User Dialog -->
    <Dialog v-model:open="showViewDialog">
      <DialogContent class="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Complete information about this user</DialogDescription>
        </DialogHeader>

        <div v-if="selectedUser" class="space-y-6 mt-4">
          <!-- Basic Information -->
          <div class="space-y-2">
            <h3 class="font-semibold text-lg border-b pb-2">Basic Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-muted-foreground">Full Name</p>
                <p class="font-medium">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Email</p>
                <p class="font-medium">{{ selectedUser.email }}</p>
              </div>
              <div v-if="selectedUser.phone">
                <p class="text-sm text-muted-foreground">Phone</p>
                <p class="font-medium">{{ selectedUser.phone }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Role</p>
                <Badge :class="getRoleBadgeColor(selectedUser.role)">{{ selectedUser.role }}</Badge>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Status</p>
                <Badge :class="getStatusBadgeColor(selectedUser.status)">{{ selectedUser.status }}</Badge>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Created At</p>
                <p class="font-medium">{{ new Date(selectedUser.createdAt).toLocaleDateString() }}</p>
              </div>
            </div>
          </div>

          <!-- Partner Information -->
          <div v-if="selectedUser.role === 'PARTNER' && selectedUser.partnerProfile" class="space-y-2">
            <h3 class="font-semibold text-lg border-b pb-2">Partner Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-muted-foreground">Institution Name</p>
                <p class="font-medium">{{ selectedUser.partnerProfile.institutionName }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Institution Type</p>
                <p class="font-medium">{{ selectedUser.partnerProfile.institutionType }}</p>
              </div>
              <div v-if="selectedUser.partnerProfile.contactPerson">
                <p class="text-sm text-muted-foreground">Contact Person</p>
                <p class="font-medium">{{ selectedUser.partnerProfile.contactPerson }}</p>
              </div>
            </div>
          </div>

          <!-- Patient Information -->
          <div v-if="selectedUser.role === 'PATIENT' && selectedUser.patientProfile" class="space-y-2">
            <h3 class="font-semibold text-lg border-b pb-2">Patient Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-muted-foreground">Patient Number</p>
                <p class="font-medium">{{ selectedUser.patientProfile.patientNumber }}</p>
              </div>
              <div v-if="selectedUser.dateOfBirth">
                <p class="text-sm text-muted-foreground">Date of Birth</p>
                <p class="font-medium">{{ new Date(selectedUser.dateOfBirth).toLocaleDateString() }}</p>
              </div>
              <div v-if="selectedUser.gender">
                <p class="text-sm text-muted-foreground">Gender</p>
                <p class="font-medium">{{ selectedUser.gender }}</p>
              </div>
              <div v-if="selectedUser.patientProfile.bloodType">
                <p class="text-sm text-muted-foreground">Blood Type</p>
                <p class="font-medium">{{ selectedUser.patientProfile.bloodType }}</p>
              </div>
              <div v-if="selectedUser.address" class="col-span-2">
                <p class="text-sm text-muted-foreground">Address</p>
                <p class="font-medium">{{ selectedUser.address }}</p>
              </div>
              <div v-if="selectedUser.patientProfile.emergencyContact">
                <p class="text-sm text-muted-foreground">Emergency Contact</p>
                <p class="font-medium">{{ selectedUser.patientProfile.emergencyContact }}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showViewDialog = false">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Edit User Dialog -->
    <Dialog v-model:open="showEditDialog">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information</DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleEditUser" class="space-y-4">
          <!-- Basic Information -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="edit-firstName">First Name</Label>
              <Input
                id="edit-firstName"
                v-model="editForm.firstName"
                placeholder="Enter first name"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="edit-lastName">Last Name</Label>
              <Input
                id="edit-lastName"
                v-model="editForm.lastName"
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="edit-email">Email</Label>
            <Input
              id="edit-email"
              v-model="editForm.email"
              type="email"
              placeholder="Enter email"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="edit-phone">Phone</Label>
            <Input
              id="edit-phone"
              v-model="editForm.phone"
              placeholder="Enter phone number"
            />
          </div>

          <!-- Personal Information -->
          <div class="space-y-2">
            <Label for="edit-dateOfBirth">Date of Birth</Label>
            <Input
              id="edit-dateOfBirth"
              v-model="editForm.dateOfBirth"
              type="date"
            />
          </div>

          <div class="space-y-2">
            <Label for="edit-gender">Gender</Label>
            <select
              id="edit-gender"
              v-model="editForm.gender"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div class="space-y-2">
            <Label for="edit-address">Address</Label>
            <Input
              id="edit-address"
              v-model="editForm.address"
              placeholder="Enter address"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" @click="showEditDialog = false" :disabled="isSubmitting">
              Cancel
            </Button>
            <Button type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Updating...' : 'Update User' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="showDeleteDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div v-if="selectedUser" class="py-4">
          <p class="text-sm">
            <strong>Name:</strong> {{ selectedUser.firstName }} {{ selectedUser.lastName }}
          </p>
          <p class="text-sm">
            <strong>Email:</strong> {{ selectedUser.email }}
          </p>
          <p class="text-sm">
            <strong>Role:</strong> {{ selectedUser.role }}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showDeleteDialog = false" :disabled="isSubmitting">
            Cancel
          </Button>
          <Button variant="destructive" @click="handleDelete" :disabled="isSubmitting">
            <Icon v-if="isSubmitting" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
            {{ isSubmitting ? 'Deleting...' : 'Delete User' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>