<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Insurance Claims Management</h1>
				<p class="text-muted-foreground">Manage patient insurance claims and documentation</p>
			</div>
		</div>

		<!-- Stats Cards -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<Card>
				<CardHeader class="pb-2">
					<CardDescription>Pending</CardDescription>
					<CardTitle class="text-2xl">{{ stats.pending }}</CardTitle>
				</CardHeader>
			</Card>
			<Card>
				<CardHeader class="pb-2">
					<CardDescription>Submitted</CardDescription>
					<CardTitle class="text-2xl">{{ stats.submitted }}</CardTitle>
				</CardHeader>
			</Card>
			<Card>
				<CardHeader class="pb-2">
					<CardDescription>Approved</CardDescription>
					<CardTitle class="text-2xl text-green-600">{{ stats.approved }}</CardTitle>
				</CardHeader>
			</Card>
			<Card>
				<CardHeader class="pb-2">
					<CardDescription>Denied</CardDescription>
					<CardTitle class="text-2xl text-red-600">{{ stats.denied }}</CardTitle>
				</CardHeader>
			</Card>
		</div>

		<!-- Claims Table -->
		<Card>
			<CardHeader>
				<div class="flex items-center justify-between">
					<div>
						<CardTitle>Insurance Claims</CardTitle>
						<CardDescription>View and manage all insurance claims</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<!-- Filters -->
				<div class="flex gap-4 mb-4">
					<div class="flex-1">
						<Input 
							v-model="searchQuery" 
							placeholder="Search by claim number or patient name..." 
							@input="loadClaims"
						/>
					</div>
					<select 
						v-model="filterStatus" 
						@change="loadClaims" 
						class="border rounded-md px-3 py-2"
					>
						<option value="">All Status</option>
						<option value="PENDING">Pending</option>
						<option value="SUBMITTED">Submitted</option>
						<option value="UNDER_REVIEW">Under Review</option>
						<option value="APPROVED">Approved</option>
						<option value="DENIED">Denied</option>
						<option value="CANCELLED">Cancelled</option>
					</select>
				</div>

				<!-- Loading State -->
				<div v-if="loading" class="text-center py-12">
					<Icon name="lucide:loader-2" class="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
					<p class="text-sm text-gray-500">Loading claims...</p>
				</div>

				<!-- Claims Table -->
				<div v-else-if="claims.length > 0" class="border rounded-lg overflow-hidden">
					<table class="w-full">
						<thead class="bg-gray-50 border-b">
							<tr>
								<th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Claim Number</th>
								<th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Patient</th>
								<th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Insurance Provider</th>
								<th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Amount</th>
								<th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
								<th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Created</th>
								<th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="claim in claims"
								:key="claim.id"
								class="border-b hover:bg-gray-50 transition-colors"
							>
								<td class="py-3 px-4 text-sm font-medium">{{ claim.claimNumber }}</td>
								<td class="py-3 px-4 text-sm">
									{{ claim.patient.user.firstName }} {{ claim.patient.user.lastName }}
								</td>
								<td class="py-3 px-4 text-sm">{{ claim.insuranceProvider }}</td>
								<td class="py-3 px-4 text-sm">₱{{ formatAmount(claim.claimAmount) }}</td>
								<td class="py-3 px-4">
									<Badge :variant="getStatusVariant(claim.status)">
										{{ formatStatus(claim.status) }}
									</Badge>
								</td>
								<td class="py-3 px-4 text-sm">{{ formatDate(claim.createdAt) }}</td>
								<td class="py-3 px-4">
									<div class="flex items-center gap-2">
										<Button
											@click="viewClaim(claim.id)"
											variant="ghost"
											size="sm"
										>
											<Icon name="lucide:eye" class="w-4 h-4 mr-1" />
											View
										</Button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Empty State -->
				<div v-else class="text-center py-12 text-muted-foreground">
					<Icon name="lucide:file-x" class="w-16 h-16 mx-auto mb-4 text-gray-300" />
					<p class="text-lg font-medium">No Insurance Claims Found</p>
					<p class="text-sm mt-2">Claims will appear here once created from patient encounters</p>
				</div>
			</CardContent>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'

definePageMeta({
	layout: 'billing-staff',
})

const { $trpc } = useNuxtApp()
const router = useRouter()

const claims = ref<any[]>([])
const loading = ref(false)
const searchQuery = ref('')
const filterStatus = ref('')

// Computed stats
const stats = computed(() => {
	return {
		pending: claims.value.filter(c => c.status === 'PENDING').length,
		submitted: claims.value.filter(c => ['SUBMITTED', 'UNDER_REVIEW'].includes(c.status)).length,
		approved: claims.value.filter(c => c.status === 'APPROVED').length,
		denied: claims.value.filter(c => c.status === 'DENIED').length,
	}
})

onMounted(async () => {
	await loadClaims()
})

async function loadClaims() {
	loading.value = true
	try {
		const response = await $trpc.insurance.getClaims.query({
			status: filterStatus.value || undefined,
			page: 1,
			limit: 50,
		})

		if (response.success && response.data) {
			// Filter by search query
			claims.value = response.data.filter((claim: any) => {
				if (!searchQuery.value) return true
				const query = searchQuery.value.toLowerCase()
				const patientName = `${claim.patient.user.firstName} ${claim.patient.user.lastName}`.toLowerCase()
				return claim.claimNumber.toLowerCase().includes(query) || patientName.includes(query)
			})
		}
	} catch (error) {
		console.error('Failed to load claims:', error)
	} finally {
		loading.value = false
	}
}

function viewClaim(claimId: string) {
	router.push(`/billing_staff/insurance/claims/${claimId}`)
}

function formatAmount(amount: any): string {
	return Number(amount).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
}

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})
}

function formatStatus(status: string): string {
	return status.replace(/_/g, ' ')
}

function getStatusVariant(status: string): any {
	switch (status) {
		case 'PENDING':
			return 'secondary'
		case 'SUBMITTED':
		case 'UNDER_REVIEW':
			return 'default'
		case 'APPROVED':
			return 'default'
		case 'DENIED':
			return 'destructive'
		case 'CANCELLED':
			return 'outline'
		default:
			return 'secondary'
	}
}
</script>
