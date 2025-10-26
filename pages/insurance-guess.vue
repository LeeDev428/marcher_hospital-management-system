<template>
	<div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
		<div class="container mx-auto p-6">
			<!-- Header -->
			<div class="bg-white shadow-lg rounded-lg p-6 mb-6">
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
						<Icon name="lucide:shield-check" class="w-6 h-6 text-white" />
					</div>
					<div>
						<h1 class="text-2xl font-bold text-gray-900">Insurance Claim Review Portal</h1>
						<p class="text-sm text-muted-foreground">Secure access for insurance companies</p>
					</div>
				</div>
			</div>

			<!-- Loading State -->
			<div v-if="loading" class="text-center py-20">
				<Icon name="lucide:loader-2" class="w-16 h-16 mx-auto mb-4 text-green-600 animate-spin" />
				<p class="text-lg font-medium">Verifying access token...</p>
				<p class="text-sm text-muted-foreground mt-2">Please wait while we validate your credentials</p>
			</div>

			<!-- Error State -->
			<div v-else-if="error" class="max-w-2xl mx-auto">
				<Card class="border-red-200">
					<CardContent class="pt-6 text-center py-12">
						<Icon name="lucide:alert-circle" class="w-16 h-16 mx-auto mb-4 text-red-500" />
						<h2 class="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
						<p class="text-gray-600 mb-6">{{ errorMessage }}</p>
						<div class="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
							<h3 class="font-semibold text-red-900 mb-2">Common Issues:</h3>
							<ul class="text-sm text-red-800 space-y-1">
								<li>• The access token has expired</li>
								<li>• The claim has already been reviewed</li>
								<li>• The token link was copied incorrectly</li>
								<li>• The claim has been cancelled</li>
							</ul>
						</div>
						<p class="text-sm text-muted-foreground mt-6">
							Please contact the hospital billing staff for assistance.
						</p>
					</CardContent>
				</Card>
			</div>

			<!-- Main Content -->
			<div v-else-if="claim" class="max-w-6xl mx-auto space-y-6">
				<!-- Claim Info Header -->
				<Card class="border-green-200 bg-white">
					<CardHeader>
						<div class="flex items-center justify-between">
							<div>
								<CardTitle class="text-2xl">{{ claim.claimNumber }}</CardTitle>
								<CardDescription>Submitted on {{ formatDate(claim.submittedAt) }}</CardDescription>
							</div>
							<Badge class="bg-blue-100 text-blue-800 border-blue-300 text-base px-4 py-2">
								{{ claim.status }}
							</Badge>
						</div>
					</CardHeader>
					<CardContent class="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div>
							<Label class="text-muted-foreground">Insurance Provider</Label>
							<p class="text-lg font-semibold">{{ claim.insuranceProvider }}</p>
							<p class="text-sm text-muted-foreground" v-if="claim.insuranceNumber">
								Policy: {{ claim.insuranceNumber }}
							</p>
						</div>
						<div>
							<Label class="text-muted-foreground">Patient Information</Label>
							<p class="text-lg font-semibold">
								{{ claim.patient.user.firstName }} {{ claim.patient.user.lastName }}
							</p>
							<p class="text-sm text-muted-foreground">{{ claim.patient.patientNumber }}</p>
						</div>
						<div>
							<Label class="text-muted-foreground">Claim Amount</Label>
							<p class="text-3xl font-bold text-green-600">₱{{ formatAmount(claim.claimAmount) }}</p>
						</div>
					</CardContent>
				</Card>

				<!-- Encounter Details -->
				<Card>
					<CardHeader>
						<CardTitle>Medical Encounter Details</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label class="text-muted-foreground">Encounter Type</Label>
								<p class="font-medium capitalize">
									{{ claim.inpatientEncounter ? 'Inpatient (Admitted)' : 'Outpatient (Consultation)' }}
								</p>
							</div>
							<div v-if="encounter">
								<Label class="text-muted-foreground">Encounter Date</Label>
								<p class="font-medium">{{ encounter.date }} {{ encounter.time }}</p>
							</div>
							<div v-if="encounter?.chiefComplaint">
								<Label class="text-muted-foreground">Chief Complaint</Label>
								<p class="font-medium">{{ encounter.chiefComplaint }}</p>
							</div>
							<div v-if="encounter?.doctorDiagnosis">
								<Label class="text-muted-foreground">Doctor's Diagnosis</Label>
								<p class="font-medium">{{ encounter.doctorDiagnosis }}</p>
							</div>
						</div>
						<div v-if="claim.billingStaffNotes" class="pt-4 border-t">
							<Label class="text-muted-foreground">Billing Staff Notes</Label>
							<p class="text-sm bg-gray-50 border rounded p-3 mt-2">{{ claim.billingStaffNotes }}</p>
						</div>
					</CardContent>
				</Card>

				<!-- Documents Section -->
				<Card>
					<CardHeader>
						<CardTitle>Medical Documents ({{ claim.documents.length }})</CardTitle>
						<CardDescription>Click on any document to view or download</CardDescription>
					</CardHeader>
					<CardContent>
						<div v-if="claim.documents.length === 0" class="text-center py-8 text-muted-foreground">
							<Icon name="lucide:file-x" class="w-12 h-12 mx-auto mb-2 opacity-50" />
							<p>No documents attached to this claim</p>
						</div>
						<div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div
								v-for="doc in claim.documents"
								:key="doc.id"
								@click="viewDocument(doc)"
								class="flex items-center gap-3 p-4 border-2 rounded-lg hover:bg-green-50 hover:border-green-300 cursor-pointer transition-all"
							>
								<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
									<Icon :name="getFileIcon(doc.mimeType)" class="w-6 h-6 text-blue-600" />
								</div>
								<div class="flex-1 min-w-0">
									<p class="font-semibold">{{ doc.documentType }}</p>
									<p class="text-xs text-muted-foreground truncate">{{ doc.fileName }}</p>
									<div class="flex items-center gap-3 text-xs text-muted-foreground mt-1">
										<span>{{ formatFileSize(doc.fileSize) }}</span>
										<span>{{ formatDate(doc.uploadedAt) }}</span>
									</div>
								</div>
								<Icon name="lucide:download" class="w-5 h-5 text-gray-400" />
							</div>
						</div>
					</CardContent>
				</Card>

				<!-- Review Form -->
				<Card v-if="!reviewed" class="border-green-300 bg-green-50">
					<CardHeader>
						<CardTitle class="text-green-900">Submit Your Review</CardTitle>
						<CardDescription class="text-green-700">
							Please review all documents and provide your decision
						</CardDescription>
					</CardHeader>
					<CardContent class="space-y-6">
						<!-- Decision -->
						<div>
							<Label class="text-base font-semibold mb-3 block">Decision *</Label>
							<div class="flex gap-4">
								<button
									@click="reviewForm.decision = 'APPROVED'"
									:class="[
										'flex-1 p-4 border-2 rounded-lg text-center font-semibold transition-all',
										reviewForm.decision === 'APPROVED'
											? 'border-green-500 bg-green-100 text-green-900'
											: 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
									]"
									:disabled="submittingReview"
								>
									<Icon name="lucide:check-circle" class="w-6 h-6 mx-auto mb-1" />
									Approve
								</button>
								<button
									@click="reviewForm.decision = 'DENIED'"
									:class="[
										'flex-1 p-4 border-2 rounded-lg text-center font-semibold transition-all',
										reviewForm.decision === 'DENIED'
											? 'border-red-500 bg-red-100 text-red-900'
											: 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
									]"
									:disabled="submittingReview"
								>
									<Icon name="lucide:x-circle" class="w-6 h-6 mx-auto mb-1" />
									Deny
								</button>
							</div>
						</div>

						<!-- Approved Amount (if approve) -->
						<div v-if="reviewForm.decision === 'APPROVED'">
							<Label>Approved Amount *</Label>
							<Input 
								v-model.number="reviewForm.approvedAmount"
								type="number"
								step="0.01"
								placeholder="0.00"
								:disabled="submittingReview"
								class="bg-white"
							/>
							<p class="text-xs text-muted-foreground mt-1">
								Original claim amount: ₱{{ formatAmount(claim.claimAmount) }}
							</p>
						</div>

						<!-- Denial Reason (if deny) -->
						<div v-if="reviewForm.decision === 'DENIED'">
							<Label>Denial Reason *</Label>
							<textarea 
								v-model="reviewForm.denialReason"
								class="w-full min-h-[100px] rounded-md border border-input bg-white px-3 py-2 text-sm"
								placeholder="Please explain why this claim is being denied..."
								:disabled="submittingReview"
							/>
						</div>

						<!-- Insurance Notes -->
						<div>
							<Label>Additional Notes</Label>
							<textarea 
								v-model="reviewForm.insuranceNotes"
								class="w-full min-h-[100px] rounded-md border border-input bg-white px-3 py-2 text-sm"
								placeholder="Any additional comments or notes..."
								:disabled="submittingReview"
							/>
						</div>

						<!-- Reviewer Email -->
						<div>
							<Label>Your Email Address *</Label>
							<Input 
								v-model="reviewForm.reviewerEmail"
								type="email"
								placeholder="reviewer@insurance.com"
								:disabled="submittingReview"
								class="bg-white"
							/>
							<p class="text-xs text-muted-foreground mt-1">
								For record keeping and follow-up communication
							</p>
						</div>

						<!-- Submit Button -->
						<Button 
							@click="submitReview" 
							:disabled="!canSubmitReview || submittingReview"
							class="w-full bg-green-600 hover:bg-green-700"
							size="lg"
						>
							<Icon v-if="!submittingReview" name="lucide:send" class="w-5 h-5 mr-2" />
							<Icon v-else name="lucide:loader-2" class="w-5 h-5 mr-2 animate-spin" />
							{{ submittingReview ? 'Submitting Review...' : 'Submit Review' }}
						</Button>

						<p class="text-xs text-center text-muted-foreground">
							By submitting this review, you confirm that you have reviewed all documents and your decision is final.
						</p>
					</CardContent>
				</Card>

				<!-- Already Reviewed -->
				<Card v-else class="border-green-300 bg-green-50">
					<CardContent class="pt-6 text-center py-12">
						<Icon name="lucide:check-circle-2" class="w-16 h-16 mx-auto mb-4 text-green-600" />
						<h2 class="text-2xl font-bold text-green-900 mb-2">Review Submitted Successfully</h2>
						<p class="text-green-700 mb-4">
							Thank you for reviewing this insurance claim. Your decision has been recorded.
						</p>
						<div class="bg-white border border-green-200 rounded-lg p-6 max-w-md mx-auto text-left">
							<div class="space-y-3">
								<div>
									<Label class="text-muted-foreground">Decision</Label>
									<Badge :class="reviewForm.decision === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
										{{ reviewForm.decision }}
									</Badge>
								</div>
								<div v-if="reviewForm.approvedAmount">
									<Label class="text-muted-foreground">Approved Amount</Label>
									<p class="text-2xl font-bold text-green-600">₱{{ formatAmount(reviewForm.approvedAmount) }}</p>
								</div>
								<div v-if="reviewForm.denialReason">
									<Label class="text-muted-foreground">Denial Reason</Label>
									<p class="text-sm">{{ reviewForm.denialReason }}</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
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
	layout: 'auth', // Use auth layout (no sidebar)
})

