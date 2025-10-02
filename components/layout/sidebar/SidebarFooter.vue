<script setup lang="ts">
import { useAuthStore } from "@/stores/app"
import { Button } from "@/components/ui/button"

const authStore = useAuthStore()

const user = authStore.user

const logout = async () => {
	await authStore.logout()
}
</script>

<template>
	<div class="flex items-center gap-2 justify-between w-full">
		<div class="flex items-center gap-2">
			<div class="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center">
				<!-- <NuxtImg src="/logo.png" alt="logo" class="w-10 h-10 rounded-full" /> -->
				<Icon name="mdi:account" size="20"/>
			</div>
			<div class="flex flex-col items-start">
				<span class="text-sm truncate max-w-[200px]">{{ authStore.fullName }}</span>
				<span class="text-xs text-gray-500">{{ user ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Unknown' }}</span>
			</div>
		</div>
		<Button variant="outline" size="icon" type="button" @click="logout">
			<Icon name="mdi:logout" />
		</Button>
	</div>
</template>