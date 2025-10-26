<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Create Insurance Claim</h1>
				<p class="text-muted-foreground">Upload documents and submit claim for insurance review</p>
			</div>
			<Button @click="$router.back()" variant="outline">
				<Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
				Back
			</Button>
		</div>

		<!-- Loading State -->
		<div v-if="loading" class="text-center py-12">
			<Icon name="lucide:loader-2" class="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
			<p class="text-sm text-gray-500">Loading encounter details...</p>
		</div>

		<!-- Main Content -->
		<div v-else-if="encounter" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Left Column - Encounter Info -->
			<div class="lg:col-span-1">
				<Card>
					<CardHeader>
						<CardTitle>Encounter Details</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div>
							<Label class="text-muted-foreground">Patient</Label>
							<p class="font-medium">
								{{ encounter.patient.user.firstName }} {{ encounter.patient.user.lastName }}
							</p>
							<p class="text-sm text-muted-foreground">{{ encounter.patient.patientNumber }}</p>
						</div>
						<div>
							<Label class="text-muted-foreground">Encounter Type</Label>
							<p class="font-medium capitalize">{{ encounterType }}</p>
						</div>
						<div>
							<Label class="text-muted-foreground">Date</Label>
							<p class="font-medium">{{ encounter.date }} {{ encounter.time }}</p>
						</div>
						<div>
							<Label class="text-muted-foreground">Chief Complaint</Label>
							<p class="font-medium">{{ encounter.chiefComplaint }}</p>
						</div>
						<div v-if="encounter.doctorDiagnosis">
							<Label class="text-muted-foreground">Diagnosis</Label>
							<p class="font-medium">{{ encounter.doctorDiagnosis }}</p>
						</div>
						<div v-if="totalAmount > 0">
							<Label class="text-muted-foreground">Total Amount</Label>
							<p class="text-2xl font-bold text-green-600">₱{{ formatAmount(totalAmount) }}</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<!-- Right Column - Claim Form -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Insurance Details -->
				<Card>
					<CardHeader>
						<CardTitle>Insurance Information</CardTitle>
						<CardDescription>Enter the patient's insurance details</CardDescription>
					</CardHeader>
					<CardContent class="space-y-4">
						<div>
							<Label>Insurance Provider *</Label>
							<Input 
								v-model="form.insuranceProvider" 
								placeholder="e.g., PhilHealth, Maxicare, Pacific Cross"
								:disabled="saving"
							/>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Label>Insurance Number</Label>
								<Input 
									v-model="form.insuranceNumber" 
									placeholder="Patient's insurance number"
									:disabled="saving"
								/>
							</div>
							<div>
								<Label>Policy Number</Label>
								<Input 
									v-model="form.policyNumber" 
									placeholder="Policy number"
									:disabled="saving"
								/>
							</div>
						</div>
						<div>
							<Label>Claim Amount *</Label>
							<Input 
								v-model.number="form.claimAmount" 
								type="number"
								step="0.01"
								placeholder="0.00"
								:disabled="saving"
							/>
							<p class="text-xs text-muted-foreground mt-1">
								Enter the total amount to claim from insurance
							</p>
						</div>
						<div>
							<Label>Notes</Label>
							<textarea 
								v-model="form.billingStaffNotes"
								class="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
								placeholder="Add any notes about this claim..."
								:disabled="saving"
							/>
						</div>
					</CardContent>
				</Card>

				<!-- Document Upload -->
				<Card>
					<CardHeader>
						<CardTitle>Upload Documents</CardTitle>
						<CardDescription>Upload all required documents (medical certificates, lab results, prescriptions, etc.)</CardDescription>
					</CardHeader>
					<CardContent class="space-y-4">
						<!-- File Upload Area -->
						<div 
							@drop.prevent="handleDrop"
							@dragover.prevent="dragover = true"
							@dragleave="dragover = false"
							:class="[
								'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
								dragover ? 'border-green-500 bg-green-50' : 'border-gray-300',
								saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
							]"
							@click="!saving && $refs.fileInput.click()"
						>
							<input 
								ref="fileInput"
								type="file"
								multiple
								accept="image/*,application/pdf,.doc,.docx"
								@change="handleFileSelect"
								class="hidden"
								:disabled="saving"
							/>
							<Icon name="lucide:upload-cloud" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
							<p class="text-lg font-medium mb-2">Drop files here or click to browse</p>
							<p class="text-sm text-muted-foreground">
								Supports: Images, PDF, Word documents (Max 10MB each)
							</p>
						</div>

						<!-- Selected Files List -->
						<div v-if="selectedFiles.length > 0" class="space-y-2">
							<div class="flex items-center justify-between mb-2">
								<Label>Selected Files ({{ selectedFiles.length }})</Label>
								<Button 
									@click="selectedFiles = []" 
									variant="ghost" 
									size="sm"
									:disabled="saving"
								>
									Clear All
								</Button>
							</div>
							<div
								v-for="(file, index) in selectedFiles"
								:key="index"
								class="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
							>
								<Icon 
									:name="getFileIcon(file.type)" 
									class="w-8 h-8 text-blue-600"
								/>
								<div class="flex-1 min-w-0">
									<p class="font-medium truncate">{{ file.name }}</p>
									<div class="flex items-center gap-3 text-xs text-muted-foreground">
										<span>{{ formatFileSize(file.size) }}</span>
										<Input 
											v-model="fileDescriptions[index]"
											placeholder="Document type (e.g., Medical Certificate)"
											class="h-7 text-xs"
											:disabled="saving"
										/>
									</div>
								</div>
								<Button
									@click="removeFile(index)"
									variant="ghost"
									size="sm"
									:disabled="saving"
								>
									<Icon name="lucide:x" class="w-4 h-4" />
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				<!-- Action Buttons -->
				<Card>
					<CardContent class="pt-6">
						<div class="flex gap-3">
							<Button
								@click="saveClaim"
								:disabled="!canSave || saving"
								class="flex-1"
								size="lg"
							>
								<Icon v-if="!saving" name="lucide:save" class="w-4 h-4 mr-2" />
								<Icon v-else name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
								{{ saving ? 'Creating Claim...' : 'Create Claim' }}
							</Button>
						</div>
						<p class="text-xs text-muted-foreground mt-2 text-center">
							* The claim will be saved as PENDING. You can add more documents later before submitting to insurance.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>

		<!-- Error State -->
		<div v-else class="text-center py-12">
			<Icon name="lucide:alert-circle" class="w-16 h-16 mx-auto mb-4 text-red-400" />
			<p class="text-lg font-medium">Encounter Not Found</p>
			<p class="text-sm text-muted-foreground mt-2">The encounter you're trying to create a claim for doesn't exist.</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { useAuthStore } from '~/stores/app'

