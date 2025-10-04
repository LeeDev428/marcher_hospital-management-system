import { defineStore } from "pinia"
import { useToast } from "@/composables/useToast"
import type { LoginSchema } from "@/types/app"

export const useAuthStore = defineStore("auth", {
	state: () => ({
		user: null as { id: string; role: string; email: string; firstName: string; lastName: string } | null,
	}),
	actions: {
		setUser(user: { id: string; role: string; email: string; firstName: string; lastName: string } | null) {
			this.user = user
		},

		async login(credentials: LoginSchema) {
			const { $trpc } = useNuxtApp()

			try {
				const response = await $trpc.auth.login.mutate(credentials) as any

				if (response.success) {
					this.user = response.user
					useToast("success", "Login", "Login successful")
					await navigateTo("/")
					return
				}

				useToast("error", "Login", response.message)
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
				const response = await $trpc.auth.logout.mutate({}) as any

				if (response.success) {
					this.user = null // Clear user state
					useToast("success", "Logout", "Logout successful")
					await navigateTo("/login")
					return
				}

				useToast("error", "Logout", response.message)
			} catch (error) {
				useToast("error", "Logout")
				// Clear user state even if logout fails (for UX)
				this.user = null
				await navigateTo("/login")
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