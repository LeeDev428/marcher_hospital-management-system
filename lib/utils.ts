import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatEnumLabel(value: string): string {
	if (!value) return ""
	const normalized = value.replace(/[-\s]+/g, "_")
	return normalized
		.split("_")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ")
}