definePageMeta({
	layout: 'billing-staff',
})

const route = useRoute()
const router = useRouter()
const { $trpc } = useNuxtApp()

const encounterId = route.params.encounterId as string
const encounterType = (route.query.type as string) || 'inpatient'

const encounter = ref<any>(null)
const loading = ref(true)
const saving = ref(false)
const dragover = ref(false)

const form = ref({
	insuranceProvider: '',
	insuranceNumber: '',
	policyNumber: '',
	claimAmount: 0,
	billingStaffNotes: '',
})

const selectedFiles = ref<File[]>([])
const fileDescriptions = ref<string[]>([])
const fileInput = ref<HTMLInputElement>()

const totalAmount = computed(() => {
	if (!encounter.value) return 0
	
	if (encounterType === 'outpatient') {
		return Number(encounter.value.consultationFee || 0)
	} else {
		// Inpatient - sum all orders
		return encounter.value.orders?.reduce((sum: number, order: any) => {
			return sum + Number(order.cost || 0)
		}, 0) || 0
	}
})

const canSave = computed(() => {
	return form.value.insuranceProvider.trim() !== '' &&
	       form.value.claimAmount > 0 &&
	       selectedFiles.value.length > 0
})

onMounted(async () => {
	await loadEncounter()
	
	// Pre-fill amount from encounter
	if (totalAmount.value > 0) {
		form.value.claimAmount = totalAmount.value
	}
	
	// Pre-fill insurance from patient
	if (encounter.value?.patient?.insuranceProvider) {
		form.value.insuranceProvider = encounter.value.patient.insuranceProvider
	}
	if (encounter.value?.patient?.insuranceNumber) {
		form.value.insuranceNumber = encounter.value.patient.insuranceNumber
	}
})

