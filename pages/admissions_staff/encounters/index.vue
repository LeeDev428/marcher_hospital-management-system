<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">New Encounter</h1>
				<p class="text-muted-foreground">Create new patient encounters</p>
			</div>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Create Patient Encounter</CardTitle>
				<CardDescription>
					Search for a patient by name to create a new encounter.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					<div>
						<Label>Search Patient by Name</Label>
						<Input 
							v-model="searchQuery" 
							placeholder="Type patient name (first or last name)..." 
							@input="searchPatients"
						/>
						
						<!-- Search Results Dropdown -->
						<div v-if="searchResults.length > 0" class="mt-2 border rounded-md max-h-64 overflow-y-auto bg-white shadow-lg">
							<div
								v-for="patient in searchResults"
								:key="patient.id"
								@click="selectPatient(patient)"
								class="p-3 hover:bg-green-50 cursor-pointer border-b last:border-b-0 transition-colors"
							>
								<div class="font-semibold text-gray-900">
									{{ patient.user.firstName }} {{ patient.user.lastName }}
								</div>
								<div class="text-sm text-gray-600">{{ patient.user.email || 'No email' }}</div>
								<div class="text-xs text-gray-500 mt-1">ID: {{ patient.id }}</div>
							</div>
						</div>
						
						<!-- No results message -->
						<div v-if="searchQuery && searchResults.length === 0 && !searching" class="mt-2 p-3 text-sm text-gray-500 border rounded-md">
							No patients found matching "{{ searchQuery }}"
						</div>
					</div>

					<!-- Selected Patient Display -->
					<div v-if="selectedPatient" class="p-4 bg-green-50 border border-green-200 rounded-lg">
						<div class="flex justify-between items-start">
							<div>
								<div class="text-sm font-medium text-green-900">Selected Patient:</div>
								<div class="text-lg font-semibold text-green-900 mt-1">
									{{ selectedPatient.user.firstName }} {{ selectedPatient.user.lastName }}
								</div>
								<div class="text-sm text-green-700">{{ selectedPatient.user.email || 'No email' }}</div>
							</div>
							<Button @click="clearSelection" variant="outline" size="sm">
								<Icon name="lucide:x" class="w-4 h-4 mr-1" />
								Clear
							</Button>
						</div>
					</div>

					<!-- Create Encounter Form -->
					<div v-if="selectedPatient && showCreateForm" class="border rounded-lg p-6 bg-gray-50 space-y-4">
						<div class="flex justify-between items-center mb-4">
							<h3 class="text-lg font-semibold">Admission Details</h3>
							<Button @click="toggleCreateForm" variant="ghost" size="sm">
								<Icon name="lucide:x" class="w-4 h-4" />
							</Button>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<!-- Doctor Selection -->
							<div>
								<Label for="doctor">Assigned Doctor *</Label>
                                <br>
								<select
									id="doctor"
									v-model="encounterForm.doctorId"
									class="w-full px-3 py-2 border rounded-md bg-white"
									:disabled="isLoadingDoctors"
								>
									<option value="">Select a doctor...</option>
									<option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
										{{ doctor.firstName }} {{ doctor.lastName }}
									</option>
								</select>
								<p v-if="isLoadingDoctors" class="text-xs text-gray-500 mt-1">Loading doctors...</p>
							</div>

							<!-- Triage Level -->
							<div>
								<Label for="triage">Triage Priority *</Label>
                                <br>
								<select
									id="triage"
									v-model="encounterForm.triage"
									class="w-full px-3 py-2 border rounded-md bg-white"
								>
									<option value="">Select priority...</option>
									<option v-for="option in triageOptions" :key="option.value" :value="option.value">
										{{ option.label }}
									</option>
								</select>
							</div>

							<!-- Admission Date -->
							<div>
								<Label for="date">Admission Date *</Label>
                                <br>
								<Input
									id="date"
									v-model="encounterForm.date"
									type="date"
									:max="new Date().toISOString().split('T')[0]"
								/>
							</div>

							<!-- Admission Time -->
							<div>
								<Label for="time">Admission Time *</Label>
                                <br>
								<Input
									id="time"
									v-model="encounterForm.time"
									type="time"
								/>
							</div>
						</div>

						<!-- Chief Complaint -->
						<div>
							<Label for="chiefComplaint">Chief Complaint *</Label>
                            <br>
							<textarea
								id="chiefComplaint"
								v-model="encounterForm.chiefComplaint"
								class="w-full px-3 py-2 border rounded-md min-h-[100px] bg-white"
								placeholder="Enter patient's chief complaint and initial findings..."
							></textarea>
						</div>

						<!-- Action Buttons -->
						<div class="flex gap-2 justify-end pt-4 border-t">
							<Button @click="toggleCreateForm" variant="outline">
								Cancel
							</Button>
							<Button 
								@click="createEncounter" 
								:disabled="!isFormValid || isCreating"
								class="bg-green-600 hover:bg-green-700"
							>
								<Icon v-if="isCreating" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
								<Icon v-else name="lucide:plus" class="w-4 h-4 mr-2" />
								{{ isCreating ? 'Creating...' : 'Create Encounter' }}
							</Button>
						</div>
					</div>

					<!-- Toggle Create Form Button -->
					<div v-if="selectedPatient && !showCreateForm" class="pt-4">
						<Button @click="toggleCreateForm" class="bg-green-600 hover:bg-green-700">
							<Icon name="lucide:plus" class="w-4 h-4 mr-2" />
							Create New Inpatient Encounter
						</Button>
					</div>

					<!-- Show patient encounters when selected -->
					<div v-if="selectedPatientId">
						<PatientEncountersView 
							:patient-id="selectedPatientId"
							:show-insurance-button="true"
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import PatientEncountersView from "~/components/app/encounters/PatientEncountersView.vue"
import { inpatientTriageOptions } from "@/types/encounters/inpatientEncounter"
import { toast } from "vue-sonner"

