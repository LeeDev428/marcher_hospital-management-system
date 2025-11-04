<script setup lang="ts">
import { ref } from "vue"
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
import BrandManagementModal from "./BrandManagementModal.vue"
import CategoryManagementModal from "./CategoryManagementModal.vue"

const pharmacyItemStore = usePharmacyItemStore()
const pharmacyBrandStore = usePharmacyBrandStore()
const pharmacyCategoryStore = usePharmacyCategoryStore()

const props = defineProps<{
	pharmacyItemId?: string
}>()

// Modal states
const showBrandModal = ref(false)
const showCategoryModal = ref(false)

// Form ref to set values
const formRef = ref<any>(null)

const brandOptions = computed(() => {
	return pharmacyBrandStore.brands.map((brand) => ({
		label: brand.name,
		value: brand.id,
	}))
})

const categoryOptions = computed(() => {
	return pharmacyCategoryStore.categories.map((category) => ({
		label: category.name,
		value: category.id,
	}))
})

// Handle brand selected from modal
const handleBrandSelected = (brandId: string) => {
	// The TypedForm will handle the value update through the select component
	showBrandModal.value = false
}

// Handle category selected from modal
const handleCategorySelected = (categoryId: string) => {
	// The TypedForm will handle the value update through the select component
	showCategoryModal.value = false
}

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
	// Fetch brands and categories when component mounts
	await pharmacyBrandStore.getPharmacyBrands()
	await pharmacyCategoryStore.getPharmacyCategories()
	
	if (props.pharmacyItemId) {
		await pharmacyItemStore.getPharmacyItem(props.pharmacyItemId)
	}
})
</script>

<template>
	<div>
		<TypedForm
			ref="formRef"
			:schema="props.pharmacyItemId ? updatePharmacyItemSchema : createPharmacyItemSchema"
			:initial-values="props.pharmacyItemId ? pharmacyItemStore.item || {} : {}"
			@submit="onSubmit"
		>
			<!-- Brand with + button -->
			<div class="space-y-2">
				<div class="flex items-end gap-2">
					<div class="flex-1">
						<TypedSelect name="brandId" label="Brand" placeholder="Select brand" :options="brandOptions" />
					</div>
					<Button 
						type="button"
						size="icon"
						variant="outline"
						@click="showBrandModal = true"
						class="h-10 w-10 shrink-0 border-2 hover:border-blue-500 hover:bg-blue-50"
						title="Manage Brands"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
					</Button>
				</div>
			</div>

			<!-- Category with + button -->
			<div class="space-y-2">
				<div class="flex items-end gap-2">
					<div class="flex-1">
						<TypedSelect name="categoryId" label="Category" placeholder="Select category" :options="categoryOptions" />
					</div>
					<Button 
						type="button"
						size="icon"
						variant="outline"
						@click="showCategoryModal = true"
						class="h-10 w-10 shrink-0 border-2 hover:border-blue-500 hover:bg-blue-50"
						title="Manage Categories"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
					</Button>
				</div>
			</div>

			<TypedInput name="name" label="Name" placeholder="Enter name" type="text" />
			<TypedSelect name="form" label="Form" placeholder="Select form" :options="pharmacyItemFormOptions" />
			<TypedSelect name="route" label="Route" placeholder="Select route" :options="pharmacyItemRouteOptions" />
			<TypedInput name="strength" label="Strength" placeholder="Enter strength" type="text" />
			<TypedNumber name="stock" label="Stock" placeholder="Enter stock" />
			<TypedNumber name="price" label="Price" placeholder="Enter price" />
			<TypedInput name="unit" label="Unit" placeholder="Enter unit" type="text" />
			<TypedInput name="sku" label="SKU" placeholder="Enter SKU" type="text" />
			
			<div class="flex gap-2">
				<Button type="submit" variant="outline" class="bg-blue-600 text-white hover:bg-blue-700">
					<Icon name="mdi:floppy" class="mr-2" />
					Save
				</Button>
				<Button type="button" variant="outline" @click="navigateTo('/pharmacist/pharmacy')">
					<Icon name="mdi:arrow-left" class="mr-2" />
					Back
				</Button>
			</div>
		</TypedForm>

		<!-- Brand Management Modal -->
		<BrandManagementModal 
			v-model:open="showBrandModal"
			@brand-selected="handleBrandSelected"
		/>

		<!-- Category Management Modal -->
		<CategoryManagementModal 
			v-model:open="showCategoryModal"
			@category-selected="handleCategorySelected"
		/>
	</div>
</template>
