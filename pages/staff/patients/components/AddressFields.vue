<script setup lang="ts">
import { useFieldArray } from "vee-validate"
import { TypedInput } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const { fields, push, remove } = useFieldArray("addresses")

const addAddress = () => {
	push({
		label: "",
		country: "",
		state: "",
		zipCode: "",
		city: "",
		address: "",
	})
}

const removeAddress = (index: number) => {
	remove(index)
}
</script>

<template>
	<div class="flex flex-col gap-4">
		<ul class="flex flex-col gap-2">
			<li v-for="(field, index) in fields" :key="field.key">
				<div class="flex flex-col gap-2">
					<TypedInput
						:name="`addresses[${index}].label`"
						label="Label"
						type="text"
						required
					/>
				</div>
				<div class="flex gap-2">
					<TypedInput
						:name="`addresses[${index}].country`"
						label="Country"
						type="text"
						required
					/>
					<TypedInput
						:name="`addresses[${index}].state`"
						label="State"
						type="text"
						required
					/>
					<TypedInput
						:name="`addresses[${index}].zipCode`"
						label="Zip Code"
						type="text"
						required
					/>
					<TypedInput
						:name="`addresses[${index}].city`"
						label="City"
						type="text"
						required
					/>
					<TypedInput
						:name="`addresses[${index}].address`"
						label="Address"
						type="text"
						required
					/>
				</div>
				<Button
					type="button"
					variant="outline"
					size="icon"
					@click="removeAddress(index)"
				>
					<Icon name="mdi:trash-can" />
				</Button>
			</li>
		</ul>
		<Button type="button" @click="addAddress">
			<Icon name="mdi:plus" />
			Add Address
		</Button>
	</div>
</template>
