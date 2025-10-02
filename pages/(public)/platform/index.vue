<script setup lang="ts">
// No special logic needed for the landing page navigation
</script>

<template>
	<NuxtLayout title="Marcher">
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

			<!-- Hero Section -->
			<main class="container mx-auto px-6 py-16">
				<div class="flex flex-col lg:flex-row items-center justify-between">
					<!-- Left Content -->
					<div class="lg:w-1/2 mb-12 lg:mb-0">
						<h1
							class="text-4xl lg:text-6xl font-bold text-[#253237] mb-6 leading-tight"
						>
							YOUR GATEWAY TO
							<span class="text-[#5c6b73]">SMARTER HEALTH</span>
							<span class="text-[#9db4c0]">MANAGEMENT</span>
						</h1>

						<p class="text-lg text-[#5c6b73] mb-8 leading-relaxed">
							Marcher is a secure, scalable public cloud hospital information
							system built with multitenancy architecture. Streamline your
							healthcare workflows while ensuring compliance with DPA and HIPAA
							regulations.
						</p>

						<div class="flex flex-col sm:flex-row gap-4">
							<NuxtLink
								to="/platform/login"
								class="bg-[#9db4c0] hover:bg-[#5c6b73] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 text-center transform hover:scale-105 shadow-lg"
							>
								LOGIN
							</NuxtLink>

							<NuxtLink
								to="/platform/aboutus"
								class="border-2 border-[#9db4c0] text-[#5c6b73] hover:bg-[#9db4c0] hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 text-center transform hover:scale-105"
							>
								Learn More
							</NuxtLink>
						</div>
					</div>

					<!-- Right Content - Healthcare Illustration -->
					<div class="lg:w-1/2 flex justify-center">
						<div class="relative">
							<!-- Main healthcare icon -->
							<div
								class="w-64 h-64 bg-gradient-to-br from-[#c2dfe3] to-[#9db4c0] rounded-full flex items-center justify-center shadow-2xl"
							>
								<div
									class="w-32 h-32 bg-white rounded-full flex items-center justify-center"
								>
									<svg
										class="w-20 h-20 text-[#5c6b73]"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
										/>
									</svg>
								</div>
							</div>

							<!-- Floating elements -->
							<div
								class="absolute -top-4 -right-4 w-16 h-16 bg-[#c2dfe3] rounded-full opacity-80 animate-bounce"
							/>
							<div
								class="absolute -bottom-4 -left-4 w-20 h-20 bg-[#9db4c0] rounded-full opacity-60 animate-pulse"
							/>
							<div
								class="absolute top-1/2 -left-8 w-12 h-12 bg-[#5c6b73] rounded-full opacity-50 animate-ping"
							/>
						</div>
					</div>
				</div>
			</main>

			<!-- How Marcher Works Section -->
			<section class="py-16 bg-[#5c6b73]">
				<div class="container mx-auto px-6">
					<div class="text-center mb-12">
						<h2 class="text-4xl font-bold text-[#e0fbfc] mb-4">
							HOW MARCHER WORKS?
						</h2>
					</div>

					<div class="grid md:grid-cols-2 gap-12 items-center">
						<!-- Left side - Image placeholder -->
						<div
							class="bg-gradient-to-br from-[#c2dfe3] to-[#9db4c0] rounded-2xl p-8 h-80 flex items-center justify-center"
						>
							<div class="text-center">
								<div
									class="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
								>
									<svg
										class="w-12 h-12 text-[#5c6b73]"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
								</div>
								<p class="text-[#253237] font-semibold">
									Healthcare Management System
								</p>
							</div>
						</div>

						<!-- Right side - Steps -->
						<div class="space-y-8">
							<div class="flex items-start space-x-4">
								<div
									class="flex-shrink-0 w-12 h-12 bg-[#9db4c0] rounded-full flex items-center justify-center"
								>
									<span class="text-[#253237] font-bold text-xl">1</span>
								</div>
								<div>
									<h3 class="text-xl font-bold text-[#e0fbfc] mb-2">
										MARCHER PLATFORM
									</h3>
									<p class="text-[#c2dfe3]">
										Visit the Marcher platform to view available Marcher plans.
										You can choose a plan that is suitable for your
										organization's specific needs.
									</p>
								</div>
							</div>

							<div class="flex items-start space-x-4">
								<div
									class="flex-shrink-0 w-12 h-12 bg-[#c2dfe3] rounded-full flex items-center justify-center"
								>
									<span class="text-[#253237] font-bold text-xl">2</span>
								</div>
								<div>
									<h3 class="text-xl font-bold text-[#e0fbfc] mb-2">
										WAIT FOR CREDENTIALS
									</h3>
									<p class="text-[#c2dfe3]">
										Wait for the login credentials to be sent to your email.
										These credentials will be used to set up your Marcher
										account.
									</p>
								</div>
							</div>

							<div class="flex items-start space-x-4">
								<div
									class="flex-shrink-0 w-12 h-12 bg-[#c5c5c3] rounded-full flex items-center justify-center"
								>
									<span class="text-[#253237] font-bold text-xl">3</span>
								</div>
								<div>
									<h3 class="text-xl font-bold text-[#e0fbfc] mb-2">
										SET UP ACCOUNT
									</h3>
									<p class="text-[#c2dfe3]">
										Follow the instructions to set up your Marcher account using
										the provided credentials.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Marcher Features Section -->
			<section class="py-16 bg-white">
				<div class="container mx-auto px-6">
					<div class="text-center mb-12">
						<h2 class="text-4xl font-bold text-[#253237] mb-4">
							MARCHER Features
						</h2>
						<p class="text-xl text-[#5c6b73]">
							Comprehensive healthcare management capabilities
						</p>
					</div>

					<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						<!-- Feature 1 -->
						<div
							class="bg-gradient-to-br from-[#e0fbfc] to-[#c2dfe3] rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
						>
							<div
								class="w-16 h-16 bg-[#5c6b73] rounded-full flex items-center justify-center mx-auto mb-4"
							>
								<svg
									class="w-8 h-8 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<h3 class="text-lg font-semibold text-[#253237] mb-2">Billing</h3>
							<p class="text-[#5c6b73]">
								Comprehensive billing and invoicing system
							</p>
						</div>

						<!-- Feature 2 -->
						<div
							class="bg-gradient-to-br from-[#c2dfe3] to-[#9db4c0] rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
						>
							<div
								class="w-16 h-16 bg-[#253237] rounded-full flex items-center justify-center mx-auto mb-4"
							>
								<svg
									class="w-8 h-8 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0L6 21m6-14L18 21"
									/>
								</svg>
							</div>
							<h3 class="text-lg font-semibold text-[#253237] mb-2">
								Appointment
							</h3>
							<p class="text-[#5c6b73]">
								Efficient appointment scheduling and management
							</p>
						</div>

						<!-- Feature 3 -->
						<div
							class="bg-gradient-to-br from-[#9db4c0] to-[#5c6b73] rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
						>
							<div
								class="w-16 h-16 bg-[#c2dfe3] rounded-full flex items-center justify-center mx-auto mb-4"
							>
								<svg
									class="w-8 h-8 text-[#253237]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<h3 class="text-lg font-semibold text-white mb-2">
								Medical Records
							</h3>
							<p class="text-[#c2dfe3]">
								Secure digital patient record management
							</p>
						</div>

						<!-- Feature 4 -->
						<div
							class="bg-gradient-to-br from-[#5c6b73] to-[#253237] rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
						>
							<div
								class="w-16 h-16 bg-[#9db4c0] rounded-full flex items-center justify-center mx-auto mb-4"
							>
								<svg
									class="w-8 h-8 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
							</div>
							<h3 class="text-lg font-semibold text-white mb-2">
								Optical Character Recognition
							</h3>
							<p class="text-[#c2dfe3]">Advanced OCR for document processing</p>
						</div>

						<!-- Feature 5 -->
						<div
							class="bg-gradient-to-br from-[#253237] to-[#c5c5c3] rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
						>
							<div
								class="w-16 h-16 bg-[#c2dfe3] rounded-full flex items-center justify-center mx-auto mb-4"
							>
								<svg
									class="w-8 h-8 text-[#253237]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<h3 class="text-lg font-semibold text-white mb-2">
								Quick Response Code
							</h3>
							<p class="text-[#c2dfe3]">
								QR code integration for rapid data access
							</p>
						</div>

						<!-- Feature 6 -->
						<div
							class="bg-gradient-to-br from-[#c5c5c3] to-[#e0fbfc] rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
						>
							<div
								class="w-16 h-16 bg-[#5c6b73] rounded-full flex items-center justify-center mx-auto mb-4"
							>
								<svg
									class="w-8 h-8 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
							</div>
							<h3 class="text-lg font-semibold text-[#253237] mb-2">
								Healthcare Security
							</h3>
							<p class="text-[#5c6b73]">
								DPA & HIPAA compliant security measures
							</p>
						</div>
					</div>
				</div>
			</section>

			<!-- Testimonials Section -->
			<section class="pt-20 pb-20 bg-[#c5c5c3]">
				<div class="container mx-auto px-6">
					<div class="text-center mb-12">
						<p
							class="text-[#9db4c0] text-2xl uppercase tracking-wider font-medium mb-4"
						>
							FEEDBACK
						</p>
						<h2 class="text-3xl font-bold text-[#253237] mb-4">
							What our customers say about their satisfaction with our services
						</h2>
					</div>

					<div class="grid md:grid-cols-2 gap-8">
						<!-- Testimonial 1 -->
						<div class="bg-white rounded-2xl p-8 shadow-lg">
							<div class="flex items-center mb-6">
								<div
									class="w-16 h-16 bg-gradient-to-br from-[#c2dfe3] to-[#9db4c0] rounded-full flex items-center justify-center mr-4"
								>
									<span class="text-2xl font-bold text-white">GC</span>
								</div>
								<div>
									<h4 class="text-lg font-semibold text-[#253237]">
										Mr. Guilbert Cruz
									</h4>
									<p class="text-[#5c6b73] text-sm">
										(St. Luke's Hospital, Feb 2025)
									</p>
								</div>
							</div>
							<p class="text-[#5c6b73] italic">
								"As the Instance Admin of St. Luke's Hospital, the Marcher
								system makes our healthcare services more efficient, more
								effective, and easier to use."
							</p>
						</div>

						<!-- Testimonial 2 -->
						<div class="bg-white rounded-2xl p-8 shadow-lg">
							<div class="flex items-center mb-6">
								<div
									class="w-16 h-16 bg-gradient-to-br from-[#5c6b73] to-[#253237] rounded-full flex items-center justify-center mr-4"
								>
									<span class="text-2xl font-bold text-white">CA</span>
								</div>
								<div>
									<h4 class="text-lg font-semibold text-[#253237]">
										Dr. Cynthia Aranilla
									</h4>
									<p class="text-[#5c6b73] text-sm">
										(Makati Medical Center, March 2025)
									</p>
								</div>
							</div>
							<p class="text-[#5c6b73] italic">
								"By using the Marcher system, it is easier for us to manage
								patient records, billing, and hospital operations efficiently,
								improving overall workflow in the Health Information System. It
								helps us provide better care to patients."
							</p>
						</div>
					</div>
				</div>
			</section>

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
									>
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
									Terms of Use
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