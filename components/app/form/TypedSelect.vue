<script setup lang="ts">
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "@/components/ui/select"

interface Props {
	name: string
	label: string
	placeholder: string
	options: {
		label: string
		value: string
	}[]
	required?: boolean
	description?: string
}

const props = defineProps<Props>()
</script>

<template>
	<FormField v-slot="{ componentField }" :name="props.name">
		<FormItem>
			<FormLabel class="text-nowrap">{{ props.label }} {{ props.required ? "*" : "" }}</FormLabel>
			<Select v-bind="componentField">
				<FormControl class="min-w-[150px]">
					<SelectTrigger>
						<SelectValue :placeholder="props.placeholder" />
					</SelectTrigger>
				</FormControl>
				<SelectContent>
					<SelectGroup>
						<SelectItem v-for="option in props.options" :key="option.value" :value="option.value">
							{{ option.label }}
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
			<FormDescription v-if="props.description">{{ props.description }}</FormDescription>
			<div class="min-h-6 flex items-start">
				<FormMessage />
			</div>
		</FormItem>
	</FormField>
</template>