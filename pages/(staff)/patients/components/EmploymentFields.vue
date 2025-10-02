<script setup lang="ts">
import { useFieldArray } from "vee-validate"
import { TypedInput } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const { fields, push, remove } = useFieldArray("employments")
</script>

<template>
	<div class="flex flex-col gap-4">
		<ul class="flex flex-col gap-2">
			<li v-for="(field, index) in fields" :key="field.key">
				<div class="flex flex-col gap-4">
					<div class="w-full flex gap-4">
						<TypedInput
							:name="`employments[${index}].employer`"
							label="Employer"
							type="text"
							required
						/>
						<TypedInput
							:name="`employments[${index}].contactPerson`"
							label="Contact Person"
							type="text"
						/>
					</div>
					<div class="w-full flex gap-4">
						<TypedInput
							:name="`employments[${index}].address`"
							label="Address"
							type="text"
						/>
						<TypedInput
							:name="`employments[${index}].phone`"
							label="Phone"
							type="text"
						/>
						<TypedInput
							:name="`employments[${index}].email`"
							label="Email"
							type="text"
						/>
						<TypedInput
							:name="`employments[${index}].website`"
							label="Website"
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
				</div>
			</li>
		</ul>
		<Button type="button" @click="push({})">
			<Icon name="mdi:plus" />
			Add Employment
		</Button>
	</div>
</template>
