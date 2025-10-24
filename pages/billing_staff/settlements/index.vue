<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Balance Settlements</h1>
				<p class="text-muted-foreground">Manage patient account balances</p>
			</div>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Account Settlements</CardTitle>
				<CardDescription>
					View and settle outstanding patient balances
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="text-center py-12 text-muted-foreground">
					<Icon name="lucide:wallet" class="w-16 h-16 mx-auto mb-4 text-gray-300" />
					<p>No pending settlements</p>
					<p class="text-sm mt-2">Patient account balances will appear here</p>
				</div>
			</CardContent>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

definePageMeta({
	layout: "billing-staff",
})
</script>
