<script setup lang="ts">
// Mock appointments data  
const todaysAppointments = ref([
  {
    id: 1,
    time: "09:00 AM",
    patient: "John Doe",
    doctor: "Dr. Sarah Wilson",
    type: "Consultation",
    status: "confirmed",
    room: "Room 101"
  },
  {
    id: 2, 
    time: "10:30 AM",
    patient: "Maria Garcia",
    doctor: "Dr. Michael Chen", 
    type: "Follow-up",
    status: "in-progress",
    room: "Room 203"
  },
  {
    id: 3,
    time: "11:15 AM", 
    patient: "Robert Johnson",
    doctor: "Dr. Emily Davis",
    type: "Consultation",
    status: "waiting",
    room: "Room 105"
  },
  {
    id: 4,
    time: "02:00 PM",
    patient: "Lisa Anderson", 
    doctor: "Dr. James Miller",
    type: "Checkup",
    status: "confirmed",
    room: "Room 301"
  },
  {
    id: 5,
    time: "03:30 PM",
    patient: "David Wilson",
    doctor: "Dr. Sarah Wilson",
    type: "Consultation", 
    status: "confirmed",
    room: "Room 101"
  }
])

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800'
    case 'waiting':
      return 'bg-yellow-100 text-yellow-800'
    case 'completed':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'lucide:check-circle'
    case 'in-progress':
      return 'lucide:clock'
    case 'waiting':
      return 'lucide:user-clock'
    case 'completed':
      return 'lucide:check'
    default:
      return 'lucide:circle'
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100">
    <div class="p-6 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Today's Appointments</h3>
        <Button variant="ghost" size="sm" @click="navigateTo('/staff/appointments')">
          View All
          <Icon name="lucide:arrow-right" class="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>

    <div class="divide-y divide-gray-100">
      <div 
        v-for="appointment in todaysAppointments" 
        :key="appointment.id"
        class="p-4 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="text-center min-w-[60px]">
              <div class="text-sm font-semibold text-gray-900">{{ appointment.time }}</div>
              <div class="text-xs text-gray-500">{{ appointment.room }}</div>
            </div>
            
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ appointment.patient }}</p>
              <p class="text-sm text-gray-600">{{ appointment.doctor }}</p>
              <p class="text-xs text-gray-500">{{ appointment.type }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <span 
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusColor(appointment.status)
              ]"
            >
              <Icon :name="getStatusIcon(appointment.status)" class="w-3 h-3 mr-1" />
              {{ appointment.status }}
            </span>
            
            <Button variant="ghost" size="sm">
              <Icon name="lucide:more-horizontal" class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="p-4 border-t border-gray-100 bg-gray-50">
      <Button variant="outline" class="w-full">
        <Icon name="lucide:calendar-plus" class="w-4 h-4 mr-2" />
        Schedule New Appointment
      </Button>
    </div>
  </div>
</template>