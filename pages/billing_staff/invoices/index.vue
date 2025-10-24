<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Invoices</h1>
				<p class="text-muted-foreground">Manage patient invoices</p>
			</div>
			<Button>
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
				<div class="text-center py-12 text-muted-foreground">
					<Icon name="lucide:file-text" class="w-16 h-16 mx-auto mb-4 text-gray-300" />
					<p>No invoices found</p>
					<p class="text-sm mt-2">Invoices will appear here when created</p>
				</div>
			</CardContent>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"

definePageMeta({
	layout: "billing-staff",
})
</script>
