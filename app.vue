<script setup lang="ts">
import { Toaster } from "vue-sonner"
import "vue-sonner/style.css"
</script>

<template>
	<NuxtLayout>
		<NuxtRouteAnnouncer />
		<NuxtLoadingIndicator />
		<NuxtPage />
		<Toaster />
	</NuxtLayout>
</template>
