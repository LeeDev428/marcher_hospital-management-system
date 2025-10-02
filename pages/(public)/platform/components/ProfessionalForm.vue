<script setup lang="ts">
// Simple reactive data for UI display only
import { ref } from 'vue'

const formData = ref({
  fullName: '',
  email: '',
  contactNumber: '+63',
  paymentMethod: '',
  cardNumber: '',
  organizationName: '',
  organizationType: ''
})

const paymentMethods = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'gcash', label: 'GCash' },
  { value: 'paymaya', label: 'PayMaya' },
  { value: 'bank_transfer', label: 'Bank Transfer' }
]

const organizationTypes = [
  { value: 'clinic', label: 'Small Clinic' },
  { value: 'medical_center', label: 'Medical Center' },
  { value: 'specialty_clinic', label: 'Specialty Clinic' },
  { value: 'diagnostic_center', label: 'Diagnostic Center' },
  { value: 'other', label: 'Other' }
]

// Simple form handler for demo
const handleSubmit = () => {
  alert('Form submitted!')
}
</script>

<template>
  <div class="min-h-screen bg-[#ebece8] py-16">
    <div class="container mx-auto px-6">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-5xl font-bold text-[#253237] mb-4">
            PROFESSIONAL PLAN
          </h1>
          <p class="text-xl text-[#5c6b73]">
            For medium-sized organizations.
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 items-start">
          <!-- Left Column - Plan Details & Terms -->
          <div class="space-y-8">
            <!-- Subscription Terms -->
            <div class="bg-white rounded-2xl p-8 shadow-lg">
              <h2 class="text-2xl font-bold text-[#253237] mb-6">Subscription Terms</h2>
              
              <div class="space-y-4 text-[#5c6b73] leading-relaxed">
                <p>
                  Your subscription will renew automatically every month, and you will be billed ₱750.00 for each renewal until you cancel your subscription. If you choose to cancel, previous payments will not be refunded (unless mandated by law), but you can still use the service until the end of the current billing period.
                </p>
                <p>
                  By clicking the "Check out" button, you acknowledge that you agree to our Terms of Service and have reviewed our Privacy Policy.
                </p>
              </div>
            </div>

            <!-- Plan Features -->
            <div class="bg-gradient-to-br from-[#c2dfe3] to-[#9db4c0] rounded-2xl p-8 shadow-lg">
              <h3 class="text-2xl font-bold text-[#253237] mb-6">What's Included</h3>
              
              <div class="space-y-4">
                <div class="flex items-center">
                  <div class="w-6 h-6 bg-[#5c6b73] rounded-full flex items-center justify-center mr-4">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-[#253237] font-medium">Up to 500 patients</span>
                </div>
                <div class="flex items-center">
                  <div class="w-6 h-6 bg-[#5c6b73] rounded-full flex items-center justify-center mr-4">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-[#253237] font-medium">Advanced patient management</span>
                </div>
                <div class="flex items-center">
                  <div class="w-6 h-6 bg-[#5c6b73] rounded-full flex items-center justify-center mr-4">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-[#253237] font-medium">Real-time analytics</span>
                </div>
                <div class="flex items-center">
                  <div class="w-6 h-6 bg-[#5c6b73] rounded-full flex items-center justify-center mr-4">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-[#253237] font-medium">Multi-department support</span>
                </div>
                <div class="flex items-center">
                  <div class="w-6 h-6 bg-[#5c6b73] rounded-full flex items-center justify-center mr-4">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-[#253237] font-medium">Priority support</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Subscription Form -->
          <div class="bg-[#c2dfe3] rounded-2xl p-8 shadow-lg">
            <!-- Price Header -->
            <div class="text-center mb-8">
              <div class="text-4xl font-bold text-[#253237] mb-2">Php 750</div>
              <p class="text-[#5c6b73]">billed every month</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Organization Details -->
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-[#253237] mb-2">
                    Organization Name:
                  </label>
                  <input
                    v-model="formData.organizationName"
                    type="text"
                    placeholder="enter organization name"
                    class="w-full px-4 py-3 rounded-lg bg-white text-[#253237] focus:outline-none focus:ring-2 focus:ring-[#5c6b73] transition-all"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-[#253237] mb-2">
                    Organization Type:
                  </label>
                  <select
                    v-model="formData.organizationType"
                    class="w-full px-4 py-3 rounded-lg bg-white text-[#253237] focus:outline-none focus:ring-2 focus:ring-[#5c6b73] transition-all"
                  >
                    <option value="">select organization type</option>
                    <option v-for="type in organizationTypes" :key="type.value" :value="type.value">
                      {{ type.label }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Personal Details -->
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-[#253237] mb-2">
                    Full Name:
                  </label>
                  <input
                    v-model="formData.fullName"
                    type="text"
                    placeholder="enter full name"
                    class="w-full px-4 py-3 rounded-lg bg-white text-[#253237] focus:outline-none focus:ring-2 focus:ring-[#5c6b73] transition-all"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-[#253237] mb-2">
                    Email Address:
                  </label>
                  <input
                    v-model="formData.email"
                    type="email"
                    placeholder="enter email address"
                    class="w-full px-4 py-3 rounded-lg bg-white text-[#253237] focus:outline-none focus:ring-2 focus:ring-[#5c6b73] transition-all"
                  />
                </div>
              </div>

              <!-- Contact Number -->
              <div>
                <label class="block text-sm font-semibold text-[#253237] mb-2">
                  Contact Number:
                </label>
                <input
                  v-model="formData.contactNumber"
                  type="tel"
                  placeholder="+63"
                  class="w-full px-4 py-3 rounded-lg bg-white text-[#253237] focus:outline-none focus:ring-2 focus:ring-[#5c6b73] transition-all"
                />
              </div>

              <!-- Payment Method -->
              <div>
                <label class="block text-sm font-semibold text-[#253237] mb-2">
                  Payment Method:
                </label>
                <select
                  v-model="formData.paymentMethod"
                  class="w-full px-4 py-3 rounded-lg bg-white text-[#253237] focus:outline-none focus:ring-2 focus:ring-[#5c6b73] transition-all"
                >
                  <option value="">choose payment method</option>
                  <option v-for="method in paymentMethods" :key="method.value" :value="method.value">
                    {{ method.label }}
                  </option>
                </select>
              </div>

              <!-- Card Details (conditionally shown) -->
              <div v-if="['credit_card', 'debit_card'].includes(formData.paymentMethod)" class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-[#253237] mb-2">
                    Card/Account Number:
                  </label>
                  <input
                    v-model="formData.cardNumber"
                    type="text"
                    placeholder="enter card number"
                    class="w-full px-4 py-3 rounded-lg bg-white text-[#253237] focus:outline-none focus:ring-2 focus:ring-[#5c6b73] transition-all"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-[#253237] mb-2">
                      Expiry Date:
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      class="w-full px-4 py-3 rounded-lg bg-white text-[#253237] focus:outline-none focus:ring-2 focus:ring-[#5c6b73] transition-all"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-[#253237] mb-2">
                      CVV:
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      class="w-full px-4 py-3 rounded-lg bg-white text-[#253237] focus:outline-none focus:ring-2 focus:ring-[#5c6b73] transition-all"
                    />
                  </div>
                </div>
              </div>

              <!-- E-Wallet Instructions (conditionally shown) -->
              <div v-if="['gcash', 'paymaya'].includes(formData.paymentMethod)" class="bg-[#e0fbfc] rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <svg class="w-5 h-5 text-[#5c6b73] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="font-semibold text-[#253237]">{{ formData.paymentMethod === 'gcash' ? 'GCash' : 'PayMaya' }} Payment</span>
                </div>
                <p class="text-sm text-[#5c6b73]">
                  You will be redirected to {{ formData.paymentMethod === 'gcash' ? 'GCash' : 'PayMaya' }} to complete your payment after clicking "Check Out".
                </p>
              </div>

              <!-- Bank Transfer Instructions -->
              <div v-if="formData.paymentMethod === 'bank_transfer'" class="bg-[#e0fbfc] rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <svg class="w-5 h-5 text-[#5c6b73] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M7 7h.01M7 3h5v4H7V3z" />
                  </svg>
                  <span class="font-semibold text-[#253237]">Bank Transfer</span>
                </div>
                <p class="text-sm text-[#5c6b73]">
                  Bank transfer details will be provided after form submission. Payment processing may take 1-2 business days.
                </p>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="w-full bg-[#9db4c0] hover:bg-[#5c6b73] text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Check Out
              </button>
            </form>
          </div>
        </div>

        <!-- Setup Process Timeline -->
        <div class="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-[#253237] mb-4">How It Works</h2>
            <p class="text-[#5c6b73]">Simple steps to get your Marcher system up and running</p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <!-- Step 1 -->
            <div class="text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-[#c2dfe3] to-[#9db4c0] rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-[#253237]">1</span>
              </div>
              <h3 class="text-xl font-semibold text-[#253237] mb-3">Complete Payment</h3>
              <p class="text-[#5c6b73]">Fill out the subscription form and complete your payment securely through your chosen method.</p>
            </div>

            <!-- Step 2 -->
            <div class="text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-[#9db4c0] to-[#5c6b73] rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-white">2</span>
              </div>
              <h3 class="text-xl font-semibold text-[#253237] mb-3">Account Setup</h3>
              <p class="text-[#5c6b73]">Our team will configure your Marcher instance with your organization's details within 24-48 hours.</p>
            </div>

            <!-- Step 3 -->
            <div class="text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-[#5c6b73] to-[#253237] rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-white">3</span>
              </div>
              <h3 class="text-xl font-semibold text-[#253237] mb-3">Start Using Marcher</h3>
              <p class="text-[#5c6b73]">Receive your login credentials via email and begin managing your healthcare workflows immediately.</p>
            </div>
          </div>
        </div>

        <!-- Support Information -->
        <div class="mt-8 text-center bg-gradient-to-r from-[#5c6b73] to-[#253237] rounded-2xl p-8 text-white">
          <h3 class="text-2xl font-bold mb-3">Need Help?</h3>
          <p class="text-[#c2dfe3] mb-4">Our support team is here to assist you with setup and onboarding</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <div class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>support@marcher.com</span>
            </div>
            <div class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>(042) 540-7732</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>