<template>
	<Card>
		<CardHeader>
			<CardTitle>Encounter History</CardTitle>
			<CardDescription>All patient visits and consultations</CardDescription>
		</CardHeader>
		<CardContent>
			<Tabs v-model="activeTab" class="w-full">
				<TabsList class="grid w-full grid-cols-2">
					<TabsTrigger value="inpatient">Inpatient ({{ inpatientEncounters.length }})</TabsTrigger>
					<TabsTrigger value="outpatient">Outpatient ({{ outpatientEncounters.length }})</TabsTrigger>
				</TabsList>

				<!-- Inpatient Tab -->
				<TabsContent value="inpatient" class="space-y-4">
					<div v-if="loadingInpatient" class="flex justify-center py-8">
						<div class="text-muted-foreground">Loading inpatient encounters...</div>
					</div>
					<div v-else-if="inpatientEncounters.length === 0" class="text-center py-8 text-muted-foreground">
						No inpatient encounters found
					</div>
					<div v-else class="space-y-3">
						<div
							v-for="encounter in inpatientEncounters"
							:key="encounter.id"
							class="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
						>
							<div class="flex justify-between items-start">
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-2">
										<Badge :variant="getDispositionBadge(encounter.disposition)">
											{{ encounter.disposition }}
										</Badge>
										<Badge variant="outline" :class="getTriageColor(encounter.triage)">
											{{ encounter.triage }}
										</Badge>
									</div>
									<div class="space-y-1">
										<p class="font-semibold">{{ encounter.chiefComplaint }}</p>
										<p v-if="encounter.doctorDiagnosis" class="text-sm text-muted-foreground">
											Diagnosis: {{ encounter.doctorDiagnosis }}
										</p>
										<div class="flex gap-4 text-xs text-muted-foreground mt-2">
											<span>Admitted: {{ formatDateTime(encounter.date, encounter.time) }}</span>
											<span v-if="encounter.doctor">
												Doctor: Dr. {{ encounter.doctor.firstName }} {{ encounter.doctor.lastName }}
											</span>
										</div>
										<div v-if="encounter.dispositionDate" class="text-xs text-muted-foreground">
											{{ encounter.disposition }}: {{ formatDateTime(encounter.dispositionDate, encounter.dispositionTime) }}
										</div>
									</div>
								</div>
								<div class="flex flex-col gap-2">
									<Button @click="viewInpatientDetails(encounter)" size="sm" variant="ghost">
										<Icon name="lucide:eye" class="w-4 h-4 mr-2" />
										View Details
									</Button>
									<Button @click="goToInsurance(encounter, 'inpatient')" size="sm" variant="outline" class="text-blue-600 border-blue-600 hover:bg-blue-50">
										<Icon name="lucide:file-text" class="w-4 h-4 mr-2" />
										Insurance
									</Button>
								</div>
							</div>
						</div>
					</div>
				</TabsContent>

				<!-- Outpatient Tab -->
				<TabsContent value="outpatient" class="space-y-4">
					<div v-if="loadingOutpatient" class="flex justify-center py-8">
						<div class="text-muted-foreground">Loading outpatient encounters...</div>
					</div>
					<div v-else-if="outpatientEncounters.length === 0" class="text-center py-8 text-muted-foreground">
						No outpatient encounters found
					</div>
					<div v-else class="space-y-3">
						<div
							v-for="encounter in outpatientEncounters"
							:key="encounter.id"
							class="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
						>
							<div class="flex justify-between items-start">
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-2">
										<Badge variant="outline">{{ encounter.type }}</Badge>
										<Badge :variant="encounter.paymentStatus === 'PAID' ? 'default' : 'secondary'">
											{{ encounter.paymentStatus }}
										</Badge>
									</div>
									<div class="space-y-1">
										<p class="font-semibold">{{ encounter.chiefComplaint }}</p>
										<p v-if="encounter.doctorDiagnosis" class="text-sm text-muted-foreground">
											Diagnosis: {{ encounter.doctorDiagnosis }}
										</p>
										<div class="flex gap-4 text-xs text-muted-foreground mt-2">
											<span>Date: {{ formatDateTime(encounter.date, encounter.time) }}</span>
											<span v-if="encounter.doctor">
												Doctor: Dr. {{ encounter.doctor.firstName }} {{ encounter.doctor.lastName }}
											</span>
											<span v-if="encounter.consultationFee" class="font-semibold">
												Fee: ₱{{ encounter.consultationFee }}
											</span>
										</div>
										<p v-if="encounter.notes" class="text-xs text-muted-foreground italic mt-1">
											{{ encounter.notes }}
										</p>
									</div>
								</div>
								<div class="flex flex-col gap-2">
									<Button @click="viewOutpatientDetails(encounter)" size="sm" variant="ghost">
										<Icon name="lucide:eye" class="w-4 h-4 mr-2" />
										View Details
									</Button>
									<Button @click="goToInsurance(encounter, 'outpatient')" size="sm" variant="outline" class="text-blue-600 border-blue-600 hover:bg-blue-50">
										<Icon name="lucide:file-text" class="w-4 h-4 mr-2" />
										Insurance
									</Button>
								</div>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</CardContent>

		<!-- Inpatient Details Dialog -->
		<Dialog v-model:open="showInpatientDialog">
			<DialogContent class="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Inpatient Encounter Details</DialogTitle>
					<DialogDescription v-if="selectedInpatient">
						{{ formatDateTime(selectedInpatient.date, selectedInpatient.time) }}
					</DialogDescription>
				</DialogHeader>

				<div v-if="selectedInpatient" class="space-y-6">
					<!-- Basic Info -->
					<div class="grid grid-cols-2 gap-4">
						<div>
							<Label class="text-muted-foreground">Chief Complaint</Label>
							<p>{{ selectedInpatient.chiefComplaint }}</p>
						</div>
						<div>
							<Label class="text-muted-foreground">Triage</Label>
							<Badge :variant="getTriageColor(selectedInpatient.triage)">
								{{ selectedInpatient.triage }}
							</Badge>
						</div>
						<div>
							<Label class="text-muted-foreground">Disposition</Label>
							<Badge :variant="getDispositionBadge(selectedInpatient.disposition)">
								{{ selectedInpatient.disposition }}
							</Badge>
						</div>
						<div v-if="selectedInpatient.doctor">
							<Label class="text-muted-foreground">Attending Doctor</Label>
							<p>Dr. {{ selectedInpatient.doctor.firstName }} {{ selectedInpatient.doctor.lastName }}</p>
						</div>
						<div v-if="selectedInpatient.doctorDiagnosis">
							<Label class="text-muted-foreground">Diagnosis</Label>
							<p>{{ selectedInpatient.doctorDiagnosis }}</p>
						</div>
						<div v-if="selectedInpatient.dispositionNote">
							<Label class="text-muted-foreground">Disposition Notes</Label>
							<p>{{ selectedInpatient.dispositionNote }}</p>
						</div>
					</div>

					<!-- Charts/Progress Notes -->
					<div v-if="encounterCharts.length > 0">
						<Label class="text-lg font-semibold">Progress Notes</Label>
						<div class="space-y-2 mt-2">
							<div v-for="chart in encounterCharts" :key="chart.id" class="p-3 border rounded-lg">
								<div class="text-sm text-muted-foreground mb-1">
									{{ formatDateTime(chart.date, chart.time) }}
									<span v-if="chart.doctor">
										- Dr. {{ chart.doctor.firstName }} {{ chart.doctor.lastName }}
									</span>
								</div>
								<p>{{ chart.note }}</p>
							</div>
						</div>
					</div>

					<!-- Orders -->
					<div v-if="encounterOrders.length > 0">
						<Label class="text-lg font-semibold">Orders</Label>
						<div class="space-y-2 mt-2">
							<div v-for="order in encounterOrders" :key="order.id" class="p-3 border rounded-lg">
								<div class="flex justify-between items-start">
									<div>
										<p class="font-semibold">{{ order.particular?.name }}</p>
										<p class="text-sm text-muted-foreground">
											{{ order.particular?.type }} - Qty: {{ order.quantity }} - ₱{{ order.cost }}
										</p>
										<p class="text-xs text-muted-foreground">
											Ordered: {{ formatDateTime(order.orderDate, order.orderTime) }}
										</p>
										<p v-if="order.notes" class="text-xs italic mt-1">{{ order.notes }}</p>
									</div>
									<Badge>{{ order.status }}</Badge>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>

		<!-- Outpatient Details Dialog -->
		<Dialog v-model:open="showOutpatientDialog">
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Outpatient Encounter Details</DialogTitle>
					<DialogDescription v-if="selectedOutpatient">
						{{ formatDateTime(selectedOutpatient.date, selectedOutpatient.time) }}
					</DialogDescription>
				</DialogHeader>

				<div v-if="selectedOutpatient" class="space-y-4">
					<div>
						<Label class="text-muted-foreground">Type</Label>
						<p>{{ selectedOutpatient.type }}</p>
					</div>
					<div>
						<Label class="text-muted-foreground">Chief Complaint</Label>
						<p>{{ selectedOutpatient.chiefComplaint }}</p>
					</div>
					<div v-if="selectedOutpatient.doctorDiagnosis">
						<Label class="text-muted-foreground">Diagnosis</Label>
						<p>{{ selectedOutpatient.doctorDiagnosis }}</p>
					</div>
					<div v-if="selectedOutpatient.doctor">
						<Label class="text-muted-foreground">Doctor</Label>
						<p>Dr. {{ selectedOutpatient.doctor.firstName }} {{ selectedOutpatient.doctor.lastName }}</p>
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div v-if="selectedOutpatient.consultationFee">
							<Label class="text-muted-foreground">Consultation Fee</Label>
							<p class="font-semibold">₱{{ selectedOutpatient.consultationFee }}</p>
						</div>
						<div>
							<Label class="text-muted-foreground">Payment Status</Label>
							<Badge :variant="selectedOutpatient.paymentStatus === 'PAID' ? 'default' : 'secondary'">
								{{ selectedOutpatient.paymentStatus }}
							</Badge>
						</div>
					</div>
					<div v-if="selectedOutpatient.notes">
						<Label class="text-muted-foreground">Notes</Label>
						<p>{{ selectedOutpatient.notes }}</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	</Card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog"

