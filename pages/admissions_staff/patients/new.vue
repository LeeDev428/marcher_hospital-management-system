<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">New Patient</h1>
				<p class="text-muted-foreground">Register a new patient in the system</p>
			</div>
			<Button variant="outline" @click="router.back()">
				<Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
				Back
			</Button>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Patient Information</CardTitle>
				<CardDescription>Enter the patient's details below</CardDescription>
			</CardHeader>
			<CardContent>
				<form @submit.prevent="handleSubmit" class="space-y-6">
					<!-- Basic Information -->
					<div class="space-y-4">
						<h3 class="text-lg font-semibold border-b pb-2">Basic Information</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="space-y-2">
								<Label for="firstName">First Name *</Label>
								<Input
									id="firstName"
									v-model="form.firstName"
									placeholder="Enter first name"
									required
								/>
							</div>
							<div class="space-y-2">
								<Label for="lastName">Last Name *</Label>
								<Input
									id="lastName"
									v-model="form.lastName"
									placeholder="Enter last name"
									required
								/>
							</div>
							<div class="space-y-2">
								<Label for="middleName">Middle Name</Label>
								<Input
									id="middleName"
									v-model="form.middleName"
									placeholder="Enter middle name (optional)"
								/>
							</div>
							<div class="space-y-2">
								<Label for="email">Email *</Label>
								<Input
									id="email"
									v-model="form.email"
									type="email"
									placeholder="patient@example.com"
									required
								/>
							</div>
							<div class="space-y-2">
								<Label for="password">Password *</Label>
								<Input
									id="password"
									v-model="form.password"
									type="password"
									placeholder="Minimum 6 characters"
									required
								/>
							</div>
							<div class="space-y-2">
								<Label for="phone">Phone Number</Label>
								<Input
									id="phone"
									v-model="form.phone"
									placeholder="+63 123 456 7890"
								/>
							</div>
						</div>
					</div>

					<!-- Personal Information -->
					<div class="space-y-4">
						<h3 class="text-lg font-semibold border-b pb-2">Personal Information</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="space-y-2">
								<Label for="dateOfBirth">Date of Birth</Label>
								<Input
									id="dateOfBirth"
									v-model="form.dateOfBirth"
									type="date"
								/>
							</div>
							<div class="space-y-2">
								<Label for="gender">Gender</Label>
								<select
									id="gender"
									v-model="form.gender"
									class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								>
									<option value="">Select gender</option>
									<option value="MALE">Male</option>
									<option value="FEMALE">Female</option>
									<option value="OTHER">Other</option>
									<option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
								</select>
							</div>
							<div class="space-y-2 md:col-span-2">
								<Label for="address">Address</Label>
								<Input
									id="address"
									v-model="form.address"
									placeholder="Complete address"
								/>
							</div>
						</div>
					</div>

					<!-- Medical Information -->
					<div class="space-y-4">
						<h3 class="text-lg font-semibold border-b pb-2">Medical Information</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="space-y-2">
								<Label for="bloodType">Blood Type</Label>
								<select
									id="bloodType"
									v-model="form.bloodType"
									class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								>
									<option value="">Select blood type</option>
									<option value="A_POSITIVE">A+</option>
									<option value="A_NEGATIVE">A-</option>
									<option value="B_POSITIVE">B+</option>
									<option value="B_NEGATIVE">B-</option>
									<option value="AB_POSITIVE">AB+</option>
									<option value="AB_NEGATIVE">AB-</option>
									<option value="O_POSITIVE">O+</option>
									<option value="O_NEGATIVE">O-</option>
								</select>
							</div>
							<div class="space-y-2">
								<Label for="emergencyContact">Emergency Contact</Label>
								<Input
									id="emergencyContact"
									v-model="form.emergencyContact"
									placeholder="Emergency contact name"
								/>
							</div>
							<div class="space-y-2 md:col-span-2">
								<Label for="allergies">Allergies</Label>
								<Input
									id="allergies"
									v-model="form.allergies"
									placeholder="List any known allergies"
								/>
							</div>
							<div class="space-y-2 md:col-span-2">
								<Label for="medicalHistory">Medical History</Label>
								<textarea
									id="medicalHistory"
									v-model="form.medicalHistory"
									placeholder="Brief medical history"
									rows="3"
									class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								/>
							</div>
						</div>
					</div>

					<!-- Insurance Information -->
					<div class="space-y-4">
						<h3 class="text-lg font-semibold border-b pb-2">Insurance Information</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="space-y-2">
								<Label for="insuranceProvider">Insurance Provider</Label>
								<Input
									id="insuranceProvider"
									v-model="form.insuranceProvider"
									placeholder="Insurance company name"
								/>
							</div>
							<div class="space-y-2">
								<Label for="insuranceNumber">Insurance Number</Label>
								<Input
									id="insuranceNumber"
									v-model="form.insuranceNumber"
									placeholder="Insurance policy number"
								/>
							</div>
						</div>
					</div>

					<!-- Action Buttons -->
					<div class="flex gap-2 pt-4">
						<Button type="submit" :disabled="isSubmitting" class="bg-green-600 hover:bg-green-700">
							<Icon v-if="isSubmitting" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
							{{ isSubmitting ? 'Creating...' : 'Create Patient' }}
						</Button>
						<Button type="button" variant="outline" @click="router.back()" :disabled="isSubmitting">
							Cancel
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"

definePageMeta({
	layout: "admissions-staff",
})

const { $trpc } = useNuxtApp()
const router = useRouter()

const isSubmitting = ref(false)

const form = ref({
	firstName: '',
	lastName: '',
	middleName: '',
	email: '',
	password: '',
	phone: '',
	dateOfBirth: '',
	gender: '',
	address: '',
	bloodType: '',
	emergencyContact: '',
	allergies: '',
	medicalHistory: '',
	insuranceProvider: '',
	insuranceNumber: '',
})

async function handleSubmit() {
	try {
		isSubmitting.value = true

		// Create user with PATIENT role
		const response = await $trpc.users.create.mutate({
			firstName: form.value.firstName,
			lastName: form.value.lastName,
			middleName: form.value.middleName || undefined,
			email: form.value.email,
			password: form.value.password,
			phone: form.value.phone || undefined,
			role: 'PATIENT',
			dateOfBirth: form.value.dateOfBirth || undefined,
			gender: form.value.gender || undefined,
			address: form.value.address || undefined,
			bloodType: form.value.bloodType || undefined,
			emergencyContact: form.value.emergencyContact || undefined,
			allergies: form.value.allergies || undefined,
			medicalHistory: form.value.medicalHistory || undefined,
			insuranceProvider: form.value.insuranceProvider || undefined,
			insuranceNumber: form.value.insuranceNumber || undefined,
		} as any)

		if (response.success) {
			useToast('success', 'Success', 'Patient created successfully')
			router.push('/admissions_staff/patients')
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
</script>
