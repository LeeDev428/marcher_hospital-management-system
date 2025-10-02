<script setup lang="ts">
import { ref } from 'vue'

// Reactive data for scroll-to-section functionality
const activeSection = ref('')

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = sectionId
  }
}

// Table of contents sections
const sections = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'description', title: '2. Service Description' },
  { id: 'eligibility', title: '3. User Eligibility' },
  { id: 'accounts', title: '4. User Accounts and Security' },
  { id: 'acceptable-use', title: '5. Acceptable Use Policy' },
  { id: 'privacy', title: '6. Privacy and Data Protection' },
  { id: 'compliance', title: '7. Healthcare Compliance' },
  { id: 'intellectual-property', title: '8. Intellectual Property' },
  { id: 'payment', title: '9. Payment Terms' },
  { id: 'limitation', title: '10. Limitation of Liability' },
  { id: 'termination', title: '11. Termination' },
  { id: 'modifications', title: '12. Modifications' },
  { id: 'governing-law', title: '13. Governing Law' },
  { id: 'contact', title: '14. Contact Information' }
]
</script>

<template>
  <div class="min-h-screen bg-[#ebece8] py-8">
    <div class="container mx-auto px-6 max-w-6xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl lg:text-5xl font-bold text-[#253237] mb-4">
          Terms of Use
        </h1>
        <p class="text-lg text-[#5c6b73] mb-2">
          Marcher Hospital Information System
        </p>
        <p class="text-sm text-[#9db4c0]">
          Last Updated: September 25, 2025
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Table of Contents - Sidebar -->
        <div class="lg:w-1/4">
          <div class="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
            <h2 class="text-xl font-bold text-[#253237] mb-4">Table of Contents</h2>
            <nav class="space-y-2">
              <button
                v-for="section in sections"
                :key="section.id"
                @click="scrollToSection(section.id)"
                class="w-full text-left px-3 py-2 rounded-lg text-sm text-[#5c6b73] hover:bg-[#e0fbfc] hover:text-[#253237] transition-colors duration-200"
                :class="{ 'bg-[#c2dfe3] text-[#253237] font-semibold': activeSection === section.id }"
              >
                {{ section.title }}
              </button>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:w-3/4">
          <div class="bg-white rounded-2xl p-8 shadow-lg">
            <div class="prose prose-lg max-w-none">
              
              <!-- Section 1: Acceptance of Terms -->
              <section id="acceptance" class="mb-8">
                <h2 class="text-2xl font-bold text-[#253237] mb-4">1. Acceptance of Terms</h2>
                <div class="text-[#5c6b73] leading-relaxed space-y-4">
                  <p>
                    By accessing and using the Marcher Hospital Information System ("Marcher", "Service", "Platform"), 
                    you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                  <p>
                    These Terms of Use constitute a legally binding agreement between you and Marcher Hospital 
                    Information System. If you do not agree to these terms, please do not use our services.
                  </p>
                </div>
              </section>

              <!-- Section 2: Service Description -->
              <section id="description" class="mb-8">
                <h2 class="text-2xl font-bold text-[#253237] mb-4">2. Service Description</h2>
                <div class="text-[#5c6b73] leading-relaxed space-y-4">
                  <p>
                    Marcher is a comprehensive cloud-based Hospital Information System (HIS) designed to streamline 
                    healthcare operations through:
                  </p>
                  <ul class="list-disc list-inside ml-4 space-y-2">
                    <li>Patient record management and electronic health records (EHR)</li>
                    <li>Appointment scheduling and management</li>
                    <li>Billing and invoicing systems</li>
                    <li>Optical Character Recognition (OCR) capabilities</li>
                    <li>QR code integration for rapid data access</li>
                    <li>Healthcare security and compliance management</li>
                  </ul>
                  <p>
                    Our platform is built with multitenancy architecture and ensures compliance with Data Protection 
                    Act (DPA) and Health Insurance Portability and Accountability Act (HIPAA) regulations.
                  </p>
                </div>
              </section>

              <!-- Section 3: User Eligibility -->
              <section id="eligibility" class="mb-8">
                <h2 class="text-2xl font-bold text-[#253237] mb-4">3. User Eligibility</h2>
                <div class="text-[#5c6b73] leading-relaxed space-y-4">
                  <p>To use Marcher services, you must:</p>
                  <ul class="list-disc list-inside ml-4 space-y-2">
                    <li>Be at least 18 years of age or the legal age of majority in your jurisdiction</li>
                    <li>Be a licensed healthcare professional or authorized healthcare organization representative</li>
                    <li>Have the legal authority to enter into this agreement</li>
                    <li>Provide accurate and complete information during registration</li>
                    <li>Maintain the confidentiality of your account credentials</li>
                  </ul>
                </div>
              </section>

              <!-- Section 4: User Accounts and Security -->
              <section id="accounts" class="mb-8">
                <h2 class="text-2xl font-bold text-[#253237] mb-4">4. User Accounts and Security</h2>
                <div class="text-[#5c6b73] leading-relaxed space-y-4">
                  <p>
                    When creating an account with Marcher, you agree to:
                  </p>
                  <ul class="list-disc list-inside ml-4 space-y-2">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and update your account information</li>
                    <li>Keep your password secure and confidential</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>
                  <p>
                    We reserve the right to terminate accounts that violate these terms or pose security risks 
                    to our platform or other users.
                  </p>
                </div>
              </section>

              <!-- Section 5: Acceptable Use Policy -->
              <section id="acceptable-use" class="mb-8">
                <h2 class="text-2xl font-bold text-[#253237] mb-4">5. Acceptable Use Policy</h2>
                <div class="text-[#5c6b73] leading-relaxed space-y-4">
                  <p>You agree not to use the Marcher platform to:</p>
                  <ul class="list-disc list-inside ml-4 space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe upon the rights of others</li>
                    <li>Upload or transmit viruses, malware, or malicious code</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with or disrupt the platform's functionality</li>
                    <li>Use the service for any commercial purpose without authorization</li>
                    <li>Share patient data in violation of privacy laws</li>
                  </ul>
                </div>
              </section>

              <!-- Section 6: Privacy and Data Protection -->
              <section id="privacy" class="mb-8">
                <h2 class="text-2xl font-bold text-[#253237] mb-4">6. Privacy and Data Protection</h2>
                <div class="text-[#5c6b73] leading-relaxed space-y-4">
                  <p>
                    Marcher is committed to protecting your privacy and the confidentiality of patient information. 
                    Our privacy practices include:
                  </p>
                  <ul class="list-disc list-inside ml-4 space-y-2">
                    <li>End-to-end encryption of all data transmissions</li>
                    <li>Secure data storage with multiple backup systems</li>
                    <li>Regular security audits and vulnerability assessments</li>
                    <li>Access controls and user authentication protocols</li>
                    <li>Compliance with international data protection standards</li>
                  </ul>
                  <p>
                    For detailed information about our data handling practices, please review our Privacy Policy.
                  </p>
                </div>
              </section>

              <!-- Section 7: Healthcare Compliance -->
              <section id="compliance" class="mb-8">
                <h2 class="text-2xl font-bold text-[#253237] mb-4">7. Healthcare Compliance</h2>
                <div class="text-[#5c6b73] leading-relaxed space-y-4">
                  <p>
                    Marcher maintains strict compliance with healthcare regulations:
                  </p>
                  <div class="bg-[#e0fbfc] p-4 rounded-lg">
                    <h3 class="font-semibold text-[#253237] mb-2">HIPAA Compliance</h3>
                    <p class="text-sm">
                      We implement appropriate safeguards to protect the privacy and security of protected 
                      health information (PHI) as required by HIPAA regulations.
                    </p>
                  </div>
                  <div class="bg-[#c2dfe3] p-4 rounded-lg">
                    <h3 class="font-semibold text-[#253237] mb-2">Data Protection Act (DPA)</h3>
                    <p class="text-sm">
                      Our platform adheres to DPA requirements for the processing and protection of personal data.
                    </p>
                  </div>
                </div>
              </section>

              <!-- Section 8: Intellectual Property -->
              <section id="intellectual-property" class="mb-8">
                <h2 class="text-2xl font-bold text-[#253237] mb-4">8. Intellectual Property</h2>
                <div class="text-[#5c6b73] leading-relaxed space-y-4">
                  <p>
                    All content, features, and functionality of the Marcher platform are owned by Marcher Hospital 
                    Information System and are protected by copyright, trademark, and other intellectual property laws.
                  </p>
                  <p>
                    You are granted a limited, non-exclusive license to use the platform for your healthcare 
                    operations in accordance with these terms.
                  </p>
                </div>
              </section>

              <!-- Section 9: Payment Terms -->
              <section id="payment" class="mb-8">
                <h2 class="text-2xl font-bold text-[#253237] mb-4">9. Payment Terms</h2>
                <div class="text-[#5c6b73] leading-relaxed space-y-4">
                  <p>
                    Payment terms vary based on your selected plan and service level:
                  </p>
                  <ul class="list-disc list-inside ml-4 space-y-2">
                    <li>Subscription fees are billed monthly or annually as selected</li>
                    <li>All fees are non-refundable unless otherwise specified</li>
                    <li>Price changes will be communicated with 30 days notice</li>
                    <li>Late payments may result in service suspension</li>
                  </ul>
                </div>
              </section>

              <!-- Section 10: Limitation of Liability -->
              <section id="limitation" class="mb-8">
                <h2 class="text-2xl font-bold text-[#253237] mb-4">10. Limitation of Liability</h2>
                <div class="text-[#5c6b73] leading-relaxed space-y-4">
                  <p>
                    To the maximum extent permitted by law, Marcher Hospital Information System shall not be 
                    liable for any indirect, incidental, special, consequential, or punitive damages arising 
                    from your use of the platform.
                  </p>
                  <p>
                    Our total liability shall not exceed the amount paid by you for the service during the 
                    twelve months preceding the claim.
                  </p>
                </div>
              </section>

              <!-- Section 11: Termination -->
              <section id="termination" class="mb-8">
                <h2 class="text-2xl font-bold text-[#253237] mb-4">11. Termination</h2>
                <div class="text-[#5c6b73] leading-relaxed space-y-4">
                  <p>
                    Either party may terminate this agreement with 30 days written notice. 
                    We may terminate immediately if you violate these terms.
                  </p>
                  <p>
                    Upon termination, you will receive a secure export of your data for a period of 90 days, 
                    after which data will be permanently deleted from our systems.
                  </p>
                </div>
              </section>

              <!-- Section 12: Modifications -->
              <section id="modifications" class="mb-8">
                <h2 class="text-2xl font-bold text-[#253237] mb-4">12. Modifications</h2>
                <div class="text-[#5c6b73] leading-relaxed space-y-4">
                  <p>
                    We reserve the right to modify these terms at any time. Changes will be effective immediately 
                    upon posting, and we will notify users of significant changes via email or platform notification.
                  </p>
                </div>
              </section>

              <!-- Section 13: Governing Law -->
              <section id="governing-law" class="mb-8">
                <h2 class="text-2xl font-bold text-[#253237] mb-4">13. Governing Law</h2>
                <div class="text-[#5c6b73] leading-relaxed space-y-4">
                  <p>
                    These terms shall be governed by and construed in accordance with the laws of the 
                    Republic of the Philippines, without regard to conflict of law principles.
                  </p>
                </div>
              </section>

              <!-- Section 14: Contact Information -->
              <section id="contact" class="mb-8">
                <h2 class="text-2xl font-bold text-[#253237] mb-4">14. Contact Information</h2>
                <div class="text-[#5c6b73] leading-relaxed">
                  <p class="mb-4">
                    If you have questions about these Terms of Use, please contact us:
                  </p>
                  <div class="bg-[#e0fbfc] p-6 rounded-lg">
                    <p><strong>Email:</strong> support@marcher.com</p>
                    <p><strong>Phone:</strong> (042) 540-7732</p>
                    <p><strong>Address:</strong> Marcher Hospital Information System<br>
                    Makati, Metro Manila Philippines</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>

      <!-- Agreement Acknowledgment -->
      <div class="mt-12 text-center">
        <div class="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
          <h3 class="text-xl font-bold text-[#253237] mb-4">
            Acknowledgment
          </h3>
          <p class="text-[#5c6b73] mb-6">
            By using the Marcher Hospital Information System, you acknowledge that you have read, 
            understood, and agree to be bound by these Terms of Use.
          </p>
          <div class="flex justify-center">
            <NuxtLink 
              to="/platform" 
              class="bg-[#9db4c0] hover:bg-[#5c6b73] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Return to Marcher
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
