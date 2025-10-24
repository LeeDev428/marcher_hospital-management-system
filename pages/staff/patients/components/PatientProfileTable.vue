<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '~/components/ui/badge'

// State
const activeTab = ref("all")
const patients = ref<any[]>([])
const isLoading = ref(true)
const showViewDialog = ref(false)
const showArchiveDialog = ref(false)
const selectedPatient = ref<any>(null)
const isSubmitting = ref(false)

// Load patients based on active tab
const loadPatients = async () => {
	try {
		isLoading.value = true
		const { $trpc } = useNuxtApp()
		
		const response = activeTab.value === "all" 
			? await $trpc.patients.profiles.getActivePatientProfiles.query({
					search: "",
					page: 1,
					limit: 20,
			  })
			: await $trpc.patients.profiles.getArchivedPatientProfiles.query({
					search: "",
					page: 1,
					limit: 20,
			  })
		
		if (response.success && response.data) {
			patients.value = response.data
		}
	} catch (error) {
		console.error('Error loading patients:', error)
		useToast('error', 'Error', 'Failed to load patients')
	} finally {
		isLoading.value = false
	}
}

// View patient details
const viewPatient = (patient: any) => {
	selectedPatient.value = patient
	showViewDialog.value = true
}

// Archive/Unarchive patient
const confirmArchive = (patient: any) => {
	selectedPatient.value = patient
	showArchiveDialog.value = true
}

const handleArchive = async () => {
	if (!selectedPatient.value) return
	
	try {
		isSubmitting.value = true
		const { $trpc } = useNuxtApp()
		
		const response = activeTab.value === "all"
			? await $trpc.patients.profiles.archivePatientProfile.mutate({ id: selectedPatient.value.id })
			: await $trpc.patients.profiles.unarchivePatientProfile.mutate({ id: selectedPatient.value.id })
		
		if (response.success) {
			useToast('success', 'Success', response.message)
			showArchiveDialog.value = false
			await loadPatients()
		} else {
			useToast('error', 'Error', response.message)
		}
	} catch (error: any) {
		console.error('Error archiving patient:', error)
		useToast('error', 'Error', error.message || 'Failed to archive patient')
	} finally {
		isSubmitting.value = false
	}
}

// Helper functions
const formatDate = (date: string | Date) => {
	if (!date) return 'N/A'
	return new Date(date).toLocaleDateString()
}

const formatDateTime = (date: string | Date) => {
	if (!date) return 'N/A'
	const d = new Date(date)
	return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}

// Watch tab changes
watch(activeTab, async () => {
	await loadPatients()
})

// Load on mount
onMounted(async () => {
	await loadPatients()
})
</script>

