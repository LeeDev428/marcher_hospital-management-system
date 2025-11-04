<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Create New Invoice</h1>
				<p class="text-muted-foreground">Create a new billing transaction for a patient</p>
			</div>
			<Button variant="outline" @click="navigateTo('/billing_staff/invoices')">
				<Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
				Back to Invoices
			</Button>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Invoice Details</CardTitle>
				<CardDescription>Fill in the details to create a new invoice</CardDescription>
			</CardHeader>
			<CardContent>
				<InvoiceForm />
			</CardContent>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import InvoiceForm from "./components/InvoiceForm.vue"

definePageMeta({
	layout: "billing-staff",
})
</script>
