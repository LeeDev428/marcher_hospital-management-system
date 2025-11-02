<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { useToast } from "@/composables/useToast"
//import { Input } from "@/components/ui/input"
//import { Button } from "@/components/ui/button"
import PatientBillingTable from "./components/PatientsBillingTable.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const route = useRoute()

onMounted(async () => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Patient Billing", link: "/billing" },
	])
	
	// Check for payment status from webhook redirect
	const paymentStatus = route.query.payment as string
	if (paymentStatus === 'success') {
		useToast('success', 'Payment Successful', 'Your payment has been processed successfully!')
		// Remove query param from URL
		window.history.replaceState({}, '', '/patient/billing')
	} else if (paymentStatus === 'failed') {
		useToast('error', 'Payment Failed', 'Your payment was declined. Please try again or use a different payment method.')
		window.history.replaceState({}, '', '/patient/billing')
	} else if (paymentStatus === 'cancelled') {
		useToast('warning', 'Payment Cancelled', 'You cancelled the payment. You can try again when ready.')
		window.history.replaceState({}, '', '/patient/billing')
	} else if (paymentStatus === 'error') {
		useToast('error', 'Payment Error', 'There was an error processing your payment. Please try again.')
		window.history.replaceState({}, '', '/patient/billing')
	}
})

useHead({
  title: 'Patient Billing'
})
</script>

<template>
	<NuxtLayout name="patient" title="Billing">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<div class="w-full flex gap-2 justify-between">
			
				<PatientBillingTable />
			
		</div>
        </div>
	</NuxtLayout>
</template>
