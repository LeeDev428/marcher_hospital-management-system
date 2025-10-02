<script setup lang="ts">
// No special logic needed for Privacy Policy form
</script>

<template>
  <main class="min-h-screen bg-[var--c5c5c3)] text-[var(--253237)] bg-[#ebece8]">
    <section class="container mx-auto px-6 py-12 lg:py-16">
      <!-- Hero -->
      <div class="text-center mb-12">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--253237)] mb-4">
          Privacy <span class="text-[var(--5c6b73)]">Policy</span>
        </h1>
        <p class="max-w-3xl mx-auto text-sm sm:text-base text-[var(--253237)]/80">
          We respect your privacy. This policy describes the information collected, how we use it,
          and when we share it.
        </p>
      </div>

      <!-- Policy content -->
      <div class="max-w-4xl mx-auto space-y-4">
        <!-- 1. Information We Collect -->
        <details class="bg-white rounded-2xl shadow-sm overflow-hidden" open>
          <summary
            class="cursor-pointer px-6 py-4 flex justify-between items-center text-[var(--253237)]"
            aria-controls="info-collect"
          >
            <div>
              <h2 class="text-lg font-semibold">1. Information We Collect</h2>
              <p class="text-xs text-[var(--5c6b73)] mt-1">Types of data we collect</p>
            </div>
            <span class="text-[var(--9db4c0)]" aria-hidden="true">▾</span>
          </summary>

          <div id="info-collect" class="px-6 pb-6 pt-0 text-sm text-[var(--253237)]/90 leading-relaxed">
            <p class="mb-3">
              <strong>Personal information:</strong> name, email, phone number and any identifiers
              you provide when creating or managing your account.
            </p>

            <p class="mb-3">
              <strong>Technical information:</strong> device and browser details, IP address, logs,
              cookies, and usage analytics collected to maintain and improve the service.
            </p>

            <p class="mb-0">
              <strong>Health-related data:</strong> when applicable (for hospital instances),
              clinical metadata or patient identifiers may be processed — only when necessary and
              under strict access controls determined by the hospital instance administrator.
            </p>
          </div>
        </details>

        <!-- 2. How We Use Information -->
        <details class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <summary
            class="cursor-pointer px-6 py-4 flex justify-between items-center text-[var(--253237)]"
            aria-controls="how-use"
          >
            <div>
              <h2 class="text-lg font-semibold">2. How We Use Information</h2>
              <p class="text-xs text-[var(--5c6b73)] mt-1">Purposes for processing data</p>
            </div>
            <span class="text-[var(--9db4c0)]" aria-hidden="true">▾</span>
          </summary>

          <div id="how-use" class="px-6 pb-6 pt-0 text-sm text-[var(--253237)]/90 leading-relaxed">
            <ul class="list-disc pl-5 space-y-2">
              <li>
                <strong>Provide and operate services:</strong> process requests, run features,
                manage accounts, and deliver the product you expect.
              </li>
              <li>
                <strong>Support and communication:</strong> respond to inquiries, send updates, and
                provide important notices about your account or system changes.
              </li>
              <li>
                <strong>Improve product and analytics:</strong> analyze usage to improve performance,
                reliability, and UX.
              </li>
              <li>
                <strong>Security and compliance:</strong> detect and prevent fraud, abuse, or security
                incidents and comply with legal obligations.
              </li>
            </ul>
          </div>
        </details>

        <!-- 3. Sharing Information -->
        <details class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <summary
            class="cursor-pointer px-6 py-4 flex justify-between items-center text-[var(--253237)]"
            aria-controls="sharing"
          >
            <div>
              <h2 class="text-lg font-semibold">3. Sharing Information</h2>
              <p class="text-xs text-[var(--5c6b73)] mt-1">Who may receive your data</p>
            </div>
            <span class="text-[var(--9db4c0)]" aria-hidden="true">▾</span>
          </summary>

          <div id="sharing" class="px-6 pb-6 pt-0 text-sm text-[var(--253237)]/90 leading-relaxed">
            <p class="mb-3">
              We do not sell your personal data. We may share data in the following limited ways:
            </p>

            <ul class="list-disc pl-5 space-y-2 mb-3">
              <li>
                <strong>Service providers:</strong> third parties who help operate the service
                (hosting, analytics, payment processors) under contractual restrictions.
              </li>
              <li>
                <strong>Legal requests:</strong> when required by law, regulation, or valid legal
                process (court orders, subpoenas).
              </li>
              <li>
                <strong>With your consent:</strong> when you specifically permit sharing for a
                particular purpose.
              </li>
            </ul>

            <p class="mb-0">
              Where possible, we share only the minimum necessary data and prefer aggregated or
              anonymized information for reporting and research.
            </p>
          </div>
        </details>
      </div>

      <!-- Footer CTA / contact -->
      <div class="max-w-4xl mx-auto mt-8 text-sm text-[var(--253237)]/80">
        <p class="mb-2">
          If you have questions about this policy or wish to request access, correction, or
          deletion of your data, contact us at
          <a href="mailto:support@marcher.com" class="text-[var(--9db4c0)] hover:underline">support@marcher.com</a>.
        </p>
      </div>
    </section>
  </main>
</template>