<script setup lang="ts">
import { usePharmacyCategoryStore } from "@/stores/pharmacy"
import {
	createPharmacyCategorySchema,
	updatePharmacyCategorySchema,
	type CreatePharmacyCategory,
	type UpdatePharmacyCategory,
} from "@/types/pharmacy"
import { TypedForm, TypedInput } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const pharmacyCategoryStore = usePharmacyCategoryStore()

const props = defineProps<{
	pharmacyCategoryId?: string
}>()

const onSubmit = async (values: CreatePharmacyCategory | UpdatePharmacyCategory) => {
	if (props.pharmacyCategoryId) {
		await pharmacyCategoryStore.updatePharmacyCategory({
			id: props.pharmacyCategoryId,
			...values,
		})
	} else {
		await pharmacyCategoryStore.createPharmacyCategory(values)
	}
}

onMounted(async () => {
	if (props.pharmacyCategoryId) {
		await pharmacyCategoryStore.getPharmacyCategory(props.pharmacyCategoryId)
	}
})
</script>

<template>
	<TypedForm
		:schema="props.pharmacyCategoryId ? updatePharmacyCategorySchema : createPharmacyCategorySchema"
		:initial-values="props.pharmacyCategoryId ? pharmacyCategoryStore.category || {} : {}"
		@submit="onSubmit"
	>
		<TypedInput name="name" label="Name" placeholder="Enter name" type="text" />
		<div class="flex gap-2">
			<Button type="submit" variant="outline">
				<Icon name="mdi:floppy" />
				Save
			</Button>
			<Button type="button" variant="outline" @click="navigateTo('/pharmacy/categories')">
				<Icon name="mdi:arrow-left" />
				Back
			</Button>
		</div>
	</TypedForm>
</template>