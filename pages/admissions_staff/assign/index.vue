<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Assign Patients</h1>
				<p class="text-muted-foreground">Assign or reassign patients to doctors</p>
			</div>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Patient Assignment</CardTitle>
				<CardDescription>
					Search for an admitted patient and assign/reassign to a doctor.
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

					<!-- Assignment Form -->
					<div v-if="selectedPatient" class="border rounded-lg p-6 bg-gray-50 space-y-4">
						<h3 class="text-lg font-semibold">Doctor Assignment</h3>

						<!-- Current Active Encounter Info -->
						<div v-if="activeEncounter" class="p-4 bg-blue-50 border border-blue-200 rounded-md">
							<div class="text-sm font-medium text-blue-900 mb-2">Current Active Encounter:</div>
							<div class="text-sm text-blue-800">
								<p><strong>Doctor:</strong> {{ getDoctorName(activeEncounter.doctorId) }}</p>
								<p><strong>Admitted:</strong> {{ formatDate(activeEncounter.date) }} at {{ activeEncounter.time }}</p>
								<p><strong>Triage:</strong> {{ formatTriage(activeEncounter.triage) }}</p>
								<p><strong>Disposition:</strong> {{ activeEncounter.disposition }}</p>
							</div>
						</div>

						<div v-if="!activeEncounter" class="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
							This patient has no active encounter. Please create an encounter first.
						</div>

						<!-- Doctor Selection -->
						<div v-if="activeEncounter">
							<Label for="newDoctor">Assign to Doctor *</Label>
							<select
								id="newDoctor"
								v-model="newDoctorId"
								class="w-full px-3 py-2 border rounded-md bg-white"
								:disabled="isLoadingDoctors || isAssigning"
							>
								<option value="">Select a doctor...</option>
								<option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
									{{ doctor.firstName }} {{ doctor.lastName }}
								</option>
							</select>
							<p v-if="isLoadingDoctors" class="text-xs text-gray-500 mt-1">Loading doctors...</p>
						</div>

						<!-- Action Buttons -->
						<div v-if="activeEncounter" class="flex gap-2 justify-end pt-4 border-t">
							<Button @click="clearSelection" variant="outline">
								Cancel
							</Button>
							<Button 
								@click="assignDoctor" 
								:disabled="!newDoctorId || isAssigning"
								class="bg-green-600 hover:bg-green-700"
							>
								<Icon v-if="isAssigning" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
								<Icon v-else name="lucide:user-check" class="w-4 h-4 mr-2" />
								{{ isAssigning ? 'Assigning...' : 'Assign Doctor' }}
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import { toast } from "vue-sonner"

definePageMeta({
	layout: "admissions-staff",
})

const { $trpc } = useNuxtApp()

const searchQuery = ref("")
const searchResults = ref<any[]>([])
const searching = ref(false)
const selectedPatient = ref<any>(null)
const activeEncounter = ref<any>(null)
const doctors = ref<any[]>([])
const isLoadingDoctors = ref(false)
const newDoctorId = ref("")
const isAssigning = ref(false)

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
	}, 300)
}

async function selectPatient(patient: any) {
	selectedPatient.value = patient
	searchResults.value = []
	searchQuery.value = ""
	
	// Load active encounter for this patient
	await loadActiveEncounter(patient.id)
	
	// Load doctors list
	if (doctors.value.length === 0) {
		await loadDoctors()
	}
}

async function loadActiveEncounter(patientId: string) {
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
	}
}

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

async function assignDoctor() {
	if (!activeEncounter.value || !newDoctorId.value) return

	isAssigning.value = true
	try {
		const result = await $trpc.encounters.inpatient.reassignDoctor.mutate({
			id: activeEncounter.value.id,
			doctorId: newDoctorId.value,
		})

		if (result.success) {
			toast.success("Doctor assigned successfully", {
				description: "The patient has been reassigned",
			})
			
			// Reload active encounter
			await loadActiveEncounter(selectedPatient.value.id)
			newDoctorId.value = ""
		} else {
			toast.error("Failed to assign doctor", {
				description: result.message || "Please try again",
			})
		}
	} catch (error: any) {
		console.error("Error assigning doctor:", error)
		toast.error("Failed to assign doctor", {
			description: error?.message || "An error occurred",
		})
	} finally {
		isAssigning.value = false
	}
}

function clearSelection() {
	selectedPatient.value = null
	activeEncounter.value = null
	searchQuery.value = ""
	searchResults.value = []
	newDoctorId.value = ""
}

function getDoctorName(doctorId: string): string {
	const doctor = doctors.value.find(d => d.id === doctorId)
	return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "Unknown Doctor"
}

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString()
}

function formatTriage(triage: string): string {
	return triage.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}
</script>
