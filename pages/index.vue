<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <img src="/img/logo/marcher-logo.png" alt="Marcher Logo" class="w-10 h-10" />
            <span class="text-2xl font-bold text-gray-900">Marcher</span>
          </div>
          
          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <a href="#features" class="text-gray-600 hover:text-teal-600 font-medium transition-colors">Features</a>
            <a href="#about" class="text-gray-600 hover:text-teal-600 font-medium transition-colors">About</a>
            <a href="#contact" class="text-gray-600 hover:text-teal-600 font-medium transition-colors">Contact</a>
            <a href="#pricing" class="text-gray-600 hover:text-teal-600 font-medium transition-colors">Pricing</a>
          </div>
          
          <!-- Auth Buttons -->
          <div class="flex items-center space-x-4">
            <Button variant="ghost" @click="navigateTo('/login')" class="text-gray-600 hover:text-teal-600">
              Sign In
            </Button>
            <Button @click="navigateTo('/register')" class="bg-teal-500 hover:bg-teal-600 text-white px-6">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-teal-50 to-blue-50 py-20">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="space-y-8">
            <div class="space-y-4">
              <div class="inline-flex items-center bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium">
                🏥 Modern Healthcare Management
              </div>
              <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Easily Find Your 
                <span class="text-teal-600">Ideal Doctor</span>
              </h1>
              <p class="text-xl text-gray-600 leading-relaxed">
                Connect with qualified healthcare professionals, book appointments seamlessly, 
                and manage your health journey with our comprehensive platform.
              </p>
            </div>

            <!-- Search Bar -->
            <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                  <select class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option>Choose Specialization</option>
                    <option>Cardiology</option>
                    <option>Dermatology</option>
                    <option>Neurology</option>
                    <option>Pediatrics</option>
                    <option>Orthopedics</option>
                  </select>
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option>Choose Location</option>
                    <option>Manila</option>
                    <option>Cebu</option>
                    <option>Davao</option>
                    <option>Quezon City</option>
                  </select>
                </div>
                <div class="flex items-end">
                  <Button class="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 h-12">
                    <Icon name="lucide:search" class="w-5 h-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div class="flex flex-wrap gap-8">
              <div class="text-center">
                <div class="text-3xl font-bold text-gray-900">1000+</div>
                <div class="text-gray-600">Qualified Doctors</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-gray-900">50K+</div>
                <div class="text-gray-600">Happy Patients</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-gray-900">100+</div>
                <div class="text-gray-600">Hospital Partners</div>
              </div>
            </div>
          </div>

          <!-- Right Content - Doctor Image -->
          <div class="relative">
            <div class="bg-teal-100 rounded-3xl p-8 relative overflow-hidden">
              <!-- Background decoration -->
              <div class="absolute top-0 right-0 w-32 h-32 bg-teal-200 rounded-full opacity-50 -translate-y-8 translate-x-8"></div>
              <div class="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 rounded-full opacity-50 translate-y-8 -translate-x-8"></div>
              
              <!-- Doctor placeholder -->
              <div class="relative z-10 text-center">
                <div class="w-48 h-64 bg-gradient-to-b from-teal-400 to-teal-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <div class="text-white text-6xl">👨‍⚕️</div>
                </div>
                <h3 class="text-xl font-semibold text-gray-900">Dr. Professional</h3>
                <p class="text-gray-600">Your trusted healthcare partner</p>
              </div>
            </div>

            <!-- Floating Elements -->
            <div class="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Icon name="lucide:check" class="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div class="font-semibold text-gray-900">Verified</div>
                  <div class="text-sm text-gray-600">Licensed Professional</div>
                </div>
              </div>
            </div>

            <div class="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon name="lucide:calendar" class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div class="font-semibold text-gray-900">Available Today</div>
                  <div class="text-sm text-gray-600">Book appointment</div>
                </div>
              </div>
            </div>
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