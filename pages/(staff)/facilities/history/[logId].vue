<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-2">Room Log Details</h1>
    <p class="text-gray-600 mb-4">
      Viewing details for log ID: <strong>{{ $route.params.logId }}</strong>
    </p>

    <!-- Placeholder details -->
    <div class="border rounded p-4 bg-gray-50">
      <p><strong>Facility:</strong> (data will load here)</p>
      <p><strong>Action:</strong> (data will load here)</p>
      <p><strong>Status Change:</strong> Old → New</p>
      <p><strong>User:</strong> (data will load here)</p>
      <p><strong>Date:</strong> (data will load here)</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Later you can fetch the log details by ID using $route.params.logId
</script>
