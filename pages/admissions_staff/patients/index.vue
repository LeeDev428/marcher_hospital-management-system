<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Patients</h1>
				<p class="text-muted-foreground">Search and view patient information</p>
			</div>
		</div>

		<Card>
			<CardHeader>
				<div class="flex items-center justify-between">
					<div>
						<CardTitle>Patient Search</CardTitle>
						<CardDescription>
							Search for patients by name to view their details and admission status
						</CardDescription>
					</div>
					<NuxtLink to="/admissions_staff/patients/new">
						<Button variant="outline" size="icon">
							<Icon name="mdi:plus" />
						</Button>
					</NuxtLink>
				</div>
			</CardHeader>

			
			<CardContent>
				<div class="space-y-4">
					<!-- Search Input -->
					<div>
						<Label>Search Patient by Name</Label>
						<Input 
							v-model="searchQuery" 
							placeholder="Type patient name (first or last name)..." 
							@input="searchPatients"
						/>
						
						<!-- Search Results Dropdown -->
						<div v-if="searchResults.length > 0" class="mt-2 border rounded-md max-h-96 overflow-y-auto bg-white shadow-lg">
							<div
								v-for="patient in searchResults"
								:key="patient.id"
								@click="selectPatient(patient)"
								class="p-4 hover:bg-green-50 cursor-pointer border-b last:border-b-0 transition-colors"
							>
								<div class="flex justify-between items-start">
									<div>
										<div class="font-semibold text-gray-900 text-lg">
											{{ patient.user.firstName }} {{ patient.user.lastName }}
											<span v-if="patient.user.middleName" class="text-gray-600">{{ patient.user.middleName }}</span>
										</div>
										<div class="text-sm text-gray-600 mt-1">
											<span v-if="patient.user.email">📧 {{ patient.user.email }}</span>
											<span v-if="patient.user.phone" class="ml-3">📱 {{ patient.user.phone }}</span>
										</div>
										<div class="text-xs text-gray-500 mt-1">
											<span>Patient ID: {{ patient.id }}</span>
											<span v-if="patient.user.dateOfBirth" class="ml-3">
												DOB: {{ formatDate(patient.user.dateOfBirth) }}
											</span>
										</div>
									</div>
									<Badge v-if="patient.user.status === 'ACTIVE'" variant="default" class="bg-green-100 text-green-800">
										Active
									</Badge>
									<Badge v-else variant="secondary">
										{{ patient.user.status }}
									</Badge>
								</div>
							</div>
						</div>
						
						<!-- No results message -->
						<div v-if="searchQuery && searchResults.length === 0 && !searching" class="mt-2 p-4 text-sm text-gray-500 border rounded-md text-center">
							<Icon name="lucide:search-x" class="w-8 h-8 mx-auto mb-2 text-gray-300" />
							No patients found matching "{{ searchQuery }}"
						</div>

						<!-- Loading state -->
						<div v-if="searching" class="mt-2 p-4 text-sm text-gray-500 border rounded-md text-center">
							<Icon name="lucide:loader-2" class="w-6 h-6 mx-auto mb-2 text-gray-400 animate-spin" />
							Searching...
						</div>
					</div>

					<!-- Selected Patient Details -->
					<div v-if="selectedPatient" class="mt-6">
						<div class="border rounded-lg p-6 bg-gradient-to-r from-green-50 to-emerald-50">
							<div class="flex justify-between items-start mb-4">
								<div>
									<h3 class="text-xl font-bold text-gray-900">
										{{ selectedPatient.user.firstName }} {{ selectedPatient.user.lastName }}
									</h3>
									<p class="text-sm text-gray-600 mt-1">Patient Information</p>
								</div>
								<Button @click="clearSelection" variant="outline" size="sm">
									<Icon name="lucide:x" class="w-4 h-4 mr-1" />
									Clear
								</Button>
							</div>

							<!-- Patient Details Grid -->
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-md">
								<div>
									<p class="text-xs text-gray-500 uppercase">Email</p>
									<p class="font-medium">{{ selectedPatient.user.email || 'N/A' }}</p>
								</div>
								<div>
									<p class="text-xs text-gray-500 uppercase">Phone</p>
									<p class="font-medium">{{ selectedPatient.user.phone || 'N/A' }}</p>
								</div>
								<div>
									<p class="text-xs text-gray-500 uppercase">Date of Birth</p>
									<p class="font-medium">{{ formatDate(selectedPatient.user.dateOfBirth) || 'N/A' }}</p>
								</div>
								<div>
									<p class="text-xs text-gray-500 uppercase">Gender</p>
									<p class="font-medium">{{ selectedPatient.user.gender || 'N/A' }}</p>
								</div>
								<div class="md:col-span-2">
									<p class="text-xs text-gray-500 uppercase">Address</p>
									<p class="font-medium">
										{{ formatAddress(selectedPatient.user) }}
									</p>
								</div>
							</div>

							<!-- Action Buttons -->
							<div class="flex gap-2 mt-4">
								<Button @click="goToEncounters" class="bg-green-600 hover:bg-green-700">
									<Icon name="lucide:clipboard-list" class="w-4 h-4 mr-2" />
									View Encounters
								</Button>
								<Button @click="goToAssign" variant="outline">
									<Icon name="lucide:user-check" class="w-4 h-4 mr-2" />
									Assign Doctor
								</Button>
							</div>
						</div>

						<!-- Check for Active Encounter -->
						<div v-if="loadingEncounter" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-center">
							<Icon name="lucide:loader-2" class="w-6 h-6 mx-auto mb-2 text-blue-600 animate-spin" />
							<p class="text-sm text-blue-800">Checking admission status...</p>
						</div>

						<div v-else-if="activeEncounter" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
							<div class="flex items-start gap-3">
								<Icon name="lucide:bed" class="w-5 h-5 text-blue-600 mt-0.5" />
								<div class="flex-1">
									<p class="font-semibold text-blue-900">Currently Admitted</p>
									<div class="text-sm text-blue-800 mt-2 space-y-1">
										<p><strong>Doctor:</strong> {{ getDoctorName(activeEncounter.doctorId) }}</p>
										<p><strong>Admitted:</strong> {{ formatDate(activeEncounter.date) }} at {{ activeEncounter.time }}</p>
										<p><strong>Triage:</strong> {{ formatTriage(activeEncounter.triage) }}</p>
										<p><strong>Chief Complaint:</strong> {{ activeEncounter.chiefComplaint }}</p>
									</div>
								</div>
							</div>
						</div>

						<div v-else class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
							<Icon name="lucide:info" class="w-5 h-5 mx-auto mb-2 text-gray-400" />
							<p class="text-sm text-gray-600">This patient has no active admission</p>
						</div>
					</div>

					<!-- Empty State / Patient Table -->
					<div v-if="!selectedPatient">
						<!-- Tabs for Active/Archived -->
						<div class="border-b mb-4">
							<div class="flex gap-4">
								<button
									@click="currentTab = 'active'"
									:class="[
										'pb-2 px-1 border-b-2 font-medium text-sm transition-colors',
										currentTab === 'active' 
											? 'border-green-600 text-green-600' 
											: 'border-transparent text-gray-500 hover:text-gray-700'
									]"
								>
									Active Patients
								</button>
								<button
									@click="currentTab = 'archived'"
									:class="[
										'pb-2 px-1 border-b-2 font-medium text-sm transition-colors',
										currentTab === 'archived' 
											? 'border-green-600 text-green-600' 
											: 'border-transparent text-gray-500 hover:text-gray-700'
									]"
								>
									Archived
								</button>
							</div>
						</div>

						<!-- Loading State -->
						<div v-if="loadingPatients" class="text-center py-12">
							<Icon name="lucide:loader-2" class="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
							<p class="text-sm text-gray-500">Loading patients...</p>
						</div>

						<!-- Patients Table -->
						<div v-else-if="displayedPatients.length > 0" class="border rounded-lg overflow-hidden">
							<table class="w-full">
								<thead class="bg-gray-50 border-b">
									<tr>
										<th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Patient Number</th>
										<th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Name</th>
										<th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Email</th>
										<th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Phone</th>
										<th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Gender</th>
										<th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Blood Type</th>
										<th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Created At</th>
										<th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for="patient in displayedPatients"
										:key="patient.id"
										@click="selectPatientFromTable(patient)"
										class="border-b hover:bg-green-50 cursor-pointer transition-colors"
									>
										<td class="py-3 px-4 text-sm">{{ patient.patientNumber }}</td>
										<td class="py-3 px-4 text-sm font-medium">
											{{ patient.user.lastName }}, {{ patient.user.firstName }}
										</td>
										<td class="py-3 px-4 text-sm">{{ patient.user.email || 'N/A' }}</td>
										<td class="py-3 px-4 text-sm">{{ patient.user.phone || 'N/A' }}</td>
										<td class="py-3 px-4 text-sm">{{ patient.user.gender || 'N/A' }}</td>
										<td class="py-3 px-4 text-sm">{{ patient.bloodType || 'N/A' }}</td>
										<td class="py-3 px-4 text-sm">{{ formatDate(patient.createdAt) }}</td>
										<td class="py-3 px-4">
											<div class="flex items-center gap-2">
												<Button
													@click.stop="selectPatientFromTable(patient)"
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
							<Icon name="lucide:users-x" class="w-16 h-16 mx-auto mb-4 text-gray-300" />
							<p class="text-lg font-medium">No Patients Found</p>
							<p class="text-sm mt-2">
								{{ searchQuery ? `No results for "${searchQuery}"` : 'No patients in this category' }}
							</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"

