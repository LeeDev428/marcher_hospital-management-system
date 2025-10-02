<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import {
	NumericTile,
	PieChartTile,
	LineChartTile,
} from "@/components/app/reports"

const breadcrumbsStore = useBreadcrumbsStore()
const samplePieData = {
	labels: ["Total Users", "Total Users", "Total Users"],
	datasets: [
		{
			label: "Total Users",
			data: [100, 100, 100],
			backgroundColor: ["#10b981", "#3b82f6", "#ef4444"],
		},
	],
}
const sampleLineData = {
	labels: ["January", "February", "March", "April", "May", "June", "July"],
	datasets: [
		{
			label: "Total Users",
			data: [10, 20, 30, 40, 50, 60, 70],
			backgroundColor: "#10b981",
		},
	],
}

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Reports", link: "/reports" },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="Reports">
		<div class="h-full w-full grid grid-cols-1 gap-6">
			<div class="flex flex-col gap-4">
				<p class="text-2xl font-bold">
					User Reports
				</p>
				<div class="w-full flex gap-4 overflow-x-auto">
					<NumericTile title="Total Users" value="100" />
					<NumericTile title="Total Users" value="100" />
					<NumericTile title="Total Users" value="100" />
					<NumericTile title="Total Users" value="100" />
				</div>
			</div>
			<div class="flex flex-col gap-4">
				<p class="text-2xl font-bold">
					User Reports
				</p>
				<div class="w-full flex gap-4 overflow-x-auto">
					<PieChartTile title="Total Users" :data="samplePieData" />
					<PieChartTile title="Total Users" :data="samplePieData" />
					<PieChartTile title="Total Users" :data="samplePieData" />
					<PieChartTile title="Total Users" :data="samplePieData" />
				</div>
			</div>
			<div class="flex flex-col gap-4">
				<p class="text-2xl font-bold">
					User Reports
				</p>
				<div class="w-full flex gap-4 overflow-x-auto">
					<LineChartTile title="Total Users" :data="sampleLineData" />
					<LineChartTile title="Total Users" :data="sampleLineData" />
					<LineChartTile title="Total Users" :data="sampleLineData" />
					<LineChartTile title="Total Users" :data="sampleLineData" />
				</div>
			</div>
			<div class="flex flex-col gap-4">
				<p class="text-2xl font-bold">
					User Reports
				</p>
				<div class="w-full flex gap-4 overflow-x-auto">
					<LineChartTile title="Total Users" :data="sampleLineData" />
					<LineChartTile title="Total Users" :data="sampleLineData" />
					<LineChartTile title="Total Users" :data="sampleLineData" />
					<LineChartTile title="Total Users" :data="sampleLineData" />
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>