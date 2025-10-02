<script setup lang="ts">
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"

const props = defineProps<{
	name: string
	label: string
	required?: boolean
	description?: string
}>()
</script>

<template>
	<FormField v-slot="{ value, handleChange }" :name="props.name">
		<FormItem class="flex flex-row items-start gap-x-3">
			<FormControl>
				<Checkbox :model-value="value" :required="props.required" @update:model-value="handleChange" />
			</FormControl>
			<FormLabel>{{ props.label }} {{ props.required ? "*" : "" }}</FormLabel>
			<FormDescription v-if="props.description">{{ props.description }}</FormDescription>
			<FormMessage />
		</FormItem>
	</FormField>
</template>
