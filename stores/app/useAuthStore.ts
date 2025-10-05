import { defineStore } from "pinia"
import { useToast } from "@/composables/useToast"
import type { LoginSchema } from "@/types/app"

export const useAuthStore = defineStore("auth", {
	state: () => ({
		user: null as { id: string; role: string; email: string; firstName: string; lastName: string } | null,
	}),
	actions: {
		setUser(user: { id: string; role: string; email: string; firstName: string; lastName: string } | null) {
			console.log('🔄 Setting user in store:', user)
			this.user = user
		},

		async login(credentials: LoginSchema) {
			const { $trpc } = useNuxtApp()

			try {
				const response = await $trpc.auth.login.mutate(credentials) as any

				if (response.success) {
					this.user = response.user
					
					// Ensure state is persisted before redirect
					await nextTick()
					
					useToast("success", "Login", "Login successful")
					
					// Get redirect path based on role
					const redirectPath = this.getRedirectPath(response.user.role)
					
					// Add a small delay to ensure persistence is complete
					setTimeout(async () => {
						await navigateTo(redirectPath)
					}, 100)
					return
				}

				useToast("error", "Login", response.message)
			} catch (error) {
				useToast("error", "Login")
			}
		},

		getRedirectPath(role: string) {
			const normalizedRole = role.toLowerCase()
			switch (normalizedRole) {
				case 'admin':
					return '/admin/dashboard'
				case 'staff':
					return '/staff/dashboard'
				case 'partner':
					return '/partner/dashboard'
				case 'patient':
				default:
					return '/patient'
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
		},
		name: (state) => {
			return state.user ? `${state.user.firstName} ${state.user.lastName}` : ""
		},
		isAuthenticated: (state) => {
			console.log('🔍 Checking authentication state:', !!state.user)
			return !!state.user
		}
	},

	persist: {
		key: 'auth',
		pick: ['user'],
		debug: process.env.NODE_ENV === 'development'
	}
})