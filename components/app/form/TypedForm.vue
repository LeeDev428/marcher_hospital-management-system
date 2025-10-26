<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import type { ZodSchema } from "zod"

const props = defineProps<{
	schema: ZodSchema<any>
	initialValues?: Record<string, any>
	defaultValues?: Record<string, any>
}>()

const emit = defineEmits<{
	submit: [values: any]
}>()

const { handleSubmit, errors, resetForm, setFieldValue } = useForm({
	validationSchema: toTypedSchema(props.schema),
	initialValues: props.defaultValues || props.initialValues,
})

defineExpose({
	setFieldValue
})

const onSubmit = handleSubmit((values: any) => {
	emit("submit", values)
})

watch(() => props.initialValues, (newVal) => {
	if (newVal) {
		resetForm({
			values: newVal,
		})
	}
})

watch(() => props.defaultValues, (newVal) => {
	if (newVal) {
		resetForm({
			values: newVal,
		})
	}
})
</script>

<template>
	<form class="flex flex-col gap-2" @submit="onSubmit">
		<slot />
		<div v-if="Object.keys(errors).length > 0" class="p-4 bg-red-50 border border-red-200 rounded-md">
			<p class="text-red-800 font-medium mb-2">One or more fields have errors. Please review the form and try again.</p>
			<ul class="text-sm text-red-700 space-y-1">
				<li v-for="(error, field) in errors" :key="field">
					<strong>{{ field }}:</strong> {{ error }}
				</li>
			</ul>
		</div>
	</form>
</template>
