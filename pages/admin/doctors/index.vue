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
  title: 'Doctor Management - Admin Portal'
})

// State for doctor management
const showCreateDialog = ref(false)
const loading = ref(false)
const doctors = ref([])

// Form state for creating new doctors
const createForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  position: 'Doctor',
  medicalLicense: '',
  specialization: '',
  subSpecialization: '',
  boardCertification: '',
  yearsOfExperience: 0,
  education: '',
  hospitalAffiliation: '',
  consultationFee: 0,
  isAvailable: true,
  workingHours: ''
})

// Medical specializations
const specializations = [
  'Internal Medicine',
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Family Medicine',
  'Gastroenterology',
  'General Surgery',
  'Neurology',
  'Obstetrics and Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedic Surgery',
  'Pathology',
  'Pediatrics',
  'Plastic Surgery',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Urology'
]

const departments = [
  'General Medicine',
  'Cardiology', 
  'Pediatrics',
  'Surgery',
  'Emergency',
  'Radiology',
  'Laboratory',
  'Orthopedics',
  'Neurology',
  'Oncology'
]

const availabilityOptions = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'ON_CALL', label: 'On Call' },
  { value: 'CONSULTANT', label: 'Consultant' }
]

// Real doctors data (loaded from API)
const doctors = ref([])
    status: 'ACTIVE',
    createdAt: '2024-01-15',
    role: 'DOCTOR'
  },
  {
    id: 'doc_002',
    firstName: 'Michael',
    lastName: 'Chen',
    middleName: '',
    suffix: 'MD',
    specialization: 'Pediatrics',
    department: 'Pediatrics',
    licenseNumber: 'MD-67890-2024',
    email: 'michael.chen@hospital.com',
    phone: '+63 912 345 6790',
    experience: '8 years',
    education: 'University of the Philippines College of Medicine',
    availability: 'FULL_TIME',
    status: 'ACTIVE',
    createdAt: '2024-02-20',
    role: 'DOCTOR'
  },
  {
    id: 'doc_003',
    firstName: 'Lisa',
    lastName: 'Wong',
    middleName: 'A',
    suffix: 'MD',
    specialization: 'Dermatology',
    department: 'General Medicine',
    licenseNumber: 'MD-11111-2024',
    email: 'lisa.wong@hospital.com',
    phone: '+63 912 345 6791',
    experience: '12 years',
    education: 'Ateneo School of Medicine',
    availability: 'PART_TIME',
    status: 'ACTIVE',
    createdAt: '2024-03-10',
    role: 'DOCTOR'
  }
])

// Validation functions
const validateForm = () => {
  if (!createForm.value.firstName || !createForm.value.lastName) {
    useToast('error', 'Validation Error', 'First name and last name are required')
    return false
  }
  
  if (!createForm.value.email) {
    useToast('error', 'Validation Error', 'Email is required')
    return false
  }
  
  if (!createForm.value.specialization || !createForm.value.medicalLicense) {
    useToast('error', 'Validation Error', 'Specialization and medical license are required')
    return false
  }
  
  return true
}

// Create new doctor
const createDoctor = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // Prepare doctor data according to new doctors API schema
    const doctorData = {
      firstName: createForm.value.firstName,
      lastName: createForm.value.lastName,
      email: createForm.value.email,
      phone: createForm.value.phone,
      department: createForm.value.department,
      position: createForm.value.position,
      medicalLicense: createForm.value.medicalLicense,
      specialization: createForm.value.specialization,
      subSpecialization: createForm.value.subSpecialization,
      boardCertification: createForm.value.boardCertification,
      yearsOfExperience: createForm.value.yearsOfExperience,
      education: createForm.value.education,
      hospitalAffiliation: createForm.value.hospitalAffiliation,
      consultationFee: createForm.value.consultationFee,
      isAvailable: createForm.value.isAvailable,
      workingHours: createForm.value.workingHours
    }
    
    // Call the new doctors creation API
    const { $trpc } = useNuxtApp()
    const response = await $trpc.doctors.create.mutate(doctorData)
    
    if (response.success) {
      useToast('success', 'Doctor Created', 'Doctor profile created successfully')
      showCreateDialog.value = false
      resetForm()
      await loadDoctors()
    } else {
      useToast('error', 'Creation Failed', response.message || 'Failed to create doctor')
    }
  } catch (error) {
    console.error('Error creating doctor:', error)
    useToast('error', 'Creation Failed', 'An error occurred while creating the doctor')
  } finally {
    loading.value = false
  }
}