async function loadEncounter() {
	loading.value = true
	try {
		let response
		if (encounterType === 'inpatient') {
			response = await $trpc.encounters.inpatient.getInpatientEncounter.query({
				id: encounterId
			})
			if (response.success && response.data) {
				encounter.value = response.data
				
				// Check if claim already exists for this encounter
				if (encounter.value.insuranceClaim) {
					useToast('warning', 'Claim Already Exists', 'This encounter already has an insurance claim')
					router.push(`/billing_staff/insurance/claims/${encounter.value.insuranceClaim.id}`)
					return
				}
			}
		} else {
			response = await $trpc.encounters.outpatient.getOutpatientEncounter.query({
				id: encounterId
			})
			if (response.success && response.data) {
				encounter.value = response.data
				
				// Check if claim already exists for this encounter
				if (encounter.value.insuranceClaim) {
					useToast('warning', 'Claim Already Exists', 'This encounter already has an insurance claim')
					router.push(`/billing_staff/insurance/claims/${encounter.value.insuranceClaim.id}`)
					return
				}
			}
		}
	} catch (error) {
		console.error('Failed to load encounter:', error)
	} finally {
		loading.value = false
	}
}

function handleFileSelect(event: Event) {
	const target = event.target as HTMLInputElement
	if (target.files) {
		addFiles(Array.from(target.files))
	}
}

function handleDrop(event: DragEvent) {
	dragover.value = false
	if (event.dataTransfer?.files) {
		addFiles(Array.from(event.dataTransfer.files))
	}
}

function addFiles(files: File[]) {
	const validFiles = files.filter(file => {
		// Max 10MB per file
		if (file.size > 10 * 1024 * 1024) {
			alert(`File ${file.name} is too large (max 10MB)`)
			return false
		}
		return true
	})
	
	selectedFiles.value.push(...validFiles)
	fileDescriptions.value.push(...Array(validFiles.length).fill(''))
}

function removeFile(index: number) {
	selectedFiles.value.splice(index, 1)
	fileDescriptions.value.splice(index, 1)
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

async function saveClaim() {
	if (!canSave.value || saving.value) return
	
	saving.value = true
	try {
		// Get current user (billing staff) from auth store
		const authStore = useAuthStore()
		if (!authStore.user) throw new Error('Not authenticated')
		
		// 1. Create the insurance claim
		const claimResponse = await $trpc.insurance.createClaim.mutate({
			patientId: encounter.value.patientId,
			encounterId: encounterId,
			encounterType: encounterType as 'inpatient' | 'outpatient',
			insuranceProvider: form.value.insuranceProvider,
			insuranceNumber: form.value.insuranceNumber || undefined,
			policyNumber: form.value.policyNumber || undefined,
			claimAmount: form.value.claimAmount,
			billingStaffNotes: form.value.billingStaffNotes || undefined,
			createdBy: authStore.user.id,
		})
		
		if (!claimResponse.success) {
			throw new Error(claimResponse.message || 'Failed to create claim')
		}
		
		const claimId = claimResponse.data.id
		
		// 2. Upload all documents
		for (let i = 0; i < selectedFiles.value.length; i++) {
			const file = selectedFiles.value[i]
			const description = fileDescriptions.value[i] || file.name
			
			// In a real app, you'd upload to cloud storage (S3, Cloudinary, etc.)
			// For now, we'll simulate with a data URL
			const fileUrl = await fileToDataURL(file)
			
			await $trpc.insurance.uploadDocument.mutate({
				claimId,
				documentType: description,
				fileName: file.name,
				fileUrl,
				fileSize: file.size,
				mimeType: file.type,
				description,
				uploadedBy: authStore.user.id,
			})
		}
		
		useToast('success', 'Success', 'Insurance claim created successfully')
		
		// Navigate to claim details page
		router.push(`/billing_staff/insurance/claims/${claimId}`)
		
	} catch (error: any) {
		console.error('Failed to create claim:', error)
		useToast('error', 'Error', error.message || 'Failed to create insurance claim')
	} finally {
		saving.value = false
	}
}

function fileToDataURL(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(reader.result as string)
		reader.onerror = reject
		reader.readAsDataURL(file)
	})
}
</script>
