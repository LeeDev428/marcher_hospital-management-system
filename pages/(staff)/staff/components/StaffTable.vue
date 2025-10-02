<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useStaffStore } from "@/stores/staff/useStaffStore"
import {
	Tabs,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs"
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { StaffRole } from "@/types/staff"

const staffStore = useStaffStore()
const activeTab = ref("ALL")

const onEdit = (id: string) => {
	navigateTo(`/staff/${id}`)
}

/* ===================== 🔎 SEARCH (debounced + clear) ===================== */
const search = ref("")                          // user input
const debouncedQuery = ref("")                  // debounced value used for filtering
const searchInputRef = ref<HTMLInputElement | null>(null)
let debounceTimer: number | undefined

watch(search, (v) => {
	window.clearTimeout(debounceTimer)
	debounceTimer = window.setTimeout(() => {
		debouncedQuery.value = v.trim()
	}, 200) // debounce ms
})

function clearSearch() {
	search.value = ""
	debouncedQuery.value = ""
	searchInputRef.value?.focus()
}

// Filter across multiple fields (case-insensitive)
const filteredStaff = computed(() => {
	const q = debouncedQuery.value.toLowerCase()
	if (!q) return staffStore.staffProfiles

	return staffStore.staffProfiles.filter((s: any) => {
		const haystack = [
			s.lastName,
			s.firstName,
			s.middleName,
			s.suffix,
			s.role,
			s.profession,
			s.createdAt,
			s.updatedAt,
		]
			.map((v) => String(v ?? "").toLowerCase())
			.join(" | ")

		return haystack.includes(q)
	})
})

/* ===================== ⏱️ SORT (toggle by created/updated) ===================== */
type SortField = 'createdAt' | 'updatedAt'
const sortField = ref<SortField>('createdAt')
const sortAsc = ref(false) // Default to newest first

function toggleSort(field: SortField) {
	if (sortField.value === field) {
		sortAsc.value = !sortAsc.value
	} else {
		sortField.value = field
		sortAsc.value = false // Default to newest first for new field
	}
}

const sortedStaff = computed(() => {
	const mul = sortAsc.value ? 1 : -1
	return [...filteredStaff.value].sort((a, b) => {
		const at = new Date(a[sortField.value]).getTime() || 0
		const bt = new Date(b[sortField.value]).getTime() || 0
		if (at === bt) return 0
		return (at - bt) * mul
	})
})

/* ===================== 📄 PAGINATION (client-side) ===================== */
const pageSize = ref(10)
const currentPage = ref(1)
const pageSizeOptions = [10, 25, 50, 100]

const totalItems = computed(() => sortedStaff.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

// reset/clamp page when results, sort, or page size change
watch([sortedStaff, pageSize], () => { currentPage.value = 1 })
watch(totalPages, (t) => { if (currentPage.value > t) currentPage.value = t })

const paginatedStaff = computed(() => {
	const start = (currentPage.value - 1) * pageSize.value
	return sortedStaff.value.slice(start, start + pageSize.value)
})

function goTo(p: number) {
	currentPage.value = Math.min(Math.max(1, p), totalPages.value)
}
function prev() { goTo(currentPage.value - 1) }
function next() { goTo(currentPage.value + 1) }

// Page number window (max 5 buttons)
const pageWindow = computed(() => {
	const windowSize = 5, half = Math.floor(windowSize / 2)
	let start = Math.max(1, currentPage.value - half)
	const end = Math.min(totalPages.value, start + windowSize - 1)
	start = Math.max(1, end - windowSize + 1)
	return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// Watch tab changes and reset pagination
watch(activeTab, async () => {
	if (activeTab.value === "ALL") {
		await staffStore.getStaffProfiles()
	} else {
		await staffStore.getStaffProfiles(activeTab.value as StaffRole)
	}
	// Reset pagination and search when tab changes
	currentPage.value = 1
})

onMounted(async () => {
	await staffStore.getStaffProfiles()
})

// Expose search for parent component
defineExpose({
	search,
	clearSearch,
	searchInputRef
})
</script>

<template>
	<!-- Loading State -->
	<div v-if="staffStore.loading" class="flex flex-col gap-2">
		<Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
	</div>

	<!-- Content -->
	<div v-else>
		<!-- Role Filter Tabs -->
		<Tabs v-model="activeTab">
			<TabsList class="mb-4 gap-1">
				<TabsTrigger value="ALL" class="hover:bg-zinc-200">All</TabsTrigger>
				<TabsTrigger value="DOCTOR" class="hover:bg-zinc-200">Doctor</TabsTrigger>
				<TabsTrigger value="NURSE" class="hover:bg-zinc-200">Nurse</TabsTrigger>
				<TabsTrigger value="SECRETARY" class="hover:bg-zinc-200">Secretary</TabsTrigger>
				<TabsTrigger value="STAFF" class="hover:bg-zinc-200">Staff</TabsTrigger>
				<TabsTrigger value="ADMIN" class="hover:bg-zinc-200">Admin</TabsTrigger>
			</TabsList>
		</Tabs>

		<div class="overflow-x-auto">
			<!-- Search results count -->
			<div class="mb-3 flex items-center gap-2">
				<span class="text-sm text-gray-500">
					{{ totalItems }} result{{ totalItems === 1 ? '' : 's' }}{{ debouncedQuery ? ` for "${debouncedQuery}"` : '' }}
				</span>
			</div>

			<!-- Table -->
			<Table v-if="totalItems > 0" class="min-w-[800px]">
				<TableHeader>
					<TableRow>
						<TableHead>Last Name</TableHead>
						<TableHead>First Name</TableHead>
						<TableHead>Middle Name</TableHead>
						<TableHead>Suffix</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Profession</TableHead>
						<TableHead class="cursor-pointer select-none">
							<button type="button" class="flex items-center gap-1" @click="toggleSort('createdAt')">
								<span>Created At</span>
								<span v-if="sortField === 'createdAt'" aria-hidden="true">{{ sortAsc ? "▲" : "▼" }}</span>
								<span class="sr-only">
									Sort by created date {{ sortField === 'createdAt' ? (sortAsc ? "ascending" : "descending") : "" }}
								</span>
							</button>
						</TableHead>
						<TableHead class="cursor-pointer select-none">
							<button type="button" class="flex items-center gap-1" @click="toggleSort('updatedAt')">
								<span>Updated At</span>
								<span v-if="sortField === 'updatedAt'" aria-hidden="true">{{ sortAsc ? "▲" : "▼" }}</span>
								<span class="sr-only">
									Sort by updated date {{ sortField === 'updatedAt' ? (sortAsc ? "ascending" : "descending") : "" }}
								</span>
							</button>
						</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow 
						v-for="staff in paginatedStaff" 
						:key="staff.id"
						class="hover:bg-gray-50"
					>
						<TableCell>{{ staff.lastName }}</TableCell>
						<TableCell>{{ staff.firstName }}</TableCell>
						<TableCell>{{ staff.middleName || '-' }}</TableCell>
						<TableCell>{{ staff.suffix || '-' }}</TableCell>
						<TableCell>
							<span 
								class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
								:class="{
									'bg-red-100 text-red-800': staff.role === 'DOCTOR',
									'bg-blue-100 text-blue-800': staff.role === 'NURSE',
									'bg-green-100 text-green-800': staff.role === 'SECRETARY',
									'bg-yellow-100 text-yellow-800': staff.role === 'STAFF',
									'bg-purple-100 text-purple-800': staff.role === 'ADMIN',
									'bg-gray-100 text-gray-800': !['DOCTOR', 'NURSE', 'SECRETARY', 'STAFF', 'ADMIN'].includes(staff.role)
								}"
							>
								{{ staff.role }}
							</span>
						</TableCell>
						<TableCell>{{ staff.profession || '-' }}</TableCell>
						<TableCell :title="staff.createdAt ? new Date(staff.createdAt).toISOString() : ''">
							{{ staff.createdAt ? new Date(staff.createdAt).toLocaleDateString() + ' ' + new Date(staff.createdAt).toLocaleTimeString() : '-' }}
						</TableCell>
						<TableCell :title="staff.updatedAt ? new Date(staff.updatedAt).toISOString() : ''">
							{{ staff.updatedAt ? new Date(staff.updatedAt).toLocaleDateString() + ' ' + new Date(staff.updatedAt).toLocaleTimeString() : '-' }}
						</TableCell>
						<TableCell class="flex gap-2">
							<Button variant="outline" size="icon" @click="onEdit(staff.id)">
								<Icon name="mdi:pencil" />
							</Button>
							<Button variant="outline" size="icon" @click="staffStore.deleteStaffProfile({ id: staff.id })">
								<Icon name="mdi:trash" />
							</Button>
						</TableCell>
					</TableRow>

					<TableRow v-if="paginatedStaff.length === 0">
						<TableCell colspan="9" class="text-center text-gray-500 py-4">
							No staff found.
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>

			<!-- Pagination controls -->
			<div v-if="totalItems > 0" class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<!-- Left: rows per page -->
				<div class="flex items-center gap-2 text-sm">
					<span>Rows per page:</span>
					<select
						v-model.number="pageSize"
						class="border rounded-md px-2 py-1"
						aria-label="Rows per page"
					>
						<option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
					</select>
					<span class="text-gray-500">
						Showing
						{{
							totalItems
								? ((currentPage - 1) * pageSize + 1) + '–' + Math.min(currentPage * pageSize, totalItems)
								: 0
						}}
						of {{ totalItems }}
					</span>
				</div>

				<!-- Right: pager -->
				<div class="flex items-center gap-1">
					<button
						class="px-3 py-1 border rounded-md disabled:opacity-50"
						:disabled="currentPage === 1"
						aria-label="First page"
						@click="goTo(1)"
					>«</button>

					<button
						class="px-3 py-1 border rounded-md disabled:opacity-50"
						:disabled="currentPage === 1"
						aria-label="Previous page"
						@click="prev"
					>‹</button>

					<button
						v-for="p in pageWindow"
						:key="p"
						class="px-3 py-1 border rounded-md"
						:class="p === currentPage ? 'bg-gray-100 font-medium' : ''"
						:aria-current="p === currentPage ? 'page' : undefined"
						@click="goTo(p)"
					>{{ p }}</button>

					<button
						class="px-3 py-1 border rounded-md disabled:opacity-50"
						:disabled="currentPage === totalPages"
						aria-label="Next page"
						@click="next"
					>›</button>

					<button
						class="px-3 py-1 border rounded-md disabled:opacity-50"
						:disabled="currentPage === totalPages"
						aria-label="Last page"
						@click="goTo(totalPages)"
					>»</button>
				</div>
			</div>

			<!-- Empty states -->
			<div v-if="totalItems === 0" class="flex flex-col gap-2 justify-center items-center h-full py-8">
				<p class="text-sm text-gray-500">
					{{ debouncedQuery ? 'No staff found matching your search.' : 'No Staff Found' }}
				</p>
				<button 
					v-if="debouncedQuery"
					type="button"
					class="text-sm text-blue-600 hover:text-blue-800 underline"
					@click="clearSearch"
				>
					Clear search
				</button>
			</div>
		</div>
	</div>
</template>