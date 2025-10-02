export type Command = {
	label: string
	commands: {
		value: string
		label: string
		icon?: string
	}[]
}