const route = useRoute()
const { $trpc } = useNuxtApp()

const token = route.query.token as string

const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')
const claim = ref<any>(null)
const encounter = ref<any>(null)
const submittingReview = ref(false)
const reviewed = ref(false)

const reviewForm = ref({
	decision: '' as 'APPROVED' | 'DENIED' | '',
	approvedAmount: 0,
	denialReason: '',
	insuranceNotes: '',
	reviewerEmail: '',
})

const canSubmitReview = computed(() => {
	if (!reviewForm.value.decision || !reviewForm.value.reviewerEmail) return false
	if (reviewForm.value.decision === 'APPROVED' && reviewForm.value.approvedAmount <= 0) return false
	if (reviewForm.value.decision === 'DENIED' && !reviewForm.value.denialReason.trim()) return false
	return true
})

onMounted(async () => {
	if (!token) {
		error.value = true
		errorMessage.value = 'No access token provided. Please use the link from your email.'
		loading.value = false
		return
	}

	await verifyAndLoadClaim()
})

async function verifyAndLoadClaim() {
	loading.value = true
	error.value = false

	try {
		const response = await $trpc.insurance.verifyToken.query({ token })

		if (!response.success) {
			throw new Error(response.message || 'Invalid or expired token')
		}

		claim.value = response.data

		// Pre-fill approved amount with claim amount
		reviewForm.value.approvedAmount = claim.value.claimAmount

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
	} catch (err: any) {
		console.error('Failed to verify token:', err)
		error.value = true
		errorMessage.value = err.message || 'Failed to verify access token'
	} finally {
		loading.value = false
	}
}

async function submitReview() {
	if (!canSubmitReview.value || submittingReview.value) return

	submittingReview.value = true
	try {
		const response = await $trpc.insurance.reviewClaim.mutate({
			token,
			decision: reviewForm.value.decision as 'APPROVED' | 'DENIED',
			approvedAmount: reviewForm.value.decision === 'APPROVED' ? Number(reviewForm.value.approvedAmount) : undefined,
			denialReason: reviewForm.value.decision === 'DENIED' ? reviewForm.value.denialReason : undefined,
			insuranceNotes: reviewForm.value.insuranceNotes || undefined,
			reviewerEmail: reviewForm.value.reviewerEmail,
		})

		if (response.success) {
			reviewed.value = true
			// Scroll to top
			window.scrollTo({ top: 0, behavior: 'smooth' })
		} else {
			throw new Error(response.message)
		}
	} catch (err: any) {
		console.error('Failed to submit review:', err)
		alert('Error: ' + (err.message || 'Failed to submit review. Please try again.'))
	} finally {
		submittingReview.value = false
	}
}

function viewDocument(doc: any) {
	// Open document in new tab
	window.open(doc.fileUrl, '_blank')
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
