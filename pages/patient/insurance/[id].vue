<template>
	<div class="space-y-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<Button @click="$router.back()" variant="outline" size="sm">
					<Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
					Back
				</Button>
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Insurance Claim Details</h1>
					<p class="text-gray-600 mt-1">Claim #{{ claim?.claimNumber }}</p>
				</div>
			</div>
			<div v-if="claim">
				<span 
					:class="getStatusBadgeClass(claim.status)"
					class="px-4 py-2 text-sm font-medium rounded-full"
				>
					{{ claim.status }}
				</span>
			</div>
		</div>

		<!-- Loading State -->
		<div v-if="loading" class="text-center py-12">
			<Icon name="lucide:loader-2" class="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
			<p class="text-sm text-gray-500">Loading claim details...</p>
		</div>

		<!-- Main Content -->
		<div v-else-if="claim" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Left Column - Claim Details -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Claim Information -->
				<Card>
					<CardHeader>
						<CardTitle>Claim Information</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Label class="text-gray-600">Insurance Provider</Label>
								<p class="font-medium text-lg">{{ claim.insuranceProvider }}</p>
							</div>
							<div>
								<Label class="text-gray-600">Claim Status</Label>
								<p class="font-medium text-lg">{{ claim.status }}</p>
							</div>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div v-if="claim.insuranceNumber">
								<Label class="text-gray-600">Insurance Number</Label>
								<p class="font-medium">{{ claim.insuranceNumber }}</p>
							</div>
							<div v-if="claim.policyNumber">
								<Label class="text-gray-600">Policy Number</Label>
								<p class="font-medium">{{ claim.policyNumber }}</p>
							</div>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<Label class="text-gray-600">Claim Amount</Label>
								<p class="text-2xl font-bold text-blue-600">₱{{ formatAmount(claim.claimAmount) }}</p>
							</div>
							<div v-if="claim.approvedAmount">
								<Label class="text-gray-600">Approved Amount</Label>
								<p class="text-2xl font-bold text-green-600">₱{{ formatAmount(claim.approvedAmount) }}</p>
							</div>
						</div>

						<div v-if="claim.billingStaffNotes">
							<Label class="text-gray-600">Billing Staff Notes</Label>
							<p class="text-sm bg-gray-50 p-3 rounded-md">{{ claim.billingStaffNotes }}</p>
						</div>

						<div v-if="claim.insuranceNotes">
							<Label class="text-gray-600">Insurance Company Notes</Label>
							<p class="text-sm bg-blue-50 p-3 rounded-md text-blue-900">{{ claim.insuranceNotes }}</p>
						</div>

						<div v-if="claim.denialReason">
							<Label class="text-red-600">Denial Reason</Label>
							<p class="text-sm bg-red-50 p-3 rounded-md text-red-900">{{ claim.denialReason }}</p>
						</div>
					</CardContent>
				</Card>

				<!-- Encounter Details -->
				<Card>
					<CardHeader>
						<CardTitle>Medical Encounter Details</CardTitle>
					</CardHeader>
					<CardContent>
						<div v-if="encounter" class="space-y-4">
							<div>
								<Label class="text-gray-600">Encounter Type</Label>
								<p class="font-medium capitalize">{{ encounterType }}</p>
							</div>
							<div class="grid grid-cols-2 gap-4">
								<div>
									<Label class="text-gray-600">Date</Label>
									<p class="font-medium">{{ encounter.date }}</p>
								</div>
								<div v-if="encounter.time">
									<Label class="text-gray-600">Time</Label>
									<p class="font-medium">{{ encounter.time }}</p>
								</div>
							</div>
							<div>
								<Label class="text-gray-600">Chief Complaint</Label>
								<p class="font-medium">{{ encounter.chiefComplaint }}</p>
							</div>
							<div v-if="encounter.doctorDiagnosis">
								<Label class="text-gray-600">Diagnosis</Label>
								<p class="font-medium">{{ encounter.doctorDiagnosis }}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<!-- Documents -->
				<Card>
					<CardHeader>
						<CardTitle>Submitted Documents</CardTitle>
						<CardDescription>All documents submitted for this claim</CardDescription>
					</CardHeader>
					<CardContent>
						<div v-if="claim.documents && claim.documents.length > 0" class="space-y-2">
							<div
								v-for="doc in claim.documents"
								:key="doc.id"
								class="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
							>
								<Icon 
									:name="getFileIcon(doc.mimeType)" 
									class="w-8 h-8 text-blue-600"
								/>
								<div class="flex-1 min-w-0">
									<p class="font-medium truncate">{{ doc.fileName }}</p>
									<p class="text-xs text-gray-500">{{ doc.documentType }} • {{ formatFileSize(doc.fileSize) }}</p>
									<p v-if="doc.description" class="text-xs text-gray-600 mt-1">{{ doc.description }}</p>
								</div>
								<Button
									@click="downloadDocument(doc)"
									size="sm"
									variant="outline"
								>
									<Icon name="lucide:download" class="w-4 h-4 mr-1" />
									Download
								</Button>
							</div>
						</div>
						<div v-else class="text-center py-8 text-gray-500">
							<Icon name="lucide:file-x" class="w-12 h-12 mx-auto mb-2 text-gray-300" />
							<p>No documents uploaded yet</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<!-- Right Column - Timeline & Status -->
			<div class="space-y-6">
				<!-- Status Timeline -->
				<Card>
					<CardHeader>
						<CardTitle>Claim Timeline</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="space-y-4">
							<div class="flex gap-3">
								<div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
									<Icon name="lucide:check" class="w-4 h-4 text-green-600" />
								</div>
								<div>
									<p class="font-medium text-sm">Claim Created</p>
									<p class="text-xs text-gray-500">{{ formatDateTime(claim.createdAt) }}</p>
								</div>
							</div>

							<div v-if="claim.submittedAt" class="flex gap-3">
								<div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
									<Icon name="lucide:send" class="w-4 h-4 text-blue-600" />
								</div>
								<div>
									<p class="font-medium text-sm">Submitted to Insurance</p>
									<p class="text-xs text-gray-500">{{ formatDateTime(claim.submittedAt) }}</p>
								</div>
							</div>

							<div v-if="claim.reviewedAt" class="flex gap-3">
								<div 
									:class="[
										'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
										claim.status === 'APPROVED' ? 'bg-green-100' : 'bg-red-100'
									]"
								>
									<Icon 
										:name="claim.status === 'APPROVED' ? 'lucide:check-circle' : 'lucide:x-circle'" 
										:class="[
											'w-4 h-4',
											claim.status === 'APPROVED' ? 'text-green-600' : 'text-red-600'
										]"
									/>
								</div>
								<div>
									<p class="font-medium text-sm">{{ claim.status === 'APPROVED' ? 'Approved' : 'Denied' }}</p>
									<p class="text-xs text-gray-500">{{ formatDateTime(claim.reviewedAt) }}</p>
									<p v-if="claim.reviewedBy" class="text-xs text-gray-500">By: {{ claim.reviewedBy }}</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<!-- Quick Stats -->
				<Card>
					<CardHeader>
						<CardTitle>Summary</CardTitle>
					</CardHeader>
					<CardContent class="space-y-3">
						<div class="flex justify-between items-center pb-2 border-b">
							<span class="text-sm text-gray-600">Claim Amount</span>
							<span class="font-bold">₱{{ formatAmount(claim.claimAmount) }}</span>
						</div>
						<div v-if="claim.approvedAmount" class="flex justify-between items-center pb-2 border-b">
							<span class="text-sm text-gray-600">Approved Amount</span>
							<span class="font-bold text-green-600">₱{{ formatAmount(claim.approvedAmount) }}</span>
						</div>
						<div v-if="claim.approvedAmount" class="flex justify-between items-center">
							<span class="text-sm text-gray-600">Difference</span>
							<span :class="getDifferenceClass(claim.claimAmount, claim.approvedAmount)">
								₱{{ formatAmount(Math.abs(Number(claim.claimAmount) - Number(claim.approvedAmount))) }}
							</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>

		<!-- Error State -->
		<div v-else class="text-center py-12">
			<Icon name="lucide:alert-circle" class="w-16 h-16 mx-auto mb-4 text-red-400" />
			<p class="text-lg font-medium">Claim Not Found</p>
			<p class="text-sm text-gray-500 mt-2">The insurance claim you're looking for doesn't exist.</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'

