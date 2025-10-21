<script setup lang="ts">
// Redirect pharmacy sales to billing sales for reusability
definePageMeta({
  middleware: () => {
    return navigateTo('/pharmacist/billing/sales')
  }
})
</script>

<template>
  <div>Redirecting to Sales History...</div>
</template>