// Load doctors
const loadDoctors = async () => {
  try {
    const { $trpc } = useNuxtApp()
    const response = await $trpc.doctors.list.query()
    
    if (response.success && response.data) {
      doctors.value = response.data
    } else {
      useToast('error', 'Load Failed', 'Failed to load doctors')
    }
  } catch (error) {
    console.error('Error loading doctors:', error)
    useToast('error', 'Load Failed', 'Failed to load doctors')
  }
}

// Reset form
const resetForm = () => {
  createForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: 'Doctor',
    medicalLicense: '',
    specialization: '',
    subSpecialization: '',
    boardCertification: '',
    yearsOfExperience: 0,
    education: '',
    hospitalAffiliation: '',
    consultationFee: 0,
    isAvailable: true,
    workingHours: ''
  }
}

// Toggle doctor status
const toggleDoctorStatus = async (doctorId: string, currentStatus: string) => {
  const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  
  try {
    // API call to update doctor status
    // For now, just update locally
    const doctorIndex = doctors.value.findIndex(d => d.id === doctorId)
    if (doctorIndex !== -1) {
      doctors.value[doctorIndex].status = newStatus
      useToast('success', 'Status Updated', `Doctor status changed to ${newStatus}`)
    }
  } catch (error) {
    console.error('Error updating doctor status:', error)
    useToast('error', 'Update Failed', 'Failed to update doctor status')
  }
}

// Format doctor name for display (matches PatientAppointmentFilters format)
const formatDoctorName = (doctor) => {
  const middleName = doctor.middleName ? ` ${doctor.middleName}` : ''
  const suffix = doctor.suffix ? ` ${doctor.suffix}` : ''
  return `Dr. ${doctor.firstName}${middleName} ${doctor.lastName}${suffix}`
}

