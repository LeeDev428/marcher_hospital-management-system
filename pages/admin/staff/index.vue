<script setup lang="ts">
import { useAuthStore } from '~/stores/app/useAuthStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '~/components/ui/badge'

const authStore = useAuthStore()

// Set page title and meta
definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Staff Management - Admin Portal'
})

// State management
const showCreateDialog = ref(false)
const loading = ref(false)
const activeTab = ref('all')
const staff = ref<any[]>([])

// Form state for creating new staff
const createForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  department: '',
  position: '',
  hireDate: null as Date | null,
  salary: 0,
  staffType: 'DOCTOR' as 'DOCTOR' | 'NURSE',
  licenseNumber: '',
  education: '',
  yearsOfExperience: 0,
  // Doctor-specific fields
  specialization: '',
  subSpecialization: '',
  consultationFee: 0,
  // Nurse-specific fields
  nursingSpecialty: '',
  certificationLevel: '',
  shiftPreference: '',
})

// Medical specializations for doctors
const doctorSpecializations = [
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

// Nursing specialties
const nursingSpecialties = [
  'Critical Care Nursing',
  'Emergency Nursing',
  'Pediatric Nursing',
  'Surgical Nursing',
  'Psychiatric Nursing',
  'Obstetric Nursing',
  'Oncology Nursing',
  'Geriatric Nursing',
  'Cardiac Nursing',
  'Orthopedic Nursing',
  'General Ward Nursing'
]

// Departments
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
  'Oncology',
  'ICU',
  'Maternity'
]

// Certification levels for nurses
const certificationLevels = [
  'Licensed Practical Nurse (LPN)',
  'Registered Nurse (RN)',
  'Bachelor of Science in Nursing (BSN)',
  'Master of Science in Nursing (MSN)',
  'Nurse Practitioner (NP)',
  'Clinical Nurse Specialist (CNS)'
]

// Shift preferences
const shiftPreferences = [
  'Day Shift (7 AM - 7 PM)',
  'Night Shift (7 PM - 7 AM)',
  'Rotating Shifts',
  'Flexible/PRN'
]

// Computed properties
const filteredStaff = computed(() => {
  if (activeTab.value === 'all') return staff.value
  if (activeTab.value === 'doctors') return staff.value.filter(s => s.staffType === 'DOCTOR')
  if (activeTab.value === 'nurses') return staff.value.filter(s => s.staffType === 'NURSE')
  return staff.value
})

const staffStats = ref({
  total: 0,
  doctors: 0,
  nurses: 0,
  active: 0
})

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
  
  if (!createForm.value.password || createForm.value.password.length < 8) {
    useToast('error', 'Validation Error', 'Password must be at least 8 characters long')
    return false
  }

  if (!createForm.value.staffType) {
    useToast('error', 'Validation Error', 'Staff type is required')
    return false
  }

  // Type-specific validation
  if (createForm.value.staffType === 'DOCTOR') {
    if (!createForm.value.specialization || !createForm.value.licenseNumber) {
      useToast('error', 'Validation Error', 'Medical specialization and license number are required for doctors')
      return false
    }
  } else if (createForm.value.staffType === 'NURSE') {
    if (!createForm.value.nursingSpecialty || !createForm.value.certificationLevel) {
      useToast('error', 'Validation Error', 'Nursing specialty and certification level are required for nurses')
      return false
    }
  }
  
  return true
}

// Create new staff member
const createStaff = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    const staffData = {
      email: createForm.value.email,
      password: createForm.value.password,
      firstName: createForm.value.firstName,
      lastName: createForm.value.lastName,
      phone: createForm.value.phone,
      department: createForm.value.department,
      position: createForm.value.position,
      hireDate: createForm.value.hireDate || undefined,
      salary: createForm.value.salary,
      staffType: createForm.value.staffType,
      licenseNumber: createForm.value.licenseNumber,
      education: createForm.value.education,
      yearsOfExperience: createForm.value.yearsOfExperience,
      specialization: createForm.value.specialization,
      subSpecialization: createForm.value.subSpecialization,
      consultationFee: createForm.value.consultationFee,
      nursingSpecialty: createForm.value.nursingSpecialty,
      certificationLevel: createForm.value.certificationLevel,
      shiftPreference: createForm.value.shiftPreference,
    }
    
    const { $trpc } = useNuxtApp()
    const response = await $trpc.staff.create.mutate(staffData)
    
    if (response.id) {
      useToast('success', 'Staff Created', `${createForm.value.staffType.toLowerCase()} profile created successfully`)
      showCreateDialog.value = false
      resetForm()
      await loadStaff()
      await loadStats()
    } else {
      useToast('error', 'Creation Failed', 'Failed to create staff member')
    }
  } catch (error) {
    console.error('Error creating staff member:', error)
    useToast('error', 'Creation Failed', 'An error occurred while creating the staff member')
  } finally {
    loading.value = false
  }
}

