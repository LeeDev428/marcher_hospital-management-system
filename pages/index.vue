<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const newsletterEmail = ref('')

const submitContact = async () => {
  console.log('Contact form submitted:', contactForm.value)
  alert('Thank you for your message! We will get back to you soon.')
  contactForm.value = { name: '', email: '', subject: '', message: '' }
}

const subscribeNewsletter = async () => {
  console.log('Newsletter subscription:', newsletterEmail.value)
  alert('Thank you for subscribing to our newsletter!')
  newsletterEmail.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-3">
            <img src="/img/logo/marcher-logo.png" alt="Marcher Logo" class="w-10 h-10" />
            <span class="text-2xl font-bold text-gray-900">Marcher</span>
          </div>
          
          <div class="hidden md:flex items-center space-x-8">
            <a href="#features" class="text-gray-600 hover:text-teal-600 font-medium transition-colors">Features</a>
            <a href="#about" class="text-gray-600 hover:text-teal-600 font-medium transition-colors">About</a>
            <a href="#pricing" class="text-gray-600 hover:text-teal-600 font-medium transition-colors">Pricing</a>
            <a href="#support" class="text-gray-600 hover:text-teal-600 font-medium transition-colors">Support</a>
          </div>
          
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
          <div class="space-y-8">
            <div class="space-y-4">
              <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                YOUR GATEWAY TO<br />
                SMARTER<br />
                <span class="text-teal-600">HEALTH MANAGEMENT</span>
              </h1>
              <p class="text-xl text-gray-600 leading-relaxed">
                Marcher is a modern and user-friendly health management system designed for ease and efficiency, 
                helping you take control of your health with comprehensive patient care and data security.
              </p>
            </div>
            
            <div class="flex flex-wrap gap-4">
              <Button @click="navigateTo('/register')" size="lg" class="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg">
                Get Started
              </Button>
              <Button variant="outline" size="lg" class="px-8 py-6 text-lg border-teal-500 text-teal-600 hover:bg-teal-50">
                Learn More
              </Button>
            </div>
          </div>

          <div class="flex justify-center items-center">
            <div class="relative">
              <!-- Small decorative circles -->
              <div class="absolute -top-8 -right-8 w-24 h-24 bg-teal-200 rounded-full opacity-60"></div>
              <div class="absolute -bottom-12 -left-12 w-32 h-32 bg-teal-200 rounded-full opacity-60"></div>
              
              <!-- Main outer circle -->
              <div class="relative w-80 h-80 bg-teal-300 rounded-full flex items-center justify-center shadow-2xl">
                <!-- Inner white circle -->
                <div class="w-56 h-56 bg-white rounded-full flex items-center justify-center">
                  <!-- Large star icon -->
                  <Icon name="fa6-solid:star" class="w-40 h-40 text-gray-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How Marcher Works -->
    <section class="py-20 bg-gray-800 text-white">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4">HOW MARCHER WORKS?</h2>
        </div>

        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="bg-teal-100 rounded-lg p-12 flex items-center justify-center h-96">
            <Icon name="mdi:play-circle" class="w-24 h-24 text-teal-600" />
          </div>

          <div class="space-y-8">
            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                  <Icon name="mdi:account-plus" class="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 class="text-2xl font-bold mb-2">MARCHER ACCOUNT</h3>
                <p class="text-gray-300">
                  Get started easily with Marcher by signing up for a free account. Enter your details, verify your 
                  email, and you are good to go! Your account is your gateway to seamless healthcare management.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                  <Icon name="mdi:file-document" class="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 class="text-2xl font-bold mb-2">EDIT MY INFORMATIONS</h3>
                <p class="text-gray-300">
                  Keep your information accurate by easily updating your profile with just a few clicks. Marcher ensures your 
                  records are always current and ready when you need them.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                  <Icon name="mdi:calendar-check" class="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 class="text-2xl font-bold mb-2">SET UP AGENDA</h3>
                <p class="text-gray-300">
                  Schedule appointments with your preferred doctors effortlessly. Choose a date and time that fits 
                  your busy schedule, and let Marcher handle the rest!
                </p>
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
          <h2 class="text-4xl font-bold text-gray-900 mb-4">MARCHER Features</h2>
          <p class="text-xl text-gray-600">Experience the comprehensive features of the system</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-teal-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mb-6">
              <Icon name="mdi:account-multiple" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Patient Management</h3>
            <p class="text-gray-600">
              Efficiently manage patient records, appointments, and medical history in one centralized system.
            </p>
          </div>

          <div class="bg-blue-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6">
              <Icon name="mdi:calendar-clock" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Appointment Scheduling</h3>
            <p class="text-gray-600">
              Seamless booking system that allows patients to schedule, reschedule, and manage appointments online.
            </p>
          </div>

          <div class="bg-gray-600 p-8 rounded-lg hover:shadow-lg transition-shadow text-white">
            <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-6">
              <Icon name="mdi:file-document-multiple" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-2xl font-bold mb-4">Electronic Health Records</h3>
            <p class="text-gray-200">
              Secure digital storage of patient health records accessible anytime, anywhere with proper authentication.
            </p>
          </div>

          <div class="bg-gray-800 p-8 rounded-lg hover:shadow-lg transition-shadow text-white">
            <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-6">
              <Icon name="mdi:credit-card" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-2xl font-bold mb-4">Insurance Claim Management</h3>
            <p class="text-gray-200">
              Streamline insurance claims processing with automated verification and submission systems.
            </p>
          </div>

          <div class="bg-teal-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mb-6">
              <Icon name="mdi:pill" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Pharmacy Integration</h3>
            <p class="text-gray-600">
              Integrated pharmacy system for prescription management and medication tracking.
            </p>
          </div>

          <div class="bg-gray-600 p-8 rounded-lg hover:shadow-lg transition-shadow text-white">
            <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-6">
              <Icon name="mdi:chart-line" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-2xl font-bold mb-4">Analytics & Reports</h3>
            <p class="text-gray-200">
              Comprehensive reporting tools and analytics dashboard for data-driven decision making.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">What our customers say</h2>
        </div>

        <div class="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                <Icon name="mdi:account" class="w-8 h-8 text-teal-600" />
              </div>
              <div>
                <h4 class="font-bold text-lg">Dr. Michael Santos</h4>
                <p class="text-gray-600 text-sm">General Practitioner</p>
              </div>
            </div>
            <p class="text-gray-700 leading-relaxed">
              "As a practitioner, I was impressed by how efficiently I was able to access my patient's medical history using Marcher's system. 
              The interface is intuitive, making it easy for both myself and my staff to navigate."
            </p>
          </div>

          <div class="bg-gray-800 text-white p-8 rounded-lg shadow-md">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                <Icon name="mdi:account" class="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 class="font-bold text-lg">Maria Rodriguez</h4>
                <p class="text-gray-300 text-sm">Patient</p>
              </div>
            </div>
            <p class="text-gray-200 leading-relaxed">
              "Marcher has truly transformed the way I manage my healthcare. Booking appointments is so simple, and I love being able to access 
              my health records online. It feels great to have everything I need in one place."
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-white">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-8">About Marcher</h2>
        </div>

        <div class="mb-20">
          <div class="bg-teal-50 p-8 rounded-lg max-w-4xl mx-auto">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">What is Marcher?</h3>
            <p class="text-gray-700 leading-relaxed">
              Marcher is a cutting-edge healthcare management system designed to streamline the way patients, doctors, and healthcare facilities 
              interact. With a focus on user experience and efficiency, Marcher provides a comprehensive platform for managing medical records, 
              scheduling appointments, processing insurance claims, and more.
            </p>
          </div>
        </div>

        <div class="mb-20">
          <h3 class="text-3xl font-bold text-center text-gray-900 mb-12">What Makes Marcher Unique?</h3>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="mdi:shield-check" class="w-10 h-10 text-teal-600" />
              </div>
              <h4 class="text-xl font-bold text-gray-900 mb-2">24/7 Health & Safety Assistance</h4>
              <p class="text-gray-600">
                Round-the-clock support and monitoring to ensure your health data is always protected and accessible.
              </p>
            </div>

            <div class="text-center">
              <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="mdi:lock" class="w-10 h-10 text-blue-600" />
              </div>
              <h4 class="text-xl font-bold text-gray-900 mb-2">HIPAA Compliant and Secured</h4>
              <p class="text-gray-600">
                Full compliance with healthcare regulations ensuring your sensitive medical information remains private and secure.
              </p>
            </div>

            <div class="text-center">
              <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="mdi:account-tie" class="w-10 h-10 text-gray-700" />
              </div>
              <h4 class="text-xl font-bold text-gray-900 mb-2">User-Friendly Interface</h4>
              <p class="text-gray-600">
                Intuitive design that makes healthcare management simple and accessible for users of all technical skill levels.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Developers</h3>
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="w-32 h-32 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="mdi:account" class="w-16 h-16 text-teal-600" />
              </div>
              <h4 class="text-lg font-bold text-gray-900">Michael George Alde</h4>
              <p class="text-gray-600 text-sm">Full Stack Developer</p>
            </div>

            <div class="text-center">
              <div class="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="mdi:account" class="w-16 h-16 text-blue-600" />
              </div>
              <h4 class="text-lg font-bold text-gray-900">Jelmark James Villarin</h4>
              <p class="text-gray-600 text-sm">Backend Developer</p>
            </div>

            <div class="text-center">
              <div class="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="mdi:account" class="w-16 h-16 text-purple-600" />
              </div>
              <h4 class="text-lg font-bold text-gray-900">Hannah Faith Calledo</h4>
              <p class="text-gray-600 text-sm">UI/UX Designer</p>
            </div>

            <div class="text-center">
              <div class="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="mdi:account" class="w-16 h-16 text-green-600" />
              </div>
              <h4 class="text-lg font-bold text-gray-900">Lance Andrey Espiritu</h4>
              <p class="text-gray-600 text-sm">Frontend Developer</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-20 bg-gray-50">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Marcher Services</h2>
          <p class="text-xl text-gray-600">Choose the plan that's perfect for your needs</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div class="bg-teal-50 p-8 rounded-lg">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">START UP</h3>
            <p class="text-sm text-gray-600 mb-6">Ideal for small clinics</p>
            <div class="mb-6">
              <span class="text-5xl font-bold text-gray-900">₱500</span>
              <span class="text-gray-600">/month</span>
            </div>
            <ul class="space-y-3 mb-8">
              <li class="flex items-center gap-2 text-gray-700">
                <Icon name="mdi:check-circle" class="text-teal-600" />
                Up to 100 patients
              </li>
              <li class="flex items-center gap-2 text-gray-700">
                <Icon name="mdi:check-circle" class="text-teal-600" />
                Basic appointment scheduling
              </li>
              <li class="flex items-center gap-2 text-gray-700">
                <Icon name="mdi:check-circle" class="text-teal-600" />
                Email support
              </li>
              <li class="flex items-center gap-2 text-gray-700">
                <Icon name="mdi:check-circle" class="text-teal-600" />
                5GB cloud storage
              </li>
            </ul>
            <Button class="w-full bg-teal-500 hover:bg-teal-600 text-white">
              Choose Plan
            </Button>
          </div>

          <div class="bg-gray-800 text-white p-8 rounded-lg relative">
            <div class="absolute top-0 right-0 bg-teal-500 text-white px-4 py-1 rounded-bl-lg text-sm">
              Popular
            </div>
            <h3 class="text-2xl font-bold mb-2">PROFESSIONAL</h3>
            <p class="text-sm text-gray-300 mb-6">Perfect for growing practices</p>
            <div class="mb-6">
              <span class="text-5xl font-bold">₱750</span>
              <span class="text-gray-300">/month</span>
            </div>
            <ul class="space-y-3 mb-8">
              <li class="flex items-center gap-2">
                <Icon name="mdi:check-circle" class="text-teal-400" />
                Up to 500 patients
              </li>
              <li class="flex items-center gap-2">
                <Icon name="mdi:check-circle" class="text-teal-400" />
                Advanced scheduling
              </li>
              <li class="flex items-center gap-2">
                <Icon name="mdi:check-circle" class="text-teal-400" />
                Priority email support
              </li>
              <li class="flex items-center gap-2">
                <Icon name="mdi:check-circle" class="text-teal-400" />
                SMS notifications
              </li>
              <li class="flex items-center gap-2">
                <Icon name="mdi:check-circle" class="text-teal-400" />
                50GB cloud storage
              </li>
              <li class="flex items-center gap-2">
                <Icon name="mdi:check-circle" class="text-teal-400" />
                Basic analytics
              </li>
            </ul>
            <Button class="w-full bg-teal-500 hover:bg-teal-600">
              Choose Plan
            </Button>
          </div>

          <div class="bg-teal-50 p-8 rounded-lg">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">ENTERPRISE</h3>
            <p class="text-sm text-gray-600 mb-6">For large healthcare facilities</p>
            <div class="mb-6">
              <span class="text-5xl font-bold text-gray-900">₱1000</span>
              <span class="text-gray-600">/month</span>
            </div>
            <ul class="space-y-3 mb-8">
              <li class="flex items-center gap-2 text-gray-700">
                <Icon name="mdi:check-circle" class="text-teal-600" />
                Unlimited patients
              </li>
              <li class="flex items-center gap-2 text-gray-700">
                <Icon name="mdi:check-circle" class="text-teal-600" />
                Full feature access
              </li>
              <li class="flex items-center gap-2 text-gray-700">
                <Icon name="mdi:check-circle" class="text-teal-600" />
                24/7 phone & email support
              </li>
              <li class="flex items-center gap-2 text-gray-700">
                <Icon name="mdi:check-circle" class="text-teal-600" />
                Unlimited storage
              </li>
              <li class="flex items-center gap-2 text-gray-700">
                <Icon name="mdi:check-circle" class="text-teal-600" />
                Advanced analytics
              </li>
              <li class="flex items-center gap-2 text-gray-700">
                <Icon name="mdi:check-circle" class="text-teal-600" />
                Custom integrations
              </li>
            </ul>
            <Button class="w-full bg-teal-500 hover:bg-teal-600 text-white">
              Choose Plan
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Support/Contact Section -->
    <section id="support" class="py-20 bg-white">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Get Support</h2>
          <p class="text-xl text-gray-600">We are here to help you succeed</p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div class="bg-white p-8 rounded-lg shadow-lg">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
            <form @submit.prevent="submitContact" class="space-y-4">
              <div>
                <Label>Name</Label>
                <Input v-model="contactForm.name" placeholder="Your name" required />
              </div>
              <div>
                <Label>Email</Label>
                <Input v-model="contactForm.email" type="email" placeholder="your@email.com" required />
              </div>
              <div>
                <Label>Subject</Label>
                <Input v-model="contactForm.subject" placeholder="How can we help?" required />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea v-model="contactForm.message" placeholder="Tell us more about your inquiry..." rows="5" required />
              </div>
              <Button type="submit" class="w-full bg-teal-500 hover:bg-teal-600 text-white">
                Send Message
              </Button>
            </form>
          </div>

          <div class="space-y-8">
            <div class="bg-gray-800 text-white p-8 rounded-lg">
              <h3 class="text-2xl font-bold mb-6">Contact Information</h3>
              <div class="space-y-4">
                <div class="flex gap-3">
                  <Icon name="mdi:email" class="w-6 h-6 text-teal-400 flex-shrink-0" />
                  <div>
                    <p class="font-semibold">Email Support</p>
                    <p class="text-gray-300">support@marcher.com</p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <Icon name="mdi:phone" class="w-6 h-6 text-teal-400 flex-shrink-0" />
                  <div>
                    <p class="font-semibold">Phone Number</p>
                    <p class="text-gray-300">+63 123 456 7890</p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <Icon name="mdi:clock" class="w-6 h-6 text-teal-400 flex-shrink-0" />
                  <div>
                    <p class="font-semibold">Business Hours</p>
                    <p class="text-gray-300">Monday - Friday: 9AM - 6PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 p-8 rounded-lg">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
              <div class="space-y-4">
                <div>
                  <h4 class="font-semibold text-gray-900 mb-1">Is Marcher HIPAA compliant?</h4>
                  <p class="text-gray-600 text-sm">Yes, we are fully HIPAA compliant and ensure all patient data is securely encrypted.</p>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-1">Can I migrate my existing data?</h4>
                  <p class="text-gray-600 text-sm">Absolutely! Our team will assist you with seamless data migration from your current system.</p>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-1">What payment methods do you accept?</h4>
                  <p class="text-gray-600 text-sm">We accept major credit cards, bank transfers, and GCash for your convenience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div class="flex items-center space-x-3 mb-4">
              <img src="/img/logo/marcher-logo.png" alt="Marcher Logo" class="w-10 h-10" />
              <span class="text-2xl font-bold">Marcher</span>
            </div>
            <p class="text-gray-400 text-sm">
              Modern healthcare management system designed for efficiency and patient care.
            </p>
          </div>

          <div>
            <h4 class="font-bold text-lg mb-4">Platform</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#features" class="hover:text-teal-400 transition-colors">Features</a></li>
              <li><a href="#about" class="hover:text-teal-400 transition-colors">About Us</a></li>
              <li><a href="#pricing" class="hover:text-teal-400 transition-colors">Pricing</a></li>
              <li><a href="#support" class="hover:text-teal-400 transition-colors">Support</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-lg mb-4">Legal</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="/privacy-policy" class="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-of-use" class="hover:text-teal-400 transition-colors">Terms of Use</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-lg mb-4">Stay Updated</h4>
            <p class="text-gray-400 text-sm mb-4">Subscribe to our newsletter for updates and health tips.</p>
            <form @submit.prevent="subscribeNewsletter" class="flex gap-2">
              <Input v-model="newsletterEmail" type="email" placeholder="Your email" class="bg-gray-800 border-gray-700 text-white" required />
              <Button type="submit" class="bg-teal-500 hover:bg-teal-600">
                <Icon name="mdi:send" />
              </Button>
            </form>
          </div>
        </div>

        <div class="border-t border-gray-800 pt-8 text-center">
          <p class="text-gray-400 text-sm">Â© 2025 Marcher. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>