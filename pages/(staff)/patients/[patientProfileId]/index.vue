<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { usePatientProfileStore } from "@/stores/patients"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { QRCodeDisplay } from "@/components/app/qrcode"

import EncountersModule from "./encounters/components/EncountersModule.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const patientProfileStore = usePatientProfileStore()
const route = useRoute()
const router = useRouter()
const { patientProfileId } = route.params as { patientProfileId: string }
const availableTabs = [
	"profile",
	"addresses",
	"contacts",
	"employment",
	"emergency-contacts",
	"consent",
	"encounters",
] as const
const activeTab = ref<string>("profile")

onMounted(async () => {
	await patientProfileStore.getPatientProfile(patientProfileId)

	if (!patientProfileStore.patientProfile) {
		return navigateTo("/patients")
	}

	breadcrumbsStore.setBreadcrumbs([
		{ label: "Patients", link: "/patients" },
		{ label: "Patient Profile", link: `/patients/${patientProfileId}` },
	])

	// Initialize active tab from URL hash if present
	const initialHash = route.hash?.replace(/^#/, "")
	if (
		initialHash &&
		(availableTabs as readonly string[]).includes(initialHash)
	) {
		activeTab.value = initialHash
	}
})

// Sync activeTab -> URL hash
watch(
	() => activeTab.value,
	(val) => {
		if (!val) return
		const targetHash = `#${val}`
		if (route.hash !== targetHash) {
			router.replace({ hash: targetHash })
		}
	}
)

// Sync URL hash -> activeTab (e.g., back/forward navigation)
watch(
	() => route.hash,
	(newHash) => {
		const val = (newHash || "").replace(/^#/, "")
		if (
			val &&
			(availableTabs as readonly string[]).includes(val) &&
			activeTab.value !== val
		) {
			activeTab.value = val
		}
	}
)
</script>

<template>
	<NuxtLayout name="staff" title="Patient Profile">
		<div class="flex flex-col gap-4 bg-white p-4 rounded-lg">
			<div
				v-if="patientProfileStore.patientProfile"
				class="h-full w-full flex flex-col gap-4"
			>
				<Tabs v-model="activeTab">
					<TabsList class="mb-4 gap-1">
						<TabsTrigger value="profile" class="hover:bg-zinc-200"
							>Profile</TabsTrigger
						>
						<TabsTrigger value="addresses" class="hover:bg-zinc-200"
							>Addresses</TabsTrigger
						>
						<TabsTrigger value="contacts" class="hover:bg-zinc-200"
							>Contacts</TabsTrigger
						>
						<TabsTrigger value="employment" class="hover:bg-zinc-200"
							>Employment</TabsTrigger
						>
						<TabsTrigger value="emergency-contacts" class="hover:bg-zinc-200"
							>Emergency Contacts</TabsTrigger
						>
						<TabsTrigger value="consent" class="hover:bg-zinc-200"
							>Consent</TabsTrigger
						>
						<TabsTrigger value="encounters" class="hover:bg-zinc-200"
							>Encounters</TabsTrigger
						>
					</TabsList>
					<TabsContent
						value="profile"
						:hidden="activeTab !== 'profile'"
						force-mount
					>
						<div class="flex flex-col gap-4">
							<QRCodeDisplay
								:data="{ entity: 'patient', id: patientProfileId }"
							/>
							<div class="w-full flex gap-4">
								<div>
									<strong>Last Name:</strong>
									{{ patientProfileStore.patientProfile.lastName }}
								</div>
								<div>
									<strong>First Name:</strong>
									{{ patientProfileStore.patientProfile.firstName }}
								</div>
								<div>
									<strong>Middle Name:</strong>
									{{ patientProfileStore.patientProfile.middleName }}
								</div>
								<div>
									<strong>Suffix:</strong>
									{{ patientProfileStore.patientProfile.suffix }}
								</div>
							</div>
							<div class="w-full flex gap-4">
								<div>
									<strong>Sex:</strong>
									{{ patientProfileStore.patientProfile.sex }}
								</div>
								<div>
									<strong>Blood Type:</strong>
									{{ patientProfileStore.patientProfile.bloodType }}
								</div>
								<div>
									<strong>Birthdate:</strong>
									{{ patientProfileStore.patientProfile.birthdate }}
								</div>
								<div>
									<strong>Birthplace:</strong>
									{{ patientProfileStore.patientProfile.birthplace }}
								</div>
							</div>
							<div class="w-full flex gap-4">
								<div>
									<strong>Nationality:</strong>
									{{ patientProfileStore.patientProfile.nationality }}
								</div>
								<div>
									<strong>Religion:</strong>
									{{ patientProfileStore.patientProfile.religion }}
								</div>
								<div>
									<strong>Marital Status:</strong>
									{{ patientProfileStore.patientProfile.maritalStatus }}
								</div>
							</div>
						</div>
					</TabsContent>
					<TabsContent
						value="addresses"
						:hidden="activeTab !== 'addresses'"
						force-mount
					>
						<div class="flex flex-col gap-4">
							<ul
								v-if="
									patientProfileStore.patientProfile.addresses &&
									patientProfileStore.patientProfile.addresses.length
								"
							>
								<li
									v-for="(address, idx) in patientProfileStore.patientProfile
										.addresses"
									:key="idx"
									class="mb-2 p-2 border rounded"
								>
									<div><strong>Label:</strong> {{ address.label }}</div>
									<div><strong>Country:</strong> {{ address.country }}</div>
									<div><strong>State:</strong> {{ address.state }}</div>
									<div><strong>Zip Code:</strong> {{ address.zipCode }}</div>
									<div><strong>City:</strong> {{ address.city }}</div>
									<div><strong>Address:</strong> {{ address.address }}</div>
								</li>
							</ul>
							<div v-else>No addresses available.</div>
						</div>
					</TabsContent>
					<TabsContent
						value="contacts"
						:hidden="activeTab !== 'contacts'"
						force-mount
					>
						<div class="flex flex-col gap-4">
							<ul
								v-if="
									patientProfileStore.patientProfile.contacts &&
									patientProfileStore.patientProfile.contacts.length
								"
							>
								<li
									v-for="(contact, idx) in patientProfileStore.patientProfile
										.contacts"
									:key="idx"
									class="mb-2 p-2 border rounded"
								>
									<div><strong>Type:</strong> {{ contact.type }}</div>
									<div><strong>Value:</strong> {{ contact.value }}</div>
								</li>
							</ul>
							<div v-else>No contacts available.</div>
						</div>
					</TabsContent>
					<TabsContent
						value="employment"
						:hidden="activeTab !== 'employment'"
						force-mount
					>
						<div class="flex flex-col gap-4">
							<ul
								v-if="
									patientProfileStore.patientProfile.employments &&
									patientProfileStore.patientProfile.employments.length
								"
							>
								<li
									v-for="(employment, idx) in patientProfileStore.patientProfile
										.employments"
									:key="idx"
									class="mb-2 p-2 border rounded"
								>
									<div>
										<strong>Employer:</strong> {{ employment.employer }}
									</div>
									<div>
										<strong>Contact Person:</strong>
										{{ employment.contactPerson }}
									</div>
									<div><strong>Address:</strong> {{ employment.address }}</div>
									<div><strong>Phone:</strong> {{ employment.phone }}</div>
									<div><strong>Email:</strong> {{ employment.email }}</div>
									<div><strong>Website:</strong> {{ employment.website }}</div>
								</li>
							</ul>
							<div v-else>No employment records available.</div>
						</div>
					</TabsContent>
					<TabsContent
						value="emergency-contacts"
						:hidden="activeTab !== 'emergency-contacts'"
						force-mount
					>
						<div class="flex flex-col gap-4">
							<ul
								v-if="
									patientProfileStore.patientProfile.emergencyContacts &&
									patientProfileStore.patientProfile.emergencyContacts.length
								"
							>
								<li
									v-for="(em, idx) in patientProfileStore.patientProfile
										.emergencyContacts"
									:key="idx"
									class="mb-2 p-2 border rounded"
								>
									<div>
										<strong>Relationship:</strong> {{ em.relationship }}
									</div>
									<div><strong>Last Name:</strong> {{ em.lastName }}</div>
									<div><strong>First Name:</strong> {{ em.firstName }}</div>
									<div><strong>Middle Name:</strong> {{ em.middleName }}</div>
									<div><strong>Suffix:</strong> {{ em.suffix }}</div>
									<div><strong>Phone:</strong> {{ em.phone }}</div>
									<div><strong>Email:</strong> {{ em.email }}</div>
									<div><strong>Address:</strong> {{ em.address }}</div>
								</li>
							</ul>
							<div v-else>No emergency contacts available.</div>
						</div>
					</TabsContent>
					<TabsContent
						value="consent"
						:hidden="activeTab !== 'consent'"
						force-mount
					>
						<div class="flex flex-col gap-4">
							<div>
								<strong>Document URL:</strong>
								{{ patientProfileStore.patientProfile.consent?.documentUrl }}
							</div>
							<div>
								<strong>Signature:</strong>
								{{ patientProfileStore.patientProfile.consent?.signature }}
							</div>
						</div>
					</TabsContent>
					<TabsContent value="encounters" :hidden="activeTab !== 'encounters'">
						<EncountersModule />
					</TabsContent>
				</Tabs>
				<div
					v-if="activeTab != 'encounters'"
					class="flex justify-start gap-2 mt-4"
				>
					<NuxtLink :to="`/patients/${patientProfileId}/edit`">
						<Button type="button">
							<Icon name="mdi:pencil" />
							Edit
						</Button>
					</NuxtLink>
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>
