<script setup lang="ts">
import { CommandGroup, CommandItem } from "@/components/ui/command"
import type { Command } from "@/types/app/command"

defineProps<{
	group: Command
}>()
</script>

<template>
	<CommandGroup :heading="group.label">
		<CommandItem v-for="command in group.commands" :key="command.value" :value="command.value">
			<Icon v-if="command.icon" :name="command.icon" />
			{{ command.label }}
		</CommandItem>
	</CommandGroup>
</template>