<template>
	<div class="h-full w-full flex flex-col gap-4">
		<Tabs v-model="activeTab">
			<TabsList class="mb-4 gap-1">
				<TabsTrigger value="all" class="hover:bg-zinc-200">Active Patients</TabsTrigger>
				<TabsTrigger value="archived" class="hover:bg-zinc-200">Archived</TabsTrigger>
			</TabsList>
		</Tabs>
		
		<div v-if="isLoading" class="flex flex-col gap-2">
			<Skeleton v-for="i in 5" :key="i" class="h-[60px] w-full rounded-md" />
		</div>
		
		<div v-else>
			<Table v-if="patients.length > 0">
				<TableHeader>
					<TableRow>
						<TableHead>Patient Number</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Phone</TableHead>
						<TableHead>Gender</TableHead>
						<TableHead>Blood Type</TableHead>
						<TableHead>Created At</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow
						v-for="patient in patients"
						:key="patient.id"
					>
						<TableCell class="font-medium">{{ patient.patientNumber }}</TableCell>
						<TableCell>
							{{ patient.user.lastName }}, {{ patient.user.firstName }}
							<span v-if="patient.user.middleName">{{ patient.user.middleName }}</span>
						</TableCell>
						<TableCell>{{ patient.user.email }}</TableCell>
						<TableCell>{{ patient.user.phone || 'N/A' }}</TableCell>
						<TableCell>{{ patient.user.gender || 'N/A' }}</TableCell>
						<TableCell>
							<Badge v-if="patient.bloodType" variant="outline">
								{{ patient.bloodType.replace('_', '') }}
							</Badge>
							<span v-else class="text-muted-foreground">N/A</span>
						</TableCell>
						<TableCell>{{ formatDate(patient.createdAt) }}</TableCell>
						<TableCell class="flex gap-2">
							<Button variant="outline" size="sm" @click="viewPatient(patient)">
								<Icon name="lucide:eye" class="w-4 h-4 mr-1" />
								View
							</Button>
							<Button variant="outline" size="sm" as-child>
								<NuxtLink :to="`/staff/patients/${patient.id}/edit`">
									<Icon name="lucide:pencil" class="w-4 h-4 mr-1" />
									Edit
								</NuxtLink>
							</Button>
							<Button 
								variant="outline" 
								size="sm" 
								@click="confirmArchive(patient)"
							>
								<Icon :name="activeTab === 'all' ? 'lucide:archive' : 'lucide:archive-restore'" class="w-4 h-4 mr-1" />
								{{ activeTab === 'all' ? 'Archive' : 'Restore' }}
							</Button>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
			
			<div
				v-else
				class="flex flex-col gap-2 justify-center items-center h-full py-12"
			>
				<Icon name="lucide:users" class="h-12 w-12 text-muted-foreground/50 mb-4" />
				<p class="text-sm text-gray-500">
					{{ activeTab === 'all' ? 'No Active Patients Found' : 'No Archived Patients Found' }}
				</p>
				<Button variant="outline" as-child class="flex items-center gap-2 mt-4">
					<NuxtLink to="/staff/patients/new">
						Add Patient
						<Icon name="lucide:plus" class="w-4 h-4" />
					</NuxtLink>
				</Button>
			</div>
		</div>

		<!-- View Patient Dialog -->
		<Dialog v-model:open="showViewDialog">
			<DialogContent class="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Patient Details</DialogTitle>
					<DialogDescription>Complete information about this patient</DialogDescription>
				</DialogHeader>

				<div v-if="selectedPatient" class="space-y-6 mt-4">
					<!-- Basic Information -->
					<div class="space-y-2">
						<h3 class="font-semibold text-lg border-b pb-2">Basic Information</h3>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<p class="text-sm text-muted-foreground">Patient Number</p>
								<p class="font-medium">{{ selectedPatient.patientNumber }}</p>
							</div>
							<div>
								<p class="text-sm text-muted-foreground">Full Name</p>
								<p class="font-medium">
									{{ selectedPatient.user.firstName }} 
									{{ selectedPatient.user.middleName }} 
									{{ selectedPatient.user.lastName }}
								</p>
							</div>
							<div>
								<p class="text-sm text-muted-foreground">Email</p>
								<p class="font-medium">{{ selectedPatient.user.email }}</p>
							</div>
							<div>
								<p class="text-sm text-muted-foreground">Phone</p>
								<p class="font-medium">{{ selectedPatient.user.phone || 'N/A' }}</p>
							</div>
							<div>
								<p class="text-sm text-muted-foreground">Date of Birth</p>
								<p class="font-medium">{{ formatDate(selectedPatient.user.dateOfBirth) }}</p>
							</div>
							<div>
								<p class="text-sm text-muted-foreground">Gender</p>
								<p class="font-medium">{{ selectedPatient.user.gender || 'N/A' }}</p>
							</div>
							<div>
								<p class="text-sm text-muted-foreground">Status</p>
								<Badge :class="selectedPatient.user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
									{{ selectedPatient.user.status }}
								</Badge>
							</div>
						</div>
					</div>

					<!-- Medical Information -->
					<div class="space-y-2">
						<h3 class="font-semibold text-lg border-b pb-2">Medical Information</h3>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<p class="text-sm text-muted-foreground">Blood Type</p>
								<p class="font-medium">{{ selectedPatient.bloodType || 'N/A' }}</p>
							</div>
							<div>
								<p class="text-sm text-muted-foreground">Allergies</p>
								<p class="font-medium">{{ selectedPatient.allergies || 'None recorded' }}</p>
							</div>
							<div class="col-span-2">
								<p class="text-sm text-muted-foreground">Medical History</p>
								<p class="font-medium">{{ selectedPatient.medicalHistory || 'No history recorded' }}</p>
							</div>
						</div>
					</div>

					<!-- Emergency Contact -->
					<div class="space-y-2">
						<h3 class="font-semibold text-lg border-b pb-2">Emergency Contact</h3>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<p class="text-sm text-muted-foreground">Contact Person</p>
								<p class="font-medium">{{ selectedPatient.emergencyContact || 'N/A' }}</p>
							</div>
							<div>
								<p class="text-sm text-muted-foreground">Contact Phone</p>
								<p class="font-medium">{{ selectedPatient.emergencyPhone || 'N/A' }}</p>
							</div>
						</div>
					</div>

					<!-- Insurance Information -->
					<div class="space-y-2">
						<h3 class="font-semibold text-lg border-b pb-2">Insurance Information</h3>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<p class="text-sm text-muted-foreground">Insurance Provider</p>
								<p class="font-medium">{{ selectedPatient.insuranceProvider || 'N/A' }}</p>
							</div>
							<div>
								<p class="text-sm text-muted-foreground">Insurance Number</p>
								<p class="font-medium">{{ selectedPatient.insuranceNumber || 'N/A' }}</p>
							</div>
						</div>
					</div>

					<!-- System Information -->
					<div class="space-y-2">
						<h3 class="font-semibold text-lg border-b pb-2">System Information</h3>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<p class="text-sm text-muted-foreground">Created At</p>
								<p class="font-medium">{{ formatDateTime(selectedPatient.createdAt) }}</p>
							</div>
							<div>
								<p class="text-sm text-muted-foreground">Last Updated</p>
								<p class="font-medium">{{ formatDateTime(selectedPatient.updatedAt) }}</p>
							</div>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" @click="showViewDialog = false">Close</Button>
					<Button as-child v-if="selectedPatient">
						<NuxtLink :to="`/staff/patients/${selectedPatient.id}/edit`">
							<Icon name="lucide:pencil" class="w-4 h-4 mr-2" />
							Edit Patient
						</NuxtLink>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>

		<!-- Archive/Restore Confirmation Dialog -->
		<Dialog v-model:open="showArchiveDialog">
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{{ activeTab === 'all' ? 'Archive' : 'Restore' }} Patient</DialogTitle>
					<DialogDescription>
						Are you sure you want to {{ activeTab === 'all' ? 'archive' : 'restore' }} this patient?
						{{ activeTab === 'all' ? 'The patient will be moved to the archived list.' : 'The patient will be restored to the active list.' }}
					</DialogDescription>
				</DialogHeader>

				<div v-if="selectedPatient" class="py-4">
					<p class="text-sm">
						<strong>Patient Number:</strong> {{ selectedPatient.patientNumber }}
					</p>
					<p class="text-sm">
						<strong>Name:</strong> {{ selectedPatient.user.firstName }} {{ selectedPatient.user.lastName }}
					</p>
					<p class="text-sm">
						<strong>Email:</strong> {{ selectedPatient.user.email }}
					</p>
				</div>

				<DialogFooter>
					<Button variant="outline" @click="showArchiveDialog = false" :disabled="isSubmitting">
						Cancel
					</Button>
					<Button @click="handleArchive" :disabled="isSubmitting">
						<Icon v-if="isSubmitting" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
						{{ isSubmitting ? 'Processing...' : (activeTab === 'all' ? 'Archive' : 'Restore') }}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>
