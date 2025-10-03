<script setup lang="ts">
// Hospital Management System Landing Page - Enhanced Version
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Marcher Hospital Information System - Philippines',
  meta: [
    { name: 'description', content: 'Comprehensive hospital management system built with Nuxt.js, Express.js, tRPC, and PostgreSQL for the Philippines healthcare sector' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center">
        <div class="flex items-center justify-center mb-8">
          <div class="text-6xl mr-4">🏥</div>
          <h1 class="text-5xl font-bold text-gray-900">
            Marcher HIS
          </h1>
        </div>
        
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          A comprehensive, modern hospital management system built with <strong>Nuxt.js</strong>, <strong>Node.js/Express</strong>, <strong>tRPC</strong>, and <strong>PostgreSQL</strong>. 
          Streamline your healthcare operations with our advanced digital platform for the Philippines 🇵🇭
        </p>
        
        <!-- System Status Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div class="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
            <div class="text-2xl mb-2">✅</div>
            <h3 class="font-semibold text-gray-900">Frontend</h3>
            <p class="text-sm text-green-600 font-medium">Nuxt.js Running</p>
          </div>
          <div class="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
            <div class="text-2xl mb-2">✅</div>
            <h3 class="font-semibold text-gray-900">Backend</h3>
            <p class="text-sm text-green-600 font-medium">Express.js Running</p>
          </div>
          <div class="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
            <div class="text-2xl mb-2">✅</div>
            <h3 class="font-semibold text-gray-900">Database</h3>
            <p class="text-sm text-green-600 font-medium">PostgreSQL Connected</p>
          </div>
          <div class="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
            <div class="text-2xl mb-2">✅</div>
            <h3 class="font-semibold text-gray-900">API Layer</h3>
            <p class="text-sm text-green-600 font-medium">tRPC Active</p>
          </div>
        </div>

        <!-- Portal Navigation -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <NuxtLink to="/admin" class="bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg transform hover:scale-105">
            <div class="text-2xl mb-2">👨‍💼</div>
            <div>Admin Dashboard</div>
          </NuxtLink>
          <NuxtLink to="/staff" class="bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg transform hover:scale-105">
            <div class="text-2xl mb-2">👨‍⚕️</div>
            <div>Staff Portal</div>
          </NuxtLink>
          <NuxtLink to="/patient" class="bg-purple-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg transform hover:scale-105">
            <div class="text-2xl mb-2">🏥</div>
            <div>Patient Portal</div>
          </NuxtLink>
          <NuxtLink to="/partner" class="bg-orange-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg transform hover:scale-105">
            <div class="text-2xl mb-2">🤝</div>
            <div>Partner Portal</div>
          </NuxtLink>
        </div>
      </div>

      <!-- Features Section -->
      <div class="py-16">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">System Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Patient Management -->
          <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div class="text-4xl mb-4">👥</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Patient Management</h3>
            <p class="text-gray-600">Comprehensive patient records, appointments, and medical history tracking with advanced search and filtering.</p>
          </div>

          <!-- Staff Management -->
          <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div class="text-4xl mb-4">👨‍⚕️</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Staff Management</h3>
            <p class="text-gray-600">Manage doctors, nurses, and administrative staff with role-based access and scheduling systems.</p>
          </div>

          <!-- Appointments -->
          <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div class="text-4xl mb-4">📅</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Appointment System</h3>
            <p class="text-gray-600">Schedule and manage patient appointments with automated reminders and conflict detection.</p>
          </div>

          <!-- Billing -->
          <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div class="text-4xl mb-4">💰</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Billing & Insurance</h3>
            <p class="text-gray-600">Automated billing, insurance claims processing, and payment tracking with PhilHealth integration.</p>
          </div>

          <!-- Pharmacy -->
          <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div class="text-4xl mb-4">💊</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Pharmacy Management</h3>
            <p class="text-gray-600">Track medication inventory, prescriptions, and dispensing with expiration date monitoring.</p>
          </div>

          <!-- Reports -->
          <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Analytics & Reports</h3>
            <p class="text-gray-600">Generate comprehensive reports and analytics for better decision making and compliance.</p>
          </div>
        </div>
      </div>

      <!-- Tech Stack -->
      <div class="py-16 bg-white rounded-lg shadow-sm">
        <div class="max-w-4xl mx-auto px-8">
          <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Technology Stack</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div class="p-4">
              <div class="text-4xl mb-2">⚡</div>
              <h4 class="font-semibold text-green-600">Nuxt.js 3</h4>
              <p class="text-sm text-gray-600">Frontend Framework</p>
            </div>
            <div class="p-4">
              <div class="text-4xl mb-2">🚀</div>
              <h4 class="font-semibold text-green-600">Express.js</h4>
              <p class="text-sm text-gray-600">Backend API</p>
            </div>
            <div class="p-4">
              <div class="text-4xl mb-2">🗄️</div>
              <h4 class="font-semibold text-blue-600">PostgreSQL</h4>
              <p class="text-sm text-gray-600">Database</p>
            </div>
            <div class="p-4">
              <div class="text-4xl mb-2">🔗</div>
              <h4 class="font-semibold text-purple-600">tRPC</h4>
              <p class="text-sm text-gray-600">API Layer</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="flex items-center justify-center mb-4">
          <div class="text-2xl mr-2">🏥</div>
          <span class="text-lg font-semibold">Marcher Hospital Information System</span>
        </div>
        <p class="text-gray-400 mb-4">
          Comprehensive healthcare management solution for the Philippines 🇵🇭
        </p>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span class="text-green-400">✅ Frontend:</span> Nuxt.js Running
          </div>
          <div>
            <span class="text-green-400">✅ Backend:</span> Express.js Running
          </div>
          <div>
            <span class="text-green-400">✅ Database:</span> PostgreSQL Connected
          </div>
          <div>
            <span class="text-green-400">✅ API:</span> tRPC Active
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>