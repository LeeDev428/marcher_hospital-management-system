<script setup lang="ts">

</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-2">Add Room Occupancy Log</h1>
    <p class="text-gray-600 mb-4">
      This form will allow manual creation of a room occupancy log.
    </p>

    <form class="space-y-4 border rounded p-4 bg-gray-50 max-w-md">
      <div>
        <label class="block mb-1 text-sm font-medium">Facility</label>
        <input type="text" class="border px-2 py-1 w-full rounded" placeholder="Room 101">
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">Action</label>
        <select class="border px-2 py-1 w-full rounded">
          <option>Occupied</option>
          <option>Vacated</option>
          <option>Maintenance</option>
        </select>
      </div>

      <button
        type="button"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Save Log
      </button>
    </form>
  </div>
</template>


