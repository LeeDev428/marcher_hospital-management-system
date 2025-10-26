<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Insurance Claim Details</h1>
				<p class="text-muted-foreground">Manage and submit insurance claim</p>
			</div>
			<Button @click="$router.back()" variant="outline">
				<Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
				Back
			</Button>
		</div>

		<!-- Loading State -->
		<div v-if="loading" class="text-center py-12">
			<Icon name="lucide:loader-2" class="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
			<p class="text-sm text-gray-500">Loading claim details...</p>
		</div>

		<!-- Main Content -->
		<div v-else-if="claim" class="space-y-6">
			<!-- Claim Overview -->
			<Card>
				<CardHeader>
					<div class="flex items-center justify-between">
						<div>
							<CardTitle>{{ claim.claimNumber }}</CardTitle>
							<CardDescription>Created on {{ formatDate(claim.createdAt) }}</CardDescription>
						</div>
						<Badge :class="getStatusColor(claim.status)">
							{{ claim.status }}
						</Badge>
					</div>
				</CardHeader>
				<CardContent class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<Label class="text-muted-foreground">Patient</Label>
						<p class="font-medium">{{ claim.patient.user.firstName }} {{ claim.patient.user.lastName }}</p>
						<p class="text-sm text-muted-foreground">{{ claim.patient.patientNumber }}</p>
					</div>
					<div>
						<Label class="text-muted-foreground">Insurance Provider</Label>
						<p class="font-medium">{{ claim.insuranceProvider }}</p>
						<p class="text-sm text-muted-foreground" v-if="claim.insuranceNumber">{{ claim.insuranceNumber }}</p>
					</div>
					<div>
						<Label class="text-muted-foreground">Claim Amount</Label>
						<p class="text-2xl font-bold text-green-600">₱{{ formatAmount(claim.claimAmount) }}</p>
						<p class="text-sm text-muted-foreground" v-if="claim.approvedAmount">
							Approved: ₱{{ formatAmount(claim.approvedAmount) }}
						</p>
					</div>
				</CardContent>
			</Card>

			<!-- Encounter Details -->
			<Card>
				<CardHeader>
					<CardTitle>Encounter Information</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label class="text-muted-foreground">Encounter Type</Label>
							<p class="font-medium capitalize">{{ claim.inpatientEncounter ? 'Inpatient' : 'Outpatient' }}</p>
						</div>
						<div v-if="encounter">
							<Label class="text-muted-foreground">Date & Time</Label>
							<p class="font-medium">{{ encounter.date }} {{ encounter.time }}</p>
						</div>
						<div v-if="encounter">
							<Label class="text-muted-foreground">Chief Complaint</Label>
							<p class="font-medium">{{ encounter.chiefComplaint }}</p>
						</div>
						<div v-if="encounter?.doctorDiagnosis">
							<Label class="text-muted-foreground">Diagnosis</Label>
							<p class="font-medium">{{ encounter.doctorDiagnosis }}</p>
						</div>
					</div>
					<div v-if="claim.billingStaffNotes">
						<Label class="text-muted-foreground">Billing Staff Notes</Label>
						<p class="text-sm">{{ claim.billingStaffNotes }}</p>
					</div>
				</CardContent>
			</Card>

			<!-- Documents -->
			<Card>
				<CardHeader>
					<div class="flex items-center justify-between">
						<div>
							<CardTitle>Uploaded Documents</CardTitle>
							<CardDescription>{{ claim.documents.length }} document(s) attached</CardDescription>
						</div>
						<Button 
							v-if="claim.status === 'PENDING'" 
							@click="showAddDocuments = true"
							size="sm"
						>
							<Icon name="lucide:plus" class="w-4 h-4 mr-2" />
							Add More
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div v-if="claim.documents.length === 0" class="text-center py-8 text-muted-foreground">
						<Icon name="lucide:file-x" class="w-12 h-12 mx-auto mb-2 opacity-50" />
						<p>No documents uploaded yet</p>
					</div>
					<div v-else class="space-y-2">
						<div
							v-for="doc in claim.documents"
							:key="doc.id"
							class="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
						>
							<Icon :name="getFileIcon(doc.mimeType)" class="w-8 h-8 text-blue-600" />
							<div class="flex-1 min-w-0">
								<p class="font-medium">{{ doc.documentType }}</p>
								<div class="flex items-center gap-3 text-xs text-muted-foreground">
									<span>{{ doc.fileName }}</span>
									<span>{{ formatFileSize(doc.fileSize) }}</span>
									<span>Uploaded {{ formatDate(doc.uploadedAt) }}</span>
								</div>
							</div>
							<Button @click="downloadDocument(doc)" variant="ghost" size="sm">
								<Icon name="lucide:download" class="w-4 h-4" />
							</Button>
							<Button
								v-if="claim.status === 'PENDING'"
								@click="deleteDocument(doc.id)"
								variant="ghost"
								size="sm"
							>
								<Icon name="lucide:trash-2" class="w-4 h-4 text-red-600" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Submit to Insurance (Only for PENDING) -->
			<Card v-if="claim.status === 'PENDING'">
				<CardHeader>
					<CardTitle>Submit to Insurance Company</CardTitle>
					<CardDescription>Send this claim to insurance company for review</CardDescription>
				</CardHeader>
				<CardContent class="space-y-4">
					<div>
						<Label>Insurance Company Email *</Label>
						<Input 
							v-model="submitForm.insuranceEmail"
							type="email"
							placeholder="claims@insurance.com"
							:disabled="submitting"
						/>
					</div>
					<div>
						<Label>Token Expiration (Days)</Label>
						<Input 
							v-model.number="submitForm.expirationDays"
							type="number"
							min="1"
							max="30"
							:disabled="submitting"
						/>
						<p class="text-xs text-muted-foreground mt-1">
							Insurance company will have {{ submitForm.expirationDays }} days to review this claim
						</p>
					</div>
					<Button 
						@click="submitToInsurance" 
						:disabled="!canSubmit || submitting"
						class="w-full"
						size="lg"
					>
						<Icon v-if="!submitting" name="lucide:send" class="w-4 h-4 mr-2" />
						<Icon v-else name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
						{{ submitting ? 'Submitting...' : 'Submit to Insurance' }}
					</Button>
				</CardContent>
			</Card>

			<!-- Resend Token (For SUBMITTED/UNDER_REVIEW) -->
			<Card v-if="['SUBMITTED', 'UNDER_REVIEW'].includes(claim.status) && claim.token">
				<CardHeader>
					<CardTitle>Access Token</CardTitle>
					<CardDescription>Insurance company access information</CardDescription>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
						<div class="flex items-start gap-3">
							<Icon name="lucide:info" class="w-5 h-5 text-blue-600 mt-0.5" />
							<div class="flex-1">
								<p class="font-medium text-blue-900">Token sent to: {{ claim.token.insuranceEmail }}</p>
								<p class="text-sm text-blue-700 mt-1">
									Expires: {{ formatDate(claim.token.expiresAt) }}
								</p>
								<p class="text-sm text-blue-700">
									Last accessed: {{ claim.token.lastAccessedAt ? formatDate(claim.token.lastAccessedAt) : 'Never' }}
								</p>
							</div>
						</div>
					</div>
					<div class="flex gap-3">
						<Button @click="resendToken" :disabled="resending" variant="outline" class="flex-1">
							<Icon v-if="!resending" name="lucide:mail" class="w-4 h-4 mr-2" />
							<Icon v-else name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
							Resend Email
						</Button>
						<Button @click="copyTokenLink" variant="outline" class="flex-1">
							<Icon name="lucide:copy" class="w-4 h-4 mr-2" />
							Copy Link
						</Button>
					</div>
				</CardContent>
			</Card>

			<!-- Review Details (For APPROVED/DENIED) -->
			<Card v-if="['APPROVED', 'DENIED'].includes(claim.status)">
				<CardHeader>
					<CardTitle>Insurance Review</CardTitle>
					<CardDescription>Decision from insurance company</CardDescription>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label class="text-muted-foreground">Decision</Label>
							<Badge :class="getStatusColor(claim.status)" class="mt-1">
								{{ claim.status }}
							</Badge>
						</div>
						<div v-if="claim.approvedAmount">
							<Label class="text-muted-foreground">Approved Amount</Label>
							<p class="text-2xl font-bold text-green-600">₱{{ formatAmount(claim.approvedAmount) }}</p>
						</div>
						<div v-if="claim.reviewedAt">
							<Label class="text-muted-foreground">Reviewed Date</Label>
							<p class="font-medium">{{ formatDate(claim.reviewedAt) }}</p>
						</div>
						<div v-if="claim.reviewerEmail">
							<Label class="text-muted-foreground">Reviewed By</Label>
							<p class="font-medium">{{ claim.reviewerEmail }}</p>
						</div>
					</div>
					<div v-if="claim.denialReason">
						<Label class="text-muted-foreground">Denial Reason</Label>
						<p class="text-sm bg-red-50 border border-red-200 rounded p-3">{{ claim.denialReason }}</p>
					</div>
					<div v-if="claim.insuranceNotes">
						<Label class="text-muted-foreground">Insurance Notes</Label>
						<p class="text-sm bg-gray-50 border rounded p-3">{{ claim.insuranceNotes }}</p>
					</div>
				</CardContent>
			</Card>

			<!-- Cancel Claim -->
			<Card v-if="!['APPROVED', 'DENIED', 'CANCELLED'].includes(claim.status)">
				<CardHeader>
					<CardTitle class="text-red-600">Cancel Claim</CardTitle>
					<CardDescription>Permanently cancel this insurance claim</CardDescription>
				</CardHeader>
				<CardContent>
					<Button @click="cancelClaim" variant="destructive" :disabled="cancelling">
						<Icon v-if="!cancelling" name="lucide:x-circle" class="w-4 h-4 mr-2" />
						<Icon v-else name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
						{{ cancelling ? 'Cancelling...' : 'Cancel Claim' }}
					</Button>
				</CardContent>
			</Card>

		</div>

		<!-- Error State -->
		<div v-else class="text-center py-12">
			<Icon name="lucide:alert-circle" class="w-16 h-16 mx-auto mb-4 text-red-400" />
			<p class="text-lg font-medium">Claim Not Found</p>
			<p class="text-sm text-muted-foreground mt-2">The insurance claim you're looking for doesn't exist.</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'

