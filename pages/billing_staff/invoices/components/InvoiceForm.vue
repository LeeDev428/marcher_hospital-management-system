<template>
	<form @submit.prevent="handleSubmit" class="space-y-6">
		<!-- Patient Selection -->
		<div class="space-y-2">
			<Label for="encounterId">Select Encounter / Patient</Label>
			<Select v-model="form.encounterId" :disabled="loadingEncounters || encounters.length === 0">
				<SelectTrigger>
					<SelectValue :placeholder="loadingEncounters ? 'Loading encounters...' : encounters.length === 0 ? 'No encounters available' : 'Select encounter'" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem v-for="encounter in encounters" :key="encounter.id" :value="encounter.id">
						{{ encounter.patient.user.firstName }} {{ encounter.patient.user.lastName }} - {{ new Date(encounter.createdAt).toLocaleDateString() }} ({{ encounter.disposition }})
					</SelectItem>
				</SelectContent>
			</Select>
			<p v-if="errors.encounterId" class="text-sm text-red-500">{{ errors.encounterId }}</p>
			<p v-if="!loadingEncounters && encounters.length === 0" class="text-sm text-orange-600">
				No inpatient encounters available. Create an inpatient encounter first before creating an invoice.
			</p>
		</div>

		<!-- Status -->
		<div class="space-y-2">
			<Label for="status">Status</Label>
			<Select v-model="form.status">
				<SelectTrigger>
					<SelectValue placeholder="Select status" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="PENDING">Pending</SelectItem>
					<SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
					<SelectItem value="PAID">Paid</SelectItem>
					<SelectItem value="OVERDUE">Overdue</SelectItem>
					<SelectItem value="CANCELLED">Cancelled</SelectItem>
				</SelectContent>
			</Select>
			<p v-if="errors.status" class="text-sm text-red-500">{{ errors.status }}</p>
		</div>

		<!-- Buttons -->
		<div class="flex gap-4">
			<Button type="submit" :disabled="transactionStore.loading">
				<Icon v-if="transactionStore.loading" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
				{{ transactionStore.loading ? 'Creating...' : 'Create Invoice' }}
			</Button>
			<Button type="button" variant="outline" @click="navigateTo('/billing_staff/invoices')">
				Cancel
			</Button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { useTransactionStore } from "~/stores/billing"
import type { CreateTransaction } from "~/types/billing"

const transactionStore = useTransactionStore()
const { $trpc } = useNuxtApp()

const form = reactive<CreateTransaction>({
	encounterId: '',
	status: 'PENDING',
})

const errors = reactive({
	encounterId: '',
	status: '',
})

const encounters = ref<any[]>([])
const loadingEncounters = ref(false)

// Fetch encounters on mount
onMounted(async () => {
	try {
		loadingEncounters.value = true
		const response = await $trpc.encounters.inpatient.getAllInpatientEncounters.query({
			page: 1,
			limit: 100,
		})
		
		console.log('Encounters response:', response)
		
		if (response.success && response.data) {
			encounters.value = response.data
			console.log('Loaded encounters:', encounters.value.length)
		} else {
			console.error('Failed to load encounters:', response)
			useToast('error', 'Error', 'No encounters found')
		}
	} catch (error) {
		console.error('Failed to fetch encounters:', error)
		useToast('error', 'Error', 'Failed to load encounters')
	} finally {
		loadingEncounters.value = false
	}
})

const validateForm = () => {
	let isValid = true
	errors.encounterId = ''
	errors.status = ''

	if (!form.encounterId) {
		errors.encounterId = 'Please select an encounter'
		isValid = false
	}

	if (!form.status) {
		errors.status = 'Please select a status'
		isValid = false
	}

	return isValid
}

const handleSubmit = async () => {
	if (!validateForm()) {
		return
	}

	await transactionStore.createTransaction(form)
}
</script>
