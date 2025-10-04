<script setup lang="ts">
import { usePharmacyBrandStore } from "@/stores/pharmacy"
import {
	createPharmacyBrandSchema,
	updatePharmacyBrandSchema,
	type CreatePharmacyBrand,
	type UpdatePharmacyBrand,
} from "@/types/pharmacy"
import { TypedForm, TypedInput } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const pharmacyBrandStore = usePharmacyBrandStore()

const props = defineProps<{
	pharmacyBrandId?: string
}>()

const onSubmit = async (values: CreatePharmacyBrand | UpdatePharmacyBrand) => {
	if (props.pharmacyBrandId) {
		await pharmacyBrandStore.updatePharmacyBrand({
			id: props.pharmacyBrandId,
			...values,
		})
	} else {
		await pharmacyBrandStore.createPharmacyBrand(values)
	}
}

onMounted(async () => {
	if (props.pharmacyBrandId) {
		await pharmacyBrandStore.getPharmacyBrand(props.pharmacyBrandId)
	}
})
</script>

<template>
	<TypedForm
		:schema="props.pharmacyBrandId ? updatePharmacyBrandSchema : createPharmacyBrandSchema"
		:initial-values="props.pharmacyBrandId ? pharmacyBrandStore.brand || {} : {}"
		@submit="onSubmit"
	>
		<TypedInput name="name" label="Name" placeholder="Enter name" type="text" />
		<div class="flex gap-2">
			<Button type="submit" variant="outline">
				<Icon name="mdi:floppy" />
				Save
			</Button>
			<Button type="button" variant="outline" @click="navigateTo('/pharmacy/brands')">
				<Icon name="mdi:arrow-left" />
				Back
			</Button>
		</div>
	</TypedForm>
</template>