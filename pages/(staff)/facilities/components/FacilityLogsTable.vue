<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useFacilityLogStore } from "@/stores/facilities/useLogStore"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

const logStore = useFacilityLogStore()

onMounted(() => {
  logStore.fetchLogs() // Mock or real data later
})

/* ===================== 🔎 SEARCH (debounced + clear) ===================== */
const search = ref("")                          // user input
const debouncedQuery = ref("")                  // debounced value used for filtering
const searchInputRef = ref<HTMLInputElement | null>(null)
let debounceTimer: number | undefined

watch(search, (v) => {
  window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    debouncedQuery.value = v.trim()
  }, 200) // debounce ms
})

function clearSearch() {
  search.value = ""
  debouncedQuery.value = ""
  searchInputRef.value?.focus()
}

// Filter across multiple fields (case-insensitive)
const filteredLogs = computed(() => {
  const q = debouncedQuery.value.toLowerCase()
  if (!q) return logStore.logs

  return logStore.logs.filter((l: any) => {
    const haystack = [
      l.roomIdentifier,
      l.type,
      l.action,
      l.oldStatus,
      l.newStatus,
      l.user,
      l.role,
      new Date(l.timestamp).toLocaleString(),
    ]
      .map((v) => String(v ?? "").toLowerCase())
      .join(" | ")

    return haystack.includes(q)
  })
})

/* ===================== ⏱️ SORT (toggle by timestamp) ===================== */
// true = oldest→newest, false = newest→oldest
const tsAsc = ref(true)
function toggleTsSort() {
  tsAsc.value = !tsAsc.value
}

const sortedLogs = computed(() => {
  const mul = tsAsc.value ? 1 : -1
  return [...filteredLogs.value].sort((a, b) => {
    const at = new Date(a.timestamp).getTime() || 0
    const bt = new Date(b.timestamp).getTime() || 0
    if (at === bt) return 0
    return (at - bt) * mul
  })
})

/* ===================== 📄 PAGINATION (client-side) ===================== */
const pageSize = ref(10)
const currentPage = ref(1)
const pageSizeOptions = [10, 25, 50, 100]

const totalItems = computed(() => sortedLogs.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

// reset/clamp page when results, sort, or page size change
watch([sortedLogs, pageSize], () => { currentPage.value = 1 })
watch(totalPages, (t) => { if (currentPage.value > t) currentPage.value = t })

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedLogs.value.slice(start, start + pageSize.value)
})

function goTo(p: number) {
  currentPage.value = Math.min(Math.max(1, p), totalPages.value)
}
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
</script>

<template>
  <!-- Loading State -->
  <div v-if="logStore.loading" class="flex flex-col gap-2">
    <Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
  </div>

  <!-- Content -->
  <div v-else class="overflow-x-auto">
    <!-- Search bar -->
    <div class="mb-3 flex items-center gap-2">
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

      <span class="hidden sm:block text-sm text-gray-500">
        {{ totalItems }} result{{ totalItems === 1 ? '' : 's' }}
      </span>
    </div>

    <!-- Table -->
    <Table class="min-w-[900px]">
      <TableHeader>
        <TableRow>
          <TableHead class="cursor-pointer select-none">
            <button type="button" class="flex items-center gap-1" @click="toggleTsSort">
              <span>Timestamp</span>
              <span aria-hidden="true">{{ tsAsc ? "▲" : "▼" }}</span>
              <span class="sr-only">
                Sort by timestamp {{ tsAsc ? "ascending" : "descending" }}
              </span>
            </button>
          </TableHead>
          <TableHead>Room</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Old Status</TableHead>
          <TableHead>New Status</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow
          v-for="log in paginatedLogs"
          :key="log.id"
          class="hover:bg-gray-50"
        >
          <TableCell :title="new Date(log.timestamp).toISOString()">
            {{ new Date(log.timestamp).toLocaleString() }} <!-- can swap to Intl.DateTimeFormat later -->
          </TableCell>
          <TableCell>{{ log.roomIdentifier }}</TableCell>
          <TableCell>{{ log.type }}</TableCell>
          <TableCell>{{ log.action }}</TableCell>
          <TableCell>{{ log.oldStatus || '-' }}</TableCell>
          <TableCell>{{ log.newStatus || '-' }}</TableCell>
          <TableCell>{{ log.user || '-' }}</TableCell>
          <TableCell>{{ log.role || '-' }}</TableCell>
        </TableRow>

        <TableRow v-if="paginatedLogs.length === 0">
          <TableCell colspan="8" class="text-center text-gray-500 py-4">
            No logs found.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Pagination controls -->
    <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <!-- Left: rows per page -->
      <div class="flex items-center gap-2 text-sm">
        <span>Rows per page:</span>
        <select
          v-model.number="pageSize"
          class="border rounded-md px-2 py-1"
          aria-label="Rows per page"
        >
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

      <!-- Right: pager -->
      <div class="flex items-center gap-1">
        <button
          class="px-3 py-1 border rounded-md disabled:opacity-50"
          :disabled="currentPage === 1"
          aria-label="First page"
          @click="goTo(1)"
        >«</button>

        <button
          class="px-3 py-1 border rounded-md disabled:opacity-50"
          :disabled="currentPage === 1"
          aria-label="Previous page"
          @click="prev"
        >‹</button>

        <button
          v-for="p in pageWindow"
          :key="p"
          class="px-3 py-1 border rounded-md"
          :class="p === currentPage ? 'bg-gray-100 font-medium' : ''"
          :aria-current="p === currentPage ? 'page' : undefined"
          @click="goTo(p)"
        >{{ p }}</button>

        <button
          class="px-3 py-1 border rounded-md disabled:opacity-50"
          :disabled="currentPage === totalPages"
          aria-label="Next page"
          @click="next"
        >›</button>

        <button
          class="px-3 py-1 border rounded-md disabled:opacity-50"
          :disabled="currentPage === totalPages"
          aria-label="Last page"
          @click="goTo(totalPages)"
        >»</button>
      </div>
    </div>
  </div>
</template>
