<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Process Payments</h1>
				<p class="text-muted-foreground">Accept and process patient payments</p>
			</div>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Payment Processing</CardTitle>
				<CardDescription>
					Enter payment details to process patient payments
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="text-center py-12 text-muted-foreground">
					<Icon name="lucide:credit-card" class="w-16 h-16 mx-auto mb-4 text-gray-300" />
					<p>Payment processing interface</p>
					<p class="text-sm mt-2">Select a patient to process their payment</p>
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
