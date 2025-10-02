<script setup lang="ts">
import ServicesForm from "../components/ServicesForm.vue"
</script> 


<template>
  <NuxtLayout title="Services">
    <div class="min-h-screen bg-[#ebece8]">
      <!-- Header Navigation -->
			<header class="bg-[#5c6b73] shadow-lg">
				<nav class="container mx-auto px-6 py-4">
					<div class="flex items-center justify-between">
						<!-- Logo -->
						<NuxtLink to="/platform" class="flex items-center space-x-2">
							<div
								class="w-8 h-8 bg-[#c2dfe3] rounded-full flex items-center justify-center"
							>
								<svg
									class="w-5 h-5 text-[#5c6b73]"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M10 2L3 7v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7l-7-5zM10 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							<span class="text-[#e0fbfc] text-xl font-bold">MARCHER</span>
						</NuxtLink>

						<!-- Navigation Links -->
						<div class="hidden md:flex items-center space-x-8">
							<NuxtLink
								to="/platform/aboutus"
								class="text-[#e0fbfc] hover:text-[#c2dfe3] transition-colors duration-300 font-medium"
							>
								About Us
							</NuxtLink>
							<NuxtLink
								to="/platform/services"
								class="text-[#e0fbfc] hover:text-[#c2dfe3] transition-colors duration-300 font-medium"
							>
								Services
							</NuxtLink>
							<NuxtLink
								to="/platform/support"
								class="text-[#e0fbfc] hover:text-[#c2dfe3] transition-colors duration-300 font-medium"
							>
								Support
							</NuxtLink>
							<div class="relative group">
								<button
									class="text-[#e0fbfc] hover:text-[#c2dfe3] transition-colors duration-300 font-medium flex items-center space-x-1"
								>
									<span>Account</span>
									<svg
										class="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
								<div
									class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10"
								>
									<NuxtLink
										to="/platform/login"
										class="block px-4 py-2 text-[#253237] hover:bg-[#e0fbfc] transition-colors duration-300"
									>
										Login
									</NuxtLink>
									<NuxtLink
										to="/platform/signup"
										class="block px-4 py-2 text-[#253237] hover:bg-[#e0fbfc] transition-colors duration-300"
									>
										Sign Up
									</NuxtLink>
								</div>
							</div>
						</div>

						<!-- Mobile menu button -->
						<div class="md:hidden">
							<button class="text-[#e0fbfc] hover:text-[#c2dfe3]">
								<svg
									class="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							</button>
						</div>
					</div>
				</nav>
			</header>

		<!-- Main Content -->
      <ServicesForm />

      <!-- Footer -->
			<footer class="bg-[#253237] text-[#e0fbfc] py-6 mt-0">
				<div class="container mx-auto px-6">
					<div class="grid md:grid-cols-2 gap-8 items-center">
						<!-- Left Column -->
						<div class="text-sm">
							<h3 class="text-base font-semibold mb-4 text-[#9db4c0]">
								Contact Us
							</h3>
							<p class="text-[#c2dfe3] mb-2">support@marcher.com</p>
							<p class="text-[#c2dfe3] mb-6">(042) 540-7732</p>

							<div>
								<p class="text-[#9db4c0] mb-2">
									Keep up to date with our news and updates.
								</p>
								<div class="flex">
									<input
										type="email"
										placeholder="enter email address"
										class="w-70 px-4 py-2 rounded-l-lg bg-white text-[#253237] focus:outline-none text-sm"
									/>
									<button
										class="bg-[#9db4c0] text-[#253237] px-6 py-2 rounded-r-lg font-semibold hover:bg-[#c2dfe3] transition-colors duration-300 text-sm"
									>
										Go
									</button>
								</div>
							</div>
						</div>

						<!-- Right Column -->
						<div
							class="flex flex-col items-center md:items-end justify-center text-center md:text-right text-sm"
						>
							<p class="font-bold mb-2">
								"Your Trusted Cloud HIS for Better Healthcare."
							</p>
							<p class="opacity-75 mb-4">
								© 2025 Marcher Hospital Information System. All rights
								reserved.
							</p>
							<div class="flex justify-center md:justify-end space-x-4">
								<NuxtLink
									to="/platform/terms"
									class="text-[#c2dfe3] hover:text-white transition-colors duration-300"
								>
									Term of Use
								</NuxtLink>
								<NuxtLink
									to="/platform/privacypolicy"
									class="text-[#c2dfe3] hover:text-white transition-colors duration-300"
								>
									Privacy Policy
								</NuxtLink>
							</div>
						</div>
					</div>
				</div>
			</footer>
    </div>
  </NuxtLayout>
</template>