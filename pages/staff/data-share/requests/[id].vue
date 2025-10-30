<template>
	<div class="container mx-auto p-6 space-y-6">
		<!-- Back Button -->
		<Button variant="ghost" @click="$router.back()">
			<Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
			Back to Requests
		</Button>

		<!-- Loading State -->
		<div v-if="loading" class="flex justify-center py-12">
			<Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-muted-foreground" />
		</div>

		<div v-else-if="!request" class="text-center py-12">
			<Icon name="lucide:alert-circle" class="w-12 h-12 mx-auto text-muted-foreground mb-4" />
			<p class="text-lg font-medium">Request not found</p>
		</div>

		<div v-else class="space-y-6">
			<!-- Header -->
			<div class="flex items-start justify-between">
				<div>
					<h1 class="text-3xl font-bold">Data Share Request</h1>
					<p class="text-muted-foreground mt-1">Request #{{ request.requestNumber }}</p>
				</div>
				<Badge :variant="getStatusVariant(request.status)" class="text-base px-4 py-2">
					{{ request.status }}
				</Badge>
			</div>

			<!-- Patient Information -->
			<Card>
				<CardHeader>
					<CardTitle>Patient Information</CardTitle>
				</CardHeader>
				<CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label class="text-muted-foreground">Patient Name</Label>
						<p class="font-medium mt-1">
							{{ request.patient?.user?.firstName || '' }} {{ request.patient?.user?.middleName || '' }} {{ request.patient?.user?.lastName || '' }}
						</p>
					</div>
					<div>
						<Label class="text-muted-foreground">Patient Number</Label>
						<p class="font-medium mt-1">{{ request.patient?.patientNumber || 'N/A' }}</p>
					</div>
					<div>
						<Label class="text-muted-foreground">Date of Birth</Label>
						<p class="font-medium mt-1">{{ formatDate(request.patient?.user?.dateOfBirth) }}</p>
					</div>
					<div>
						<Label class="text-muted-foreground">Contact Number</Label>
						<p class="font-medium mt-1">{{ request.patient?.user?.phoneNumber || 'N/A' }}</p>
					</div>
				</CardContent>
			</Card>

			<!-- Hospital & Request Information -->
			<Card>
				<CardHeader>
					<CardTitle>Request Details</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label class="text-muted-foreground">Requesting Hospital</Label>
							<p class="font-medium mt-1">{{ request.hospitalName }}</p>
						</div>
						<div>
							<Label class="text-muted-foreground">Hospital Type</Label>
							<p class="font-medium mt-1">{{ request.hospitalType }}</p>
						</div>
						<div>
							<Label class="text-muted-foreground">Contact Person</Label>
							<p class="font-medium mt-1">{{ request.contactPerson }}</p>
						</div>
						<div>
							<Label class="text-muted-foreground">Contact Number</Label>
							<p class="font-medium mt-1">{{ request.contactNumber }}</p>
						</div>
					</div>
					<div>
						<Label class="text-muted-foreground">Reason for Request</Label>
						<p class="mt-1">{{ request.reason }}</p>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label class="text-muted-foreground">Submitted By</Label>
							<p class="font-medium mt-1">{{ request.requestedByStaff?.user?.firstName || 'N/A' }} {{ request.requestedByStaff?.user?.lastName || '' }}</p>
						</div>
						<div>
							<Label class="text-muted-foreground">Submitted At</Label>
							<p class="font-medium mt-1">{{ formatDateTime(request.submittedAt) }}</p>
						</div>
					</div>
					<div>
						<Label class="text-muted-foreground flex items-center gap-2">
							Patient Consent
							<Icon v-if="request.patientConsent" name="lucide:check-circle" class="w-5 h-5 text-green-500" />
							<Icon v-else name="lucide:x-circle" class="w-5 h-5 text-red-500" />
						</Label>
						<p class="mt-1">{{ request.patientConsent ? 'Patient has consented to share their data' : 'Patient consent not verified' }}</p>
					</div>
				</CardContent>
			</Card>

			<!-- Encounters -->
			<Card v-if="request.encounters && request.encounters.length > 0">
				<CardHeader>
					<CardTitle>Related Encounters</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-2">
						<div v-for="(encounter, idx) in request.encounters" :key="encounter?.id || idx" class="p-3 border rounded-lg">
							<div class="flex items-start justify-between">
								<div>
									<p class="font-medium">Encounter #{{ idx + 1 }}</p>
									<p class="text-sm text-muted-foreground mt-1">
										Date: {{ formatDate(encounter?.date) }} at {{ encounter?.time || 'N/A' }}
									</p>
									<p class="text-sm mt-1">
										<span class="font-medium">Chief Complaint:</span> {{ encounter?.chiefComplaint || 'N/A' }}
									</p>
									<p v-if="encounter?.diagnosis" class="text-sm mt-1">
										<span class="font-medium">Diagnosis:</span> {{ encounter.diagnosis }}
									</p>
								</div>
								<Badge v-if="encounter?.disposition">{{ encounter.disposition }}</Badge>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Data Selection (For Approval) -->
			<Card v-if="request.status === 'SUBMITTED' || request.status === 'PENDING'">
				<CardHeader>
					<CardTitle>Select Data to Share</CardTitle>
					<CardDescription>
						Choose which patient particulars to include in the data share
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-3">
						<div class="flex items-center space-x-2">
							<Checkbox id="basic" v-model:checked="selectedData.basicInfo" />
							<Label for="basic" class="cursor-pointer">Basic Information (Name, DOB, Contact)</Label>
						</div>
						<div class="flex items-center space-x-2">
							<Checkbox id="medical" v-model:checked="selectedData.medicalHistory" />
							<Label for="medical" class="cursor-pointer">Medical History</Label>
						</div>
						<div class="flex items-center space-x-2">
							<Checkbox id="allergies" v-model:checked="selectedData.allergies" />
							<Label for="allergies" class="cursor-pointer">Allergies</Label>
						</div>
						<div class="flex items-center space-x-2">
							<Checkbox id="medications" v-model:checked="selectedData.medications" />
							<Label for="medications" class="cursor-pointer">Current Medications</Label>
						</div>
						<div class="flex items-center space-x-2">
							<Checkbox id="vitals" v-model:checked="selectedData.vitalSigns" />
							<Label for="vitals" class="cursor-pointer">Vital Signs</Label>
						</div>
						<div class="flex items-center space-x-2">
							<Checkbox id="labs" v-model:checked="selectedData.labResults" />
							<Label for="labs" class="cursor-pointer">Laboratory Results</Label>
						</div>
						<div class="flex items-center space-x-2">
							<Checkbox id="imaging" v-model:checked="selectedData.imagingResults" />
							<Label for="imaging" class="cursor-pointer">Imaging Results</Label>
						</div>
						<div class="flex items-center space-x-2">
							<Checkbox id="diagnosis" v-model:checked="selectedData.diagnosis" />
							<Label for="diagnosis" class="cursor-pointer">Diagnosis & Treatment Plan</Label>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Review Information (if reviewed) -->
			<Card v-if="request.status === 'APPROVED' || request.status === 'DENIED'">
				<CardHeader>
					<CardTitle>Review Information</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label class="text-muted-foreground">Reviewed By</Label>
							<p class="font-medium mt-1">{{ request.reviewedByStaff?.user?.firstName || 'N/A' }} {{ request.reviewedByStaff?.user?.lastName || '' }}</p>
						</div>
						<div>
							<Label class="text-muted-foreground">Reviewed At</Label>
							<p class="font-medium mt-1">{{ formatDateTime(request.reviewedAt) }}</p>
						</div>
					</div>
					<div v-if="request.denialReason">
						<Label class="text-muted-foreground">Denial Reason</Label>
						<p class="mt-1">{{ request.denialReason }}</p>
					</div>
					<div v-if="request.selectedData">
						<Label class="text-muted-foreground">Shared Data</Label>
						<div class="mt-2 flex flex-wrap gap-2">
							<Badge v-for="(value, key) in (request.selectedData as Record<string, any>)" :key="key" v-show="value">
								{{ formatDataKey(key as string) }}
							</Badge>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Action Buttons -->
			<Card v-if="request.status === 'SUBMITTED' || request.status === 'PENDING'">
				<CardContent class="p-6">
					<div class="flex gap-4">
						<Button
							@click="openApproveDialog"
							class="flex-1"
							:disabled="processing || !request.patientConsent"
						>
							<Icon name="lucide:check" class="w-4 h-4 mr-2" />
							Approve Request
						</Button>
						<Button
							@click="openDenyDialog"
							variant="destructive"
							class="flex-1"
							:disabled="processing"
						>
							<Icon name="lucide:x" class="w-4 h-4 mr-2" />
							Deny Request
						</Button>
					</div>
					<p v-if="!request.patientConsent" class="text-sm text-muted-foreground text-center mt-3">
						Cannot approve without patient consent
					</p>
				</CardContent>
			</Card>
		</div>

		<!-- Approve Dialog -->
		<Dialog v-model:open="showApproveDialog">
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Approve Data Share Request</DialogTitle>
					<DialogDescription>
						Confirm approval and data selection for this request
					</DialogDescription>
				</DialogHeader>

				<div class="py-4">
					<p class="text-sm text-muted-foreground mb-4">
						Selected data will be shared with {{ request?.hospitalName }}
					</p>
					<div class="p-4 bg-muted rounded-md">
						<p class="font-medium mb-2">Data to be shared:</p>
						<ul class="space-y-1 text-sm">
							<li v-if="selectedData.basicInfo">✓ Basic Information</li>
							<li v-if="selectedData.medicalHistory">✓ Medical History</li>
							<li v-if="selectedData.allergies">✓ Allergies</li>
							<li v-if="selectedData.medications">✓ Current Medications</li>
							<li v-if="selectedData.vitalSigns">✓ Vital Signs</li>
							<li v-if="selectedData.labResults">✓ Laboratory Results</li>
							<li v-if="selectedData.imagingResults">✓ Imaging Results</li>
							<li v-if="selectedData.diagnosis">✓ Diagnosis & Treatment Plan</li>
						</ul>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" @click="showApproveDialog = false" :disabled="processing">
						Cancel
					</Button>
					<Button @click="approveRequest" :disabled="processing || !hasSelectedData">
						<Icon v-if="processing" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
						Confirm Approval
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>

		<!-- Deny Dialog -->
		<Dialog v-model:open="showDenyDialog">
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Deny Data Share Request</DialogTitle>
					<DialogDescription>
						Please provide a reason for denying this request
					</DialogDescription>
				</DialogHeader>

				<div class="py-4">
					<Label for="denyReason">Reason for Denial *</Label>
					<Textarea
						id="denyReason"
						v-model="denyReason"
						placeholder="Enter the reason for denying this request..."
						rows="4"
						class="mt-2"
					/>
				</div>

				<DialogFooter>
					<Button variant="outline" @click="showDenyDialog = false" :disabled="processing">
						Cancel
					</Button>
					<Button variant="destructive" @click="denyRequest" :disabled="processing || !denyReason.trim()">
						<Icon v-if="processing" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
						Confirm Denial
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import { Checkbox } from '~/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Textarea } from '~/components/ui/textarea'
import { toast } from 'vue-sonner'
import { useAuthStore } from '~/stores/app/useAuthStore'

