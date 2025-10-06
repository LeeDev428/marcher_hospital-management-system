<script setup lang="ts">
import { useMedicalServiceStore } from "@/stores/medical-services/useMedicalServiceStore"
import { 
  serviceTypeOptions, 
  serviceCategoryOptions,
  type ServiceType,
  type ServiceCategory 
} from "@/types/medical-services"
import type { TableMedicalService } from "@/types/medical-services"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import MedicalServiceForm from "./components/MedicalServiceForm.vue"

definePageMeta({
  layout: "staff",
  middleware: ["auth"],
})

const medicalServiceStore = useMedicalServiceStore()

/* ---------------- Local State ---------------- */

const searchQuery = ref("")
const selectedType = ref<ServiceType | undefined>(undefined)
const selectedCategory = ref<ServiceCategory | undefined>(undefined)
const showActiveOnly = ref<boolean>(true)

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const editingServiceId = ref<string | undefined>(undefined)

/* ---------------- Computed ---------------- */

const services = computed(() => medicalServiceStore.medicalServices)
const loading = computed(() => medicalServiceStore.loading)
const pagination = computed(() => medicalServiceStore.pagination)

/* ---------------- Methods ---------------- */

const loadServices = async () => {
  await medicalServiceStore.getMedicalServices({
    search: searchQuery.value || undefined,
    type: selectedType.value,
    category: selectedCategory.value,
    isActive: showActiveOnly.value ? true : undefined,
    page: pagination.value.page,
    limit: pagination.value.limit,
  })
}

const handleSearch = () => {
  medicalServiceStore.pagination.page = 1
  loadServices()
}

const handleClearFilters = () => {
  searchQuery.value = ""
  selectedType.value = undefined
  selectedCategory.value = undefined
  showActiveOnly.value = true
  medicalServiceStore.clearFilters()
}

const openCreateDialog = () => {
  showCreateDialog.value = true
}

const openEditDialog = (serviceId: string) => {
  editingServiceId.value = serviceId
  showEditDialog.value = true
}

const closeCreateDialog = () => {
  showCreateDialog.value = false
}

const closeEditDialog = () => {
  showEditDialog.value = false
  editingServiceId.value = undefined
}

const handleFormSuccess = () => {
  loadServices()
}

const handleDelete = async (service: TableMedicalService) => {
  if (confirm(`Are you sure you want to delete "${service.name}"?`)) {
    await medicalServiceStore.deleteMedicalService(service.id)
  }
}

const handleChangePage = async (page: number) => {
  await medicalServiceStore.changePage(page)
}

/* ---------------- Formatting ---------------- */

const formatServiceType = (type: string) => {
  const option = serviceTypeOptions.find(opt => opt.value === type)
  return option?.label || type
}

const formatCategory = (category?: string | null) => {
  if (!category) return "-"
  const option = serviceCategoryOptions.find(opt => opt.value === category)
  return option?.label || category
}

