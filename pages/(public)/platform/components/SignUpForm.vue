<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  organizationName: '',
  organizationType: 'hospital',
  role: 'admin',
  phone: '',
  plan: 'professional',
  agreeToTerms: false
})

const submitForm = () => {
  // Basic validation
  if (form.value.password !== form.value.confirmPassword) {
    alert('Passwords do not match')
    return
  }
  
  if (!form.value.agreeToTerms) {
    alert('Please agree to the terms and conditions')
    return
  }

  // Handle form submission
  console.log('Signup form submitted:', form.value)
  alert('Thank you for signing up! We will contact you soon to set up your account.')
  
  // Reset form
  form.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    organizationType: 'hospital',
    role: 'admin',
    phone: '',
    plan: 'professional',
    agreeToTerms: false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">

    <!-- SignUp Card -->
    <div class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-[#5c6b73] rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2L3 7v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7l-7-5zM10 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        
        <h1 class="text-3xl font-bold text-[#253237] mb-2">Create Your Account</h1>
        <p class="text-[#5c6b73]">Join thousands of healthcare professionals using Marcher</p>
      </div>

      <!-- Form -->
      <form class="space-y-6" @submit.prevent="submitForm">
        <!-- Personal Information -->
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[#253237] font-medium mb-2">First Name *</label>
            <input
              v-model="form.firstName"
              type="text"
              required
              class="w-full px-4 py-3 border border-[#c2dfe3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9db4c0] focus:border-transparent transition-all duration-300"
              placeholder="Enter your first name"
            >
          </div>
          
          <div>
            <label class="block text-[#253237] font-medium mb-2">Last Name *</label>
            <input
              v-model="form.lastName"
              type="text"
              required
              class="w-full px-4 py-3 border border-[#c2dfe3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9db4c0] focus:border-transparent transition-all duration-300"
              placeholder="Enter your last name"
            >
          </div>
        </div>

        <!-- Contact Information -->
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[#253237] font-medium mb-2">Email Address *</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-[#c2dfe3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9db4c0] focus:border-transparent transition-all duration-300"
              placeholder="Enter your email"
            >
          </div>
          
          <div>
            <label class="block text-[#253237] font-medium mb-2">Phone Number</label>
            <input
              v-model="form.phone"
              type="tel"
              class="w-full px-4 py-3 border border-[#c2dfe3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9db4c0] focus:border-transparent transition-all duration-300"
              placeholder="Enter your phone number"
            >
          </div>
        </div>

        <!-- Role  -->
        <div>
          <label class="block text-[#253237] font-medium mb-2">Role</label>
          <select
            v-model="form.role"
            class="w-full px-4 py-3 border border-[#c2dfe3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9db4c0] focus:border-transparent transition-all duration-300"
            placeholder="Select your role"
            >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="staff">Staff</option>
            <option value="patient">Patient</option>
          </select>
        </div>

        <!-- Organization Information -->
        <div>
          <label class="block text-[#253237] font-medium mb-2">Organization Name *</label>
          <input
            v-model="form.organizationName"
            type="text"
            required
            class="w-full px-4 py-3 border border-[#c2dfe3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9db4c0] focus:border-transparent transition-all duration-300"
            placeholder="City General Hospital"
          >
        </div>

        <div>
          <label class="block text-[#253237] font-medium mb-2">Organization Type</label>
          <select
            v-model="form.organizationType"
            class="w-full px-4 py-3 border border-[#c2dfe3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9db4c0] focus:border-transparent transition-all duration-300"
            placeholder="Select your organization type"
          >
            <option value="hospital">Hospital</option>
            <option value="clinic">Clinic</option>
            <option value="medical-center">Medical Center</option>
            <option value="nursing-home">Nursing Home</option>
            <option value="other">Other</option>
          </select>
        </div>

        <!-- Password Fields -->
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[#253237] font-medium mb-2">Password *</label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-3 border border-[#c2dfe3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9db4c0] focus:border-transparent transition-all duration-300"
              placeholder="Enter your password"
            >
          </div>
          
          <div>
            <label class="block text-[#253237] font-medium mb-2">Confirm Password *</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              required
              class="w-full px-4 py-3 border border-[#c2dfe3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9db4c0] focus:border-transparent transition-all duration-300"
              placeholder="Enter your password again"
            >
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-start space-x-3">
          <input
            v-model="form.agreeToTerms"
            type="checkbox"
            required
            class="mt-1 w-5 h-5 text-[#9db4c0] border border-[#c2dfe3] rounded focus:ring-[#9db4c0]"
          >
          <label class="text-sm text-[#5c6b73]">
            I agree to the 
            <NuxtLink 
              to="/platform/terms" 
              class="text-[#9db4c0] hover:text-[#5c6b73] font-semibold transition-colors duration-300"
            >
              Terms of Service
            </NuxtLink>
            and 
           <NuxtLink 
              to="/platform/privacypolicy" 
              class="text-[#9db4c0] hover:text-[#5c6b73] font-semibold transition-colors duration-300"
            >
              Privacy Policy
            </NuxtLink>
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-[#5c6b73] hover:bg-[#253237] text-white py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
        >
          Create Account
        </button>

        <!-- Login Link -->
        <div class="text-center pt-4">
          <p class="text-[#5c6b73]">
            Already have an account? 
            <NuxtLink 
              to="/platform/login" 
              class="text-[#9db4c0] hover:text-[#5c6b73] font-semibold transition-colors duration-300"
            >
              Sign in
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>