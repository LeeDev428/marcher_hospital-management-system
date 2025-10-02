<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useMedicalRecordsStore } from "@/stores/medical-records/useMedicalRecordsStore"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { MedicalRecordStatus } from "@/types/medical-records"

const medicalRecordsStore = useMedicalRecordsStore()
const activeTab = ref("ALL")

const onEdit = (id: string) => {
  navigateTo(`/patient/medical-records/${id}`)
}

const onDownload = (fileUrl: string) => {
  if (fileUrl) {
    window.open(fileUrl, '_blank')
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/* ===================== 🔎 SEARCH (debounced + clear) ===================== */
const search = ref("")
const debouncedQuery = ref("")
const searchInputRef = ref<HTMLInputElement | null>(null)
let debounceTimer: number | undefined

watch(search, (v) => {
  clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    debouncedQuery.value = v.trim()
  }, 200)
})

function clearSearch() {
  search.value = ""
  debouncedQuery.value = ""
  searchInputRef.value?.focus()
}

const filteredRecords = computed(() => {
  const q = debouncedQuery.value.toLowerCase()
  if (!q) return medicalRecordsStore.medicalRecordRequests

  return medicalRecordsStore.medicalRecordRequests.filter((r: any) => {
    const haystack = [
      r.patientProfile.lastName,
      r.patientProfile.firstName,
      r.patientProfile.middleName,
      r.patientProfile.suffix,
      r.type,
      r.status,
      r.inpatientEncounter?.date,
      r.createdAt
    ]
      .map(v => String(v ?? "").toLowerCase())
      .join(" | ")

    return haystack.includes(q)
  })
})

/* ===================== ⏱️ SORT ===================== */
type SortField = 'createdAt' | 'inpatientEncounterDate'
const sortField = ref<SortField>('createdAt')
const sortAsc = ref(false)

function toggleSort(field: SortField) {
  if (sortField.value === field) {
    sortAsc.value = !sortAsc.value
  } else {
    sortField.value = field
    sortAsc.value = false
  }
}

const sortedRecords = computed(() => {
  const mul = sortAsc.value ? 1 : -1
  return [...filteredRecords.value].sort((a, b) => {
    const at = sortField.value === 'inpatientEncounterDate'
      ? new Date(a.inpatientEncounter?.date).getTime() || 0
      : new Date(a.createdAt).getTime() || 0
    const bt = sortField.value === 'inpatientEncounterDate'
      ? new Date(b.inpatientEncounter?.date).getTime() || 0
      : new Date(b.createdAt).getTime() || 0
    if (at === bt) return 0
    return (at - bt) * mul
  })
})

/* ===================== 📄 PAGINATION ===================== */
const pageSize = ref(10)
const currentPage = ref(1)
const pageSizeOptions = [10, 25, 50, 100]

const totalItems = computed(() => sortedRecords.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

watch([sortedRecords, pageSize], () => { currentPage.value = 1 })
watch(totalPages, (t) => { if (currentPage.value > t) currentPage.value = t })

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedRecords.value.slice(start, start + pageSize.value)
})

function goTo(p: number) {
  currentPage.value = Math.min(Math.max(1, p), totalPages.value)
}
function prev() { goTo(currentPage.value - 1) }
function next() { goTo(currentPage.value + 1) }

