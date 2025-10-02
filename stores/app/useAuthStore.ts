import { defineStore } from "pinia"
import { useToast } from "@/composables/useToast"
import type { LoginSchema } from "@/types/app"

export const useAuthStore = defineStore("auth", {
	state: () => ({
		user: null as { id: string; role: string; email: string; firstName: string; lastName: string } | null,
	}),
	actions: {
		async login(credentials: LoginSchema) {
			const { $trpc } = useNuxtApp()

			try {
				const { success, message, user } = await $trpc.auth.login.mutate(credentials)

				if (success) {
					this.user = user
					useToast("success", "Login", "Login successful")
					await navigateTo("/")
					return
				}

				useToast("error", "Login", message)
			} catch (error) {
				useToast("error", "Login")
			}
		},

		// async refresh() {
		// 	const { $trpc } = useNuxtApp()

		// 	try {

		// 	} catch (error) {

		// 	}
		// },

		async logout() {
			const { $trpc } = useNuxtApp()

			try {
				const { success, message } = await $trpc.auth.logout.mutate()

				if (success) {
					useToast("success", "Logout", "Logout successful")
					await navigateTo("/login")
					return
				}

				useToast("error", "Logout", message)
			} catch (error) {
				useToast("error", "Logout")
			}
		},
	},

	getters: {
		fullName: (state) => {
			return state.user ? `${state.user.firstName} ${state.user.lastName}` : ""
		}
	},

	persist: true
})