definePageMeta({
	layout: 'staff',
	middleware: ['staff-type']
})

const route = useRoute()
const router = useRouter()
const { $trpc } = useNuxtApp()
const authStore = useAuthStore()

const loading = ref(false)
const processing = ref(false)
const request = ref<any>(null)
const showApproveDialog = ref(false)
const showDenyDialog = ref(false)
const denyReason = ref('')

const selectedData = reactive({
	basicInfo: true,
	medicalHistory: false,
	allergies: false,
	medications: false,
	vitalSigns: false,
	labResults: false,
	imagingResults: false,
	diagnosis: false
})

const hasSelectedData = computed(() => {
	return Object.values(selectedData).some(v => v === true)
})

onMounted(() => {
	loadRequest()
})

useHead(() => ({
	title: `Request #${request.value?.requestNumber || route.params.id} - Data Share`
}))

async function loadRequest() {
	loading.value = true
	try {
		const response = await $trpc.dataShare.getRequest.query({
			id: route.params.id as string
		})

		if (response.success) {
			request.value = response.data
		} else {
			toast.error('Error', {
				description: 'Failed to load request'
			})
		}
	} catch (error: any) {
		console.error('Error loading request:', error)
		toast.error('Error', {
			description: 'Failed to load data share request'
		})
	} finally {
		loading.value = false
	}
}