definePageMeta({
	layout: 'patient',
})

const route = useRoute()
const { $trpc } = useNuxtApp()

const claimId = route.params.id as string
const claim = ref<any>(null)
const loading = ref(true)

const encounter = computed(() => {
	if (!claim.value) return null
	return claim.value.inpatientEncounter || claim.value.outpatientEncounter
})

const encounterType = computed(() => {
	if (!claim.value) return ''
	return claim.value.inpatientEncounter ? 'inpatient' : 'outpatient'
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
		}
	} catch (error) {
		console.error('Failed to load claim:', error)
	} finally {
		loading.value = false
	}
}

function getStatusBadgeClass(status: string): string {
	const classes: Record<string, string> = {
		PENDING: 'bg-gray-100 text-gray-800',
		SUBMITTED: 'bg-blue-100 text-blue-800',
		UNDER_REVIEW: 'bg-purple-100 text-purple-800',
		APPROVED: 'bg-green-100 text-green-800',
		DENIED: 'bg-red-100 text-red-800',
		CANCELLED: 'bg-gray-100 text-gray-500',
	}
	return classes[status] || 'bg-gray-100 text-gray-800'
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

function formatAmount(amount: any): string {
	return Number(amount).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
}

function formatDateTime(dateString: string): string {
	return new Date(dateString).toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

function getDifferenceClass(claimed: any, approved: any): string {
	const diff = Number(claimed) - Number(approved)
	if (diff === 0) return 'font-bold text-gray-600'
	if (diff > 0) return 'font-bold text-red-600'
	return 'font-bold text-green-600'
}

function downloadDocument(doc: any) {
	// Create a temporary link and trigger download
	const link = document.createElement('a')
	link.href = doc.fileUrl
	link.download = doc.fileName
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}
</script>