const props = defineProps<{
	patientId: string
}>()

const { $trpc } = useNuxtApp()
const router = useRouter()

const activeTab = ref("inpatient")
const loadingInpatient = ref(false)
const loadingOutpatient = ref(false)

const inpatientEncounters = ref<any[]>([])
const outpatientEncounters = ref<any[]>([])
const selectedInpatient = ref<any>(null)
const selectedOutpatient = ref<any>(null)
const encounterCharts = ref<any[]>([])
const encounterOrders = ref<any[]>([])

const showInpatientDialog = ref(false)
const showOutpatientDialog = ref(false)

onMounted(async () => {
	await Promise.all([loadInpatientEncounters(), loadOutpatientEncounters()])
})

async function loadInpatientEncounters() {
	loadingInpatient.value = true
	try {
		const response = await $trpc.encounters.inpatient.getInpatientEncounters.query({
			patientId: props.patientId,
		})
		if (response.success && response.data) {
			inpatientEncounters.value = response.data
		}
	} catch (error) {
		console.error("Failed to load inpatient encounters:", error)
	} finally {
		loadingInpatient.value = false
	}
}

async function loadOutpatientEncounters() {
	loadingOutpatient.value = true
	try {
		const response = await $trpc.encounters.outpatient.getOutpatientEncounters.query({
			patientId: props.patientId,
		})
		if (response.success && response.data) {
			outpatientEncounters.value = response.data
		}
	} catch (error) {
		console.error("Failed to load outpatient encounters:", error)
	} finally {
		loadingOutpatient.value = false
	}
}

