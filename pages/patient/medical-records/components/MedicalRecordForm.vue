<script setup lang="ts">
import { useMedicalRecordsStore } from "@/stores/medical-records/useMedicalRecordsStore"
import { createMedicalRecordRequestSchema, updateMedicalRecordRequestSchema, medicalRecordStatusOptions, medicalRecordTypeOptions } from "@/types/medical-records"
import type { CreateMedicalRecordRequest, UpdateMedicalRecordRequest } from "@/types/medical-records"
import { TypedForm, TypedInput, TypedSelect } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const medicalRecordsStore = useMedicalRecordsStore()

const props = defineProps<{
  recordId?: string
}>()

const loading = ref(true)

const onSubmit = async (data: CreateMedicalRecordRequest | UpdateMedicalRecordRequest) => {
  if (props.recordId) {
    await medicalRecordsStore.updateMedicalRecordRequest({
      id: props.recordId,
      ...data,
      status: "PENDING"
    })
  } else {
    await medicalRecordsStore.createMedicalRecordRequest(data)
  }
}

onMounted(async () => {
  try {
    loading.value = true
    
    // Load patient profiles and inpatient encounters in parallel
    await Promise.all([
      medicalRecordsStore.getPatientProfiles(),
      medicalRecordsStore.getInpatientEncounters()
    ])
    
    // Debug logs
    console.log('Patient profiles:', medicalRecordsStore.patientProfiles)
    console.log('Inpatient encounters:', medicalRecordsStore.inpatientEncounters)
    console.log('Patient profile options:', medicalRecordsStore.patientProfileOptions)
    console.log('Inpatient encounter options:', medicalRecordsStore.inpatientEncounterOptions)
    
    // Load specific record if editing
    if (props.recordId) {
      await medicalRecordsStore.getMedicalRecordRequest({ id: props.recordId })
    }
    
    loading.value = false
  } catch (error) {
    console.error('Error loading form data:', error)
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="flex flex-col gap-4">
    <div class="animate-pulse">
      <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"/>
      <div class="h-10 bg-gray-200 rounded mb-4"/>
      <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"/>
      <div class="h-10 bg-gray-200 rounded mb-4"/>
      <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"/>
      <div class="h-10 bg-gray-200 rounded mb-4"/>
      <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"/>
      <div class="h-10 bg-gray-200 rounded mb-4"/>
    </div>
  </div>
  
  <TypedForm
    v-else
    :schema="props.recordId ? updateMedicalRecordRequestSchema : createMedicalRecordRequestSchema"
    :initial-values="props.recordId ? medicalRecordsStore.medicalRecordRequest || {} : {}"
    @submit="onSubmit"
  >
    <TypedSelect 
      name="patientProfileId" 
      label="Patient" 
      :options="medicalRecordsStore.patientProfileOptions" 
      placeholder="Select Patient" 
    /> 
     
      <!-- <TypedInput
        name="patientName"
        label="Patient"
        placeholder="Enter patient name"
      /> -->

    <TypedSelect 
      name="inpatientEncounterId" 
      label="Inpatient Encounter" 
      :options="medicalRecordsStore.inpatientEncounterOptions" 
      placeholder="Select Encounter" 
    />
    
    <TypedSelect 
      name="type" 
      label="Record Type" 
      :options="medicalRecordTypeOptions" 
      placeholder="Select Record Type" 
    />
    
    <!-- Status field only shown when editing -->
    <TypedSelect 
      v-if="props.recordId"
      name="status" 
      label="Status" 
      :options="medicalRecordStatusOptions" 
      placeholder="Select Status" 
    />

    <!-- Debug information (remove in production) -->
    <!-- <div class="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
      <p><strong> Info:</strong></p>
      <p>Patient Profiles Count: {{ medicalRecordsStore.patientProfiles.length }}</p>
      <p>Inpatient Encounters Count: {{ medicalRecordsStore.inpatientEncounters.length }}</p>
      <p>Patient Profile Options Count: {{ medicalRecordsStore.patientProfileOptions.length }}</p>
      <p>Inpatient Encounter Options Count: {{ medicalRecordsStore.inpatientEncounterOptions.length }}</p>
    </div> -->

    <div class="flex gap-2">
      <Button type="submit" variant="outline" >
        <Icon name="mdi:floppy" />
        Save
      </Button>
      <Button type="button" variant="outline" @click="navigateTo('/patient/medical-records')">
        <Icon name="mdi:arrow-left" />
        Back
      </Button>
    </div>
  </TypedForm>
</template>