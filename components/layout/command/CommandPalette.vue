<script setup lang="ts">
import { CommandDialog, CommandGroup } from "."
import type { Command } from "@/types/app/command"

const commandInput = ref("")
const commands = ref<Command[]>([
	{
		label: "Patient Records",
		commands: [
			{
				value: "records.patients.create",
				label: "Create Patient Profile",
				icon: "mdi:account-plus"
			},
			{
				value: "records.patients.edit",
				label: "Edit Patient Profile",
				icon: "mdi:account-edit"
			},
			{
				value: "records.patients.delete",
				label: "Delete Patient Profile",
				icon: "mdi:account-remove"
			}
		]
	}
])
</script>

<template>
	<CommandDialog v-model="commandInput">
		<CommandGroup v-for="command in commands" :key="command.label" :group="command" />
	</CommandDialog>
</template>