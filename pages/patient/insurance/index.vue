<template>
	<div class="space-y-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">My Insurance Claims</h1>
				<p class="text-gray-600 mt-1">View and track your insurance claims</p>
			</div>
		</div>

		<!-- Stats Cards -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<Card>
				<CardContent class="pt-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-gray-600">Total Claims</p>
							<p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
						</div>
						<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<Icon name="lucide:file-text" class="w-6 h-6 text-blue-600" />
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent class="pt-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-gray-600">Pending</p>
							<p class="text-2xl font-bold text-yellow-600">{{ stats.pending }}</p>
						</div>
						<div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
							<Icon name="lucide:clock" class="w-6 h-6 text-yellow-600" />
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent class="pt-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-gray-600">Approved</p>
							<p class="text-2xl font-bold text-green-600">{{ stats.approved }}</p>
						</div>
						<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<Icon name="lucide:check-circle" class="w-6 h-6 text-green-600" />
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent class="pt-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-gray-600">Total Approved</p>
							<p class="text-2xl font-bold text-green-600">₱{{ formatAmount(stats.totalApproved) }}</p>
						</div>
						<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<Icon name="lucide:dollar-sign" class="w-6 h-6 text-green-600" />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>

		<!-- Claims List -->
		<Card>
			<CardHeader>
				<CardTitle>Insurance Claims History</CardTitle>
				<CardDescription>All your insurance claims and their current status</CardDescription>
			</CardHeader>
			<CardContent>
				<!-- Loading State -->
				<div v-if="loading" class="text-center py-12">
					<Icon name="lucide:loader-2" class="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
					<p class="text-sm text-gray-500">Loading claims...</p>
				</div>

				<!-- Empty State -->
				<div v-else-if="claims.length === 0" class="text-center py-12">
					<Icon name="lucide:shield-off" class="w-16 h-16 mx-auto mb-4 text-gray-300" />
					<h3 class="text-lg font-medium text-gray-900 mb-2">No Insurance Claims</h3>
					<p class="text-gray-500">You don't have any insurance claims yet.</p>
				</div>

				<!-- Claims Table -->
				<div v-else class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50 border-b">
							<tr>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim #</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Encounter</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim Amount</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved Amount</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							<tr v-for="claim in claims" :key="claim.id" class="hover:bg-gray-50">
								<td class="px-4 py-4 text-sm font-medium text-gray-900">
									{{ claim.claimNumber }}
								</td>
								<td class="px-4 py-4 text-sm text-gray-600">
									<div>
										<p class="font-medium">{{ getEncounterType(claim) }}</p>
										<p class="text-xs text-gray-500">{{ getEncounterDate(claim) }}</p>
									</div>
								</td>
								<td class="px-4 py-4 text-sm text-gray-600">
									{{ claim.insuranceProvider }}
								</td>
								<td class="px-4 py-4 text-sm text-gray-900 font-medium">
									₱{{ formatAmount(claim.claimAmount) }}
								</td>
								<td class="px-4 py-4 text-sm font-medium">
									<span v-if="claim.approvedAmount" class="text-green-600">
										₱{{ formatAmount(claim.approvedAmount) }}
									</span>
									<span v-else class="text-gray-400">-</span>
								</td>
								<td class="px-4 py-4 text-sm">
									<span 
										:class="getStatusBadgeClass(claim.status)"
										class="px-2 py-1 text-xs font-medium rounded-full"
									>
										{{ claim.status }}
									</span>
								</td>
								<td class="px-4 py-4 text-sm text-gray-600">
									{{ formatDate(claim.createdAt) }}
								</td>
								<td class="px-4 py-4 text-sm">
									<Button 
										@click="viewClaim(claim.id)" 
										size="sm" 
										variant="ghost"
										class="text-blue-600 hover:text-blue-700"
									>
										<Icon name="lucide:eye" class="w-4 h-4 mr-1" />
										View
									</Button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { useAuthStore } from '~/stores/app'

definePageMeta({
	layout: 'patient',
})

const router = useRouter()
const { $trpc } = useNuxtApp()
const authStore = useAuthStore()

const claims = ref<any[]>([])
const loading = ref(true)

const stats = computed(() => {
	const total = claims.value.length
	const pending = claims.value.filter(c => c.status === 'PENDING' || c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length
	const approved = claims.value.filter(c => c.status === 'APPROVED').length
	const totalApproved = claims.value
		.filter(c => c.status === 'APPROVED' && c.approvedAmount)
		.reduce((sum, c) => sum + Number(c.approvedAmount), 0)
	
	return { total, pending, approved, totalApproved }
})

onMounted(async () => {
	await loadClaims()
})

async function loadClaims() {
	loading.value = true
	try {
		// Get patient data from auth store
		const user = authStore.user
		if (!user) return

		// Get patient record
		const patientResponse = await $trpc.patients.getPatientByUserId.query({
			userId: user.id
		})

		if (patientResponse.success && patientResponse.data) {
			const patientId = patientResponse.data.id

			// Get all insurance claims for this patient
			const claimsResponse = await $trpc.insurance.getClaims.query({
				patientId,
				page: 1,
				limit: 50,
			})

			if (claimsResponse.success && claimsResponse.data) {
				claims.value = claimsResponse.data
			}
		}
	} catch (error) {
		console.error('Failed to load claims:', error)
	} finally {
		loading.value = false
	}
}

function getEncounterType(claim: any): string {
	if (claim.inpatientEncounter) {
		return 'Inpatient Admission'
	} else if (claim.outpatientEncounter) {
		return 'Outpatient Visit'
	}
	return 'Unknown'
}

function getEncounterDate(claim: any): string {
	const encounter = claim.inpatientEncounter || claim.outpatientEncounter
	if (!encounter) return 'N/A'
	return `${encounter.date || ''} ${encounter.time || ''}`.trim()
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

function formatAmount(amount: any): string {
	return Number(amount).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})
}

function viewClaim(claimId: string) {
	router.push(`/patient/insurance/${claimId}`)
}
</script>
