<script setup lang="ts">
import { usePharmacyItemStore, usePharmacyBrandStore, usePharmacyCategoryStore } from "@/stores/pharmacy"
import {
	createPharmacyItemSchema,
	updatePharmacyItemSchema,
	type CreatePharmacyItem,
	type UpdatePharmacyItem,
	pharmacyItemFormOptions,
	pharmacyItemRouteOptions,
} from "@/types/pharmacy"
import { TypedForm, TypedSelect, TypedInput, TypedNumber } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const pharmacyItemStore = usePharmacyItemStore()
const pharmacyBrandStore = usePharmacyBrandStore()
const pharmacyCategoryStore = usePharmacyCategoryStore()

const props = defineProps<{
	pharmacyItemId?: string
}>()

const brandOptions = computed(() => {
	pharmacyBrandStore.getPharmacyBrands()

	return pharmacyBrandStore.brands.map((brand) => ({
		label: brand.name,
		value: brand.id,
	}))
})

const categoryOptions = computed(() => {
	pharmacyCategoryStore.getPharmacyCategories()

	return pharmacyCategoryStore.categories.map((category) => ({
		label: category.name,
		value: category.id,
	}))
})

const onSubmit = async (values: CreatePharmacyItem | UpdatePharmacyItem) => {
	if (props.pharmacyItemId) {
		await pharmacyItemStore.updatePharmacyItem({
			id: props.pharmacyItemId,
			...values,
		})
	} else {
		await pharmacyItemStore.createPharmacyItem(values)
	}
}

onMounted(async () => {
	if (props.pharmacyItemId) {
		await pharmacyItemStore.getPharmacyItem(props.pharmacyItemId)
	}
})
</script>

<template>
	<TypedForm
		:schema="props.pharmacyItemId ? updatePharmacyItemSchema : createPharmacyItemSchema"
		:initial-values="props.pharmacyItemId ? pharmacyItemStore.item || {} : {}"
		@submit="onSubmit"
	>
		<TypedSelect name="brandId" label="Brand" placeholder="Select brand" :options="brandOptions" />
		<TypedSelect name="categoryId" label="Category" placeholder="Select category" :options="categoryOptions" />
		<TypedInput name="name" label="Name" placeholder="Enter name" type="text" />
		<TypedSelect name="form" label="Form" placeholder="Select form" :options="pharmacyItemFormOptions" />
		<TypedSelect name="route" label="Route" placeholder="Select route" :options="pharmacyItemRouteOptions" />
		<TypedInput name="strength" label="Strength" placeholder="Enter strength" type="text" />
		<TypedNumber name="stock" label="Stock" placeholder="Enter stock" />
		<TypedInput name="unit" label="Unit" placeholder="Enter unit" type="text" />
		<TypedInput name="sku" label="SKU" placeholder="Enter SKU" type="text" />
		<div class="flex gap-2">
			<Button type="submit" variant="outline">
				<Icon name="mdi:floppy" />
				Save
			</Button>
			<Button type="button" variant="outline" @click="navigateTo('/pharmacy')">
				<Icon name="mdi:arrow-left" />
				Back
			</Button>
		</div>
	</TypedForm>
</template>