<script setup lang="ts">
import { useFieldArray } from "vee-validate"
import { relationshipOptions } from "@/types/patients/patientEmergencyContact"
import { TypedInput, TypedSelect } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const { fields, push, remove } = useFieldArray("emergencyContacts")
</script>

<template>
	<div class="flex flex-col gap-4">
		<ul class="flex flex-col gap-2">
			<li v-for="(field, index) in fields" :key="field.key">
				<TypedSelect
					:name="`emergencyContacts[${index}].relationship`"
					label="Relationship"
					placeholder="Select relationship"
					:options="relationshipOptions"
					required
				/>
				<div class="w-full flex gap-4">
					<TypedInput
						:name="`emergencyContacts[${index}].lastName`"
						label="Last Name"
						type="text"
						required
					/>
					<TypedInput
						:name="`emergencyContacts[${index}].firstName`"
						label="First Name"
						type="text"
						required
					/>
					<TypedInput
						:name="`emergencyContacts[${index}].middleName`"
						label="Middle Name"
						type="text"
					/>
					<TypedInput
						:name="`emergencyContacts[${index}].suffix`"
						label="Suffix"
						type="text"
					/>
				</div>
				<div class="w-full flex gap-4">
					<TypedInput
						:name="`emergencyContacts[${index}].phone`"
						label="Phone"
						type="text"
					/>
					<TypedInput
						:name="`emergencyContacts[${index}].email`"
						label="Email"
						type="text"
					/>
					<TypedInput
						:name="`emergencyContacts[${index}].address`"
						label="Address"
						type="text"
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
			Add Emergency Contact
		</Button>
	</div>
</template>
