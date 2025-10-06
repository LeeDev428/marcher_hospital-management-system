<script setup lang="ts">
import { Button } from "@/components/ui/button"

interface Props {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "page-change", page: number): void
}>()

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit("page-change", page)
  }
}

const startItem = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)
const endItem = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
    <div class="text-sm text-gray-600">
      Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} results
    </div>
    <div class="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        :disabled="currentPage === 1"
        @click="handlePageChange(currentPage - 1)"
      >
        <Icon name="mdi:chevron-left" class="w-4 h-4" />
        Previous
      </Button>
      
      <div class="flex items-center gap-1">
        <span class="text-sm text-gray-600 px-2">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
      </div>
      
      <Button
        size="sm"
        variant="outline"
        :disabled="currentPage >= totalPages"
        @click="handlePageChange(currentPage + 1)"
      >
        Next
        <Icon name="mdi:chevron-right" class="w-4 h-4" />
      </Button>
    </div>
  </div>
</template>
