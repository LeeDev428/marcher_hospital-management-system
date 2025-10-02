<script setup lang="ts">
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "@/components/ui/form"
import {
	Combobox,
	ComboboxAnchor,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxItemIndicator,
	ComboboxList,
	ComboboxTrigger,
} from "@/components/ui/combobox"

const props = defineProps<{
	name: string
	label: string
	placeholder: string
	options: {
		label: string
		value: string
	}[]
	required?: boolean
	description?: string
}>()

const emit = defineEmits<{
	select: [value: { name: string; value: string }]
	search: [value: string]
}>()
</script>

<template>
	<FormField :name="props.name">
		<FormItem class="flex flex-col">
			<FormLabel>{{ props.label }} {{ props.required ? "*" : "" }}</FormLabel>
			<Combobox by="label">
				<FormControl>
					<ComboboxAnchor>
						<div class="relative w-full max-w-sm items-center">
							<ComboboxInput :display-value="(val) => val?.label ?? ''" :placeholder="props.placeholder" />
							<ComboboxTrigger class="absolute end-0 inset-y-0 flex items-center justify-center px-3">
								<Icon name="mdi:chevron-down" class="size-4 text-muted-foreground" />
							</ComboboxTrigger>
						</div>
					</ComboboxAnchor>
				</FormControl>
				<ComboboxList>
					<ComboboxEmpty>
						No results.
					</ComboboxEmpty>
					<ComboboxGroup>
						<ComboboxItem
							v-for="option in props.options"
							:key="option.value"
							:value="option"
							@select="emit('select', { name: props.name, value: option.value })"
						>
							{{ option.label }}
							<ComboboxItemIndicator>
								<Icon name="mdi:check" />
							</ComboboxItemIndicator>
						</ComboboxItem>
					</ComboboxGroup>
				</ComboboxList>
			</Combobox>
			<FormDescription v-if="props.description">{{ props.description }}</FormDescription>
			<FormMessage />
		</FormItem>
	</FormField>
</template>
