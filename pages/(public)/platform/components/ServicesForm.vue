<script setup lang="ts">
// No special logic needed for Services form
</script>

<template>
  <div class="container mx-auto px-6 py-16">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <h1 class="text-4xl lg:text-5xl font-bold text-[#253237] mb-6">
        Marcher <span class="text-[#5c6b73]">Services</span>
      </h1>
      <p class="text-xl text-[#5c6b73] max-w-3xl mx-auto">
        Choose the perfect plan for your healthcare institution. All plans include our core features with scalable options.
      </p>
    </div>

    <!-- Pricing Plans -->
    <div class="grid lg:grid-cols-3 gap-8 mb-16">
      <!-- Start Up Plan -->
      <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-[#c2dfe3] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-[#5c6b73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M7 7h.01M7 3h5v4H7V3z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-[#253237] mb-2">Start Up</h3>
          <p class="text-[#5c6b73] mb-4">Perfect for small clinics</p>
          <div class="text-4xl font-bold text-[#5c6b73] mb-2">₱500</div>
          <p class="text-[#9db4c0]">per month</p>
        </div>
        
        <div class="space-y-4 mb-8">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-[#9db4c0] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[#5c6b73]">Up to 50 patients</span>
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 text-[#9db4c0] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[#5c6b73]">5 user accounts</span>
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 text-[#9db4c0] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[#5c6b73]">Basic patient management</span>
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 text-[#9db4c0] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[#5c6b73]">24/7 support</span>
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 text-[#9db4c0] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[#5c6b73]">DPA & HIPAA compliance</span>
          </div>
        </div>
        <NuxtLink to="/platform/services/startup">
          <button class="w-full bg-[#253237] hover:bg-[#5c6b73] text-white py-3 rounded-lg font-semibold transition-all duration-300">
            Choose Start Up
          </button>
          </NuxtLink>
      </div>

      <!-- Professional Plan (Featured) -->
      <div class="bg-gradient-to-br from-[#5c6b73] to-[#253237] rounded-2xl p-8 shadow-2xl text-white transform scale-105 relative">
        <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div class="bg-[#9db4c0] text-[#253237] px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </div>
        </div>
        
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-[#9db4c0] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M9 7h1l1 3h2l1-3h1M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-2">Professional</h3>
          <p class="text-[#c2dfe3] mb-4">Ideal for medium hospitals</p>
          <div class="text-4xl font-bold mb-2">₱750</div>
          <p class="text-[#c2dfe3]">per month</p>
        </div>
        
        <div class="space-y-4 mb-8">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-[#c2dfe3] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[#e0fbfc]">Up to 500 patients</span>
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 text-[#c2dfe3] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[#e0fbfc]">Advanced patient management</span>
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 text-[#c2dfe3] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[#e0fbfc]">Real-time analytics</span>
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 text-[#c2dfe3] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[#e0fbfc]">Multi-department support</span>
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 text-[#c2dfe3] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[#e0fbfc]">Priority support</span>
          </div>
        </div>
        <NuxtLink to="/platform/services/professional">
           <button class="w-full bg-[#9db4c0] hover:bg-[#c2dfe3] text-[#253237] py-3 rounded-lg font-semibold transition-all duration-300">
            Choose Professional
          </button>
          </NuxtLink>
      </div>

      <!-- Enterprise Plan -->
      <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-[#253237] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M13 7h.01M13 3h5v4h-5V3z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-[#253237] mb-2">Enterprise</h3>
          <p class="text-[#5c6b73] mb-4">For large hospital networks</p>
          <div class="text-4xl font-bold text-[#5c6b73] mb-2">₱1,000</div>
          <p class="text-[#9db4c0]">per month</p>
        </div>
        
        <div class="space-y-4 mb-8">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-[#9db4c0] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[#5c6b73]">Unlimited patients</span>
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 text-[#9db4c0] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[#5c6b73]">Full HIS capabilities</span>
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 text-[#9db4c0] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[#5c6b73]">Advanced security</span>
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 text-[#9db4c0] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[#5c6b73]">Custom integrations</span>
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 text-[#9db4c0] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[#5c6b73]">Dedicated support</span>
          </div>
        </div>
        <NuxtLink to="/platform/services/enterprise">
        <button class="w-full bg-[#253237] hover:bg-[#5c6b73] text-white py-3 rounded-lg font-semibold transition-all duration-300">
          Choose Enterprise
        </button>
        </NuxtLink>
      </div>
    </div>

    <!-- Features Comparison -->
    <div class="bg-white rounded-2xl p-8 shadow-lg mb-16">
      <h2 class="text-3xl font-bold text-[#253237] text-center mb-8">Feature Comparison</h2>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b-2 border-[#c2dfe3]">
              <th class="text-left py-4 px-6 text-[#253237] font-semibold">Features</th>
              <th class="text-center py-4 px-6 text-[#253237] font-semibold">Start Up</th>
              <th class="text-center py-4 px-6 text-[#253237] font-semibold">Professional</th>
              <th class="text-center py-4 px-6 text-[#253237] font-semibold">Enterprise</th>
            </tr>
          </thead>
          <tbody class="text-[#5c6b73]">
            <tr class="border-b border-[#e0fbfc]">
              <td class="py-4 px-6">Patient Records</td>
              <td class="text-center py-4 px-6">50</td>
              <td class="text-center py-4 px-6">500</td>
              <td class="text-center py-4 px-6">Unlimited</td>
            </tr>
            <tr class="border-b border-[#e0fbfc]">
              <td class="py-4 px-6">User Accounts</td>
              <td class="text-center py-4 px-6">5</td>
              <td class="text-center py-4 px-6">25</td>
              <td class="text-center py-4 px-6">Unlimited</td>
            </tr>
            <tr class="border-b border-[#e0fbfc]">
              <td class="py-4 px-6">Real-time Analytics</td>
              <td class="text-center py-4 px-6">❌</td>
              <td class="text-center py-4 px-6">✅</td>
              <td class="text-center py-4 px-6">✅</td>
            </tr>
            <tr class="border-b border-[#e0fbfc]">
              <td class="py-4 px-6">API Access</td>
              <td class="text-center py-4 px-6">❌</td>
              <td class="text-center py-4 px-6">Limited</td>
              <td class="text-center py-4 px-6">Full</td>
            </tr>
            <tr class="border-b border-[#e0fbfc]">
              <td class="py-4 px-6">Custom Integrations</td>
              <td class="text-center py-4 px-6">❌</td>
              <td class="text-center py-4 px-6">❌</td>
              <td class="text-center py-4 px-6">✅</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="text-center">
      <div class="bg-gradient-to-r from-[#5c6b73] to-[#253237] rounded-2xl p-8 text-white">
        <h3 class="text-2xl font-bold mb-4">Ready to Get Started?</h3>
        <p class="text-lg mb-6 text-[#c2dfe3]">Contact our team for a personalized demo and pricing consultation.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            to="/platform/signup" 
            class="bg-[#9db4c0] hover:bg-[#c2dfe3] text-[#253237] px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Start Free Trial
          </NuxtLink>
          <NuxtLink 
            to="/platform/support" 
            class="border-2 border-[#9db4c0] text-[#9db4c0] hover:bg-[#9db4c0] hover:text-[#253237] px-8 py-3 rounded-full font-semibold transition-all duration-300"
          >
            Contact Sales
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>