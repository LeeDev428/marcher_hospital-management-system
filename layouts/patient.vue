<script setup lang="ts">
import { useTitle } from "@vueuse/core"
import { useSidebarStore, useBreadcrumbsStore } from "~/stores/app"

import { SidebarBase, SidebarItem } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"

import { LayoutBreadcrumbs } from "@/components/layout/breadcrumbs"
import { QRCodeScanner } from "@/components/app/qrcode"

import { NotificationsPopover } from "@/components/layout/notifications"

const sidebarStore = useSidebarStore()
const breadcrumbsStore = useBreadcrumbsStore()
const { title } = defineProps<{
  title: string
}>()

const links = [

  {label: "Patient", 
  link: "/patient",
  icon: "mdi:home",
  },
  {
    label: "Appointment",
    icon: "mdi:calendar-clock",
    link: "/patient/appointments",
  },
  {
    label: "Doctor",
    icon: "mdi:medical-bag",
    link: "/patient/doctor",
  },
  {
    label: "Billing",
    icon: "mdi:cash-multiple",
    link: "/patient/billing",
  },

  {
    label: "Services",
    icon: "mdi:file-document",
    link: "/patient/medical-records",
  },
]

onMounted(() => {
  useTitle(title)
})
</script>

<template>
  <div class="flex h-full w-full">
    <!-- Sidebar -->
    <SidebarBase>
      <ul class="h-fit flex flex-col gap-1.5">
        <SidebarItem
          v-for="item in links"
          :key="item.label"
          :label="item.label"
          :icon="item.icon"
          :link="item.link"
          :active="$route.path === item.link"
        />
      </ul>
    </SidebarBase>
	<!-- Make Header Component -->
		<div class="h-full w-full flex flex-col">
			<div class="flex-none p-6 bg-white shadow-sm">
				<div class="flex justify-between">
					<div class="flex items-center gap-4">
						<Button variant="outline" size="icon" @click="sidebarStore.toggleSidebar">
							<Icon name="mdi:menu" />
						</Button>
						<LayoutBreadcrumbs :items="breadcrumbsStore.breadcrumbs" />
					</div>
					<div class="flex items-center gap-2">
						<QRCodeScanner />
						
						<NotificationsPopover />
					</div>
				</div>
			</div>
			<div class="h-full w-full flex flex-col gap-4 p-4 overflow-y-auto">
				<slot />
			</div>
		</div>
    <!-- Main Content Area -->

  </div>
</template>
