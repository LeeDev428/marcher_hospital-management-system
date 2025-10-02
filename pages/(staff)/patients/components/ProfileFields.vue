<script setup lang="ts">
// import { usePatientProfileStore } from "@/stores/patients/usePatientProfileStore"
import {
	// type CreatePatientProfile,
	// type UpdatePatientProfile,
	maritalStatusOptions,
	sexOptions,
	bloodTypeOptions,
} from "@/types/patients/patientProfile"

import { TypedInput, TypedSelect, TypedDate } from "@/components/app/form"
</script>

<template>
	<div class="flex flex-col gap-4">
		<div class="w-full flex gap-4">
			<TypedInput name="lastName" label="Last Name" type="text" required />
			<TypedInput name="firstName" label="First Name" type="text" required />
			<TypedInput name="middleName" label="Middle Name" type="text" required />
			<TypedInput name="suffix" label="Suffix" type="text" />
		</div>
		<div class="w-full flex gap-4">
			<TypedSelect
				name="sex"
				label="Sex"
				placeholder="Select sex"
				:options="sexOptions"
				required
			/>
			<TypedSelect
				name="bloodType"
				label="Blood Type"
				placeholder="Select blood type"
				:options="bloodTypeOptions"
			/>
			<TypedDate
				name="birthdate"
				label="Birthdate"
				placeholder="Select birthdate"
				required
			/>
			<TypedInput name="birthplace" label="Birthplace" type="text" />
		</div>
		<div class="w-full flex gap-4">
			<TypedInput name="nationality" label="Nationality" type="text" required />
			<TypedInput name="religion" label="Religion" type="text" required />
			<TypedSelect
				name="maritalStatus"
				label="Marital Status"
				placeholder="Select marital status"
				:options="maritalStatusOptions"
				required
			/>
		</div>
	</div>
</template>
