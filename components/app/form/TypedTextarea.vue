<script setup lang="ts">
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

const text = defineModel<string>("text")

const props = defineProps<{
	name: string
	label: string
	required?: boolean
	placeholder?: string
	description?: string
}>()

const setText = (value: string) => {
	text.value = value
}
</script>

<template>
	<FormField v-slot="{ componentField }" :name="props.name" @update:model-value="setText">
		<FormItem>
			<FormLabel>{{ props.label }} {{ props.required ? "*" : "" }}</FormLabel>
			<FormControl>
				<Textarea v-bind="componentField" v-model="text" :placeholder="props.placeholder" :required="props.required" />
			</FormControl>
			<FormDescription>{{ props.description }}</FormDescription>
			<FormMessage />
		</FormItem>
	</FormField>
</template>