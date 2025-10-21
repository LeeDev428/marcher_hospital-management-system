<script setup lang="ts">
import { ref, computed } from "vue"
import { usePharmacyBrandStore } from "@/stores/pharmacy"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'brandSelected': [brandId: string]
}>()

const brandStore = usePharmacyBrandStore()
const brandName = ref("")
const editingBrand = ref<{ id: string; name: string } | null>(null)
const isSubmitting = ref(false)

// Load brands when modal opens
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    brandStore.getPharmacyBrands()
  }
})

// Handle add/update brand
const handleSaveBrand = async () => {
  if (!brandName.value.trim()) {
    useToast("error", "Validation Error", "Brand name is required")
    return
  }

  isSubmitting.value = true
  try {
    if (editingBrand.value) {
      // Update existing brand
      await brandStore.updatePharmacyBrand({
        id: editingBrand.value.id,
        name: brandName.value.trim(),
      })
      useToast("success", "Brand Updated", "Brand has been updated successfully")
    } else {
      // Create new brand
      await brandStore.createPharmacyBrand({
        name: brandName.value.trim(),
      })
      useToast("success", "Brand Created", "Brand has been created successfully")
    }
    
    // Reset form
    brandName.value = ""
    editingBrand.value = null
    
    // Reload brands
    await brandStore.getPharmacyBrands()
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

// Handle edit brand
const handleEditBrand = (brand: { id: string; name: string }) => {
  editingBrand.value = brand
  brandName.value = brand.name
}

// Handle delete brand
const handleDeleteBrand = async (brandId: string) => {
  if (!confirm("Are you sure you want to delete this brand? This action cannot be undone.")) {
    return
  }

  try {
    await brandStore.deletePharmacyBrand(brandId)
    useToast("success", "Brand Deleted", "Brand has been deleted successfully")
    await brandStore.getPharmacyBrands()
  } catch (error) {
    console.error(error)
    useToast("error", "Delete Failed", "Failed to delete brand. It may be in use by pharmacy items.")
  }
}

// Handle select brand
const handleSelectBrand = (brandId: string) => {
  emit('brandSelected', brandId)
  emit('update:open', false)
}

// Cancel editing
const handleCancelEdit = () => {
  editingBrand.value = null
  brandName.value = ""
}
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
    <DialogContent class="max-w-3xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Manage Brands</DialogTitle>
      </DialogHeader>

      <!-- Add/Edit Form -->
      <div class="space-y-4 border-b pb-4">
        <div class="space-y-2">
          <Label for="brandName">{{ editingBrand ? 'Edit Brand' : 'Add New Brand' }}</Label>
          <div class="flex gap-2">
            <Input
              id="brandName"
              v-model="brandName"
              placeholder="Enter brand name"
              @keyup.enter="handleSaveBrand"
              class="flex-1"
            />
            <Button 
              @click="handleSaveBrand" 
              :disabled="!brandName.trim() || isSubmitting"
              class="bg-blue-600 hover:bg-blue-700"
            >
              <span v-if="isSubmitting">Saving...</span>
              <span v-else>{{ editingBrand ? 'Update' : 'Add' }}</span>
            </Button>
            <Button 
              v-if="editingBrand" 
              @click="handleCancelEdit" 
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <!-- Brands List -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-gray-700">Existing Brands</h3>
        
        <div v-if="brandStore.loading" class="text-center py-8 text-gray-500">
          Loading brands...
        </div>

        <div v-else-if="brandStore.brands.length === 0" class="text-center py-8 text-gray-400">
          No brands found. Add your first brand above.
        </div>

        <div v-else class="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="brand in brandStore.brands" 
                :key="brand.id"
                class="hover:bg-gray-50"
              >
                <TableCell class="font-medium">{{ brand.name }}</TableCell>
                <TableCell class="text-sm text-gray-500">
                  {{ new Date(brand.createdAt).toLocaleDateString() }}
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      @click="handleSelectBrand(brand.id)"
                      class="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      Select
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      @click="handleEditBrand(brand)"
                      class="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      @click="handleDeleteBrand(brand.id)"
                      class="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
