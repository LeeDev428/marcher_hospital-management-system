<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useLogsStore } from "@/stores/useLogsStore"
import type { Log } from "@/types/logs"


const logsStore = useLogsStore()
const currentPage = ref(1)
const logsPerPage = 12
const filter = ref<"All" | "Admin" | "Users">("All")

onMounted(() => {
  logsStore.getLogs()
})

const filteredLogs = computed(() => {
  if (filter.value === "All") return logsStore.logs
  if (filter.value === "Admin") return logsStore.logs.filter((log) =>
    log.user?.toLowerCase().includes("admin")
  )
  if (filter.value === "Users") return logsStore.logs.filter((log) =>
    !log.user?.toLowerCase().includes("admin")
  )
  return logsStore.logs
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * logsPerPage
  const end = start + logsPerPage
  return filteredLogs.value.slice(start, end)
})

const totalPages = computed(() =>
  Math.ceil(filteredLogs.value.length / logsPerPage)
)

const setPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const setFilter = (value: typeof filter.value) => {
  filter.value = value
  currentPage.value = 1
}
</script>

<template>
  <NuxtLayout>
    <section class="p-6">
      <h1 class="text-xl font-semibold mb-4">Logs</h1>
      <div class="flex gap-4 mb-4">
        <button
          class="px-4 py-1 rounded-full text-sm font-medium"
          :class="filter === 'All' ? 'bg-black text-white' : 'bg-gray-200'"
          @click="setFilter('All')"
        >
          All
        </button>
        <button
          class="px-4 py-1 rounded-full text-sm font-medium"
          :class="filter === 'Admin' ? 'bg-black text-white' : 'bg-gray-200'"
          @click="setFilter('Admin')"
        >
          Admin
        </button>
        <button
          class="px-4 py-1 rounded-full text-sm font-medium"
          :class="filter === 'Users' ? 'bg-black text-white' : 'bg-gray-200'"
          @click="setFilter('Users')"
        >
          Users
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm border-t">
          <thead class="bg-gray-100 text-xs uppercase text-gray-500">
            <tr>
              <th class="px-4 py-3">Date</th>
              <th class="px-4 py-3">Time</th>
              <th class="px-4 py-3">User</th>
              <th class="px-4 py-3">Action</th>
              <th class="px-4 py-3">Resource</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="log in paginatedLogs"
              :key="log.id"
              class="border-b hover:bg-gray-50"
            >
              <td class="px-4 py-2">{{ log.date }}</td>
              <td class="px-4 py-2">{{ log.time }}</td>
              <td class="px-4 py-2">{{ log.user }}</td>
              <td class="px-4 py-2 text-blue-600">{{ log.action }}</td>
              <td class="px-4 py-2">{{ log.resource }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex justify-center items-center gap-2 text-sm">
        <button @click="setPage(currentPage - 1)" :disabled="currentPage === 1" class="text-gray-500 disabled:opacity-50">
          Prev
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="setPage(page)"
          class="px-3 py-1 rounded text-sm"
          :class="{
            'bg-black text-white': currentPage === page,
            'bg-gray-200': currentPage !== page,
          }"
        >
          {{ page }}
        </button>
        <button @click="setPage(currentPage + 1)" :disabled="currentPage === totalPages" class="text-gray-500 disabled:opacity-50">
          Next
        </button>
      </div>
    </section>
  </NuxtLayout>
</template>