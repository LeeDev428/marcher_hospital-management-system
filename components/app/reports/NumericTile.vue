<script setup lang="ts">
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

defineProps<{
	title: string
	value: number | string
}>()
</script>

<template>
	<Card class="h-[150px] w-fit min-w-[150px] max-w-[250px]">
		<CardHeader>
			<CardTitle class="text-sm">{{ title }}</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="text-2xl font-bold">
				{{ value }}
			</div>
		</CardContent>
	</Card>
</template>