definePageMeta({
	layout: 'billing-staff',
})

const route = useRoute()
const router = useRouter()
const { $trpc } = useNuxtApp()

const claimId = route.params.id as string

const claim = ref<any>(null)
const encounter = ref<any>(null)
const loading = ref(true)
const submitting = ref(false)
const resending = ref(false)
const cancelling = ref(false)
const showAddDocuments = ref(false)

const submitForm = ref({
	insuranceEmail: '',
	expirationDays: 7,
})

const canSubmit = computed(() => {
	return submitForm.value.insuranceEmail.trim() !== '' &&
	       submitForm.value.expirationDays > 0 &&
	       claim.value?.documents.length > 0
})

onMounted(async () => {
	await loadClaim()
})

async function loadClaim() {
	loading.value = true
	try {
		const response = await $trpc.insurance.getClaimById.query({ claimId })
		
		if (response.success && response.data) {
			claim.value = response.data
			
			// Load encounter details
			const encounterId = claim.value.inpatientEncounterId || claim.value.outpatientEncounterId
			const encounterType = claim.value.inpatientEncounter ? 'inpatient' : 'outpatient'
			
			if (encounterType === 'inpatient') {
				const encounterResponse = await $trpc.encounters.inpatient.getInpatientEncounter.query({
					id: encounterId
				})
				if (encounterResponse.success && encounterResponse.data) {
					encounter.value = encounterResponse.data
				}
			} else {
				const encounterResponse = await $trpc.encounters.outpatient.getOutpatientEncounter.query({
					id: encounterId
				})
				if (encounterResponse.success && encounterResponse.data) {
					encounter.value = encounterResponse.data
				}
			}
		}
	} catch (error) {
		console.error('Failed to load claim:', error)
	} finally {
		loading.value = false
	}
}

