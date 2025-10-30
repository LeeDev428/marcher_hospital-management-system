<template>
	<div class="container mx-auto p-6 max-w-4xl">
		<div class="mb-6">
			<Button @click="router.back()" variant="ghost" size="sm" class="mb-4">
				<Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
				Back
			</Button>
			<h1 class="text-3xl font-bold">Create Data Share Request</h1>
			<p class="text-muted-foreground">Share patient data with external hospital</p>
		</div>

		<!-- Loading State -->
		<div v-if="loading" class="flex justify-center py-12">
			<div class="text-muted-foreground">Loading encounter details...</div>
		</div>

		<!-- Error State -->
		<Card v-else-if="error" class="mb-6 border-red-500">
			<CardHeader>
				<CardTitle class="text-red-600 flex items-center gap-2">
					<Icon name="lucide:alert-circle" class="w-5 h-5" />
					Error
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-red-600">{{ error }}</p>
			</CardContent>
		</Card>

		<!-- Encounter Details -->
		<Card v-else-if="encounter" class="mb-6">
			<CardHeader>
				<CardTitle>Encounter Information</CardTitle>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<Label class="text-muted-foreground">Patient Name</Label>
						<p class="font-semibold">
							{{ encounter.patient?.user?.firstName }} {{ encounter.patient?.user?.lastName }}
						</p>
					</div>
					<div>
						<Label class="text-muted-foreground">Encounter Type</Label>
						<p class="font-semibold capitalize">{{ encounterType }}</p>
					</div>
					<div>
						<Label class="text-muted-foreground">Date</Label>
						<p class="font-semibold">{{ formatDate(encounter.date) }}</p>
					</div>
					<div>
						<Label class="text-muted-foreground">Chief Complaint</Label>
						<p class="font-semibold">{{ encounter.chiefComplaint }}</p>
					</div>
					<div v-if="encounter.disposition" class="col-span-2">
						<Label class="text-muted-foreground">Status</Label>
						<Badge :variant="getDispositionBadge(encounter.disposition)">
							{{ encounter.disposition }}
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Request Form -->
		<Card v-if="encounter">
			<CardHeader>
				<CardTitle>Hospital Information</CardTitle>
				<CardDescription>
					Enter the details of the hospital requesting patient data
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form @submit.prevent="handleSubmit" class="space-y-6">
					<div class="space-y-2">
						<Label for="hospitalIdentifier">Hospital ID/Identifier *</Label>
						<Input
							id="hospitalIdentifier"
							v-model="formData.hospitalIdentifier"
							placeholder="e.g., HOSP-2024-001"
							required
						/>
						<p class="text-xs text-muted-foreground">
							Unique identifier for the requesting hospital
						</p>
					</div>

					<div class="space-y-2">
						<Label for="hospitalName">Hospital Name *</Label>
						<Input
							id="hospitalName"
							v-model="formData.hospitalName"
							placeholder="e.g., St. Mary's Medical Center"
							required
						/>
					</div>

					<div class="space-y-2">
						<Label for="hospitalEmail">Hospital Email *</Label>
						<Input
							id="hospitalEmail"
							v-model="formData.hospitalEmail"
							type="email"
							placeholder="e.g., records@stmarys.com"
							required
						/>
						<p class="text-xs text-muted-foreground">
							Access link and updates will be sent to this email
						</p>
					</div>

					<div class="space-y-2">
						<Label for="reason">Reason for Data Request *</Label>
						<Textarea
							id="reason"
							v-model="formData.reason"
							placeholder="Explain why the external hospital needs access to this patient's data..."
							rows="4"
							required
							minlength="10"
						/>
						<p class="text-xs text-muted-foreground">
							Minimum 10 characters required
						</p>
					</div>

					<div class="space-y-2">
						<Label for="requestNotes">Additional Notes (Optional)</Label>
						<Textarea
							id="requestNotes"
							v-model="formData.requestNotes"
							placeholder="Any additional information..."
							rows="3"
						/>
					</div>

					<!-- Patient Consent Confirmation -->
					<div class="space-y-3 p-4 border rounded-lg bg-blue-50 border-blue-200">
						<div class="flex items-start gap-3">
							<input 
								type="checkbox" 
								id="patientConsent" 
								v-model="formData.patientConsent"
								class="w-4 h-4 mt-1 text-blue-600 rounded focus:ring-blue-500"
							/>
							<div class="flex-1">
								<Label for="patientConsent" class="cursor-pointer font-semibold text-blue-900">
									Patient Consent Confirmed *
								</Label>
								<p class="text-sm text-blue-700 mt-1">
									I confirm that the patient <strong>{{ encounter?.patient?.user?.firstName }} {{ encounter?.patient?.user?.lastName }}</strong> has given explicit consent to share their medical data with the requesting hospital.
								</p>
							</div>
						</div>
					</div>

					<div class="flex justify-end gap-3">
						<Button type="button" variant="outline" @click="router.back()">
							Cancel
						</Button>
						<Button type="submit" :disabled="submitting">
							<Icon v-if="submitting" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
							<Icon v-else name="lucide:send" class="w-4 h-4 mr-2" />
							{{ submitting ? 'Creating...' : 'Create Request' }}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Badge } from '~/components/ui/badge'