function openApproveDialog() {
	if (!request.value?.patientConsent) {
		toast.error('Cannot Approve', {
			description: 'Patient consent is required before approving the request'
		})
		return
	}
	showApproveDialog.value = true
}

function openDenyDialog() {
	denyReason.value = ''
	showDenyDialog.value = true
}

async function approveRequest() {
	if (!hasSelectedData.value) {
		toast.error('Selection Required', {
			description: 'Please select at least one data category to share'
		})
		return
	}

	processing.value = true
	try {
		const response = await $trpc.dataShare.approveRequest.mutate({
			id: request.value.id,
			reviewedBy: authStore.user?.id as string,
			selectedData: { ...selectedData }
		})

		if (response.success) {
			toast.success('Request Approved', {
				description: 'The data share request has been approved successfully'
			})
			showApproveDialog.value = false
			await loadRequest()
		} else {
			throw new Error(response.message || 'Failed to approve request')
		}
	} catch (error: any) {
		console.error('Error approving request:', error)
		toast.error('Approval Failed', {
			description: error.message || 'Failed to approve the request'
		})
	} finally {
		processing.value = false
	}
}

async function denyRequest() {
	if (!denyReason.value.trim()) {
		toast.error('Reason Required', {
			description: 'Please provide a reason for denying the request'
		})
		return
	}

	processing.value = true
	try {
		const response = await $trpc.dataShare.denyRequest.mutate({
			id: request.value.id,
			reviewedBy: authStore.user?.id as string,
			denialReason: denyReason.value.trim()
		})

		if (response.success) {
			toast.success('Request Denied', {
				description: 'The data share request has been denied'
			})
			showDenyDialog.value = false
			await loadRequest()
		} else {
			throw new Error(response.message || 'Failed to deny request')
		}
	} catch (error: any) {
		console.error('Error denying request:', error)
		toast.error('Denial Failed', {
			description: error.message || 'Failed to deny the request'
		})
	} finally {
		processing.value = false
	}
}

function getStatusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
	const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
		PENDING: 'outline',
		SUBMITTED: 'default',
		APPROVED: 'default',
		DENIED: 'destructive',
		ACCESSED: 'secondary',
		EXPIRED: 'outline'
	}
	return variants[status] || 'default'
}

function formatDate(dateStr: string | null) {
	if (!dateStr) return 'N/A'
	const date = new Date(dateStr)
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
}

function formatDateTime(dateStr: string | null) {
	if (!dateStr) return 'N/A'
	const date = new Date(dateStr)
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
}

function formatDataKey(key: string) {
	return key
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, str => str.toUpperCase())
		.trim()
}
</script>
