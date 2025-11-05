<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Audit Logs</h1>
				<p class="text-muted-foreground">Track all system activities and changes</p>
			</div>
		</div>

		<!-- Filters -->
		<Card>
			<CardHeader>
				<CardTitle>Filters</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<Label>Search User</Label>
						<Input v-model="filters.user" placeholder="Search by user name..." @input="handleFilter" />
					</div>
					<div>
						<Label>Action Type</Label>
						<Select v-model="filters.action" @update:model-value="handleFilter">
							<SelectTrigger>
								<SelectValue placeholder="All actions" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ALL">All actions</SelectItem>
								<SelectItem value="CREATE">Create</SelectItem>
								<SelectItem value="UPDATE">Update</SelectItem>
								<SelectItem value="DELETE">Delete</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div class="flex items-end">
						<Button @click="resetFilters" variant="outline" class="w-full">
							<Icon name="lucide:rotate-ccw" class="w-4 h-4 mr-2" />
							Reset Filters
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Audit Logs Table -->
		<Card>
			<CardHeader>
				<CardTitle>Facility Activity Logs</CardTitle>
				<CardDescription>
					Complete audit trail of all facility-related actions
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div v-if="loading" class="text-center py-12">
					<Icon name="lucide:loader-2" class="w-8 h-8 mx-auto animate-spin text-gray-400" />
					<p class="text-muted-foreground mt-4">Loading audit logs...</p>
				</div>

				<div v-else-if="logs.length === 0" class="text-center py-12 text-muted-foreground">
					<Icon name="lucide:file-text" class="w-16 h-16 mx-auto mb-4 text-gray-300" />
					<p>No audit logs found</p>
					<p class="text-sm mt-2">Activities will appear here when users perform actions</p>
				</div>

				<div v-else class="overflow-x-auto">
					<table class="w-full">
						<thead class="border-b bg-gray-50">
							<tr class="text-left">
								<th class="py-3 px-4 font-semibold">Timestamp</th>
								<th class="py-3 px-4 font-semibold">User</th>
								<th class="py-3 px-4 font-semibold">Role</th>
								<th class="py-3 px-4 font-semibold">Action</th>
								<th class="py-3 px-4 font-semibold">Facility</th>
								<th class="py-3 px-4 font-semibold">Type</th>
								<th class="py-3 px-4 font-semibold">Status Change</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="log in logs" :key="log.id" class="border-b hover:bg-gray-50">
								<td class="py-3 px-4 text-sm">
									{{ formatDate(log.timestamp) }}
								</td>
								<td class="py-3 px-4 font-medium">{{ log.user }}</td>
								<td class="py-3 px-4">
									<span class="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
										{{ log.role }}
									</span>
								</td>
								<td class="py-3 px-4">
									<span :class="getActionClass(log.action)" class="px-2 py-1 rounded-full text-xs font-semibold">
										{{ log.action }}
									</span>
								</td>
								<td class="py-3 px-4">{{ log.roomIdentifier }}</td>
								<td class="py-3 px-4 text-sm">{{ log.type }}</td>
								<td class="py-3 px-4 text-sm">
									<span v-if="log.oldStatus || log.newStatus">
										<span class="text-red-600">{{ log.oldStatus || 'N/A' }}</span>
										<Icon name="lucide:arrow-right" class="w-4 h-4 inline mx-1" />
										<span class="text-green-600">{{ log.newStatus || 'N/A' }}</span>
									</span>
									<span v-else class="text-gray-400">-</span>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- Pagination -->
					<div class="mt-4 flex items-center justify-between">
						<div class="text-sm text-gray-600">
							Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to 
							{{ Math.min(pagination.page * pagination.limit, pagination.total) }} of 
							{{ pagination.total }} entries
						</div>
						<div class="flex gap-2">
							<Button 
								@click="goToPage(pagination.page - 1)" 
								:disabled="pagination.page === 1"
								variant="outline"
								size="sm"
							>
								<Icon name="lucide:chevron-left" class="w-4 h-4" />
								Previous
							</Button>
							<Button 
								@click="goToPage(pagination.page + 1)" 
								:disabled="pagination.page >= pagination.totalPages"
								variant="outline"
								size="sm"
							>
								Next
								<Icon name="lucide:chevron-right" class="w-4 h-4" />
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import type { FacilityLog } from "~/types/logs"

definePageMeta({
	layout: "admin",
})

const { $trpc } = useNuxtApp()

const loading = ref(false)
const logs = ref<FacilityLog[]>([])

const filters = reactive({
	user: '',
	action: 'ALL',
})

const pagination = reactive({
	page: 1,
	limit: 50,
	total: 0,
	totalPages: 0,
})

const fetchLogs = async () => {
	try {
		loading.value = true
		const response = await $trpc.logs.facility.getFacilityLogs.query({
			page: pagination.page,
			limit: pagination.limit,
			user: filters.user || undefined,
			action: filters.action !== 'ALL' ? filters.action : undefined,
		})

		if (response.success && response.data) {
			logs.value = response.data.logs
			pagination.total = response.data.total
			pagination.totalPages = response.data.totalPages
		}
	} catch (error) {
		console.error('Failed to fetch audit logs:', error)
		useToast('error', 'Error', 'Failed to load audit logs')
	} finally {
		loading.value = false
	}
}

const handleFilter = () => {
	pagination.page = 1
	fetchLogs()
}

const resetFilters = () => {
	filters.user = ''
	filters.action = 'ALL'
	pagination.page = 1
	fetchLogs()
}

const goToPage = (page: number) => {
	pagination.page = page
	fetchLogs()
}

const formatDate = (date: Date | string) => {
	const d = new Date(date)
	return d.toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

const getActionClass = (action: string) => {
	switch (action) {
		case 'CREATE':
			return 'bg-green-100 text-green-800'
		case 'UPDATE':
			return 'bg-blue-100 text-blue-800'
		case 'DELETE':
			return 'bg-red-100 text-red-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
}

onMounted(() => {
	fetchLogs()
})
</script>