definePageMeta({
	layout: "admissions-staff",
})

const { $trpc } = useNuxtApp()
const router = useRouter()

const searchQuery = ref("")
const searchResults = ref<any[]>([])
const searching = ref(false)
const selectedPatient = ref<any>(null)
const activeEncounter = ref<any>(null)
const loadingEncounter = ref(false)
const doctors = ref<any[]>([])
const allPatients = ref<any[]>([])
const archivedPatients = ref<any[]>([])
const loadingPatients = ref(false)
const currentTab = ref<'active' | 'archived'>('active')

let searchTimeout: NodeJS.Timeout | null = null

// Computed property for displayed patients based on search and tab
const displayedPatients = computed(() => {
	const patients = currentTab.value === 'active' ? allPatients.value : archivedPatients.value
	
	if (!searchQuery.value || searchQuery.value.length < 2) {
		return patients
	}
	
	// Filter patients based on search query
	const query = searchQuery.value.toLowerCase()
	return patients.filter(patient => {
		const firstName = patient.user.firstName?.toLowerCase() || ''
		const lastName = patient.user.lastName?.toLowerCase() || ''
		const email = patient.user.email?.toLowerCase() || ''
		const patientNumber = patient.patientNumber?.toLowerCase() || ''
		
		return firstName.includes(query) || 
		       lastName.includes(query) || 
		       email.includes(query) ||
		       patientNumber.includes(query)
	})
})

