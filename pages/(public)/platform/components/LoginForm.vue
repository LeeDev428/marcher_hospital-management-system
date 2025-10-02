<script setup lang="ts">
import { loginSchema, type LoginSchema } from "@/types/app"
import { useAuthStore } from "@/stores/app"
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "@/components/ui/card"
import {
	TypedForm,
	TypedInput,
	TypedCheckbox,
} from "@/components/app/form"
import { Button } from "@/components/ui/button"

const authStore = useAuthStore()
const onSubmit = async (values: LoginSchema) => {
	await authStore.login(values)
}
</script>

<template>
	<div class="min-h-screen flex items-center justify-center p-4">
		<!-- Login Card -->
		<Card class="w-full max-w-md shadow-2xl border-0 bg-white">
			<CardHeader class="text-center pb-6">
				<!-- Logo -->
				<div class="flex justify-center mb-4">
					<div class="w-16 h-16 bg-[#5c6b73] rounded-full flex items-center justify-center">
						<svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 2L3 7v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7l-7-5zM10 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" clip-rule="evenodd" />
						</svg>
					</div>
				</div>
				
				<CardTitle class="text-2xl font-bold text-[#253237] mb-2">Welcome Back</CardTitle>
				<p class="text-[#5c6b73]">Sign in to your Marcher account</p>
			</CardHeader>
			
			<CardContent class="space-y-6">
				<TypedForm :schema="loginSchema" class="space-y-4" @submit="onSubmit">
					<div class="space-y-2">
						<TypedInput 
							name="email" 
							label="Email" 
							type="email" 
							class="w-full px-4 py-3 border border-[#c2dfe3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9db4c0] focus:border-transparent transition-all duration-300"
							placeholder="Enter your email"
						/>
					</div>
					
					<div class="space-y-2">
						<TypedInput 
							name="password" 
							label="Password" 
							type="password" 
							class="w-full px-4 py-3 border border-[#c2dfe3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9db4c0] focus:border-transparent transition-all duration-300"
							placeholder="Enter your password"
						/>
					</div>
					
					<div class="flex items-center justify-between">
						<TypedCheckbox 
							name="remember" 
							label="Remember me" 
							class="text-[#5c6b73]"
						/>
						<a href="#" class="text-[#9db4c0] hover:text-[#5c6b73] text-sm font-medium transition-colors duration-300">
							Forgot password?
						</a>
					</div>
					
					<Button 
						type="submit" 
						class="w-full bg-[#5c6b73] hover:bg-[#253237] text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
					>
						Sign In
					</Button>
				</TypedForm>
				
				<div class="text-center pt-4">
					<p class="text-[#5c6b73]">
						Don't have an account? 
						<NuxtLink 
							to="platform/signup" 
							class="text-[#9db4c0] hover:text-[#5c6b73] font-semibold transition-colors duration-300"
						>
							Sign up
						</NuxtLink>
					</p>
				</div>
			</CardContent>
		</Card>
	</div> 
</template>