<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Invoices</h1>
				<p class="text-muted-foreground">Manage patient invoices</p>
			</div>
			<Button @click="navigateTo('/billing_staff/invoices/new')">
				<Icon name="lucide:plus" class="w-4 h-4 mr-2" />
				New Invoice
			</Button>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Invoice List</CardTitle>
				<CardDescription>
					View and manage all patient invoices
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div v-if="transactionStore.loading" class="text-center py-12">
					<Icon name="lucide:loader-2" class="w-8 h-8 mx-auto animate-spin text-gray-400" />
					<p class="text-muted-foreground mt-4">Loading invoices...</p>
				</div>
				
				<div v-else-if="transactionStore.transactions.length === 0" class="text-center py-12 text-muted-foreground">
					<Icon name="lucide:file-text" class="w-16 h-16 mx-auto mb-4 text-gray-300" />
					<p>No invoices found</p>
					<p class="text-sm mt-2">Invoices will appear here when created</p>
				</div>
				
				<div v-else class="overflow-x-auto">
					<table class="w-full">
						<thead class="border-b">
							<tr class="text-left">
								<th class="py-3 px-4">Transaction #</th>
								<th class="py-3 px-4">Patient</th>
								<th class="py-3 px-4">Status</th>
								<th class="py-3 px-4">Total Amount</th>
								<th class="py-3 px-4">Paid Amount</th>
								<th class="py-3 px-4">Balance</th>
								<th class="py-3 px-4">Date</th>
								<!-- <th class="py-3 px-4">Actions</th> -->
							</tr>
						</thead>
						<tbody>
							<tr v-for="transaction in transactionStore.transactions" :key="transaction.id" class="border-b hover:bg-gray-50">
								<td class="py-3 px-4 font-medium">{{ transaction.id }}</td>
								<td class="py-3 px-4">
									{{ transaction.encounter.patient.firstName }} {{ transaction.encounter.patient.lastName }}
								</td>
								<td class="py-3 px-4">
									<span :class="getStatusClass(transaction.status)" class="px-2 py-1 rounded-full text-xs font-semibold">
										{{ transaction.status }}
									</span>
								</td>
								<td class="py-3 px-4">₱0.00</td>
								<td class="py-3 px-4">₱0.00</td>
								<td class="py-3 px-4">₱0.00</td>
								<td class="py-3 px-4">{{ new Date(transaction.createdAt).toLocaleDateString() }}</td>
								<td class="py-3 px-4">
									<!-- <div class="flex gap-2">
										<Button size="sm" variant="outline" @click="viewInvoice(transaction.id)">
											<Icon name="lucide:eye" class="w-4 h-4" />
										</Button>
										<Button size="sm" variant="outline" @click="editInvoice(transaction.id)">
											<Icon name="lucide:edit" class="w-4 h-4" />
										</Button>
									</div> -->
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { useTransactionStore } from "~/stores/billing"

definePageMeta({
	layout: "billing-staff",
})

const transactionStore = useTransactionStore()

const getStatusClass = (status: string) => {
	switch (status) {
		case 'PAID':
			return 'bg-green-100 text-green-800'
		case 'PENDING':
			return 'bg-yellow-100 text-yellow-800'
		case 'PARTIALLY_PAID':
			return 'bg-blue-100 text-blue-800'
		case 'OVERDUE':
			return 'bg-orange-100 text-orange-800'
		case 'CANCELLED':
			return 'bg-red-100 text-red-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
}

const viewInvoice = (id: string) => {
	navigateTo(`/billing_staff/invoices/${id}`)
}

const editInvoice = (id: string) => {
	navigateTo(`/billing_staff/invoices/${id}/edit`)
}

onMounted(async () => {
	await transactionStore.getTransactions()
})
</script>