// Load staff
const loadStaff = async () => {
  try {
    const { $trpc } = useNuxtApp()
    const staffData = await $trpc.staff.getAll.query()
    
    if (staffData && Array.isArray(staffData)) {
      staff.value = staffData
    } else {
      useToast('error', 'Load Failed', 'Failed to load staff')
    }
  } catch (error) {
    console.error('Error loading staff:', error)
    useToast('error', 'Load Failed', 'Failed to load staff')
  }
}

// Load statistics
const loadStats = async () => {
  try {
    const { $trpc } = useNuxtApp()
    const stats = await $trpc.staff.getStats.query()
    staffStats.value = stats
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

// Reset form
const resetForm = () => {
  createForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    position: '',
    hireDate: null,
    salary: 0,
    staffType: 'DOCTOR',
    licenseNumber: '',
    education: '',
    yearsOfExperience: 0,
    specialization: '',
    subSpecialization: '',
    consultationFee: 0,
    nursingSpecialty: '',
    certificationLevel: '',
    shiftPreference: '',
  }
}

// Helper functions
const getStaffBadgeColor = (staffType: string) => {
  return staffType === 'DOCTOR' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
}

const formatStaffName = (member: any) => {
  const prefix = member.staffType === 'DOCTOR' ? 'Dr.' : 'Nurse'
  return `${prefix} ${member.firstName} ${member.lastName}`
}

// Load data on mount
onMounted(async () => {
  await Promise.all([loadStaff(), loadStats()])
})
</script>

<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Staff Management</h1>
        <p class="text-muted-foreground">Manage doctors and nurses in your hospital</p>
      </div>
      
      <Dialog v-model:open="showCreateDialog">
        <DialogTrigger as-child>
          <Button class="flex items-center gap-2">
            <Icon name="lucide:plus" class="h-4 w-4" />
            Add Staff Member
          </Button>
        </DialogTrigger>
        <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>Create a new doctor or nurse profile</DialogDescription>
          </DialogHeader>
          
          <form @submit.prevent="createStaff" class="space-y-6">
            <!-- Staff Type Selection -->
            <div class="space-y-2">
              <Label for="staffType">Staff Type *</Label>
              <Select v-model="createForm.staffType">
                <SelectTrigger>
                  <SelectValue placeholder="Select staff type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DOCTOR">Doctor</SelectItem>
                  <SelectItem value="NURSE">Nurse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Personal Information -->
            <div class="space-y-4 p-4 bg-blue-50 rounded-lg">
              <h3 class="font-medium text-blue-900">Personal Information</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="firstName">First Name *</Label>
                  <Input v-model="createForm.firstName" id="firstName" placeholder="John" />
                </div>
                <div class="space-y-2">
                  <Label for="lastName">Last Name *</Label>
                  <Input v-model="createForm.lastName" id="lastName" placeholder="Doe" />
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="email">Email Address *</Label>
                  <Input v-model="createForm.email" id="email" type="email" placeholder="john.doe@hospital.com" />
                </div>
                <div class="space-y-2">
                  <Label for="password">Password *</Label>
                  <Input v-model="createForm.password" id="password" type="password" placeholder="Secure password" />
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="phone">Phone Number</Label>
                  <Input v-model="createForm.phone" id="phone" placeholder="+63 912 345 6789" />
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
            </div>

            <!-- Professional Information -->
            <div class="space-y-4 p-4 bg-green-50 rounded-lg">
              <h3 class="font-medium text-green-900">Professional Information</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="licenseNumber">License Number</Label>
                  <Input v-model="createForm.licenseNumber" id="licenseNumber" placeholder="Professional license number" />
                </div>
                <div class="space-y-2">
                  <Label for="yearsOfExperience">Years of Experience</Label>
                  <Input v-model.number="createForm.yearsOfExperience" id="yearsOfExperience" type="number" min="0" />
                </div>
              </div>

              <!-- Doctor-specific fields -->
              <div v-if="createForm.staffType === 'DOCTOR'" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="specialization">Medical Specialization *</Label>
                    <Select v-model="createForm.specialization">
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="spec in doctorSpecializations" :key="spec" :value="spec">
                          {{ spec }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div class="space-y-2">
                    <Label for="subSpecialization">Sub-specialization</Label>
                    <Input v-model="createForm.subSpecialization" id="subSpecialization" placeholder="Optional sub-specialty" />
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="consultationFee">Consultation Fee (₱)</Label>
                    <Input v-model.number="createForm.consultationFee" id="consultationFee" type="number" min="0" />
                  </div>
                </div>
              </div>

              <!-- Nurse-specific fields -->
              <div v-if="createForm.staffType === 'NURSE'" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="nursingSpecialty">Nursing Specialty *</Label>
                    <Select v-model="createForm.nursingSpecialty">
                      <SelectTrigger>
                        <SelectValue placeholder="Select nursing specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="spec in nursingSpecialties" :key="spec" :value="spec">
                          {{ spec }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div class="space-y-2">
                    <Label for="certificationLevel">Certification Level *</Label>
                    <Select v-model="createForm.certificationLevel">
                      <SelectTrigger>
                        <SelectValue placeholder="Select certification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="cert in certificationLevels" :key="cert" :value="cert">
                          {{ cert }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div class="space-y-2">
                  <Label for="shiftPreference">Shift Preference</Label>
                  <Select v-model="createForm.shiftPreference">
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="shift in shiftPreferences" :key="shift" :value="shift">
                        {{ shift }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div class="space-y-2">
                <Label for="education">Education</Label>
                <Input v-model="createForm.education" id="education" placeholder="Educational background" />
              </div>
            </div>

            <!-- Employment Information -->
            <div class="space-y-4 p-4 bg-purple-50 rounded-lg">
              <h3 class="font-medium text-purple-900">Employment Information</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="position">Position</Label>
                  <Input v-model="createForm.position" id="position" placeholder="Job position" />
                </div>
                <div class="space-y-2">
                  <Label for="salary">Salary (₱)</Label>
                  <Input v-model.number="createForm.salary" id="salary" type="number" min="0" />
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" @click="showCreateDialog = false">Cancel</Button>
              <Button type="submit" :disabled="loading">
                <Icon v-if="loading" name="lucide:loader" class="h-4 w-4 mr-2 animate-spin" />
                Create {{ createForm.staffType === 'DOCTOR' ? 'Doctor' : 'Nurse' }}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Statistics Cards -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Staff</CardTitle>
          <Icon name="lucide:users" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ staffStats.total }}</div>
          <p class="text-xs text-muted-foreground">Doctors and Nurses</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Doctors</CardTitle>
          <Icon name="lucide:stethoscope" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ staffStats.doctors }}</div>
          <p class="text-xs text-muted-foreground">Medical doctors</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Nurses</CardTitle>
          <Icon name="lucide:heart-pulse" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ staffStats.nurses }}</div>
          <p class="text-xs text-muted-foreground">Registered nurses</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Active Staff</CardTitle>
          <Icon name="lucide:user-check" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ staffStats.active }}</div>
          <p class="text-xs text-muted-foreground">Currently active</p>
        </CardContent>
      </Card>
    </div>

    <!-- Staff Management Tabs -->
    <Card>
      <CardHeader>
        <CardTitle>Staff Directory</CardTitle>
        <CardDescription>View and manage all medical staff</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Staff ({{ staffStats.total }})</TabsTrigger>
            <TabsTrigger value="doctors">Doctors ({{ staffStats.doctors }})</TabsTrigger>
            <TabsTrigger value="nurses">Nurses ({{ staffStats.nurses }})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" class="space-y-4">
            <div class="rounded-md border">
              <table class="w-full">
                <thead class="border-b bg-muted/50">
                  <tr>
                    <th class="p-3 text-left font-medium">Staff Member</th>
                    <th class="p-3 text-left font-medium">Type</th>
                    <th class="p-3 text-left font-medium">Specialization</th>
                    <th class="p-3 text-left font-medium">Department</th>
                    <th class="p-3 text-left font-medium">Status</th>
                    <th class="p-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="member in filteredStaff" :key="member.id" class="border-b hover:bg-muted/50">
                    <td class="p-3">
                      <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                          <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <Icon :name="member.staffType === 'DOCTOR' ? 'lucide:stethoscope' : 'lucide:heart-pulse'" class="h-4 w-4" />
                          </div>
                        </div>
                        <div>
                          <p class="font-medium">{{ formatStaffName(member) }}</p>
                          <p class="text-sm text-muted-foreground">{{ member.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="p-3">
                      <Badge :class="getStaffBadgeColor(member.staffType)">
                        {{ member.staffType }}
                      </Badge>
                    </td>
                    <td class="p-3">
                      <p class="font-medium">{{ member.specialization || 'General' }}</p>
                      <p v-if="member.subSpecialization" class="text-sm text-muted-foreground">{{ member.subSpecialization }}</p>
                    </td>
                    <td class="p-3">
                      <p class="font-medium">{{ member.department || 'General' }}</p>
                      <p class="text-sm text-muted-foreground">{{ member.position || member.staffType }}</p>
                    </td>
                    <td class="p-3">
                      <Badge :class="member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                        {{ member.status }}
                      </Badge>
                    </td>
                    <td class="p-3">
                      <div class="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div v-if="filteredStaff.length === 0" class="p-8 text-center text-muted-foreground">
                <Icon name="lucide:users" class="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No staff members found</p>
                <p class="text-sm">Add your first {{ activeTab === 'doctors' ? 'doctor' : activeTab === 'nurses' ? 'nurse' : 'staff member' }}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="doctors" class="space-y-4">
            <!-- Same table structure, filtered for doctors -->
            <div class="rounded-md border">
              <table class="w-full">
                <thead class="border-b bg-muted/50">
                  <tr>
                    <th class="p-3 text-left font-medium">Doctor</th>
                    <th class="p-3 text-left font-medium">Specialization</th>
                    <th class="p-3 text-left font-medium">Department</th>
                    <th class="p-3 text-left font-medium">Consultation Fee</th>
                    <th class="p-3 text-left font-medium">Status</th>
                    <th class="p-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="doctor in filteredStaff" :key="doctor.id" class="border-b hover:bg-muted/50">
                    <td class="p-3">
                      <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icon name="lucide:stethoscope" class="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <p class="font-medium">Dr. {{ doctor.firstName }} {{ doctor.lastName }}</p>
                          <p class="text-sm text-muted-foreground">{{ doctor.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="p-3">
                      <p class="font-medium">{{ doctor.specialization || 'General Medicine' }}</p>
                      <p v-if="doctor.subSpecialization" class="text-sm text-muted-foreground">{{ doctor.subSpecialization }}</p>
                    </td>
                    <td class="p-3">{{ doctor.department || 'General' }}</td>
                    <td class="p-3">₱{{ doctor.consultationFee || 0 }}</td>
                    <td class="p-3">
                      <Badge :class="doctor.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                        {{ doctor.status }}
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
              
              <div v-if="filteredStaff.length === 0" class="p-8 text-center text-muted-foreground">
                <Icon name="lucide:stethoscope" class="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No doctors found</p>
                <p class="text-sm">Add your first doctor to get started</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="nurses" class="space-y-4">
            <!-- Same table structure, filtered for nurses -->
            <div class="rounded-md border">
              <table class="w-full">
                <thead class="border-b bg-muted/50">
                  <tr>
                    <th class="p-3 text-left font-medium">Nurse</th>
                    <th class="p-3 text-left font-medium">Specialty</th>
                    <th class="p-3 text-left font-medium">Department</th>
                    <th class="p-3 text-left font-medium">Certification</th>
                    <th class="p-3 text-left font-medium">Status</th>
                    <th class="p-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="nurse in filteredStaff" :key="nurse.id" class="border-b hover:bg-muted/50">
                    <td class="p-3">
                      <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Icon name="lucide:heart-pulse" class="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                        <div>
                          <p class="font-medium">Nurse {{ nurse.firstName }} {{ nurse.lastName }}</p>
                          <p class="text-sm text-muted-foreground">{{ nurse.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="p-3">{{ nurse.specialization || 'General Nursing' }}</td>
                    <td class="p-3">{{ nurse.department || 'General' }}</td>
                    <td class="p-3">
                      <p class="text-sm">{{ nurse.workingHours?.certificationLevel || 'RN' }}</p>
                    </td>
                    <td class="p-3">
                      <Badge :class="nurse.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                        {{ nurse.status }}
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
              
              <div v-if="filteredStaff.length === 0" class="p-8 text-center text-muted-foreground">
                <Icon name="lucide:heart-pulse" class="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No nurses found</p>
                <p class="text-sm">Add your first nurse to get started</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
</template>