// Load all patients on mount
onMounted(async () => {
	await loadAllPatients()
	await loadDoctors()
})

// Watch tab changes to load appropriate data
watch(currentTab, async () => {
	if (currentTab.value === 'archived' && archivedPatients.value.length === 0) {
		await loadArchivedPatients()
	}
})

async function loadAllPatients() {
	loadingPatients.value = true
	try {
		const response = await $trpc.patients.profiles.getActivePatientProfiles.query({
			search: '',
			page: 1,
			limit: 20,
		})
		
		if (response.success && response.data) {
			allPatients.value = response.data
		}
	} catch (error) {
		console.error("Failed to load patients:", error)
	} finally {
		loadingPatients.value = false
	}
}

async function loadArchivedPatients() {
	loadingPatients.value = true
	try {
		const response = await $trpc.patients.profiles.getArchivedPatientProfiles.query({
			search: '',
			page: 1,
			limit: 20,
		})
		
		if (response.success && response.data) {
			archivedPatients.value = response.data
		}
	} catch (error) {
		console.error("Failed to load archived patients:", error)
	} finally {
		loadingPatients.value = false
	}
}

async function searchPatients() {
	// Clear previous timeout
	if (searchTimeout) {
		clearTimeout(searchTimeout)
	}
	
	// If search query is too short, clear results
	if (searchQuery.value.length < 2) {
		searchResults.value = []
		return
	}
	
	// Debounce search
	searchTimeout = setTimeout(async () => {
		searching.value = true
		try {
			const response = await $trpc.patients.profiles.getActivePatientProfiles.query({
				search: searchQuery.value,
				page: 1,
				limit: 20,
			})
			
			if (response.success && response.data) {
				searchResults.value = response.data
			} else {
				searchResults.value = []
			}
		} catch (error) {
			console.error("Failed to search patients:", error)
			searchResults.value = []
		} finally {
			searching.value = false
		}
	}, 300)
}

async function selectPatient(patient: any) {
	selectedPatient.value = patient
	searchResults.value = []
	searchQuery.value = ""
	
	// Load active encounter
	await loadActiveEncounter(patient.id)
	
	// Load doctors for display
	if (doctors.value.length === 0) {
		await loadDoctors()
	}
}

function selectPatientFromTable(patient: any) {
	selectPatient(patient)
}

async function loadActiveEncounter(patientId: string) {
	loadingEncounter.value = true
	try {
		const response = await $trpc.encounters.inpatient.getInpatientEncounters.query({
			patientId,
		})
		
		if (response.success && response.data) {
			// Find the active encounter (ADMITTED disposition)
			activeEncounter.value = response.data.find((enc: any) => enc.disposition === 'ADMITTED') || null
		}
	} catch (error) {
		console.error("Failed to load active encounter:", error)
		activeEncounter.value = null
	} finally {
		loadingEncounter.value = false
	}
}

async function loadDoctors() {
	try {
		const result = await $trpc.staff.profiles.getStaffByType.query("DOCTOR")
		
		if (result.success && result.data) {
			doctors.value = result.data
		}
	} catch (error) {
		console.error("Error loading doctors:", error)
	}
}

function clearSelection() {
	selectedPatient.value = null
	activeEncounter.value = null
	searchQuery.value = ""
	searchResults.value = []
	// Reload patients to refresh the table
	if (currentTab.value === 'active') {
		loadAllPatients()
	} else {
		loadArchivedPatients()
	}
}

function goToEncounters() {
	router.push('/admissions_staff/encounters')
}

function goToAssign() {
	router.push('/admissions_staff/assign')
}

function getDoctorName(doctorId: string): string {
	const doctor = doctors.value.find(d => d.id === doctorId)
	return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "Unknown Doctor"
}

function formatDate(dateStr: string | null): string {
	if (!dateStr) return 'N/A'
	return new Date(dateStr).toLocaleDateString()
}

function formatTriage(triage: string): string {
	return triage.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

function formatAddress(user: any): string {
	const parts = [user.address, user.city, user.province, user.zipCode].filter(Boolean)
	return parts.length > 0 ? parts.join(', ') : 'N/A'
}
</script>
