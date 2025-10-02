<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useStaffStore } from "@/stores/staff/useStaffStore"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

// Reuse Staff store, but fetch only doctors
const staffStore = useStaffStore()

/* ===================== 🔎 SEARCH (debounced) + FILTER ===================== */
const search = ref("")
const debouncedQuery = ref("")
const searchInputRef = ref<HTMLInputElement | null>(null)
let debounceTimer: number | undefined

const professionFilter = ref<string>("")
const professionOptions = computed(() => {
  const set = new Set<string>()
  for (const s of staffStore.staffProfiles) if (s?.profession) set.add(s.profession)
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

watch(search, (v) => {
  window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    debouncedQuery.value = v.trim()
  }, 200)
})

function clearSearch() {
  search.value = ""
  debouncedQuery.value = ""
  professionFilter.value = ""
  searchInputRef.value?.focus()
}

// Filter across multiple fields (case-insensitive) + profession filter
const filteredDoctors = computed(() => {
  const q = debouncedQuery.value.toLowerCase()
  const selected = professionFilter.value.toLowerCase()
  const source = staffStore.staffProfiles
  if (!q && !selected) return source

  return source.filter((s: any) => {
    if (selected && (s.profession ?? "").toLowerCase() !== selected) return false
    if (!q) return true

    const haystack = [
      s.profession,
      s.lastName,
      s.firstName,
      s.middleName,
      s.suffix,
      s.role,
    ].map(v => String(v ?? "").toLowerCase()).join(" | ")

    return haystack.includes(q)
  })
})

/* ===================== 📄 PAGINATION (client-side) ===================== */
const pageSize = ref(10)
const currentPage = ref(1)
const pageSizeOptions = [10, 25, 50, 100]

const totalItems = computed(() => filteredDoctors.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

watch([filteredDoctors, pageSize], () => { currentPage.value = 1 })
watch(totalPages, (t) => { if (currentPage.value > t) currentPage.value = t })
watch(professionFilter, () => { currentPage.value = 1 })

const paginatedDoctors = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredDoctors.value.slice(start, start + pageSize.value)
})

function goTo(p: number) { currentPage.value = Math.min(Math.max(1, p), totalPages.value) }
function prev() { goTo(currentPage.value - 1) }
function next() { goTo(currentPage.value + 1) }

// Page number window (max 5 buttons)
const pageWindow = computed(() => {
  const windowSize = 5, half = Math.floor(windowSize / 2)
  let start = Math.max(1, currentPage.value - half)
  const end = Math.min(totalPages.value, start + windowSize - 1)
  start = Math.max(1, end - windowSize + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

onMounted(async () => {
  await staffStore.getStaffProfiles("DOCTOR")
})

// Expose search for parent component
defineExpose({ search, clearSearch, searchInputRef })
</script>

<template>
  <!-- Loading State -->
  <div v-if="staffStore.loading" class="flex flex-col gap-2">
    <Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
  </div>

  <!-- Content -->
  <div v-else>
    <div class="overflow-x-auto">
      <!-- Toolbar -->
      <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-2">
        <div class="relative w-full max-w-md">
        <input
          ref="searchInputRef"
          v-model="search"
          type="text"
          placeholder="Search"
          class="w-full rounded-md border px-2 py-2 outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Search logs"
          @keydown.esc.prevent="clearSearch"
        >
        
        <button
          v-if="search"
          type="button"
          class="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 text-sm text-gray-600 hover:bg-gray-100"
          aria-label="Clear search"
          title="Clear"
          @click="clearSearch"
        >✕</button>
      </div>
    </div>

          <select
            v-model="professionFilter"
            class="border rounded-md px-3 py-2 bg-white"
            aria-label="Filter by profession"
          >
            <option value="">All Professions</option>
            <option v-for="p in professionOptions" :key="p" :value="p">{{ p }}</option>
          </select>

        
        </div>

        <!-- Count -->
        <span class="text-sm text-gray-500">
          {{ totalItems }} result{{ totalItems === 1 ? '' : 's' }}
          {{ debouncedQuery ? ` for "${debouncedQuery}"` : '' }}
          {{ professionFilter ? ` in "${professionFilter}"` : '' }}
        </span>
      </div>

      <!-- Table — spacing like the screenshot -->
      <Table class="min-w-full text-sm">
        <TableHeader>
          <TableRow class="bg-gray-50 border-b border-gray-200">
            <TableHead class="px-6 py-3 text-gray-600 font-medium">Profession</TableHead>
            <TableHead class="px-6 py-3 text-gray-600 font-medium">Last Name</TableHead>
            <TableHead class="px-6 py-3 text-gray-600 font-medium">First Name</TableHead>
            <TableHead class="px-6 py-3 text-gray-600 font-medium">Middle Name</TableHead>
            <TableHead class="px-6 py-3 text-gray-600 font-medium">Suffix</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow
            v-for="doc in paginatedDoctors"
            :key="doc.id"
            class="border-b border-gray-200 hover:bg-gray-50"
          >
            <TableCell class="px-6 py-4 whitespace-nowrap">{{ doc.profession || '-' }}</TableCell>
            <TableCell class="px-6 py-4">{{ doc.lastName }}</TableCell>
            <TableCell class="px-6 py-4 whitespace-nowrap">{{ doc.firstName }}</TableCell>
            <TableCell class="px-6 py-4 whitespace-nowrap">{{ doc.middleName || '-' }}</TableCell>
            <TableCell class="px-6 py-4 whitespace-nowrap">{{ doc.suffix || '-' }}</TableCell>
          </TableRow>

          <TableRow v-if="paginatedDoctors.length === 0">
            <TableCell colspan="5" class="px-6 py-6 text-center text-gray-500">
              No doctors found.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <!-- Pagination (with similar spacing) -->
      <div v-if="totalItems > 0" class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-2 text-sm">
          <span>Rows per page:</span>
          <select v-model.number="pageSize" class="border rounded-md px-2 py-1" aria-label="Rows per page">
            <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
          <span class="text-gray-500">
            Showing
            {{
              totalItems
                ? ((currentPage - 1) * pageSize + 1) + '–' + Math.min(currentPage * pageSize, totalItems)
                : 0
            }}
            of {{ totalItems }}
          </span>
        </div>

        <div class="flex items-center gap-1">
          <button class="px-3 py-1 border rounded-md disabled:opacity-50" :disabled="currentPage === 1" aria-label="First page" @click="goTo(1)">«</button>
          <button class="px-3 py-1 border rounded-md disabled:opacity-50" :disabled="currentPage === 1" aria-label="Previous page" @click="prev">‹</button>
          <button
            v-for="p in pageWindow"
            :key="p"
            class="px-3 py-1 border rounded-md"
            :class="p === currentPage ? 'bg-gray-100 font-medium' : ''"
            :aria-current="p === currentPage ? 'page' : undefined"
            @click="goTo(p)"
          >{{ p }}</button>
          <button class="px-3 py-1 border rounded-md disabled:opacity-50" :disabled="currentPage === totalPages" aria-label="Next page" @click="next">›</button>
          <button class="px-3 py-1 border rounded-md disabled:opacity-50" :disabled="currentPage === totalPages" aria-label="Last page" @click="goTo(totalPages)">»</button>
        </div>
      </div>
    </div>
  </div>
</template>
