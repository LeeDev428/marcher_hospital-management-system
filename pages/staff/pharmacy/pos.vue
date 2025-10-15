<script setup lang="ts">
// Redirect pharmacy POS to billing POS
definePageMeta({
  middleware: () => {
    return navigateTo('/staff/billing')
  }
})
</script>

<template>
  <div>Redirecting to Billing POS...</div>
</template>
