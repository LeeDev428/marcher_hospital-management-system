<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="bg-slate-700 shadow-md sticky top-0 z-50">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <img src="/img/logo/marcher-logo.png" alt="Marcher Logo" class="w-8 h-8" />
            <span class="text-xl font-bold text-white">Marcher</span>
          </div>
          
          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-6">
            <a href="#home" class="text-gray-200 hover:text-white font-medium transition-colors">Home</a>
            <a href="#features" class="text-gray-200 hover:text-white font-medium transition-colors">Features</a>
            <a href="#about" class="text-gray-200 hover:text-white font-medium transition-colors">About</a>
            <a href="#services" class="text-gray-200 hover:text-white font-medium transition-colors">Services</a>
            <a href="#contact" class="text-gray-200 hover:text-white font-medium transition-colors">Contact</a>
          </div>
          
          <!-- Auth Buttons -->
          <div class="flex items-center space-x-3">
            <Button variant="ghost" @click="navigateTo('/login')" class="text-gray-200 hover:text-white hover:bg-slate-600">
              Login
            </Button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="bg-gradient-to-br from-gray-100 to-slate-200 py-20">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="space-y-6">
            <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              YOUR GATEWAY TO<br/>
              SMARTER<br/>
              <span class="text-teal-600">HEALTH MANAGEMENT</span>
            </h1>
            <p class="text-lg text-gray-700 leading-relaxed">
              Marcher is a modern, scalable and user-friendly information management system 
              that empowers healthcare providers and patients with advanced tools for better health outcomes.
            </p>
            
            <div class="flex flex-wrap gap-4">
              <Button @click="navigateTo('/register')" class="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 text-lg">
                Get Started
              </Button>
              <Button variant="outline" @click="scrollTo('about')" class="border-slate-400 text-slate-700 hover:bg-slate-100 px-8 py-3 text-lg">
                Learn More
              </Button>
            </div>
          </div>

          <!-- Right Content - Illustration -->
          <div class="relative">
            <div class="bg-teal-400 bg-opacity-30 rounded-full w-80 h-80 mx-auto flex items-center justify-center">
              <div class="bg-white rounded-full p-12 shadow-xl">
                <Icon name="lucide:heart-pulse" class="w-32 h-32 text-teal-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How Marcher Works Section -->
    <section id="how-it-works" class="py-20 bg-slate-700 text-white">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4">HOW MARCHER WORKS?</h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Step 1 -->
          <div class="text-center space-y-4">
            <div class="bg-slate-600 rounded-lg p-12 mb-4 mx-auto w-fit">
              <Icon name="lucide:search" class="w-16 h-16 text-teal-400 mx-auto" />
            </div>
            <h3 class="text-xl font-semibold">SEARCH PLATFORM</h3>
            <p class="text-gray-300">
              Our intuitive search engine allows you to easily find healthcare providers, 
              services, and information tailored to your needs.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="text-center space-y-4">
            <div class="bg-slate-600 rounded-lg p-12 mb-4 mx-auto w-fit">
              <Icon name="lucide:user-check" class="w-16 h-16 text-teal-400 mx-auto" />
            </div>
            <h3 class="text-xl font-semibold">NOTIFY IMMEDIATELY</h3>
            <p class="text-gray-300">
              Receive instant notifications and updates about appointments, 
              prescriptions, and important health information in real-time.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="text-center space-y-4">
            <div class="bg-slate-600 rounded-lg p-12 mb-4 mx-auto w-fit">
              <Icon name="lucide:shield-check" class="w-16 h-16 text-teal-400 mx-auto" />
            </div>
            <h3 class="text-xl font-semibold">SETUP ACCOUNT</h3>
            <p class="text-gray-300">
              Create your secure account in minutes and get immediate access to 
              all platform features with complete data privacy protection.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Why Choose Marcher Healthcare?</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience seamless healthcare management with our comprehensive platform designed for modern medical practices.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-gradient-to-br from-teal-50 to-blue-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-teal-500 rounded-xl flex items-center justify-center mb-6">
              <Icon name="lucide:users" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Patient Management</h3>
            <p class="text-gray-600 mb-4">
              Comprehensive patient records, medical history tracking, and seamless appointment scheduling.
            </p>
            <ul class="text-sm text-gray-500 space-y-2">
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-teal-500 mr-2" />Electronic Health Records</li>
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-teal-500 mr-2" />Medical History</li>
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-teal-500 mr-2" />Patient Portal</li>
            </ul>
          </div>

          <!-- Feature 2 -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
              <Icon name="lucide:calendar-check" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Smart Scheduling</h3>
            <p class="text-gray-600 mb-4">
              Intelligent appointment booking with automated reminders and resource optimization.
            </p>
            <ul class="text-sm text-gray-500 space-y-2">
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-blue-500 mr-2" />Real-time Availability</li>
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-blue-500 mr-2" />Automated Reminders</li>
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-blue-500 mr-2" />Resource Planning</li>
            </ul>
          </div>

          <!-- Feature 3 -->
          <div class="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-indigo-500 rounded-xl flex items-center justify-center mb-6">
              <Icon name="lucide:shield-check" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Secure & Compliant</h3>
            <p class="text-gray-600 mb-4">
              HIPAA-compliant security with role-based access and comprehensive audit trails.
            </p>
            <ul class="text-sm text-gray-500 space-y-2">
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-indigo-500 mr-2" />HIPAA Compliance</li>
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-indigo-500 mr-2" />Role-based Access</li>
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-indigo-500 mr-2" />Audit Trails</li>
            </ul>
          </div>

          <!-- Feature 4 -->
          <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
              <Icon name="lucide:credit-card" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Billing & Claims</h3>
            <p class="text-gray-600 mb-4">
              Automated billing processes with insurance integration and payment tracking.
            </p>
            <ul class="text-sm text-gray-500 space-y-2">
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-purple-500 mr-2" />Insurance Integration</li>
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-purple-500 mr-2" />Automated Claims</li>
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-purple-500 mr-2" />Payment Processing</li>
            </ul>
          </div>

          <!-- Feature 5 -->
          <div class="bg-gradient-to-br from-pink-50 to-red-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-pink-500 rounded-xl flex items-center justify-center mb-6">
              <Icon name="lucide:activity" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Analytics & Reports</h3>
            <p class="text-gray-600 mb-4">
              Comprehensive reporting with real-time analytics and business intelligence.
            </p>
            <ul class="text-sm text-gray-500 space-y-2">
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-pink-500 mr-2" />Real-time Analytics</li>
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-pink-500 mr-2" />Custom Reports</li>
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-pink-500 mr-2" />Business Intelligence</li>
            </ul>
          </div>

          <!-- Feature 6 -->
          <div class="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center mb-6">
              <Icon name="lucide:smartphone" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Mobile Ready</h3>
            <p class="text-gray-600 mb-4">
              Responsive design with mobile apps for patients and staff accessibility.
            </p>
            <ul class="text-sm text-gray-500 space-y-2">
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-red-500 mr-2" />Responsive Design</li>
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-red-500 mr-2" />Mobile Apps</li>
              <li class="flex items-center"><Icon name="lucide:check" class="w-4 h-4 text-red-500 mr-2" />Cross-platform</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-teal-600 to-blue-600">
      <div class="container mx-auto px-4 lg:px-8 text-center">
        <h2 class="text-4xl font-bold text-white mb-4">Ready to Transform Your Healthcare Practice?</h2>
        <p class="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
          Join thousands of healthcare professionals who trust Marcher to streamline their operations and improve patient care.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" @click="navigateTo('/register')" class="bg-white text-teal-600 hover:bg-gray-50 px-8">
            <Icon name="lucide:rocket" class="w-5 h-5 mr-2" />
            Get Started Free
          </Button>
          <Button variant="outline" size="lg" class="border-white text-white hover:bg-white hover:text-teal-600 px-8">
            <Icon name="lucide:calendar" class="w-5 h-5 mr-2" />
            Schedule Demo
          </Button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-16">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                <Icon name="lucide:heart-pulse" class="w-6 h-6 text-white" />
              </div>
              <span class="text-2xl font-bold">Marcher</span>
            </div>
            <p class="text-gray-400 mb-6 max-w-md">
              Modern healthcare management system designed to streamline medical practice operations 
              and improve patient care in the Philippines.
            </p>
            <div class="flex space-x-4">
              <div class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-600 cursor-pointer transition-colors">
                <Icon name="lucide:facebook" class="w-5 h-5" />
              </div>
              <div class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-600 cursor-pointer transition-colors">
                <Icon name="lucide:twitter" class="w-5 h-5" />
              </div>
              <div class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-600 cursor-pointer transition-colors">
                <Icon name="lucide:linkedin" class="w-5 h-5" />
              </div>
            </div>
          </div>

          <!-- Product -->
          <div>
            <h5 class="font-semibold mb-6">Product</h5>
            <ul class="space-y-3 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h5 class="font-semibold mb-6">Support</h5>
            <ul class="space-y-3 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm">
            © 2024 Marcher Healthcare Management System. All rights reserved.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Marcher - Modern Healthcare Management System',
  meta: [
    { name: 'description', content: 'Find qualified doctors, book appointments, and manage your healthcare journey with Marcher - the modern healthcare management platform.' }
  ]
})
</script>