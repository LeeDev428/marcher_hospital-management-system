<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Patients</h1>
				<p class="text-muted-foreground">View patient billing information</p>
			</div>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Patient List</CardTitle>
				<CardDescription>
					Search and view patient billing details
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="text-center py-12 text-muted-foreground">
					<Icon name="lucide:users" class="w-16 h-16 mx-auto mb-4 text-gray-300" />
					<p>Patient search interface</p>
					<p class="text-sm mt-2">Search for patients to view their billing information</p>
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
