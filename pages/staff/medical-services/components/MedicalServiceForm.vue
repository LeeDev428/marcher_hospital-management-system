<script setup lang="ts">
import { useMedicalServiceStore } from "@/stores/medical-services/useMedicalServiceStore"
import { 
  createMedicalServiceSchema, 
  serviceTypeOptions, 
  serviceCategoryOptions 
} from "@/types/medical-services"
import type { CreateMedicalService, UpdateMedicalService } from "@/types/medical-services"
import {
  TypedForm,
  TypedSelect,
  TypedInput,
  TypedTextarea,
} from "@/components/app/form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/composables/useToast"
import { useAuthStore } from "@/stores/app"

const medicalServiceStore = useMedicalServiceStore()
const authStore = useAuthStore()

const props = defineProps<{
  medicalServiceId?: string
  mode: "create" | "edit"
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "success"): void
}>()

/* ---------------- Local state ---------------- */

const loading = ref(false)
const formData = ref<CreateMedicalService | UpdateMedicalService>({
  staffId: authStore.user?.id || "",
  name: "",
  type: "CONSULTATION",
  category: undefined,
  description: "",
  price: 0,
  duration: 30,
  isActive: true,
  requirements: "",
  notes: "",
})

/* ---------------- Load existing service ---------------- */

const loadMedicalService = async () => {
  if (props.mode === "edit" && props.medicalServiceId) {
    loading.value = true
    const result = await medicalServiceStore.getMedicalService(props.medicalServiceId)
    if (result.success && result.data) {
      formData.value = {
        id: result.data.id,
        staffId: result.data.staffId,
        name: result.data.name,
        type: result.data.type,
        category: result.data.category || undefined,
        description: result.data.description || "",
        price: parseFloat(result.data.price),
        duration: result.data.duration,
        isActive: result.data.isActive,
        requirements: result.data.requirements || "",
        notes: result.data.notes || "",
      }
    }
    loading.value = false
  }
}

/* ---------------- Form submit ---------------- */

const onSubmit = async (data: CreateMedicalService) => {
  try {
    loading.value = true

    // Ensure required fields
    const payload: CreateMedicalService | UpdateMedicalService = {
      ...data,
      staffId: data.staffId,
      name: data.name.trim(),
      type: data.type,
      category: data.category || undefined,
      description: data.description?.trim() || undefined,
      price: Number(data.price),
      duration: Number(data.duration),
      isActive: data.isActive ?? true,
      requirements: data.requirements?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
    }

    let result

    if (props.mode === "edit" && props.medicalServiceId) {
      result = await medicalServiceStore.updateMedicalService({
        ...payload,
        id: props.medicalServiceId,
      } as UpdateMedicalService)
    } else {
      result = await medicalServiceStore.createMedicalService(payload)
    }

    if (result.success) {
      emit("success")
      emit("close")
    }

    loading.value = false
  } catch (error) {
    console.error("Form submission error:", error)
    loading.value = false
    useToast("error", "Medical Services", "Failed to save medical service")
  }
}

/* ---------------- Lifecycle ---------------- */

onMounted(async () => {
  // Load existing service if editing
  if (props.mode === "edit") {
    await loadMedicalService()
  }
})
</script>

<template>
  <div class="space-y-4">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900">
        {{ mode === "edit" ? "Edit Medical Service" : "Create Medical Service" }}
      </h2>
      <p class="text-sm text-gray-600 mt-1">
        {{ mode === "edit" 
          ? "Update the medical service information below." 
          : "Add a new medical service that you offer to patients." 
        }}
      </p>
    </div>

    <TypedForm
      :schema="createMedicalServiceSchema"
      :default-values="formData"
      @submit="onSubmit"
      class="space-y-6"
    >
      <!-- Service Name -->
      <TypedInput
        name="name"
        label="Service Name"
        placeholder="e.g., General Consultation, Blood Pressure Check"
        type="text"
        description="Clear, descriptive name for the service"
      />

      <!-- Service Type -->
      <TypedSelect
        name="type"
        label="Service Type"
        :options="serviceTypeOptions"
        placeholder="Select service type"
        description="Category of medical service"
      />

      <!-- Service Category (Optional) -->
      <TypedSelect
        name="category"
        label="Specialization Category (Optional)"
        :options="serviceCategoryOptions"
        placeholder="Select category"
        description="Medical specialization area"
      />

      <!-- Price and Duration (side by side) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TypedInput
          name="price"
          label="Price (₱)"
          placeholder="0.00"
          type="text"
          description="Service fee in Philippine Peso"
        />

        <TypedInput
          name="duration"
          label="Duration (minutes)"
          placeholder="30"
          type="text"
          description="Expected duration of service"
        />
      </div>

      <!-- Description -->
      <TypedTextarea
        name="description"
        label="Description (Optional)"
        placeholder="Detailed description of the service..."
        description="What does this service include?"
        :rows="4"
      />

      <!-- Requirements -->
      <TypedTextarea
        name="requirements"
        label="Requirements (Optional)"
        placeholder="e.g., Fasting for 8-12 hours, bring previous medical records..."
        description="Any preparations or requirements for patients"
        :rows="3"
      />

      <!-- Internal Notes -->
      <TypedTextarea
        name="notes"
        label="Internal Notes (Optional)"
        placeholder="Internal notes for staff only..."
        description="Notes visible only to staff"
        :rows="2"
      />

      <!-- Is Active Toggle -->
      <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <input
          type="checkbox"
          id="isActive"
          v-model="formData.isActive"
          class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label for="isActive" class="flex-1">
          <div class="font-medium text-gray-900">Active Service</div>
          <div class="text-sm text-gray-600">
            {{ formData.isActive 
              ? "This service is currently available for booking" 
              : "This service is disabled and won't appear in patient booking" 
            }}
          </div>
        </label>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-4 border-t border-gray-200">
        <Button type="submit" :disabled="loading">
          <Icon name="mdi:floppy" class="mr-2" />
          {{ mode === "edit" ? "Update Service" : "Create Service" }}
        </Button>
        <Button type="button" variant="outline" @click="emit('close')" :disabled="loading">
          <Icon name="mdi:close" class="mr-2" /> Cancel
        </Button>
      </div>
    </TypedForm>
  </div>
</template>
