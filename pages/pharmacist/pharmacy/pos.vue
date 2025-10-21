<script setup lang="ts">
// Redirect pharmacy POS to pharmacist billing POS
definePageMeta({
  middleware: () => {
    return navigateTo('/pharmacist/billing')
  }
})
</script>

<template>
  <div>Redirecting to Billing POS...</div>
</template>
