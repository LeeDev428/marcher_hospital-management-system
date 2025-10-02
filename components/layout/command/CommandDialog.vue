<script setup lang="ts">
import { useMagicKeys } from "@vueuse/core"
import { Button } from "@/components/ui/button"
import { CommandDialog, CommandInput, CommandList, CommandEmpty } from "@/components/ui/command"

const keys = useMagicKeys({
	passive: false,
	onEventFired: (event) => {
		if (event.key === "P" && event.ctrlKey && event.shiftKey) {
			event.preventDefault()
		}
	}
})
const keyboardShortcut = keys["Ctrl+Shift+P"]
const open = ref(false)
const commandInput = defineModel<string>("commandInput")

watch(keyboardShortcut, (value) => {
	if (value) {
		open.value = !open.value
	}
})
</script>

<template>
	<div>
		<Button variant="outline" size="icon" @click="open = !open">
			<Icon name="mdi:terminal-line" />
		</Button>

		<CommandDialog :open="open" @update:open="open = $event">
			<CommandInput v-model="commandInput" placeholder="Type a command or search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<slot />
			</CommandList>
		</CommandDialog>
	</div>
</template>