<script setup lang="ts">
import { ref, watch } from "vue"
import { usePharmacyCategoryStore } from "@/stores/pharmacy"
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
  'categorySelected': [categoryId: string]
}>()

const categoryStore = usePharmacyCategoryStore()
const categoryName = ref("")
const editingCategory = ref<{ id: string; name: string } | null>(null)
const isSubmitting = ref(false)

// Load categories when modal opens
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    categoryStore.getPharmacyCategories()
  }
})

// Handle add/update category
const handleSaveCategory = async () => {
  if (!categoryName.value.trim()) {
    useToast("error", "Validation Error", "Category name is required")
    return
  }

  isSubmitting.value = true
  try {
    if (editingCategory.value) {
      // Update existing category
      await categoryStore.updatePharmacyCategory({
        id: editingCategory.value.id,
        name: categoryName.value.trim(),
      })
      useToast("success", "Category Updated", "Category has been updated successfully")
    } else {
      // Create new category
      await categoryStore.createPharmacyCategory({
        name: categoryName.value.trim(),
      })
      useToast("success", "Category Created", "Category has been created successfully")
    }
    
    // Reset form
    categoryName.value = ""
    editingCategory.value = null
    
    // Reload categories
    await categoryStore.getPharmacyCategories()
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

// Handle edit category
const handleEditCategory = (category: { id: string; name: string }) => {
  editingCategory.value = category
  categoryName.value = category.name
}

// Handle delete category
const handleDeleteCategory = async (categoryId: string) => {
  if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
    return
  }

  try {
    await categoryStore.deletePharmacyCategory(categoryId)
    useToast("success", "Category Deleted", "Category has been deleted successfully")
    await categoryStore.getPharmacyCategories()
  } catch (error) {
    console.error(error)
    useToast("error", "Delete Failed", "Failed to delete category. It may be in use by pharmacy items.")
  }
}

// Handle select category
const handleSelectCategory = (categoryId: string) => {
  emit('categorySelected', categoryId)
  emit('update:open', false)
}

// Cancel editing
const handleCancelEdit = () => {
  editingCategory.value = null
  categoryName.value = ""
}
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
    <DialogContent class="max-w-3xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Manage Categories</DialogTitle>
      </DialogHeader>

      <!-- Add/Edit Form -->
      <div class="space-y-4 border-b pb-4">
        <div class="space-y-2">
          <Label for="categoryName">{{ editingCategory ? 'Edit Category' : 'Add New Category' }}</Label>
          <div class="flex gap-2">
            <Input
              id="categoryName"
              v-model="categoryName"
              placeholder="Enter category name"
              @keyup.enter="handleSaveCategory"
              class="flex-1"
            />
            <Button 
              @click="handleSaveCategory" 
              :disabled="!categoryName.trim() || isSubmitting"
              class="bg-blue-600 hover:bg-blue-700"
            >
              <span v-if="isSubmitting">Saving...</span>
              <span v-else>{{ editingCategory ? 'Update' : 'Add' }}</span>
            </Button>
            <Button 
              v-if="editingCategory" 
              @click="handleCancelEdit" 
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <!-- Categories List -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-gray-700">Existing Categories</h3>
        
        <div v-if="categoryStore.loading" class="text-center py-8 text-gray-500">
          Loading categories...
        </div>

        <div v-else-if="categoryStore.categories.length === 0" class="text-center py-8 text-gray-400">
          No categories found. Add your first category above.
        </div>

        <div v-else class="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="category in categoryStore.categories" 
                :key="category.id"
                class="hover:bg-gray-50"
              >
                <TableCell class="font-medium">{{ category.name }}</TableCell>
                <TableCell class="text-sm text-gray-500">
                  {{ new Date(category.createdAt).toLocaleDateString() }}
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      @click="handleSelectCategory(category.id)"
                      class="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      Select
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      @click="handleEditCategory(category)"
                      class="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      @click="handleDeleteCategory(category.id)"
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
