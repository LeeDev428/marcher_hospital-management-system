<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import type { ZodSchema } from "zod"

const props = defineProps<{
	schema: ZodSchema<any>
	initialValues?: Record<string, any>
}>()

const emit = defineEmits<{
	submit: [values: any]
}>()

const { handleSubmit, errors, resetForm, setFieldValue } = useForm({
	validationSchema: toTypedSchema(props.schema),
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
</script>

<template>
	<form class="flex flex-col gap-2" @submit="onSubmit">
		<slot />
		<div v-if="Object.keys(errors).length > 0" class="text-red-500">
			<p>One or more fields have errors. Please review the form and try again.</p>
		</div>
	</form>
</template>
