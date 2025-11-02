<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Data Share Requests</h1>
				<p class="text-muted-foreground">Review and manage patient data sharing requests</p>
			</div>
		</div>

		<!-- Statistics -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<Card>
				<CardContent class="p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-muted-foreground">Pending Review</p>
							<p class="text-2xl font-bold">{{ stats.pending }}</p>
						</div>
						<Icon name="lucide:clock" class="w-8 h-8 text-orange-500" />
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent class="p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-muted-foreground">Approved</p>
							<p class="text-2xl font-bold text-green-600">{{ stats.approved }}</p>
						</div>
						<Icon name="lucide:check-circle" class="w-8 h-8 text-green-500" />
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent class="p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-muted-foreground">Denied</p>
							<p class="text-2xl font-bold text-red-600">{{ stats.denied }}</p>
						</div>
						<Icon name="lucide:x-circle" class="w-8 h-8 text-red-500" />
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent class="p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-muted-foreground">Accessed</p>
							<p class="text-2xl font-bold text-blue-600">{{ stats.accessed }}</p>
						</div>
						<Icon name="lucide:eye" class="w-8 h-8 text-blue-500" />
					</div>
				</CardContent>
			</Card>
		</div>

		<!-- Filters -->
		<Card>
			<CardHeader>
				<CardTitle>Filters</CardTitle>
			</CardHeader>
			<CardContent class="flex gap-4">
				<div class="flex-1">
					<Label>Status</Label>
					<Select v-model="filters.status" @update:model-value="loadRequests">
						<SelectTrigger>
							<SelectValue placeholder="All Statuses" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="PENDING">Pending</SelectItem>
							<SelectItem value="SUBMITTED">Submitted</SelectItem>
							<SelectItem value="APPROVED">Approved</SelectItem>
							<SelectItem value="DENIED">Denied</SelectItem>
							<SelectItem value="ACCESSED">Accessed</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardContent>
		</Card>

		<!-- Requests List -->
		<Card>
			<CardHeader>
				<CardTitle>Data Share Requests</CardTitle>
				<CardDescription>
					Click on a request to view details and take action
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div v-if="loading" class="flex justify-center py-12">
					<Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-muted-foreground" />
				</div>

				<div v-else-if="requests.length === 0" class="text-center py-12 text-muted-foreground">
					No data share requests found
				</div>

				<div v-else class="space-y-3">
					<Card
						v-for="request in requests"
						:key="request.id"
						class="cursor-pointer hover:shadow-md transition-shadow"
						@click="viewRequest(request)"
					>
						<CardContent class="p-4">
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center gap-3">
										<div class="font-semibold text-lg">
											{{ request.patientName }}
										</div>
										<Badge :variant="getStatusVariant(request.status)">
											{{ request.status }}
										</Badge>
									</div>
									<div class="text-sm text-muted-foreground mt-1">
										Request #: {{ request.requestNumber }}
									</div>
									<div class="mt-3 space-y-1">
										<div class="text-sm">
											<span class="font-medium">Hospital:</span> {{ request.hospitalName }}
										</div>
										<div class="text-sm">
											<span class="font-medium">Reason:</span> {{ request.reason }}
										</div>
										<div class="text-sm text-muted-foreground">
											Submitted: {{ formatDate(request.submittedAt) }}
										</div>
									</div>
								</div>
								<Icon name="lucide:chevron-right" class="w-5 h-5 text-muted-foreground" />
							</div>
						</CardContent>
					</Card>
				</div>

				<!-- Pagination -->
				<div v-if="pagination.pages > 1" class="flex justify-center gap-2 mt-6">
					<Button
						variant="outline"
						size="sm"
						:disabled="pagination.page === 1"
						@click="changePage(pagination.page - 1)"
					>
						<Icon name="lucide:chevron-left" class="w-4 h-4" />
					</Button>
					<div class="flex items-center px-4 text-sm">
						Page {{ pagination.page }} of {{ pagination.pages }}
					</div>
					<Button
						variant="outline"
						size="sm"
						:disabled="pagination.page === pagination.pages"
						@click="changePage(pagination.page + 1)"
					>
						<Icon name="lucide:chevron-right" class="w-4 h-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { toast } from 'vue-sonner'

definePageMeta({
	layout: 'staff',
	middleware: ['staff-type']
})

useHead({
	title: 'Data Share Requests - Staff'
})

const router = useRouter()
const { $trpc } = useNuxtApp()

const loading = ref(false)
const requests = ref<any[]>([])

const filters = reactive<{
	status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'DENIED' | 'ACCESSED' | 'EXPIRED' | ''
}>({
	status: ''
})

const pagination = reactive({
	page: 1,
	limit: 10,
	total: 0,
	pages: 0
})

const stats = computed(() => {
	const all = requests.value
	return {
		pending: all.filter(r => r.status === 'PENDING' || r.status === 'SUBMITTED').length,
		approved: all.filter(r => r.status === 'APPROVED').length,
		denied: all.filter(r => r.status === 'DENIED').length,
		accessed: all.filter(r => r.status === 'ACCESSED').length
	}
})

onMounted(() => {
	loadRequests()
})

async function loadRequests() {
	loading.value = true
	try {
		const response = await $trpc.datashare.getRequests.query({
			status: filters.status || undefined,
			page: pagination.page,
			limit: pagination.limit
		})

		if (response.success) {
			requests.value = response.data
			if (response.pagination) {
				pagination.page = response.pagination.page
				pagination.total = response.pagination.total
				pagination.pages = response.pagination.pages
			}
		} else {
			toast.error('Error', {
				description: 'Failed to load requests'
			})
		}
	} catch (error: any) {
		console.error('Error loading requests:', error)
		toast.error('Error', {
			description: 'Failed to load data share requests'
		})
	} finally {
		loading.value = false
	}
}

function changePage(page: number) {
	pagination.page = page
	loadRequests()
}

function viewRequest(request: any) {
	// Navigate to request detail page (to be created)
	router.push(`/staff/data-share/requests/${request.id}`)
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
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
}
</script>
