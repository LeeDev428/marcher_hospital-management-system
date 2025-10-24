<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Billing Reports</h1>
				<p class="text-muted-foreground">Generate billing and revenue reports</p>
			</div>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Report Generation</CardTitle>
				<CardDescription>
					Generate various billing and financial reports
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="text-center py-12 text-muted-foreground">
					<Icon name="lucide:file-bar-chart" class="w-16 h-16 mx-auto mb-4 text-gray-300" />
					<p>Reports will be generated here</p>
					<p class="text-sm mt-2">Select a report type to generate</p>
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