async function submitToInsurance() {
	if (!canSubmit.value || submitting.value) return
	
	submitting.value = true
	try {
		const response = await $trpc.insurance.submitClaim.mutate({
			claimId,
			recipientEmail: submitForm.value.insuranceEmail,
			expirationDays: submitForm.value.expirationDays,
		})
		
		if (response.success) {
			useToast('success', 'Success', 'Claim submitted to insurance company. Email sent.')
			await loadClaim() // Reload to show new status
		} else {
			throw new Error(response.message)
		}
	} catch (error: any) {
		console.error('Failed to submit claim:', error)
		useToast('error', 'Error', error.message || 'Failed to submit claim')
	} finally {
		submitting.value = false
	}
}

async function resendToken() {
	if (resending.value || !claim.value?.token) return
	
	resending.value = true
	try {
		// Re-submit with same email
		const response = await $trpc.insurance.submitClaim.mutate({
			claimId,
			insuranceEmail: claim.value.token.insuranceEmail,
			expirationDays: 7,
		})
		
		if (response.success) {
			useToast('success', 'Success', 'Email resent to insurance company')
			await loadClaim()
		} else {
			throw new Error(response.message)
		}
	} catch (error: any) {
		console.error('Failed to resend token:', error)
		useToast('error', 'Error', error.message || 'Failed to resend email')
	} finally {
		resending.value = false
	}
}