import { Checkbox } from '~/components/ui/checkbox'
import { toast } from 'vue-sonner'

definePageMeta({
	layout: 'staff',
})

const router = useRouter()
const route = useRoute()
const { $trpc } = useNuxtApp()

const encounterId = route.params.encounterId as string
const encounterType = (route.query.type as string) || 'inpatient'

const loading = ref(true)
const submitting = ref(false)
const error = ref('')
const encounter = ref<any>(null)

const formData = ref({
	hospitalIdentifier: '',
	hospitalName: '',
	hospitalEmail: '',
	reason: '',
	requestNotes: '',
	patientConsent: false,
})

onMounted(async () => {
	await loadEncounter()
})

async function loadEncounter() {
	loading.value = true
	error.value = ''

	try {
		let response
		if (encounterType === 'inpatient') {
			response = await $trpc.encounters.inpatient.getInpatientEncounter.query({
				id: encounterId,
			})
		} else {
			response = await $trpc.encounters.outpatient.getOutpatientEncounter.query({
				id: encounterId,
			})
		}

		if (response.success && response.data) {
			encounter.value = response.data
			
			// Check if encounter meets requirements for data sharing
			// 1. Check if patient has DISCHARGED status (only for inpatient)
			if (encounterType === 'inpatient') {
				if (encounter.value.disposition !== 'DISCHARGED') {
					error.value = 'Data sharing is only available for DISCHARGED patients. Current status: ' + encounter.value.disposition
					return
				}
			}
			
			// 2. TODO: Check if patient has given consent
			// This will be implemented when patient consent UI is added
			// For now, we'll assume consent is given
		} else {
			error.value = response.message || 'Failed to load encounter'
		}
	} catch (err: any) {
		console.error('Error loading encounter:', err)
		error.value = err.message || 'Failed to load encounter'
	} finally {
		loading.value = false
	}
}

async function handleSubmit() {
	if (!encounter.value) return

	// Debug log
	console.log('Patient Consent:', formData.value.patientConsent)

	// Validate patient consent
	if (!formData.value.patientConsent) {
		toast.error('Consent Required', {
			description: 'You must confirm that the patient has given consent to share their data',
		})
		return
	}

	submitting.value = true

	try {
		// Get current user from auth store
		const { useAuthStore } = await import('~/stores/app/useAuthStore')
		const authStore = useAuthStore()
		const currentUser = authStore.user

		if (!currentUser) {
			toast.error('Authentication Error', {
				description: 'You must be logged in to create a data share request',
			})
			return
		}

		const response = await $trpc.dataShare.createRequest.mutate({
			patientId: encounter.value.patientId,
			encounterId: encounterId,
			encounterType: encounterType as 'inpatient' | 'outpatient',
			hospitalIdentifier: formData.value.hospitalIdentifier,
			hospitalName: formData.value.hospitalName,
			hospitalEmail: formData.value.hospitalEmail,
			reason: formData.value.reason,
			requestNotes: formData.value.requestNotes,
			requestedBy: currentUser.id, // Pass user ID from auth store
			patientConsent: formData.value.patientConsent, // Pass patient consent
		})

		if (response.success) {
			toast.success('Request Created', {
				description: `Data share request ${response.data.requestNumber} has been created and submitted for review.`,
			})
			// Redirect back to encounters
			router.push('/staff/encounters')
		} else {
			throw new Error(response.message || 'Failed to create request')
		}
	} catch (err: any) {
		console.error('Error creating request:', err)
		
		// Parse validation errors
		let errorMessage = 'Failed to create data share request'
		if (err.message) {
			try {
				const errors = JSON.parse(err.message)
				if (Array.isArray(errors) && errors.length > 0) {
					errorMessage = errors.map((e: any) => e.message).join(', ')
				} else {
					errorMessage = err.message
				}
			} catch {
				errorMessage = err.message
			}
		}
		
		toast.error('Validation Error', {
			description: errorMessage,
		})
	} finally {
		submitting.value = false
	}
}

function formatDate(dateStr: string) {
	if (!dateStr) return 'N/A'
	const date = new Date(dateStr)
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
}

function getDispositionBadge(disposition: string): 'default' | 'secondary' | 'outline' | 'destructive' {
	const badges: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
		ADMITTED: 'default',
		DISCHARGED: 'secondary',
		TRANSFERRED: 'outline',
		DECEASED: 'destructive',
		DISCONTINUED: 'outline',
		OTHER: 'outline',
	}
	return badges[disposition] || 'default'
}
</script>
