<script setup lang="ts">
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Pie } from "vue-chartjs"

defineProps<{
	title: string
	data: {
		labels: string[]
		datasets: {
			label: string
			data: number[]
			backgroundColor: string[]
		}[]
	}
}>()

ChartJS.register(ArcElement, Tooltip, Legend)
</script>

<template>
	<Card>
		<CardHeader>
			<CardTitle>{{ title }}</CardTitle>
		</CardHeader>
		<CardContent>
			<Pie
				:data="data"
			/>
		</CardContent>
	</Card>
</template>