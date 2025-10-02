<script setup lang="ts">
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const props = defineProps<{
	name: string
	label: string
	required?: boolean
	placeholder?: string
	description?: string
}>()
</script>

<template>
	<FormField v-slot="{ componentField }" :name="props.name">
		<FormItem>
			<FormLabel>{{ props.label }} {{ props.required ? "*" : "" }}</FormLabel>
			<FormControl class="min-w-[150px]">
				<div class="relative">
					<Input
						v-bind="componentField"
						type="datetime-local" 
						:placeholder="props.placeholder" 
					/>
				</div>
			</FormControl>
			<FormDescription v-if="props.description">{{ props.description }}</FormDescription>
			<div class="min-h-6 flex items-start">
				<FormMessage />
			</div>
		</FormItem>
	</FormField>
</template>