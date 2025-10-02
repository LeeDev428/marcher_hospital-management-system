
<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
  priority: 'medium'
})

const submitForm = () => {
  // Handle form submission
  console.log('Support form submitted:', form.value)
  // Show success message or handle submission
  alert('Thank you for your message! We will get back to you soon.')
  
  // Reset form
  form.value = {
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  }
}
</script>

<template>
  <div class="container mx-auto px-6 py-16">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <h1 class="text-4xl lg:text-5xl font-bold text-[#253237] mb-6">
        Get <span class="text-[#5c6b73]">Support</span>
      </h1>
      <p class="text-xl text-[#5c6b73] max-w-3xl mx-auto">
        We're here to help! Contact our support team or browse our resources.
      </p>
    </div>

    <div class="grid lg:grid-cols-2 gap-12">
      <!-- Contact Form -->
      <div class="bg-white rounded-2xl p-8 shadow-lg">
        <h2 class="text-2xl font-bold text-[#253237] mb-6">Send us a Message</h2>
        
        <form class="space-y-6" @submit.prevent="submitForm">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[#253237] font-medium mb-2">Full Name *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-[#c2dfe3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9db4c0] focus:border-transparent transition-all duration-300"
                placeholder="Enter your full name"
              >
            </div>
            
            <div>
              <label class="block text-[#253237] font-medium mb-2">Email Address *</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 border border-[#c2dfe3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9db4c0] focus:border-transparent transition-all duration-300"
                placeholder="Enter your email address"
              >
            </div>
          </div>

          <div>
            <label class="block text-[#253237] font-medium mb-2">Priority Level</label>
            <select
              v-model="form.priority"
              class="w-full px-4 py-3 border border-[#c2dfe3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9db4c0] focus:border-transparent transition-all duration-300"
            >
              <option value="low">Low - General inquiry</option>
              <option value="medium">Medium - Technical support</option>
              <option value="high">High - Urgent issue</option>
              <option value="critical">Critical - System down</option>
            </select>
          </div>

          <div>
            <label class="block text-[#253237] font-medium mb-2">Subject *</label>
            <input
              v-model="form.subject"
              type="text"
              required
              class="w-full px-4 py-3 border border-[#c2dfe3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9db4c0] focus:border-transparent transition-all duration-300"
              placeholder="Brief description of your inquiry"
            >
          </div>

          <div>
            <label class="block text-[#253237] font-medium mb-2">Message *</label>
            <textarea
              v-model="form.message"
              required
              rows="6"
              class="w-full px-4 py-3 border border-[#c2dfe3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9db4c0] focus:border-transparent transition-all duration-300 resize-vertical"
              placeholder="Please provide detailed information about your inquiry..."
            />
          </div>

          <button
            type="submit"
            class="w-full bg-[#5c6b73] hover:bg-[#253237] text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Send Message
          </button>
        </form>
      </div>

      <!-- Support Information -->
      <div class="space-y-8">
        <!-- Contact Information -->
        <div class="bg-gradient-to-br from-[#5c6b73] to-[#253237] rounded-2xl p-8 text-white">
          <h3 class="text-2xl font-bold mb-6">Contact Information</h3>
          
          <div class="space-y-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-[#9db4c0] rounded-full flex items-center justify-center mr-4">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="font-medium">Email Support</p>
                <p class="text-[#c2dfe3]">support@marcher.com</p>
              </div>
            </div>

            <div class="flex items-center">
              <div class="w-10 h-10 bg-[#c2dfe3] rounded-full flex items-center justify-center mr-4">
                <svg class="w-5 h-5 text-[#253237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p class="font-medium">Phone Support</p>
                <p class="text-[#c2dfe3]">(042) 540-7732</p>
              </div>
            </div>

            <div class="flex items-center">
              <div class="w-10 h-10 bg-[#9db4c0] rounded-full flex items-center justify-center mr-4">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="font-medium">Support Hours</p>
                <p class="text-[#c2dfe3]">24/7 Available</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="bg-white rounded-2xl p-8 shadow-lg">
          <h3 class="text-2xl font-bold text-[#253237] mb-6">Frequently Asked Questions</h3>
          
          <div class="space-y-4">
            <details class="border border-[#c2dfe3] rounded-lg">
              <summary class="p-4 cursor-pointer text-[#253237] font-medium hover:bg-[#e0fbfc] transition-colors duration-300">
                How secure is Marcher HIS?
              </summary>
              <div class="p-4 pt-0 text-[#5c6b73]">
                Marcher is built with enterprise-grade security and is fully compliant with DPA and HIPAA regulations. We use advanced encryption and multi-factor authentication.
              </div>
            </details>

            <details class="border border-[#c2dfe3] rounded-lg">
              <summary class="p-4 cursor-pointer text-[#253237] font-medium hover:bg-[#e0fbfc] transition-colors duration-300">
                Can I integrate Marcher with existing systems?
              </summary>
              <div class="p-4 pt-0 text-[#5c6b73]">
                Yes! Marcher offers comprehensive API access and custom integration capabilities, especially with our Professional and Enterprise plans.
              </div>
            </details>

            <details class="border border-[#c2dfe3] rounded-lg">
              <summary class="p-4 cursor-pointer text-[#253237] font-medium hover:bg-[#e0fbfc] transition-colors duration-300">
                Is there a free trial available?
              </summary>
              <div class="p-4 pt-0 text-[#5c6b73]">
                Yes, we offer a 30-day free trial for all new customers. You can start with any plan and upgrade or downgrade as needed.
              </div>
            </details>

            <details class="border border-[#c2dfe3] rounded-lg">
              <summary class="p-4 cursor-pointer text-[#253237] font-medium hover:bg-[#e0fbfc] transition-colors duration-300">
                What kind of support do you provide?
              </summary>
              <div class="p-4 pt-0 text-[#5c6b73]">
                We provide 24/7 support through multiple channels including email, phone, and live chat. Enterprise customers get dedicated support representatives.
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>