<script setup lang="ts">
import { useFieldArray } from "vee-validate"
import { contactTypeOptions } from "@/types/patients"
import { TypedSelect, TypedInput } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const { fields, push, remove } = useFieldArray("contacts")
</script>

<template>
	<div class="flex flex-col gap-4">
		<ul class="flex flex-col gap-2">
			<li v-for="(field, index) in fields" :key="field.key">
				<div class="flex flex-col gap-2">
					<TypedSelect
						:name="`contacts[${index}].type`"
						label="Type"
						placeholder="Select type"
						:options="contactTypeOptions"
						required
					/>
				</div>
				<div class="flex gap-2">
					<TypedInput
						:name="`contacts[${index}].value`"
						label="Value"
						type="text"
						required
					/>
				</div>
				<Button
					type="button"
					variant="outline"
					size="icon"
					@click="remove(index)"
				>
					<Icon name="mdi:trash-can" />
				</Button>
			</li>
		</ul>
		<Button type="button" @click="push({})">
			<Icon name="mdi:plus" />
			Add Contact
		</Button>
	</div>
</template>
