<script setup lang="ts">
import { useRoomStore } from "@/stores/facilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

definePageMeta({
  layout: 'staff',
})

const route = useRoute()
const roomId = route.params.id as string
const roomStore = useRoomStore()

onMounted(async () => {
  await roomStore.getRoom(roomId)
})

const room = computed(() => roomStore.room)
const loading = computed(() => roomStore.loading)

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'AVAILABLE': return 'bg-green-100 text-green-800'
    case 'OCCUPIED': return 'bg-red-100 text-red-800'
    case 'PREPARING': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatType = (type: string) => {
  return type?.charAt(0) + type?.slice(1).toLowerCase()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Facility Details</h1>
        <p class="mt-2 text-gray-600">View facility information and QR code</p>
      </div>
      <Button variant="outline" @click="navigateTo('/staff/facilities')">
        <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
        Back to Facilities
      </Button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <Skeleton class="h-[200px] w-full" />
      <Skeleton class="h-[300px] w-full" />
    </div>

    <!-- Content -->
    <div v-else-if="room" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Facility Info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Basic Information Card -->
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-muted-foreground">Identifier</p>
                <p class="font-medium text-lg">{{ room.identifier }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Type</p>
                <p class="font-medium">{{ formatType(room.type) }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Building</p>
                <p class="font-medium">{{ room.building?.name || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Capacity</p>
                <p class="font-medium">{{ room.capacity || 'N/A' }} people</p>
              </div>
              <div class="col-span-2">
                <p class="text-sm text-muted-foreground">Status</p>
                <Badge :class="getStatusColor(room.status)">
                  {{ room.status }}
                </Badge>
              </div>
              <div v-if="room.description" class="col-span-2">
                <p class="text-sm text-muted-foreground">Description</p>
                <p class="text-sm mt-1">{{ room.description }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Timestamps Card -->
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div>
              <p class="text-sm text-muted-foreground">Created At</p>
              <p class="text-sm">{{ new Date(room.createdAt).toLocaleString() }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Last Updated</p>
              <p class="text-sm">{{ new Date(room.updatedAt).toLocaleString() }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Facility ID</p>
              <p class="text-xs font-mono bg-gray-100 p-2 rounded">{{ room.id }}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: QR Code -->
      <div class="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
          </CardHeader>
          <CardContent class="flex flex-col items-center space-y-4">
            <QRCodeDisplay :data="{ entity: 'facility', id: roomId }" />
            <p class="text-xs text-center text-muted-foreground">
              Scan this QR code to quickly access this facility's details
            </p>
            <Button variant="outline" size="sm" class="w-full">
              <Icon name="lucide:download" class="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Error State -->
    <Card v-else>
      <CardContent class="p-6 text-center">
        <Icon name="lucide:alert-circle" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p class="text-gray-600">Facility not found</p>
        <Button variant="outline" class="mt-4" @click="navigateTo('/staff/facilities')">
          <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
          Back to Facilities
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
