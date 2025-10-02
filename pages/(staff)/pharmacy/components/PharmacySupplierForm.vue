<script setup lang="ts">
import { usePharmacySupplierStore } from "@/stores/pharmacy"
import {
	createPharmacySupplierSchema,
	updatePharmacySupplierSchema,
	type CreatePharmacySupplier,
	type UpdatePharmacySupplier,
} from "@/types/pharmacy"
import { TypedForm, TypedInput, TypedTextarea } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const pharmacySupplierStore = usePharmacySupplierStore()

const props = defineProps<{
	pharmacySupplierId?: string
}>()

const onSubmit = async (values: CreatePharmacySupplier | UpdatePharmacySupplier) => {
	if (props.pharmacySupplierId) {
		await pharmacySupplierStore.updatePharmacySupplier({
			id: props.pharmacySupplierId,
			...values,
		})
	} else {
		await pharmacySupplierStore.createPharmacySupplier(values)
	}
}

onMounted(async () => {
	if (props.pharmacySupplierId) {
		await pharmacySupplierStore.getPharmacySupplier(props.pharmacySupplierId)
	}
})
</script>

<template>
	<TypedForm
		:schema="props.pharmacySupplierId ? updatePharmacySupplierSchema : createPharmacySupplierSchema"
		:initial-values="props.pharmacySupplierId ? pharmacySupplierStore.supplier || {} : {}"
		@submit="onSubmit"
	>
		<TypedInput name="name" label="Name" placeholder="Enter name" type="text" />
		<TypedInput name="email" label="Email" placeholder="Enter email" type="email" />
		<TypedInput name="contact" label="Contact" placeholder="Enter contact" type="text" />
		<TypedInput name="address" label="Address" placeholder="Enter address" type="text" />
		<TypedTextarea name="notes" label="Notes" placeholder="Enter notes" />
		<div class="flex gap-2">
			<Button type="submit" variant="outline">
				<Icon name="mdi:floppy" />
				Save
			</Button>
			<Button type="button" variant="outline" @click="navigateTo('/pharmacy/suppliers')">
				<Icon name="mdi:arrow-left" />
				Back
			</Button>
		</div>
	</TypedForm>
</template>