definePageMeta({
	layout: "admissions-staff",
})

const { $trpc } = useNuxtApp()

const searchQuery = ref("")
const searchResults = ref<any[]>([])
const searching = ref(false)
const selectedPatient = ref<any>(null)
const selectedPatientId = ref<string | null>(null)

// Form state
const showCreateForm = ref(false)
const isCreating = ref(false)
const doctors = ref<any[]>([])
const isLoadingDoctors = ref(false)
const triageOptions = inpatientTriageOptions

const encounterForm = ref({
	doctorId: "",
	date: "",
	time: "",
	chiefComplaint: "",
	triage: "",
})

let searchTimeout: NodeJS.Timeout | null = null

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
				limit: 10,
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
	}, 300) // 300ms debounce
}

function selectPatient(patient: any) {
	selectedPatient.value = patient
	selectedPatientId.value = patient.id
	searchResults.value = []
	searchQuery.value = ""
}

function clearSelection() {
	selectedPatient.value = null
	selectedPatientId.value = null
	searchQuery.value = ""
	searchResults.value = []
	showCreateForm.value = false
	resetForm()
}

// Reset form
function resetForm() {
	encounterForm.value = {
		doctorId: "",
		date: "",
		time: "",
		chiefComplaint: "",
		triage: "",
	}
}

// Load doctors
async function loadDoctors() {
	isLoadingDoctors.value = true
	try {
		const result = await $trpc.staff.profiles.getStaffByType.query("DOCTOR")
		
		if (result.success && result.data) {
			doctors.value = result.data
		}
	} catch (error) {
		console.error("Error loading doctors:", error)
		toast.error("Failed to load doctors list", {
			description: "Please try again",
		})
	} finally {
		isLoadingDoctors.value = false
	}
}

// Toggle create form
function toggleCreateForm() {
	showCreateForm.value = !showCreateForm.value
	if (showCreateForm.value && doctors.value.length === 0) {
		loadDoctors()
	}
	if (!showCreateForm.value) {
		resetForm()
	}
}

// Form validation
const isFormValid = computed(() => {
	return (
		encounterForm.value.doctorId &&
		encounterForm.value.date &&
		encounterForm.value.time &&
		encounterForm.value.chiefComplaint.trim() &&
		encounterForm.value.triage
	)
})

// Create new inpatient encounter
async function createEncounter() {
	if (!selectedPatient.value || !isFormValid.value) return

	isCreating.value = true
	try {
		const result = await $trpc.encounters.inpatient.createInpatientEncounter.mutate({
			patientId: selectedPatient.value.id,
			doctorId: encounterForm.value.doctorId,
			date: encounterForm.value.date,
			time: encounterForm.value.time,
			chiefComplaint: encounterForm.value.chiefComplaint,
			triage: encounterForm.value.triage,
		})

		if (result.success) {
			toast.success("Inpatient encounter created successfully", {
				description: "The patient has been admitted",
			})
			
			// Reset form and refresh
			resetForm()
			showCreateForm.value = false
			
			// Force refresh of encounters view
			window.location.reload()
		} else {
			toast.error("Failed to create encounter", {
				description: result.message || "Please try again",
			})
		}
	} catch (error: any) {
		console.error("Error creating encounter:", error)
		toast.error("Failed to create encounter", {
			description: error?.message || "An error occurred",
		})
	} finally {
		isCreating.value = false
	}
}
</script>