function copyTokenLink() {
	if (!claim.value?.token) return
	
	const origin = window.location.origin
	const link = `${origin}/insurance-guess?token=${claim.value.token.token}`
	
	navigator.clipboard.writeText(link).then(() => {
		useToast('success', 'Copied', 'Link copied to clipboard')
	}).catch(() => {
		useToast('error', 'Error', 'Failed to copy link')
	})
}

async function deleteDocument(documentId: string) {
	if (!confirm('Are you sure you want to delete this document?')) return
	
	try {
		const response = await $trpc.insurance.deleteDocument.mutate({ documentId })
		
		if (response.success) {
			useToast('success', 'Success', 'Document deleted')
			await loadClaim()
		} else {
			throw new Error(response.message)
		}
	} catch (error: any) {
		console.error('Failed to delete document:', error)
		useToast('error', 'Error', error.message || 'Failed to delete document')
	}
}

async function cancelClaim() {
	if (!confirm('Are you sure you want to cancel this claim? This action cannot be undone.')) return
	
	cancelling.value = true
	try {
		const response = await $trpc.insurance.cancelClaim.mutate({ claimId })
		
		if (response.success) {
			useToast('success', 'Success', 'Claim cancelled')
			router.push('/billing_staff/insurance')
		} else {
			throw new Error(response.message)
		}
	} catch (error: any) {
		console.error('Failed to cancel claim:', error)
		useToast('error', 'Error', error.message || 'Failed to cancel claim')
	} finally {
		cancelling.value = false
	}
}

function downloadDocument(doc: any) {
	// In a real app, this would download from cloud storage
	// For now, open data URL in new tab
	window.open(doc.fileUrl, '_blank')
}

function getStatusColor(status: string): string {
	const colors: Record<string, string> = {
		PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
		SUBMITTED: 'bg-blue-100 text-blue-800 border-blue-300',
		UNDER_REVIEW: 'bg-purple-100 text-purple-800 border-purple-300',
		APPROVED: 'bg-green-100 text-green-800 border-green-300',
		DENIED: 'bg-red-100 text-red-800 border-red-300',
		CANCELLED: 'bg-gray-100 text-gray-800 border-gray-300',
	}
	return colors[status] || 'bg-gray-100 text-gray-800'
}

function getFileIcon(mimeType: string): string {
	if (mimeType.startsWith('image/')) return 'lucide:file-image'
	if (mimeType === 'application/pdf') return 'lucide:file-text'
	if (mimeType.includes('word')) return 'lucide:file-text'
	return 'lucide:file'
}

function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes'
	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

function formatAmount(amount: number): string {
	return amount.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
}

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}
</script>
