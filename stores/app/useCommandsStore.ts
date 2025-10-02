import { defineStore } from "pinia"
import type { Command } from "@/types/app/command"

export const useCommandsStore = defineStore("commands", {
	state: () => ({
		commands: [] as Command[]
	}),

	actions: {

	}
})