const pageWindow = computed(() => {
  const windowSize = 5, half = Math.floor(windowSize / 2)
  let start = Math.max(1, currentPage.value - half)
  const end = Math.min(totalPages.value, start + windowSize - 1)
  start = Math.max(1, end - windowSize + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

watch(activeTab, async () => {
  if (activeTab.value === "ALL") {
    await medicalRecordsStore.getMedicalRecordRequests()
  } else {
    await medicalRecordsStore.getMedicalRecordRequests(activeTab.value as MedicalRecordStatus)
  }
  currentPage.value = 1
  search.value = ""
})

onMounted(async () => {
  await medicalRecordsStore.getMedicalRecordRequests()
})

defineExpose({
  search,
  clearSearch,
  searchInputRef
})
</script>

<template>
  <div v-if="medicalRecordsStore.loading" class="flex flex-col gap-2">
    <Skeleton v-for="i in 5" :key="i" class="h-[50px] w-full rounded-md" />
  </div>
  <div v-else>
    <Tabs v-model="activeTab">
      <TabsList class="mb-4 gap-1">
        <TabsTrigger value="ALL">All</TabsTrigger>
        <TabsTrigger value="PENDING">Pending</TabsTrigger>
        <TabsTrigger value="PROCESSING">Processing</TabsTrigger>
        <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
        <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
      </TabsList>
    </Tabs>

    <!-- Results count -->
    <div class="mb-3 text-sm text-gray-500">
      {{ totalItems }} result{{ totalItems === 1 ? '' : 's' }}{{ debouncedQuery ? ` for "${debouncedQuery}"` : '' }}
    </div>

    <Table v-if="totalItems > 0">
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead class="cursor-pointer" @click="toggleSort('inpatientEncounterDate')">
            Encounter Date <span v-if="sortField==='inpatientEncounterDate'">{{ sortAsc ? '▲' : '▼' }}</span>
          </TableHead>
          <TableHead>Record Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>File</TableHead>
          <TableHead class="cursor-pointer" @click="toggleSort('createdAt')">
            Requested Date <span v-if="sortField==='createdAt'">{{ sortAsc ? '▲' : '▼' }}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="record in paginatedRecords" :key="record.id">
          <TableCell>
            {{ record.patientProfile.lastName }}, {{ record.patientProfile.firstName }}
            {{ record.patientProfile.middleName ? record.patientProfile.middleName + ' ' : '' }}
            {{ record.patientProfile.suffix || '' }}
          </TableCell>
          <TableCell>{{ record.inpatientEncounter.date }}</TableCell>
          <TableCell>{{ record.type }}</TableCell>
          <TableCell>
            <span :class="getStatusColor(record.status)" class="px-2 py-1 rounded-full text-xs font-medium">
              {{ record.status }}
            </span>
          </TableCell>
          <TableCell>
            <Button v-if="record.fileUrl" variant="outline" size="sm" @click="onDownload(record.fileUrl)">
              <Icon name="mdi:download" class="mr-1" /> Download
            </Button>
            <span v-else class="text-gray-400 text-sm">No file</span>
          </TableCell>
          <TableCell>{{ new Date(record.createdAt).toLocaleDateString() }}</TableCell>
          <TableCell class="flex gap-2">
            <!-- <Button variant="outline" size="icon" @click="onEdit(record.id)">
              <Icon name="mdi:pencil" />
            </Button>
            <Button variant="outline" size="icon" @click="medicalRecordsStore.deleteMedicalRecordRequest({ id: record.id })">
              <Icon name="mdi:trash" />
            </Button> -->
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Pagination -->
    <div v-if="totalItems > 0" class="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
      <div class="flex items-center gap-2 text-sm">
        <span>Rows per page:</span>
        <select v-model.number="pageSize" class="border rounded-md px-2 py-1">
          <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
        <span class="text-gray-500">
          Showing {{ ((currentPage - 1) * pageSize + 1) }}–{{ Math.min(currentPage * pageSize, totalItems) }} of {{ totalItems }}
        </span>
      </div>
      <div class="flex items-center gap-1">
        <button :disabled="currentPage===1" @click="goTo(1)">«</button>
        <button :disabled="currentPage===1" @click="prev">‹</button>
        <button v-for="p in pageWindow" :key="p" :class="p===currentPage ? 'bg-gray-100 font-medium px-3 py-1 border rounded' : 'px-3 py-1 border rounded'" @click="goTo(p)">{{ p }}</button>
        <button :disabled="currentPage===totalPages" @click="next">›</button>
        <button :disabled="currentPage===totalPages" @click="goTo(totalPages)">»</button>
      </div>
    </div>

    <div v-if="totalItems === 0" class="py-8 text-center text-gray-500">
      {{ debouncedQuery ? 'No records found matching your search.' : 'No Medical Records Found' }}
      <button v-if="debouncedQuery" class="block mt-2 text-blue-600 underline" @click="clearSearch">Clear search</button>
    </div>
  </div>
</template>
