<script setup lang="ts">
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
} from "chart.js"
import { Line } from "vue-chartjs"

defineProps<{
	title: string
	data: {
		labels: string[]
		datasets: {
			label: string
			data: number[]
			backgroundColor: string
		}[]
	}
}>()

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)
</script>

<template>
	<Card>
		<CardHeader>
			<CardTitle>{{ title }}</CardTitle>
		</CardHeader>
		<CardContent>
			<Line
				:data="data"
			/>
		</CardContent>
	</Card>
</template>