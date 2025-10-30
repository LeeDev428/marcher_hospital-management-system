<template>
	<div>
		<p>Redirecting...</p>
	</div>
</template>

<script setup lang="ts">
// This page redirects to the staff encounters list
// Individual encounter management is handled by admissions staff
definePageMeta({
	layout: 'staff',
	middleware: 'auth'
})

// Redirect to encounters list
navigateTo('/staff/encounters')
</script>
