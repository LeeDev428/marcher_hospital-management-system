<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create New Bill</DialogTitle>
        <DialogDescription>
          Create a billing transaction for a patient encounter
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6 py-4">
        <!-- Step 1: Select Patient & Encounter -->
        <div class="space-y-4">
          <h3 class="font-medium">1. Select Patient & Encounter</h3>
          
          <!-- Patient Search -->
          <div class="space-y-2">
            <Label>Patient</Label>
            <div class="relative">
              <Input
                v-model="patientSearch"
                placeholder="Search patient by name or ID..."
                @input="searchPatients"
              />
              <!-- Patient Dropdown -->
              <div v-if="showPatientDropdown && filteredPatients.length > 0" 
                   class="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                <button
                  v-for="patient in filteredPatients"
                  :key="patient.id"
                  class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  @click="selectPatient(patient)"
                >
                  <div>
                    <div class="font-medium">{{ patient.fullName }}</div>
                    <div class="text-sm text-gray-500">ID: {{ patient.id }}</div>
                  </div>
                </button>
              </div>
            </div>
            <div v-if="selectedPatient" class="flex items-center gap-2 p-2 bg-blue-50 rounded">
              <Icon name="mdi:check-circle" class="text-blue-600" />
              <span>{{ selectedPatient.fullName }} ({{ selectedPatient.id }})</span>
            </div>
          </div>

          <!-- Encounter Selection -->
          <div v-if="selectedPatient" class="space-y-2">
            <Label>Encounter</Label>
            <Select v-model="form.encounterId" @update:modelValue="loadEncounter">
              <SelectTrigger>
                <SelectValue placeholder="Select encounter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="enc in patientEncounters" :key="enc.id" :value="enc.id">
                  {{ enc.type }} - {{ formatDate(enc.admissionDate) }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Step 2: Add Line Items -->
        <div v-if="form.encounterId" class="space-y-4">
          <h3 class="font-medium">2. Add Charges</h3>
          
          <!-- Add Item Form -->
          <div class="grid grid-cols-2 gap-4 p-4 border rounded-lg">
            <div class="space-y-2">
              <Label>Item Type</Label>
              <Select v-model="newItem.itemType">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ROOM_CHARGE">Room Charge</SelectItem>
                  <SelectItem value="CONSULTATION">Consultation</SelectItem>
                  <SelectItem value="LABORATORY">Laboratory</SelectItem>
                  <SelectItem value="RADIOLOGY">Radiology</SelectItem>
                  <SelectItem value="MEDICATION">Medication</SelectItem>
                  <SelectItem value="PROCEDURE">Procedure</SelectItem>
                  <SelectItem value="SURGERY">Surgery</SelectItem>
                  <SelectItem value="SUPPLIES">Supplies</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div class="space-y-2">
              <Label>Description</Label>
              <Input v-model="newItem.description" placeholder="e.g., Room 101 - Private" />
            </div>
            
            <div class="space-y-2">
              <Label>Quantity</Label>
              <Input v-model.number="newItem.quantity" type="number" min="1" />
            </div>
            
            <div class="space-y-2">
              <Label>Unit Price (₱)</Label>
              <Input v-model.number="newItem.unitPrice" type="number" min="0" step="0.01" />
            </div>
            
            <div class="col-span-2 flex items-center gap-2">
              <input v-model="newItem.requiresPreAuth" type="checkbox" id="preauth" />
              <Label for="preauth" class="cursor-pointer">Requires Pre-Authorization</Label>
            </div>
            
            <div class="col-span-2">
              <Button @click="addItem" class="w-full" variant="outline">
                <Icon name="mdi:plus" class="mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          <!-- Items List -->
          <div v-if="form.items.length > 0" class="space-y-2">
            <h4 class="font-medium text-sm">Added Items ({{ form.items.length }})</h4>
            <div class="border rounded-lg divide-y">
              <div v-for="(item, index) in form.items" :key="index" 
                   class="p-3 flex items-center justify-between hover:bg-gray-50">
                <div class="flex-1">
                  <div class="font-medium">{{ item.description }}</div>
                  <div class="text-sm text-gray-500">
                    {{ item.itemType }} • {{ item.quantity }} × {{ peso(item.unitPrice) }}
                    <span v-if="item.requiresPreAuth" class="ml-2 text-red-600">(Pre-Auth)</span>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span class="font-medium">{{ peso(item.quantity * item.unitPrice) }}</span>
                  <Button size="sm" variant="ghost" @click="removeItem(index)">
                    <Icon name="mdi:close" class="text-red-600" />
                  </Button>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg font-bold text-lg">
              <span>Total Amount:</span>
              <span class="text-blue-600">{{ peso(totalAmount) }}</span>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="$emit('update:open', false)" :disabled="creating">
          Cancel
        </Button>
        <Button @click="createBill" :disabled="!canCreate || creating">
          <Icon v-if="creating" name="mdi:loading" class="mr-2 animate-spin" />
          Create Bill
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useToast } from '@/composables/useToast'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'bill-created': []
}>()

