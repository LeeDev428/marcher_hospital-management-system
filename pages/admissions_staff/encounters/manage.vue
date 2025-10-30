<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Manage Patient Status</h1>
				<p class="text-muted-foreground">Update patient disposition for admitted encounters</p>
			</div>
		</div>

		<!-- Filters -->
		<Card>
			<CardHeader>
				<CardTitle>Filters</CardTitle>
			</CardHeader>
			<CardContent class="flex gap-4">
				<div class="flex-1">
					<Label>Disposition</Label>
					<Select v-model="filters.disposition">
						<SelectTrigger>
							<SelectValue placeholder="All Dispositions" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ADMITTED">Admitted</SelectItem>
							<SelectItem value="DISCHARGED">Discharged</SelectItem>
							<SelectItem value="TRANSFERRED">Transferred</SelectItem>
							<SelectItem value="DISCONTINUED">Discontinued</SelectItem>
							<SelectItem value="DECEASED">Deceased</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div class="flex items-end">
					<Button @click="loadEncounters" variant="outline">
						<Icon name="lucide:search" class="w-4 h-4 mr-2" />
						Search
					</Button>
				</div>
			</CardContent>
		</Card>

		<!-- Encounters Table -->
		<Card>
			<CardHeader>
				<CardTitle>Inpatient Encounters</CardTitle>
				<CardDescription>
					Click on a patient to update their status
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div v-if="loading" class="flex justify-center py-12">
					<Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-muted-foreground" />
				</div>

				<div v-else-if="encounters.length === 0" class="text-center py-12 text-muted-foreground">
					No encounters found
				</div>

				<div v-else class="space-y-3">
					<Card
						v-for="encounter in encounters"
						:key="encounter.id"
						class="cursor-pointer hover:shadow-md transition-shadow"
						@click="openStatusDialog(encounter)"
					>
						<CardContent class="p-4">
							<div class="flex items-center justify-between">
								<div class="flex-1">
									<div class="font-semibold text-lg">
										{{ encounter.patient.user.firstName }} {{ encounter.patient.user.lastName }}
									</div>
									<div class="text-sm text-muted-foreground mt-1">
										Patient #: {{ encounter.patient.patientNumber }}
									</div>
									<div class="text-sm text-muted-foreground">
										Admitted: {{ formatDate(encounter.date) }} at {{ encounter.time }}
									</div>
									<div class="text-sm mt-2">
										<span class="font-medium">Chief Complaint:</span> {{ encounter.chiefComplaint }}
									</div>
									<div v-if="encounter.dataShareStatus" class="text-sm mt-2 flex items-center gap-2">
										<Icon name="lucide:share-2" class="w-4 h-4" />
										<span class="font-medium">Data Share:</span>
										<Badge :variant="getDataShareVariant(encounter.dataShareStatus)" class="text-xs">
											{{ encounter.dataShareStatus }}
										</Badge>
									</div>
								</div>
								<div class="flex flex-col items-end gap-2">
									<Badge :variant="getDispositionVariant(encounter.disposition)">
										{{ encounter.disposition }}
									</Badge>
									<div class="text-xs text-muted-foreground">
										Triage: {{ encounter.triage }}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</CardContent>
		</Card>

		<!-- Update Status Dialog -->
		<Dialog v-model:open="showDialog">
			<DialogContent class="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Update Patient Status</DialogTitle>
					<DialogDescription>
						Change the disposition for {{ selectedEncounter?.patient?.user?.firstName }} {{ selectedEncounter?.patient?.user?.lastName }}
					</DialogDescription>
				</DialogHeader>

				<div class="space-y-4 py-4">
					<div class="space-y-2">
						<Label>Current Status</Label>
						<div class="p-3 bg-muted rounded-md">
							<Badge :variant="getDispositionVariant(selectedEncounter?.disposition)">
								{{ selectedEncounter?.disposition }}
							</Badge>
						</div>
					</div>

					<div class="space-y-2">
						<Label for="newDisposition">New Status *</Label>
						<Select v-model="updateForm.disposition" required>
							<SelectTrigger id="newDisposition">
								<SelectValue placeholder="Select new status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ADMITTED">Admitted</SelectItem>
								<SelectItem value="DISCHARGED">Discharged</SelectItem>
								<SelectItem value="TRANSFERRED">Transferred</SelectItem>
								<SelectItem value="DISCONTINUED">Discontinued</SelectItem>
								<SelectItem value="DECEASED">Deceased</SelectItem>
								<SelectItem value="OTHER">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div class="space-y-2">
						<Label for="dispositionNote">Notes (Optional)</Label>
						<Textarea
							id="dispositionNote"
							v-model="updateForm.note"
							placeholder="Add any notes about this status change..."
							rows="3"
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" @click="showDialog = false" :disabled="updating">
						Cancel
					</Button>
					<Button @click="updateStatus" :disabled="!updateForm.disposition || updating">
						<Icon v-if="updating" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
						Update Status
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Textarea } from '~/components/ui/textarea'
import { toast } from 'vue-sonner'