// Initialize data
onMounted(() => {
  loadDoctors()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Doctor Management</h1>
        <p class="text-gray-600">Create and manage doctor profiles for appointments</p>
      </div>
      
      <Dialog v-model:open="showCreateDialog">
        <DialogTrigger as-child>
          <Button>
            <Icon name="lucide:user-plus" class="w-4 h-4 mr-2" />
            Add Doctor
          </Button>
        </DialogTrigger>
        <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
            <DialogDescription>
              Create a new doctor profile that will be available for patient appointments
            </DialogDescription>
          </DialogHeader>
          
          <div class="space-y-4">
            <!-- Personal Information -->
            <div class="space-y-4 p-4 bg-blue-50 rounded-lg">
              <h3 class="font-medium text-blue-900">Personal Information</h3>
              
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
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="middleName">Middle Name</Label>
                  <Input v-model="createForm.middleName" id="middleName" placeholder="Enter middle name" />
                </div>
                <div class="space-y-2">
                  <Label for="suffix">Suffix</Label>
                  <Input v-model="createForm.suffix" id="suffix" placeholder="e.g., MD, Jr., Sr." />
                </div>
              </div>
            </div>
            
            <!-- Professional Information -->
            <div class="space-y-4 p-4 bg-green-50 rounded-lg">
              <h3 class="font-medium text-green-900">Professional Information</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="specialization">Specialization *</Label>
                  <Select v-model="createForm.specialization">
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="spec in specializations" :key="spec" :value="spec">
                        {{ spec }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="space-y-2">
                  <Label for="department">Department *</Label>
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
                  <Label for="licenseNumber">License Number *</Label>
                  <Input v-model="createForm.licenseNumber" id="licenseNumber" placeholder="Medical license number" />
                </div>
                <div class="space-y-2">
                  <Label for="availability">Availability</Label>
                  <Select v-model="createForm.availability">
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="avail in availabilityOptions" :key="avail.value" :value="avail.value">
                        {{ avail.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <!-- Contact Information -->
            <div class="space-y-4 p-4 bg-purple-50 rounded-lg">
              <h3 class="font-medium text-purple-900">Contact Information</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="email">Email Address</Label>
                  <Input v-model="createForm.email" id="email" type="email" placeholder="doctor@hospital.com" />
                </div>
                <div class="space-y-2">
                  <Label for="phone">Phone Number</Label>
                  <Input v-model="createForm.phone" id="phone" placeholder="+63 912 345 6789" />
                </div>
              </div>
            </div>
            
            <!-- Additional Information -->
            <div class="space-y-4 p-4 bg-orange-50 rounded-lg">
              <h3 class="font-medium text-orange-900">Additional Information</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="experience">Years of Experience</Label>
                  <Input v-model="createForm.experience" id="experience" placeholder="e.g., 10 years" />
                </div>
                <div class="space-y-2">
                  <Label for="education">Education</Label>
                  <Input v-model="createForm.education" id="education" placeholder="Medical school/university" />
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex justify-end space-x-2 pt-4">
              <Button variant="outline" @click="showCreateDialog = false">Cancel</Button>
              <Button @click="createDoctor" :disabled="loading">
                <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
                Add Doctor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Doctors</p>
              <p class="text-2xl font-bold">{{ doctors.length }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:user-md" class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Active Doctors</p>
              <p class="text-2xl font-bold">{{ doctors.filter(d => d.user.status === 'ACTIVE').length }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:activity" class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Specializations</p>
              <p class="text-2xl font-bold">{{ new Set(doctors.map(d => d.specialization || d.profession)).size }}</p>
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
              <p class="text-sm font-medium text-muted-foreground">Departments</p>
              <p class="text-2xl font-bold">{{ new Set(doctors.map(d => d.department)).size }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:building" class="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Doctors Table -->
    <Card>
      <CardHeader>
        <CardTitle>All Doctors</CardTitle>
        <CardDescription>Manage doctor profiles available for patient appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left p-3 font-medium">Doctor</th>
                <th class="text-left p-3 font-medium">Specialization</th>
                <th class="text-left p-3 font-medium">Department</th>
                <th class="text-left p-3 font-medium">Contact</th>
                <th class="text-left p-3 font-medium">Status</th>
                <th class="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doctor in doctors" :key="doctor.id" class="border-b hover:bg-muted/50">
                <td class="p-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon name="lucide:user-md" class="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p class="font-medium">Dr. {{ doctor.user.firstName }} {{ doctor.user.lastName }}</p>
                      <p class="text-sm text-muted-foreground">{{ doctor.medicalLicense || 'License N/A' }}</p>
                    </div>
                  </div>
                </td>
                <td class="p-3">
                  <p class="font-medium">{{ doctor.specialization || 'General Practice' }}</p>
                  <p class="text-sm text-muted-foreground">{{ doctor.yearsOfExperience || 0 }} years experience</p>
                </td>
                <td class="p-3">
                  <p class="font-medium">{{ doctor.staff.department || 'General Medicine' }}</p>
                  <p class="text-sm text-muted-foreground">{{ doctor.isAvailable ? 'Available' : 'Unavailable' }}</p>
                </td>
                <td class="p-3">
                  <div>
                    <p class="text-sm">{{ doctor.user.email || 'Email not provided' }}</p>
                    <p class="text-sm text-muted-foreground">{{ doctor.user.phone || 'Phone not provided' }}</p>
                  </div>
                </td>
                <td class="p-3">
                  <span :class="`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    doctor.user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`">
                    {{ doctor.user.status }}
                  </span>
                </td>
                <td class="p-3">
                  <div class="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      @click="toggleDoctorStatus(doctor.id, doctor.user.status)"
                    >
                      {{ doctor.user.status === 'ACTIVE' ? 'Deactivate' : 'Activate' }}
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Empty state -->
          <div v-if="doctors.length === 0" class="text-center py-8">
            <Icon name="lucide:user-md" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">No doctors found. Add your first doctor to get started.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>