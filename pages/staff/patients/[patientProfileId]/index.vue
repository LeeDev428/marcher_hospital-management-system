<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { usePatientProfileStore } from "@/stores/patients"
import { Button } from "@/components/ui/button"
import { QRCodeDisplay } from "@/components/app/qrcode"

const breadcrumbsStore = useBreadcrumbsStore()
const patientProfileStore = usePatientProfileStore()
const route = useRoute()
const { patientProfileId } = route.params as { patientProfileId: string }

onMounted(async () => {
	await patientProfileStore.getPatientProfile(patientProfileId)

	if (!patientProfileStore.patientProfile) {
		return navigateTo("/staff/patients")
	}

	breadcrumbsStore.setBreadcrumbs([
		{ label: "Patients", link: "/staff/patients" },
		{ label: "Patient Profile", link: `/staff/patients/${patientProfileId}` },
	])
})

const formatDate = (date: any) => {
	if (!date) return 'N/A'
	try {
		return new Date(date).toLocaleDateString()
	} catch {
		return 'N/A'
	}
}
</script>

<template>
	<NuxtLayout name="staff" title="Patient Profile">
		<div class="flex flex-col gap-6 bg-white p-6 rounded-lg">
			<div
				v-if="patientProfileStore.patientProfile && patientProfileStore.patientProfile.user"
				class="h-full w-full flex flex-col gap-6"
			>
				<!-- Header with QR Code -->
				<div class="flex justify-between items-start border-b pb-4">
					<div>
						<h2 class="text-2xl font-bold text-gray-800">
							{{ patientProfileStore.patientProfile.user.firstName }}
							{{ patientProfileStore.patientProfile.user.middleName }}
							{{ patientProfileStore.patientProfile.user.lastName }}
							{{ patientProfileStore.patientProfile.user.suffix }}
						</h2>
						<p class="text-gray-600">Patient Number: {{ patientProfileStore.patientProfile.patientNumber }}</p>
					</div>
					<div class="flex flex-col items-center gap-2">
						<QRCodeDisplay
							:data="{ entity: 'patient', id: patientProfileId }"
						/>
						<p class="text-sm text-gray-500">Scan to view profile</p>
					</div>
				</div>

				<!-- Personal Information -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div class="space-y-1">
						<p class="text-sm font-medium text-gray-500">First Name</p>
						<p class="text-base text-gray-900">{{ patientProfileStore.patientProfile.user.firstName || 'N/A' }}</p>
					</div>
					<div class="space-y-1">
						<p class="text-sm font-medium text-gray-500">Middle Name</p>
						<p class="text-base text-gray-900">{{ patientProfileStore.patientProfile.user.middleName || 'N/A' }}</p>
					</div>
					<div class="space-y-1">
						<p class="text-sm font-medium text-gray-500">Last Name</p>
						<p class="text-base text-gray-900">{{ patientProfileStore.patientProfile.user.lastName || 'N/A' }}</p>
					</div>
					<div class="space-y-1">
						<p class="text-sm font-medium text-gray-500">Suffix</p>
						<p class="text-base text-gray-900">{{ patientProfileStore.patientProfile.user.suffix || 'N/A' }}</p>
					</div>
					<div class="space-y-1">
						<p class="text-sm font-medium text-gray-500">Email</p>
						<p class="text-base text-gray-900">{{ patientProfileStore.patientProfile.user.email || 'N/A' }}</p>
					</div>
					<div class="space-y-1">
						<p class="text-sm font-medium text-gray-500">Contact Number</p>
						<p class="text-base text-gray-900">{{ patientProfileStore.patientProfile.user.contactNumber || 'N/A' }}</p>
					</div>
				</div>

				<!-- Demographics -->
				<div class="border-t pt-4">
					<h3 class="text-lg font-semibold text-gray-800 mb-4">Demographics</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<div class="space-y-1">
							<p class="text-sm font-medium text-gray-500">Sex</p>
							<p class="text-base text-gray-900">{{ patientProfileStore.patientProfile.user.sex || 'N/A' }}</p>
						</div>
						<div class="space-y-1">
							<p class="text-sm font-medium text-gray-500">Blood Type</p>
							<p class="text-base text-gray-900">{{ patientProfileStore.patientProfile.user.bloodType || 'N/A' }}</p>
						</div>
						<div class="space-y-1">
							<p class="text-sm font-medium text-gray-500">Birthdate</p>
							<p class="text-base text-gray-900">{{ formatDate(patientProfileStore.patientProfile.user.birthdate) }}</p>
						</div>
						<div class="space-y-1">
							<p class="text-sm font-medium text-gray-500">Birthplace</p>
							<p class="text-base text-gray-900">{{ patientProfileStore.patientProfile.user.birthplace || 'N/A' }}</p>
						</div>
						<div class="space-y-1">
							<p class="text-sm font-medium text-gray-500">Nationality</p>
							<p class="text-base text-gray-900">{{ patientProfileStore.patientProfile.user.nationality || 'N/A' }}</p>
						</div>
						<div class="space-y-1">
							<p class="text-sm font-medium text-gray-500">Religion</p>
							<p class="text-base text-gray-900">{{ patientProfileStore.patientProfile.user.religion || 'N/A' }}</p>
						</div>
						<div class="space-y-1">
							<p class="text-sm font-medium text-gray-500">Marital Status</p>
							<p class="text-base text-gray-900">{{ patientProfileStore.patientProfile.user.maritalStatus || 'N/A' }}</p>
						</div>
						<div class="space-y-1">
							<p class="text-sm font-medium text-gray-500">Status</p>
							<p class="text-base text-gray-900">
								<span :class="patientProfileStore.patientProfile.user.status === 'ACTIVE' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
									{{ patientProfileStore.patientProfile.user.status }}
								</span>
							</p>
						</div>
					</div>
				</div>

				<!-- Additional Information -->
				<div class="border-t pt-4">
					<h3 class="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="space-y-1">
							<p class="text-sm font-medium text-gray-500">Civil Status</p>
							<p class="text-base text-gray-900">{{ patientProfileStore.patientProfile.user.civilStatus || 'N/A' }}</p>
						</div>
						<div class="space-y-1">
							<p class="text-sm font-medium text-gray-500">Occupation</p>
							<p class="text-base text-gray-900">{{ patientProfileStore.patientProfile.user.occupation || 'N/A' }}</p>
						</div>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex justify-start gap-2 mt-4 border-t pt-4">
					<NuxtLink :to="`/staff/patients/${patientProfileId}/edit`">
						<Button type="button">
							<Icon name="mdi:pencil" class="mr-2" />
							Edit Patient
						</Button>
					</NuxtLink>
				</div>
			</div>

			<!-- Loading State -->
			<div v-else-if="patientProfileStore.loading" class="flex justify-center items-center h-64">
				<p class="text-gray-500">Loading patient information...</p>
			</div>

			<!-- Error State -->
			<div v-else class="flex justify-center items-center h-64">
				<p class="text-red-500">Failed to load patient information.</p>
			</div>
		</div>
	</NuxtLayout>
</template>