const formatPrice = (price: string) => {
  return `₱${parseFloat(price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatDuration = (duration: number) => {
  if (duration < 60) return `${duration} mins`
  const hours = Math.floor(duration / 60)
  const mins = duration % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

const getStaffName = (service: TableMedicalService) => {
  if (!service.staff) return "Unknown Staff"
  const { firstName, lastName, middleName } = service.staff
  return `${firstName} ${lastName}${middleName ? ` ${middleName}` : ""}`
}

/* ---------------- Lifecycle ---------------- */

onMounted(() => {
  loadServices()
})
</script>

<template>
  <div class="space-y-6 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Medical Services</h1>
        <p class="text-gray-600 mt-1">Manage services offered by staff members</p>
      </div>
      <Button @click="openCreateDialog">
        <Icon name="mdi:plus" class="mr-2" />
        Create Service
      </Button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search -->
        <div>
          <label class="text-sm font-medium text-gray-700 mb-1 block">Search</label>
          <div class="relative">
            <Input
              v-model="searchQuery"
              placeholder="Search by name..."
              @keyup.enter="handleSearch"
            />
            <Icon 
              name="mdi:magnify" 
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <!-- Type Filter -->
        <div>
          <label class="text-sm font-medium text-gray-700 mb-1 block">Service Type</label>
          <select
            v-model="selectedType"
            @change="handleSearch"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="undefined">All Types</option>
            <option v-for="opt in serviceTypeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <!-- Category Filter -->
        <div>
          <label class="text-sm font-medium text-gray-700 mb-1 block">Category</label>
          <select
            v-model="selectedCategory"
            @change="handleSearch"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="undefined">All Categories</option>
            <option v-for="opt in serviceCategoryOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="text-sm font-medium text-gray-700 mb-1 block">Status</label>
          <div class="flex items-center gap-3 h-10">
            <input
              type="checkbox"
              id="showActive"
              v-model="showActiveOnly"
              @change="handleSearch"
              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="showActive" class="text-sm text-gray-700">
              Show active only
            </label>
          </div>
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="flex gap-2">
        <Button size="sm" @click="handleSearch">
          <Icon name="mdi:filter" class="mr-2" />
          Apply Filters
        </Button>
        <Button size="sm" variant="outline" @click="handleClearFilters">
          <Icon name="mdi:filter-remove" class="mr-2" />
          Clear Filters
        </Button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-gray-200">
      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <Icon name="mdi:loading" class="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
        <p class="text-gray-600">Loading medical services...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="services.length === 0" class="p-8 text-center">
        <Icon name="mdi:file-document-outline" class="text-6xl text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No medical services found</h3>
        <p class="text-gray-600 mb-4">
          {{ searchQuery || selectedType || selectedCategory 
            ? "Try adjusting your filters" 
            : "Get started by creating your first medical service" 
          }}
        </p>
        <Button @click="openCreateDialog">
          <Icon name="mdi:plus" class="mr-2" />
          Create Service
        </Button>
      </div>

      <!-- Table Content -->
      <div v-else class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="service in services" :key="service.id">
              <!-- Service Name -->
              <TableCell class="font-medium">
                <div class="max-w-xs">
                  <div class="font-semibold text-gray-900">{{ service.name }}</div>
                  <div v-if="service.description" class="text-xs text-gray-500 truncate">
                    {{ service.description }}
                  </div>
                </div>
              </TableCell>

              <!-- Type -->
              <TableCell>
                <Badge variant="outline">
                  {{ formatServiceType(service.type) }}
                </Badge>
              </TableCell>

              <!-- Category -->
              <TableCell>
                <span class="text-sm text-gray-600">
                  {{ formatCategory(service.category) }}
                </span>
              </TableCell>

              <!-- Staff -->
              <TableCell>
                <div class="text-sm">
                  <div class="font-medium text-gray-900">{{ getStaffName(service) }}</div>
                  <div class="text-xs text-gray-500">{{ service.staff?.email }}</div>
                </div>
              </TableCell>

              <!-- Price -->
              <TableCell>
                <span class="font-semibold text-green-600">
                  {{ formatPrice(service.price) }}
                </span>
              </TableCell>

              <!-- Duration -->
              <TableCell>
                <div class="flex items-center gap-1 text-sm text-gray-600">
                  <Icon name="mdi:clock-outline" class="w-4 h-4" />
                  {{ formatDuration(service.duration) }}
                </div>
              </TableCell>

              <!-- Status -->
              <TableCell>
                <Badge :variant="service.isActive ? 'default' : 'secondary'">
                  {{ service.isActive ? "Active" : "Inactive" }}
                </Badge>
              </TableCell>

              <!-- Actions -->
              <TableCell class="text-right">
                <div class="flex justify-end gap-2">
                  <Button size="sm" variant="outline" @click="openEditDialog(service.id)">
                    <Icon name="mdi:pencil" class="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" @click="handleDelete(service)">
                    <Icon name="mdi:delete" class="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="border-t border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Showing {{ ((pagination.page - 1) * pagination.limit) + 1 }} to 
            {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of 
            {{ pagination.total }} services
          </div>
          <div class="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              :disabled="pagination.page === 1"
              @click="handleChangePage(pagination.page - 1)"
            >
              <Icon name="mdi:chevron-left" />
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              :disabled="pagination.page >= pagination.totalPages"
              @click="handleChangePage(pagination.page + 1)"
            >
              Next
              <Icon name="mdi:chevron-right" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Dialog -->
    <Dialog :open="showCreateDialog" @update:open="showCreateDialog = $event">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Medical Service</DialogTitle>
        </DialogHeader>
        <MedicalServiceForm
          mode="create"
          @close="closeCreateDialog"
          @success="handleFormSuccess"
        />
      </DialogContent>
    </Dialog>

    <!-- Edit Dialog -->
    <Dialog :open="showEditDialog" @update:open="showEditDialog = $event">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Medical Service</DialogTitle>
        </DialogHeader>
        <MedicalServiceForm
          mode="edit"
          :medical-service-id="editingServiceId"
          @close="closeEditDialog"
          @success="handleFormSuccess"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>