definePageMeta({
	layout: 'admissions-staff',
	middleware: ['staff-type']
})

useHead({
	title: 'Manage Patient Status - Admissions Staff'
})

const { $trpc } = useNuxtApp()

const loading = ref(false)
const updating = ref(false)
const showDialog = ref(false)
const encounters = ref<any[]>([])
const selectedEncounter = ref<any>(null)

const filters = reactive({
	disposition: ''
})

const updateForm = reactive<{
	disposition: 'ADMITTED' | 'DISCHARGED' | 'DISCONTINUED' | 'TRANSFERRED' | 'DECEASED' | 'OTHER' | ''
	note: string
}>({
	disposition: '',
	note: ''
})

onMounted(() => {
	loadEncounters()
})

async function loadEncounters() {
	loading.value = true
	try {
		const response = await $trpc.encounters.inpatient.getAllInpatientEncounters.query({
			disposition: filters.disposition || undefined,
			page: 1,
			limit: 100
		})

		if (response.success) {
			encounters.value = response.data
		} else {
			toast.error('Error', {
				description: response.message || 'Failed to load encounters'
			})
		}
	} catch (error: any) {
		console.error('Error loading encounters:', error)
		toast.error('Error', {
			description: 'Failed to load encounters'
		})
	} finally {
		loading.value = false
	}
}

function openStatusDialog(encounter: any) {
	selectedEncounter.value = encounter
	updateForm.disposition = encounter.disposition
	updateForm.note = ''
	showDialog.value = true
}

async function updateStatus() {
	if (!selectedEncounter.value || !updateForm.disposition) return

	updating.value = true
	try {
		const now = new Date()
		const response = await $trpc.encounters.inpatient.updateInpatientEncounter.mutate({
			id: selectedEncounter.value.id,
			disposition: updateForm.disposition as any,
			dispositionDate: now.toISOString().split('T')[0],
			dispositionTime: now.toTimeString().split(' ')[0].substring(0, 5),
			dispositionNote: updateForm.note || undefined
		})

		if (response.success) {
			toast.success('Status Updated', {
				description: `Patient status changed to ${updateForm.disposition}`
			})
			showDialog.value = false
			await loadEncounters()
		} else {
			throw new Error(response.message || 'Failed to update status')
		}
	} catch (error: any) {
		console.error('Error updating status:', error)
		toast.error('Update Failed', {
			description: error.message || 'Failed to update patient status'
		})
	} finally {
		updating.value = false
	}
}

function getDispositionVariant(disposition: string): 'default' | 'secondary' | 'outline' | 'destructive' {
	const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
		ADMITTED: 'default',
		DISCHARGED: 'secondary',
		TRANSFERRED: 'outline',
		DISCONTINUED: 'outline',
		DECEASED: 'destructive',
		OTHER: 'outline'
	}
	return variants[disposition] || 'default'
}

function getDataShareVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
	const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
		PENDING: 'outline',
		SUBMITTED: 'default',
		APPROVED: 'default',
		DENIED: 'destructive',
		ACCESSED: 'secondary',
		EXPIRED: 'outline'
	}
	return variants[status] || 'outline'
}

function formatDate(dateStr: string) {
	if (!dateStr) return 'N/A'
	const date = new Date(dateStr)
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	})
}
</script>
