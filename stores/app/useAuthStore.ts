import { defineStore } from "pinia"
import { useToast } from "@/composables/useToast"
import type { LoginSchema } from "@/types/app"

export const useAuthStore = defineStore("auth", {
	state: () => ({
		user: null as { 
			id: string; 
			role: string; 
			email: string; 
			firstName: string; 
			lastName: string;
			staffCredentials?: {
				staffType: 'DOCTOR' | 'NURSE' | 'STAFF';
			} | null;
		} | null,
		isHydrated: false,
	}),
	actions: {
		setUser(user: { 
			id: string; 
			role: string; 
			email: string; 
			firstName: string; 
			lastName: string;
			staffCredentials?: {
				staffType: 'DOCTOR' | 'NURSE' | 'STAFF';
			} | null;
		} | null) {
			console.log('🔄 Setting user in store:', user)
			this.user = user
			this.isHydrated = true
		},

		async login(credentials: LoginSchema) {
			const { $trpc } = useNuxtApp()

			try {
				const response = await $trpc.auth.login.mutate(credentials) as any

				if (response.success) {
					this.user = response.user
					this.isHydrated = true
					
					// Ensure state is persisted before redirect
					await nextTick()
					
					useToast("success", "Login", "Login successful")
					
					// Get redirect path based on role
					const redirectPath = this.getRedirectPath(response.user.role)
					
					// Add a delay to ensure cookies and persistence are complete
					setTimeout(async () => {
						await navigateTo(redirectPath)
					}, 300)
					return
				}

				useToast("error", "Login", response.message)
			} catch (error) {
				useToast("error", "Login")
			}
		},

		getRedirectPath(role: string) {
			const normalizedRole = role.toLowerCase()
			const staffType = this.user?.staffCredentials?.staffType
			
			switch (normalizedRole) {
				case 'admin':
					return '/admin/users'
				case 'staff':
					// Check staff type for specialized roles
					if (staffType === 'ADMISSIONS_STAFF') {
						return '/admissions_staff'
					}
					if (staffType === 'BILLING_STAFF') {
						return '/billing_staff'
					}
					if (staffType === 'PHARMACIST') {
						return '/pharmacist/billing'
					}
					// Default staff dashboard (doctors/nurses)
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
					localStorage.removeItem('auth') // Clear localStorage
					
					// Clear all pinia persisted state
					if (typeof window !== 'undefined') {
						const keys = Object.keys(localStorage)
						keys.forEach(key => {
							if (key.startsWith('pinia-')) {
								localStorage.removeItem(key)
							}
						})
					}
					
					useToast("success", "Logout", "Logout successful")
					
					// Wait a bit before redirect to ensure state is cleared
					await new Promise(resolve => setTimeout(resolve, 100))
					await navigateTo("/login")
					return
				}

				useToast("error", "Logout", response.message)
			} catch (error) {
				useToast("error", "Logout")
				// Clear user state and localStorage even if logout fails (for UX)
				this.user = null
				localStorage.removeItem('auth')
				
				// Clear all pinia persisted state
				if (typeof window !== 'undefined') {
					const keys = Object.keys(localStorage)
					keys.forEach(key => {
						if (key.startsWith('pinia-')) {
							localStorage.removeItem(key)
						}
					})
				}
				
				await new Promise(resolve => setTimeout(resolve, 100))
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
		storage: typeof window !== 'undefined' ? localStorage : undefined,
		pick: ['user']
	}
})