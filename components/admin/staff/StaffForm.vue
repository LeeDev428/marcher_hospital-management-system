<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  open: boolean
  staffMember?: any // For editing existing staff
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  staffAdded: []
  staffUpdated: []
}>()

// TRPC Client
const { $trpc } = useNuxtApp()

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
  specialization: '',
  subSpecialization: '',
  licenseNumber: '',
  licenseExpiryDate: '',
  education: '',
  yearsOfExperience: undefined as number | undefined,
  consultationFee: undefined as number | undefined,
  hospitalAffiliation: ''
})

const isLoading = ref(false)
const error = ref<string | null>(null)

// Staff types
const staffTypes = [
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'NURSE', label: 'Nurse' },
  { value: 'TECHNICIAN', label: 'Technician' },
  { value: 'PHARMACIST', label: 'Pharmacist' },
  { value: 'RADIOLOGIST', label: 'Radiologist' },
  { value: 'THERAPIST', label: 'Therapist' },
  { value: 'ADMINISTRATOR', label: 'Administrator' },
  { value: 'OTHER', label: 'Other' }
]

// Departments
const departments = [
  'Cardiology', 'Emergency', 'Pediatrics', 'Surgery', 'Radiology',
  'Oncology', 'Neurology', 'Orthopedics', 'Dermatology', 'Psychiatry',
  'Pharmacy', 'Laboratory', 'Administration'
]

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
    specialization: '',
    subSpecialization: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    education: '',
    yearsOfExperience: undefined,
    consultationFee: undefined,
    hospitalAffiliation: ''
  }
  error.value = null
}

// Watch for dialog open/close
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    if (props.staffMember) {
      // Populate form for editing
      const member = props.staffMember
      form.value = {
        firstName: member.firstName || '',
        lastName: member.lastName || '',
        email: member.email || '',
        password: '', // Don't populate password for editing
        phone: member.phone || '',
        department: member.department || '',
        position: member.position || '',
        staffType: member.staffCredentials?.staffType || 'DOCTOR',
        specialization: member.staffCredentials?.specialization || '',
        subSpecialization: member.staffCredentials?.subSpecialization || '',
        licenseNumber: member.staffCredentials?.licenseNumber || '',
        licenseExpiryDate: member.staffCredentials?.licenseExpiryDate || '',
        education: member.staffCredentials?.education || '',
        yearsOfExperience: member.staffCredentials?.yearsOfExperience,
        consultationFee: member.staffCredentials?.consultationFee,
        hospitalAffiliation: member.staffCredentials?.hospitalAffiliation || ''
      }
    } else {
      resetForm()
    }
  }
})

// Submit form
const submitForm = async () => {
  try {
    isLoading.value = true
    error.value = null

    // Validate required fields
    if (!form.value.firstName || !form.value.lastName || !form.value.email) {
      error.value = 'Please fill in all required fields'
      return
    }

    if (!props.staffMember && !form.value.password) {
      error.value = 'Password is required for new staff members'
      return
    }

    const response = await $trpc.staff.create.mutate({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      phone: form.value.phone,
      department: form.value.department,
      position: form.value.position,
      staffType: form.value.staffType,
      specialization: form.value.specialization,
      subSpecialization: form.value.subSpecialization,
      licenseNumber: form.value.licenseNumber,
      licenseExpiryDate: form.value.licenseExpiryDate,
      education: form.value.education,
      yearsOfExperience: form.value.yearsOfExperience,
      consultationFee: form.value.consultationFee,
      hospitalAffiliation: form.value.hospitalAffiliation
    })

    if (response.success) {
      emit('staffAdded')
      useToast().add({
        title: 'Success',
        description: 'Staff member created successfully',
        color: 'green'
      })
    } else {
      error.value = response.message || 'Failed to create staff member'
    }
  } catch (err) {
    console.error('Error creating staff:', err)
    error.value = 'Failed to create staff member'
  } finally {
    isLoading.value = false
  }
}

// Close dialog
const closeDialog = () => {
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="closeDialog">
    <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{{ staffMember ? 'Edit Staff Member' : 'Add New Staff Member' }}</DialogTitle>
        <DialogDescription>
          Create a new staff account with professional credentials
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center">
            <Icon name="lucide:alert-circle" class="w-5 h-5 text-red-500 mr-2" />
            <p class="text-red-700">{{ error }}</p>
          </div>
        </div>

        <!-- Basic Information -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Basic Information</CardTitle>
            <CardDescription>Personal details and contact information</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
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

            <div v-if="!staffMember" class="space-y-2">
              <Label for="password">Password *</Label>
              <Input 
                id="password" 
                v-model="form.password" 
                type="password" 
                required 
                placeholder="Enter password"
              />
            </div>
          </CardContent>
        </Card>

        <!-- Professional Information -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Professional Information</CardTitle>
            <CardDescription>Role, department, and position details</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="staffType">Staff Type *</Label>
                <Select v-model="form.staffType">
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="type in staffTypes" :key="type.value" :value="type.value">
                      {{ type.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label for="department">Department</Label>
                <Select v-model="form.department">
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

            <div class="space-y-2">
              <Label for="position">Position</Label>
              <Input 
                id="position" 
                v-model="form.position" 
                placeholder="Enter job position"
              />
            </div>
          </CardContent>
        </Card>

        <!-- Medical Credentials -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Medical Credentials</CardTitle>
            <CardDescription>Professional qualifications and certifications</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="specialization">Specialization</Label>
                <Input 
                  id="specialization" 
                  v-model="form.specialization" 
                  placeholder="Primary specialization"
                />
              </div>
              <div class="space-y-2">
                <Label for="subSpecialization">Sub-specialization</Label>
                <Input 
                  id="subSpecialization" 
                  v-model="form.subSpecialization" 
                  placeholder="Sub-specialization"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="licenseNumber">License Number</Label>
                <Input 
                  id="licenseNumber" 
                  v-model="form.licenseNumber" 
                  placeholder="Professional license number"
                />
              </div>
              <div class="space-y-2">
                <Label for="licenseExpiryDate">License Expiry Date</Label>
                <Input 
                  id="licenseExpiryDate" 
                  v-model="form.licenseExpiryDate" 
                  type="date"
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="education">Education</Label>
              <Input 
                id="education" 
                v-model="form.education" 
                placeholder="Educational background"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="yearsOfExperience">Years of Experience</Label>
                <Input 
                  id="yearsOfExperience" 
                  v-model.number="form.yearsOfExperience" 
                  type="number"
                  placeholder="Years of experience"
                />
              </div>
              <div v-if="form.staffType === 'DOCTOR'" class="space-y-2">
                <Label for="consultationFee">Consultation Fee</Label>
                <Input 
                  id="consultationFee" 
                  v-model.number="form.consultationFee" 
                  type="number"
                  placeholder="Consultation fee"
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="hospitalAffiliation">Hospital Affiliation</Label>
              <Input 
                id="hospitalAffiliation" 
                v-model="form.hospitalAffiliation" 
                placeholder="Hospital or institution affiliation"
              />
            </div>
          </CardContent>
        </Card>
      </form>

      <DialogFooter>
        <Button @click="closeDialog" variant="outline" :disabled="isLoading">
          Cancel
        </Button>
        <Button @click="submitForm" :disabled="isLoading">
          <Icon v-if="isLoading" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
          {{ staffMember ? 'Update Staff' : 'Create Staff' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>