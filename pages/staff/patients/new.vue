<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const breadcrumbsStore = useBreadcrumbsStore()
const { $trpc } = useNuxtApp()
const router = useRouter()

// Form state
const form = ref({
  firstName: '',
  lastName: '',
  middleName: '',
  email: '',
  password: '',
  phone: '',
  role: 'PATIENT' as const,
  dateOfBirth: '',
  gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY',
  address: '',
  emergencyContact: '',
  emergencyPhone: '',
  bloodType: 'O_POSITIVE' as 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE',
  allergies: '',
  medicalHistory: '',
  insuranceProvider: '',
  insuranceNumber: '',
})

const isSubmitting = ref(false)

// Submit handler
const handleCreatePatient = async () => {
  try {
    isSubmitting.value = true
    
    const response = await $trpc.users.create.mutate({
      ...form.value,
    })
    
    if (response.success && response.data) {
      useToast('success', 'Patient Created', 'Patient account created successfully')
      await router.push('/staff/patients')
    } else {
      useToast('error', 'Error', response.message || 'Failed to create patient')
    }
  } catch (error: any) {
    console.error('Error creating patient:', error)
    useToast('error', 'Error', error.message || 'Failed to create patient')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Patients", link: "/staff/patients" },
		{ label: "New Patient Profile", link: "/staff/patients/new" },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="New Patient">
		<div class="max-w-4xl mx-auto p-6">
			<Card>
				<CardHeader>
					<CardTitle>New Patient Profile</CardTitle>
					<CardDescription>Create a new patient account with medical information</CardDescription>
				</CardHeader>
				<CardContent>
					<form @submit.prevent="handleCreatePatient" class="space-y-6">
						<!-- Personal Information -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold">Personal Information</h3>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div class="space-y-2">
									<Label for="firstName">First Name *</Label>
									<Input id="firstName" v-model="form.firstName" placeholder="John" required />
								</div>
								<div class="space-y-2">
									<Label for="middleName">Middle Name</Label>
									<Input id="middleName" v-model="form.middleName" placeholder="Robert" />
								</div>
								<div class="space-y-2">
									<Label for="lastName">Last Name *</Label>
									<Input id="lastName" v-model="form.lastName" placeholder="Doe" required />
								</div>
							</div>
						</div>

						<!-- Contact Information -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold">Contact Information</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div class="space-y-2">
									<Label for="email">Email *</Label>
									<Input id="email" v-model="form.email" type="email" placeholder="john.doe@example.com" required />
								</div>
								<div class="space-y-2">
									<Label for="phone">Phone</Label>
									<Input id="phone" v-model="form.phone" type="tel" placeholder="+1234567890" />
								</div>
								<div class="space-y-2">
									<Label for="password">Password *</Label>
									<Input id="password" v-model="form.password" type="password" placeholder="••••••••" required />
								</div>
								<div class="space-y-2">
									<Label for="address">Address</Label>
									<Input id="address" v-model="form.address" placeholder="123 Main St, City" />
								</div>
							</div>
						</div>

						<!-- Demographics -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold">Demographics</h3>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div class="space-y-2">
									<Label for="dateOfBirth">Date of Birth</Label>
									<Input id="dateOfBirth" v-model="form.dateOfBirth" type="date" />
								</div>
								<div class="space-y-2">
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
								<div class="space-y-2">
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

						<!-- Emergency Contact -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold">Emergency Contact</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div class="space-y-2">
									<Label for="emergencyContact">Emergency Contact Name</Label>
									<Input id="emergencyContact" v-model="form.emergencyContact" placeholder="Jane Doe" />
								</div>
								<div class="space-y-2">
									<Label for="emergencyPhone">Emergency Contact Phone</Label>
									<Input id="emergencyPhone" v-model="form.emergencyPhone" type="tel" placeholder="+1234567890" />
								</div>
							</div>
						</div>

						<!-- Medical Information -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold">Medical Information</h3>
							<div class="grid grid-cols-1 gap-4">
								<div class="space-y-2">
									<Label for="allergies">Allergies</Label>
									<Input id="allergies" v-model="form.allergies" placeholder="Penicillin, Peanuts, etc." />
								</div>
								<div class="space-y-2">
									<Label for="medicalHistory">Medical History</Label>
									<Input id="medicalHistory" v-model="form.medicalHistory" placeholder="Diabetes, Hypertension, etc." />
								</div>
							</div>
						</div>

						<!-- Insurance Information -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold">Insurance Information</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div class="space-y-2">
									<Label for="insuranceProvider">Insurance Provider</Label>
									<Input id="insuranceProvider" v-model="form.insuranceProvider" placeholder="Blue Cross" />
								</div>
								<div class="space-y-2">
									<Label for="insuranceNumber">Insurance Number</Label>
									<Input id="insuranceNumber" v-model="form.insuranceNumber" placeholder="INS123456" />
								</div>
							</div>
						</div>

						<!-- Actions -->
						<div class="flex gap-2 justify-end pt-4">
							<Button type="button" variant="outline" @click="router.push('/staff/patients')">
								<Icon name="mdi:arrow-left" class="w-4 h-4 mr-2" />
								Cancel
							</Button>
							<Button type="submit" :disabled="isSubmitting">
								<Icon name="mdi:content-save" class="w-4 h-4 mr-2" />
								{{ isSubmitting ? 'Creating...' : 'Create Patient' }}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	</NuxtLayout>
</template>