async function viewInpatientDetails(encounter: any) {
	selectedInpatient.value = encounter
	encounterCharts.value = []
	encounterOrders.value = []

	// Load charts and orders
	try {
		const [chartsResponse, ordersResponse] = await Promise.all([
			$trpc.encounters.inpatient.getInpatientCharts.query({ encounterId: encounter.id }),
			$trpc.encounters.inpatient.getInpatientOrders.query({ encounterId: encounter.id }),
		])

		if (chartsResponse.success && chartsResponse.data) {
			encounterCharts.value = chartsResponse.data
		}
		if (ordersResponse.success && ordersResponse.data) {
			encounterOrders.value = ordersResponse.data
		}
	} catch (error) {
		console.error("Failed to load encounter details:", error)
	}

	showInpatientDialog.value = true
}

function viewOutpatientDetails(encounter: any) {
	selectedOutpatient.value = encounter
	showOutpatientDialog.value = true
}

function goToInsurance(encounter: any, type: 'inpatient' | 'outpatient') {
	// Check if encounter already has an insurance claim
	if (encounter.insuranceClaim) {
		// Navigate to existing claim
		router.push(`/billing_staff/insurance/claims/${encounter.insuranceClaim.id}`)
	} else {
		// Navigate to create new claim
		router.push(`/billing_staff/insurance/${encounter.id}/new?type=${type}`)
	}
}

function formatDateTime(date: string, time: string) {
	if (!date || !time) return "N/A"
	return `${date} ${time}`
}

function getDispositionBadge(disposition: string) {
	switch (disposition) {
		case "ADMITTED":
			return "default"
		case "DISCHARGED":
			return "secondary"
		case "TRANSFERRED":
			return "outline"
		default:
			return "outline"
	}
}

function getTriageColor(triage: string) {
	switch (triage) {
		case "EMERGENCY":
			return "border-red-500 text-red-700"
		case "URGENT":
			return "border-orange-500 text-orange-700"
		case "NON_URGENT":
			return "border-green-500 text-green-700"
		default:
			return ""
	}
}
</script>
