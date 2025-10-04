<script setup lang="ts">
import { useDashboardStore } from "~/stores/dashboard/useDashboardStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const dashboardStore = useDashboardStore()

const summaryCards = computed(() => [
  {
    title: "Today's Appointments",
    value: dashboardStore.todayAppointmentCount,
    icon: "mdi:calendar-today",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Total scheduled for today",
  },
  {
    title: "Today's Pending Appointments", 
    value: dashboardStore.todayPendingAppointmentCount, 
    icon: "mdi:clock-outline",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    description: "Awaiting confirmation",
  },
  {
    title: "Appointments This Month",
    value: dashboardStore.thisMonthAppointmentCount,
    icon: "mdi:calendar-month",
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "Month to date",
  },
  {
    title: "Total Patients",
    value: dashboardStore.totalPatientsCount,
    icon: "mdi:account-group",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "Registered patients today",
  },
])

</script>

<template>
  <div class="space-y-6">
    <!-- Main Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card v-for="card in summaryCards" :key="card.title" class="relative overflow-hidden">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            {{ card.title }}
          </CardTitle>
          <div :class="[card.bgColor, card.color, 'p-2 rounded-lg']">
            <Icon :name="card.icon" size="20" />
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="dashboardStore.loading" class="space-y-2">
            <Skeleton class="h-8 w-16" />
            <Skeleton class="h-4 w-24" />
          </div>
          <div v-else>
            <div class="text-2xl font-bold">
              {{ card.value.toLocaleString() }}
            </div>
            <p class="text-xs text-muted-foreground mt-1">
              {{ card.description }}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>