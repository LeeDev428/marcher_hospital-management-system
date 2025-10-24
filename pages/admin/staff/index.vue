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
  title: 'Staff Management - Admin Portal'
})

// State
const staff = ref<any[]>([])
const isLoading = ref(true)
const showAddModal = ref(false)
const showViewDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const isSubmitting = ref(false)
const selectedStaff = ref<any>(null)

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

// Edit form state
const editForm = ref({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  staffType: 'DOCTOR',
  specialization: '',
  licenseNumber: ''
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
    case 'STAFF': return 'bg-purple-100 text-purple-800'
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

// View staff details
const viewStaff = (staffMember: any) => {
  selectedStaff.value = staffMember
  showViewDialog.value = true
}

// Edit staff
const editStaff = (staffMember: any) => {
  selectedStaff.value = staffMember
  editForm.value = {
    id: staffMember.id,
    firstName: staffMember.firstName,
    lastName: staffMember.lastName,
    email: staffMember.email,
    phone: staffMember.phone || '',
    department: staffMember.department || '',
    position: staffMember.position || '',
    staffType: staffMember.staffCredentials?.staffType || 'DOCTOR',
    specialization: staffMember.staffCredentials?.specialization || '',
    licenseNumber: staffMember.staffCredentials?.licenseNumber || ''
  }
  showEditDialog.value = true
}

const handleEditStaff = async () => {
  try {
    isSubmitting.value = true
    const { $trpc } = useNuxtApp()
    
    const response = await $trpc.users.update.mutate({
      id: editForm.value.id,
      firstName: editForm.value.firstName,
      lastName: editForm.value.lastName,
      email: editForm.value.email,
      phone: editForm.value.phone,
      department: editForm.value.department,
      position: editForm.value.position,
      staffType: editForm.value.staffType as any,
      specialization: editForm.value.specialization,
      licenseNumber: editForm.value.licenseNumber,
    })
    
    if (response.success) {
      useToast('success', 'Staff Updated', 'Staff member updated successfully')
      showEditDialog.value = false
      await loadStaff()
    } else {
      useToast('error', 'Error', response.message || 'Failed to update staff member')
    }
  } catch (error) {
    console.error('Error updating staff:', error)
    useToast('error', 'Error', 'Failed to update staff member')
  } finally {
    isSubmitting.value = false
  }
}

// Delete staff
const confirmDelete = (staffMember: any) => {
  selectedStaff.value = staffMember
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  try {
    isSubmitting.value = true
    const { $trpc } = useNuxtApp()
    
    const response = await $trpc.users.delete.mutate({ id: selectedStaff.value.id })
    
    if (response.success) {
      useToast('success', 'Staff Deleted', 'Staff member deleted successfully')
      showDeleteDialog.value = false
      await loadStaff()
    } else {
      useToast('error', 'Error', response.message || 'Failed to delete staff member')
    }
  } catch (error) {
    console.error('Error deleting staff:', error)
    useToast('error', 'Error', 'Failed to delete staff member')
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
      role: 'STAFF' as any,
      department: form.value.department,
      position: form.value.position,
      staffType: form.value.staffType as any,
      specialization: form.value.specialization
    })
    
    if (response.success) {
      showAddModal.value = false
      resetForm()
      loadStaff() // Refresh the list
      // Show success message
      useToast('success', 'Success', 'Staff member created successfully')
    }
  } catch (error) {
    console.error('Error creating staff:', error)
    useToast('error', 'Error', 'Failed to create staff member')
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
        <CardDescription>Doctors, nurses, and medical staff</CardDescription>
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
                    <Button variant="outline" size="sm" @click="viewStaff(member)">
                      <Icon name="lucide:eye" class="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" @click="editStaff(member)">
                      <Icon name="lucide:pencil" class="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" @click="confirmDelete(member)">
                      <Icon name="lucide:trash-2" class="w-4 h-4 mr-1" />
                      Delete
                    </Button>
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
                  <SelectItem value="ADMISSIONS_STAFF">Admissions Staff</SelectItem>
                  <SelectItem value="BILLING_STAFF">Billing Staff</SelectItem>
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

    <!-- View Staff Dialog -->
    <Dialog v-model:open="showViewDialog">
      <DialogContent class="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Staff Member Details</DialogTitle>
          <DialogDescription>Complete information about this staff member</DialogDescription>
        </DialogHeader>

        <div v-if="selectedStaff" class="space-y-6 mt-4">
          <!-- Basic Information -->
          <div class="space-y-2">
            <h3 class="font-semibold text-lg border-b pb-2">Basic Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-muted-foreground">Full Name</p>
                <p class="font-medium">{{ selectedStaff.firstName }} {{ selectedStaff.lastName }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Email</p>
                <p class="font-medium">{{ selectedStaff.email }}</p>
              </div>
              <div v-if="selectedStaff.phone">
                <p class="text-sm text-muted-foreground">Phone</p>
                <p class="font-medium">{{ selectedStaff.phone }}</p>
              </div>
              <div v-if="selectedStaff.staffNumber">
                <p class="text-sm text-muted-foreground">Staff Number</p>
                <p class="font-medium">{{ selectedStaff.staffNumber }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Status</p>
                <Badge :class="getStatusBadgeColor(selectedStaff.status)">{{ selectedStaff.status }}</Badge>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Created At</p>
                <p class="font-medium">{{ new Date(selectedStaff.createdAt).toLocaleDateString() }}</p>
              </div>
            </div>
          </div>

          <!-- Staff Information -->
          <div class="space-y-2">
            <h3 class="font-semibold text-lg border-b pb-2">Professional Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div v-if="selectedStaff.staffCredentials">
                <p class="text-sm text-muted-foreground">Staff Type</p>
                <Badge :class="getRoleBadgeColor(selectedStaff.staffCredentials.staffType)">
                  {{ selectedStaff.staffCredentials.staffType }}
                </Badge>
              </div>
              <div v-if="selectedStaff.department">
                <p class="text-sm text-muted-foreground">Department</p>
                <p class="font-medium">{{ selectedStaff.department }}</p>
              </div>
              <div v-if="selectedStaff.position">
                <p class="text-sm text-muted-foreground">Position</p>
                <p class="font-medium">{{ selectedStaff.position }}</p>
              </div>
              <div v-if="selectedStaff.staffCredentials?.specialization">
                <p class="text-sm text-muted-foreground">Specialization</p>
                <p class="font-medium">{{ selectedStaff.staffCredentials.specialization }}</p>
              </div>
              <div v-if="selectedStaff.staffCredentials?.licenseNumber">
                <p class="text-sm text-muted-foreground">License Number</p>
                <p class="font-medium">{{ selectedStaff.staffCredentials.licenseNumber }}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showViewDialog = false">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Edit Staff Dialog -->
    <Dialog v-model:open="showEditDialog">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
          <DialogDescription>Update staff member information</DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-4">
          <!-- Basic Information -->
          <div class="space-y-2">
            <h3 class="font-semibold text-sm">Basic Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label for="editFirstName">First Name *</Label>
                <Input id="editFirstName" v-model="editForm.firstName" required />
              </div>
              <div>
                <Label for="editLastName">Last Name *</Label>
                <Input id="editLastName" v-model="editForm.lastName" required />
              </div>
              <div class="col-span-2">
                <Label for="editEmail">Email *</Label>
                <Input id="editEmail" v-model="editForm.email" type="email" required />
              </div>
              <div class="col-span-2">
                <Label for="editPhone">Phone</Label>
                <Input id="editPhone" v-model="editForm.phone" placeholder="+63 123 456 7890" />
              </div>
            </div>
          </div>

          <!-- Professional Information -->
          <div class="space-y-2">
            <h3 class="font-semibold text-sm border-t pt-4">Professional Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label for="editStaffType">Staff Type *</Label>
                <Select v-model="editForm.staffType">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DOCTOR">Doctor</SelectItem>
                    <SelectItem value="NURSE">Nurse</SelectItem>
                    <SelectItem value="ADMISSIONS_STAFF">Admissions Staff</SelectItem>
                    <SelectItem value="BILLING_STAFF">Billing Staff</SelectItem>
                    <SelectItem value="PHARMACIST">Pharmacist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label for="editDepartment">Department</Label>
                <Input id="editDepartment" v-model="editForm.department" placeholder="e.g., Cardiology" />
              </div>
              <div>
                <Label for="editPosition">Position</Label>
                <Input id="editPosition" v-model="editForm.position" placeholder="Job position" />
              </div>
              <div>
                <Label for="editSpecialization">Specialization</Label>
                <Input id="editSpecialization" v-model="editForm.specialization" placeholder="Medical specialization" />
              </div>
              <div class="col-span-2">
                <Label for="editLicenseNumber">License Number</Label>
                <Input id="editLicenseNumber" v-model="editForm.licenseNumber" placeholder="Professional license number" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showEditDialog = false" :disabled="isSubmitting">
            Cancel
          </Button>
          <Button @click="handleEditStaff" :disabled="isSubmitting">
            <Icon v-if="isSubmitting" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
            {{ isSubmitting ? 'Updating...' : 'Update Staff' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="showDeleteDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Staff Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this staff member? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div v-if="selectedStaff" class="py-4">
          <p class="text-sm">
            <strong>Name:</strong> {{ selectedStaff.firstName }} {{ selectedStaff.lastName }}
          </p>
          <p class="text-sm">
            <strong>Email:</strong> {{ selectedStaff.email }}
          </p>
          <p class="text-sm">
            <strong>Type:</strong> {{ selectedStaff.staffCredentials?.staffType || 'STAFF' }}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showDeleteDialog = false" :disabled="isSubmitting">
            Cancel
          </Button>
          <Button variant="destructive" @click="handleDelete" :disabled="isSubmitting">
            <Icon v-if="isSubmitting" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
            {{ isSubmitting ? 'Deleting...' : 'Delete Staff' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>