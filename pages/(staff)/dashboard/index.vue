<script setup lang="ts">
import { useAuthStore } from "@/stores/app" 
import StaffDashboard from "./StaffDashboard.vue"
import DoctorDashboard from "@/pages/(staff)/dashboard/components/DoctorDashboard.vue"
import SecretaryDashboard from "@/pages/(staff)/dashboard/components/SecretaryDashboard.vue"

const authStore = useAuthStore()

// Determine which dashboard to show based on user role
const userRole = computed(() => authStore.user?.role || 'STAFF')
</script>

<template>
  <div class="w-full flex gap-4 overflow-x-auto">
    <!-- Doctor-specific dashboard -->
    <DoctorDashboard v-if="userRole === 'DOCTOR'" />
    
    <!-- Secretary-specific dashboard -->
    <SecretaryDashboard v-else-if="userRole === 'SECRETARY'" />
    
    <!-- General staff dashboard (default) -->
    <StaffDashboard v-else />
  </div>
</template>
