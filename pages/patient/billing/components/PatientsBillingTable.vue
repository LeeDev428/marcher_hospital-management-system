<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
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
import PaymentDialog from "./PaymentDialog.vue"
import { useToast } from "@/composables/useToast"
import { useAuthStore } from "@/stores/app/useAuthStore"

const { $trpc } = useNuxtApp()
const authStore = useAuthStore()

/* ===================== STATE ===================== */
const activeTab = ref("unsettled")
const loading = ref(true)
const paymentDialogOpen = ref(false)
const selectedBill = ref<any>(null)
const bills = ref<any[]>([])

// 🔎 Search (debounced) — mirrored from DoctorTable.vue
const search = ref("")
const debouncedQuery = ref("")
const searchInputRef = ref<HTMLInputElement | null>(null)
let debounceTimer: number | undefined

const outstandingBalance = computed(() => {
  return bills.value
    .filter(b => b.status === "unsettled")
    .reduce((sum, bill) => sum + bill.cost, 0)
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
  searchInputRef.value?.focus()
}

// Fetch bills from API
const fetchBills = async () => {
  if (!authStore.user?.id) return
  
  loading.value = true
  try {
    const { success, data } = await $trpc.billing.getPatientBills.query({
      patientId: authStore.user.id
    })
    
    if (success && data) {
      bills.value = data
    }
  } catch (error) {
    console.error("Error fetching bills:", error)
    useToast("error", "Billing", "Failed to load bills")
  } finally {
    loading.value = false
  }
}

/* ===================== SORTING PER TAB ===================== */
function parseSlashDate(s: string) {
  // expects "MM / DD / YYYY"
  try {
    const parts = s.split("/").map(p => p.trim())
    const [mm, dd, yyyy] = [Number(parts[0]), Number(parts[1]), Number(parts[2])]
    return new Date(yyyy, mm - 1, dd).getTime()
  } catch {
    return 0
  }
}

const tabSortedBills = computed(() => {
  const list = bills.value.filter(b => b.status === activeTab.value)
  if (activeTab.value === "completed") {
    return [...list].sort((a: any, b: any) => {
      const ta = a.settledAtISO ? new Date(a.settledAtISO).getTime() : 0
      const tb = b.settledAtISO ? new Date(b.settledAtISO).getTime() : 0
      return tb - ta
    })
  }
  // unsettled by posted date (newest first)
  return [...list].sort((a: any, b: any) => parseSlashDate(b.date) - parseSlashDate(a.date))
})

/* ===================== FILTER (search) ===================== */
const filteredBills = computed(() => {
  const q = debouncedQuery.value.toLowerCase()
  if (!q) return tabSortedBills.value

  return tabSortedBills.value.filter((b: any) => {
    const haystack = [
      b.transactionId,
      b.items,
      b.date,
    ].map(v => String(v ?? "").toLowerCase()).join(" | ")

    return haystack.includes(q)
  })
})

/* ===================== 📄 PAGINATION (same structure as DoctorTable.vue) ===================== */
const pageSize = ref(10)
const currentPage = ref(1)
const pageSizeOptions = [10, 25, 50, 100]

const totalItems = computed(() => filteredBills.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

watch([filteredBills, pageSize, activeTab], () => { currentPage.value = 1 })
watch(totalPages, (t) => { if (currentPage.value > t) currentPage.value = t })

const paginatedBills = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredBills.value.slice(start, start + pageSize.value)
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

/* ===================== ACTIONS ===================== */
onMounted(async () => {
  await fetchBills()
})

const openPaymentDialog = (bill: any) => {
  selectedBill.value = bill
  paymentDialogOpen.value = true
}

const handleConfirmPayment = async (billId: string, paymentMethod: string) => {
  try {
    const bill = bills.value.find(b => b.id === billId)
    if (!bill) return
    
    // Call payment API
    const { success, message } = await $trpc.billing.processPayment.mutate({
      billId,
      paymentMethod,
      amount: bill.cost,
    })
    
    if (success) {
      // Refresh bills
      await fetchBills()
      
      // Close dialog
      paymentDialogOpen.value = false
      selectedBill.value = null
      
      // Show success message
      useToast("success", "Payment Successful", `Your payment via ${paymentMethod === 'paymaya' ? 'PayMaya' : 'Maya'} has been processed successfully.`)
      
      // Switch to completed tab
      setTimeout(() => {
        activeTab.value = "completed"
      }, 500)
    } else {
      useToast("error", "Payment Failed", message || "Failed to process payment")
    }
  } catch (error) {
    console.error("Payment error:", error)
    useToast("error", "Payment Failed", "An error occurred while processing your payment")
  }
}

const handleSettle = (id: string) => {
  const bill = bills.value.find(b => b.id === id)
  if (bill) {
    openPaymentDialog(bill)
  }
}

/* ===================== FORMATTERS ===================== */
function peso(n: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(n)
}

function formatDateTimeISO(iso?: string) {
  if (!iso) return "-"
  const d = new Date(iso)
  return `${d.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })} ${d.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
  })}`
}
</script>

<template>
  <div class="h-full w-full flex flex-col gap-4">
    <div class="flex items-center justify-between">
  <Tabs v-model="activeTab">
    <TabsList class="gap-1">
      <TabsTrigger value="unsettled" class="hover:bg-zinc-200">Unsettled</TabsTrigger>
      <TabsTrigger value="completed" class="hover:bg-zinc-200">Completed</TabsTrigger>
    </TabsList>
  </Tabs>

  <!-- Outstanding Balance -->
  <div v-if="activeTab === 'unsettled'" class="text-sm sm:text-base font-semibold text-gray-700">
    Outstanding Balance: {{ peso(outstandingBalance) }}
  </div>
</div>


    <!-- Toolbar (search + clear) -->
    <div class="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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

      <!-- Count -->
      <span class="text-sm text-gray-500">
        {{ totalItems }} result{{ totalItems === 1 ? '' : 's' }}
        {{ debouncedQuery ? ` for "${debouncedQuery}"` : '' }}
        in "{{ activeTab }}"
      </span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col gap-2">
      <Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
    </div>

    <!-- Content -->
    <div v-else>
      <Table v-if="paginatedBills.length > 0" class="min-w-full text-sm">
        <TableHeader>
          <TableRow class="bg-gray-50 border-b border-gray-200">
            <TableHead class="px-6 py-3 text-gray-600 font-medium">Transaction ID</TableHead>
            <TableHead class="px-6 py-3 text-gray-600 font-medium">Date Posted</TableHead>
            <TableHead class="px-6 py-3 text-gray-600 font-medium">Items</TableHead>
            <TableHead class="px-6 py-3 text-right text-gray-600 font-medium">Cost</TableHead>
            <TableHead class="px-6 py-3 text-right text-gray-600 font-medium">
              {{ activeTab === 'unsettled' ? 'Actions' : 'Settled At' }}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow
            v-for="bill in paginatedBills"
            :key="bill.id"
            class="border-b border-gray-200 hover:bg-gray-50"
          >
            <TableCell class="px-6 py-4 whitespace-nowrap">{{ bill.transactionId }}</TableCell>
            <TableCell class="px-6 py-4 whitespace-nowrap">{{ bill.date }}</TableCell>
            <TableCell class="px-6 py-4 whitespace-nowrap">{{ bill.items }}</TableCell>
            <TableCell class="px-6 py-4 text-right whitespace-nowrap">{{ peso(bill.cost) }}</TableCell>
            <TableCell class="px-6 py-4 text-right whitespace-nowrap">
              <template v-if="bill.status === 'unsettled'">
                <Button 
                  size="sm" 
                  class="bg-green-600 hover:bg-green-700 text-white"
                  @click="openPaymentDialog(bill)"
                >
                  <Icon name="mdi:credit-card" class="mr-1" />
                  Pay Now
                </Button>
              </template>
              <template v-else>
                <span class="text-sm">{{ formatDateTimeISO(bill.settledAtISO) }}</span>
              </template>
            </TableCell>
          </TableRow>

          <TableRow v-if="paginatedBills.length === 0">
            <TableCell colspan="5" class="px-6 py-6 text-center text-gray-500">
              No {{ activeTab }} bills found.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div v-else class="flex flex-col gap-2 justify-center items-center h-32">
        <p class="text-sm text-gray-500">No {{ activeTab }} bills found</p>
      </div>

      <!-- 🔸 Pagination (copied structure from DoctorTable.vue) -->
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

    <!-- Payment Dialog -->
    <PaymentDialog
      v-if="selectedBill"
      :open="paymentDialogOpen"
      :bill="selectedBill"
      @update:open="paymentDialogOpen = $event"
      @confirm-payment="handleConfirmPayment"
    />
  </div>
</template>
