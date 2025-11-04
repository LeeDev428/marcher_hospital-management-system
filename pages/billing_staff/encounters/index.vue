<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Encounters</h1>
				<p class="text-muted-foreground">View patient encounters for billing</p>
			</div>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Patient Encounters</CardTitle>
				<CardDescription>
					Search for a patient by name to view their encounters and process billing.
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
								class="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
							>
								<div class="font-semibold text-gray-900">
									{{ patient.user.firstName }} {{ patient.user.lastName }}
								</div>
								<div class="text-sm text-gray-600">{{ patient.user.email || 'No email' }}</div>
								<!-- <div class="text-xs text-gray-500 mt-1">ID: {{ patient.id }}</div> -->
							</div>
						</div>
						
						<!-- No results message -->
						<div v-if="searchQuery && searchResults.length === 0 && !searching" class="mt-2 p-3 text-sm text-gray-500 border rounded-md">
							No patients found matching "{{ searchQuery }}"
						</div>
					</div>

					<!-- Selected Patient Display -->
					<div v-if="selectedPatient" class="p-4 bg-purple-50 border border-purple-200 rounded-lg">
						<div class="flex justify-between items-start">
							<div>
								<div class="text-sm font-medium text-purple-900">Selected Patient:</div>
								<div class="text-lg font-semibold text-purple-900 mt-1">
									{{ selectedPatient.user.firstName }} {{ selectedPatient.user.lastName }}
								</div>
								<div class="text-sm text-purple-700">{{ selectedPatient.user.email || 'No email' }}</div>
							</div>
							<Button @click="clearSelection" variant="outline" size="sm">
								<Icon name="lucide:x" class="w-4 h-4 mr-1" />
								Clear
							</Button>
						</div>
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
import { ref } from "vue"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import PatientEncountersView from "~/components/app/encounters/PatientEncountersView.vue"

definePageMeta({
	layout: "billing-staff",
})

const { $trpc } = useNuxtApp()

const searchQuery = ref("")
const searchResults = ref<any[]>([])
const searching = ref(false)
const selectedPatient = ref<any>(null)
const selectedPatientId = ref<string | null>(null)

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
}
</script>
