<script setup lang="ts">
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const props = defineProps<{
	name: string
	label: string
	type: "text" | "email" | "password" | "url"
	required?: boolean
	disabled?: boolean
	placeholder?: string
	description?: string
}>()
const showPassword = ref(false)
</script>

<template>
	<FormField v-slot="{ componentField }" :name="props.name" >
		<FormItem>
			<FormLabel>{{ props.label }} {{ props.required ? "*" : "" }}</FormLabel>
			<FormControl class="min-w-[150px]">
				<div class="relative">
					<Input v-bind="componentField" :type="props.type === 'password' && showPassword ? 'text' : props.type" :placeholder="props.placeholder" :disabled="props.disabled" />
					<Button v-if="props.type === 'password'" variant="ghost" type="button" size="icon" class="absolute right-2 top-1/2 -translate-y-1/2" @click="showPassword = !showPassword">
						<Icon v-if="showPassword" name="mdi:eye" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" />
						<Icon v-else name="mdi:eye-off" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" />
					</Button>
				</div>
			</FormControl>
			<FormDescription v-if="props.description">{{ props.description }}</FormDescription>
			<div class="min-h-6 flex items-start">
				<FormMessage />
			</div>
		</FormItem>
	</FormField>
</template>
