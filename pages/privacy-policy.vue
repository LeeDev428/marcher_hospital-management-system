<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 lg:px-8 max-w-4xl">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p class="text-gray-600">Last updated: January 2025</p>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-lg shadow-lg p-8 space-y-8">
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
          <p class="text-gray-700 leading-relaxed">
            Welcome to Marcher. We are committed to protecting your personal information and your right to privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
            healthcare management system.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            We collect personal information that you voluntarily provide to us when you register on the platform, 
            express an interest in obtaining information about us or our products and services, or otherwise contact us.
          </p>
          <ul class="list-disc pl-6 space-y-2 text-gray-700">
            <li>Personal identification information (name, email address, phone number)</li>
            <li>Medical history and health records</li>
            <li>Insurance information</li>
            <li>Payment and billing information</li>
            <li>Appointment and consultation records</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            We use the information we collect or receive:
          </p>
          <ul class="list-disc pl-6 space-y-2 text-gray-700">
            <li>To facilitate account creation and authentication</li>
            <li>To provide and maintain our healthcare services</li>
            <li>To manage appointments and medical consultations</li>
            <li>To process your insurance claims and payments</li>
            <li>To send administrative information and updates</li>
            <li>To improve our services and develop new features</li>
            <li>To ensure compliance with legal and regulatory requirements</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">4. HIPAA Compliance</h2>
          <p class="text-gray-700 leading-relaxed">
            Marcher is fully compliant with the Health Insurance Portability and Accountability Act (HIPAA). We implement 
            appropriate technical, administrative, and physical safeguards to protect your Protected Health Information (PHI). 
            All data is encrypted both in transit and at rest, and access is strictly controlled on a need-to-know basis.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">5. Information Sharing</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            We only share information with your consent, to comply with laws, to provide you with services, 
            to protect your rights, or to fulfill business obligations. Specifically, we may share your information with:
          </p>
          <ul class="list-disc pl-6 space-y-2 text-gray-700">
            <li>Healthcare providers involved in your care</li>
            <li>Insurance companies for claims processing</li>
            <li>Service providers who assist in our operations</li>
            <li>Legal and regulatory authorities when required by law</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
          <p class="text-gray-700 leading-relaxed">
            We have implemented appropriate technical and organizational security measures designed to protect the security 
            of any personal information we process. However, please note that no electronic transmission over the Internet 
            or information storage technology can be guaranteed to be 100% secure.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">7. Your Privacy Rights</h2>
          <p class="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
          <ul class="list-disc pl-6 space-y-2 text-gray-700">
            <li>Access and receive a copy of your personal information</li>
            <li>Request correction of inaccurate or incomplete data</li>
            <li>Request deletion of your personal information</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
          <p class="text-gray-700 leading-relaxed">
            We will retain your personal information only for as long as necessary for the purposes set out in this Privacy Policy, 
            and to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
          <p class="text-gray-700 leading-relaxed">
            Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information 
            from children under 18. If you become aware that a child has provided us with personal information, please contact us.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">10. Updates to This Policy</h2>
          <p class="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last updated" 
            date and will be effective as soon as it is accessible. We encourage you to review this Privacy Policy frequently to stay 
            informed about how we are protecting your information.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            If you have questions or comments about this Privacy Policy, please contact us at:
          </p>
          <div class="bg-gray-50 p-6 rounded-lg">
            <p class="text-gray-700"><strong>Email:</strong> privacy@marcher.com</p>
            <p class="text-gray-700"><strong>Phone:</strong> +63 123 456 7890</p>
            <p class="text-gray-700"><strong>Address:</strong> Marcher Healthcare Systems, Philippines</p>
          </div>
        </section>
      </div>

      <!-- Back Button -->
      <div class="mt-8 text-center">
        <Button @click="navigateTo('/')" variant="outline" class="px-8">
          <Icon name="mdi:arrow-left" class="mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button"
</script>
