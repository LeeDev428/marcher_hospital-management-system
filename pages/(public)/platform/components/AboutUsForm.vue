<script setup lang="ts">
// No special logic needed for About Us form
</script>

<template>
  <div class="container mx-auto px-6 py-16">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <h1 class="text-4xl lg:text-5xl font-bold text-[#253237] mb-6">
        About <span class="text-[#5c6b73]">Marcher</span>
      </h1>
      <p class="text-xl text-[#5c6b73] max-w-3xl mx-auto"> 
        "Your Trusted Cloud HIS for Better Healthcare."
      </p>
    </div>

    <!-- What is Marcher Section -->
    <div class="bg-white rounded-2xl p-8 mb-12 shadow-lg">
      <h2 class="text-3xl font-bold text-[#253237] mb-6 text-center">What is Marcher?</h2>
      <div class="max-w-4xl mx-auto">
        <div class="bg-gradient-to-r from-[#e0fbfc] to-[#c2dfe3] rounded-xl p-6 mb-6">
          <p class="text-lg text-[#253237] leading-relaxed">
            Marcher is a <strong>public cloud hospital information system (HIS)</strong> that uses a 
            <strong>multitenancy architecture</strong>. Our system aims to be secure and scalable to ensure 
            compliance with the <strong>Data Privacy Act (DPA)</strong> and 
            <strong>Health Insurance Portability and Accountability Act (HIPAA)</strong>, 
            and to provide an efficient digital solution to traditional HISs.
          </p>
        </div>
      </div>
    </div>

    <!-- What Makes Marcher Unique Section -->
    <div class="bg-[#253237] rounded-2xl p-8 mb-12 text-white">
      <h2 class="text-3xl font-bold mb-8 text-center">What Makes Marcher Unique?</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-[#9db4c0] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-4h-8M19 19H5" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-3">Multitenancy Architecture</h3>
          <p class="text-[#c2dfe3]">Scalable multi-tenant system supporting multiple healthcare institutions securely.</p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-[#c2dfe3] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-[#253237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-3">Attribute-Based Access</h3>
          <p class="text-[#c2dfe3]">Advanced security with granular permissions and role-based access control.</p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-[#5c6b73] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-3">Real-Time Data Access</h3>
          <p class="text-[#c2dfe3]">Instant synchronization and real-time access to critical patient information.</p>
        </div>
      </div>
    </div>

    <!-- Vision & Mission Section -->
    <div class="grid md:grid-cols-2 gap-8 mb-12">
      <!-- Vision -->
      <div class="bg-gradient-to-br from-[#c2dfe3] to-[#9db4c0] rounded-2xl p-8 text-white">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-[#5c6b73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold">Vision</h3>
        </div>
        <p class="text-lg leading-relaxed">
          "To revolutionize healthcare management by providing a secure, scalable, and intelligent 
          cloud-based hospital information system that empowers healthcare institutions to deliver 
          faster, safer, and more patient-centered care."
        </p>
      </div>

      <!-- Mission -->
      <div class="bg-gradient-to-br from-[#5c6b73] to-[#253237] rounded-2xl p-8 text-white">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-[#e0fbfc] rounded-full flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-[#253237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold">Mission</h3>
        </div>
        <p class="text-lg leading-relaxed">
          "Our mission is to provide hospitals and healthcare providers with a reliable and compliant 
          public cloud HIS built on multitenancy architecture. Marcher ensures data security, 
          regulatory compliance (DPA & HIPAA), and operational efficiency, enabling institutions to 
          streamline workflows, safeguard patient information, and enhance the quality of healthcare services."
        </p>
      </div>
    </div>

    <!-- Developers Section -->
    <div class="bg-white rounded-2xl p-8 shadow-lg">
      <h2 class="text-3xl font-bold text-[#253237] mb-8 text-center">Meet Our Developers</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-[#c2dfe3] to-[#9db4c0] rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl font-bold text-white">MC</span>
          </div>
          <h4 class="text-lg font-semibold text-[#253237] mb-1">Michael George Cibak</h4>
          <p class="text-[#5c6b73] text-sm">Lead Developer</p>
        </div>

        <div class="text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-[#9db4c0] to-[#5c6b73] rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl font-bold text-white">AM</span>
          </div>
          <h4 class="text-lg font-semibold text-[#253237] mb-1">Allyssa Ashley Mallillin</h4>
          <p class="text-[#5c6b73] text-sm">Full Stack Developer</p>
        </div>

        <div class="text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-[#5c6b73] to-[#253237] rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl font-bold text-white">NT</span>
          </div>
          <h4 class="text-lg font-semibold text-[#253237] mb-1">Nicole Urich Tabrilla</h4>
          <p class="text-[#5c6b73] text-sm">Backend Developer</p>
        </div>

        <div class="text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-[#c2dfe3] to-[#9db4c0] rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl font-bold text-white">JV</span>
          </div>
          <h4 class="text-lg font-semibold text-[#253237] mb-1">Jules Ashley Veluz</h4>
          <p class="text-[#5c6b73] text-sm">Frontend Developer</p>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="text-center mt-16">
      <div class="bg-gradient-to-r from-[#5c6b73] to-[#253237] rounded-2xl p-8 text-white">
        <h3 class="text-2xl font-bold mb-4">Ready to Transform Your Healthcare Management?</h3>
        <p class="text-lg mb-6 text-[#c2dfe3]">Join healthcare institutions worldwide who trust Marcher for their digital transformation.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            to="/platform/login" 
            class="bg-[#9db4c0] hover:bg-[#c2dfe3] text-[#253237] px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </NuxtLink>
          <NuxtLink 
            to="/platform/services" 
            class="border-2 border-[#9db4c0] text-[#9db4c0] hover:bg-[#9db4c0] hover:text-[#253237] px-8 py-3 rounded-full font-semibold transition-all duration-300"
          >
            View Services
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>