const { $trpc } = useNuxtApp()

// State
const creating = ref(false)
const patientSearch = ref('')
const showPatientDropdown = ref(false)
const filteredPatients = ref<any[]>([])
const selectedPatient = ref<any>(null)
const patientEncounters = ref<any[]>([])

const form = ref({
  encounterId: '',
  patientId: '',
  items: [] as any[]
})

const newItem = ref({
  itemType: '',
  description: '',
  quantity: 1,
  unitPrice: 0,
  requiresPreAuth: false
})

// Computed
const totalAmount = computed(() => {
  return form.value.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
})

const canCreate = computed(() => {
  return form.value.encounterId && form.value.items.length > 0
})

// Methods
const searchPatients = async () => {
  if (patientSearch.value.length < 2) {
    showPatientDropdown.value = false
    return
  }

  try {
    // Search real patients from database
    const { success, data } = await $trpc.patients.searchPatients.query({
      query: patientSearch.value,
      limit: 10
    })
    
    if (success && data) {
      filteredPatients.value = data.map((p: any) => ({
        id: p.patientId,
        fullName: `${p.firstName} ${p.lastName}`,
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email
      }))
    }
    
    showPatientDropdown.value = true
  } catch (error) {
    console.error('Error searching patients:', error)
    useToast('error', 'Search Error', 'Failed to search patients')
  }
}

const selectPatient = async (patient: any) => {
  selectedPatient.value = patient
  form.value.patientId = patient.id
  patientSearch.value = patient.fullName
  showPatientDropdown.value = false

  // Load patient encounters from database
  try {
    const { success, data } = await $trpc.encounters.inpatient.getInpatientEncounters.query({
      patientId: patient.id
    })
    
    if (success && data) {
      patientEncounters.value = data.map((enc: any) => ({
        id: enc.encounterId,
        type: 'Inpatient',
        admissionDate: enc.admissionDate || enc.createdAt
      }))
    }
    
    // If no encounters, allow creating bill without encounter
    if (patientEncounters.value.length === 0) {
      patientEncounters.value = [{
        id: 'no-encounter',
        type: 'General Billing',
        admissionDate: new Date().toISOString()
      }]
    }
  } catch (error) {
    console.error('Error loading encounters:', error)
    // Still allow creating bill even if encounters fail
    patientEncounters.value = [{
      id: 'no-encounter',
      type: 'General Billing',
      admissionDate: new Date().toISOString()
    }]
  }
}

const loadEncounter = (encounterId: string) => {
  // Load encounter details if needed
  console.log('Selected encounter:', encounterId)
}

const addItem = () => {
  if (!newItem.value.itemType || !newItem.value.description || newItem.value.unitPrice <= 0) {
    useToast('error', 'Error', 'Please fill all item fields')
    return
  }

  form.value.items.push({ ...newItem.value })

  // Reset form
  newItem.value = {
    itemType: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    requiresPreAuth: false
  }
}

const removeItem = (index: number) => {
  form.value.items.splice(index, 1)
}

const createBill = async () => {
  creating.value = true
  try {
    const { success, message, data } = await $trpc.billing.transactions.createBill.mutate({
      patientId: selectedPatient.value!.id,
      encounterId: form.value.encounterId,
      items: form.value.items
    })
    
    if (success) {
      useToast('success', 'Bill Created', message || 'Bill created successfully!')
      emit('bill-created')
      
      // Reset form
      form.value = {
        encounterId: '',
        patientId: '',
        items: []
      }
      selectedPatient.value = null
      patientSearch.value = ''
      patientEncounters.value = []
      
      // Close dialog
      emit('update:open', false)
    } else {
      useToast('error', 'Error', message || 'Failed to create bill')
    }
  } catch (error: any) {
    console.error('Error creating bill:', error)
    useToast('error', 'Error', error.message || 'Failed to create bill')
  } finally {
    creating.value = false
  }
}

const peso = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
