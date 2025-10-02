<script setup lang="ts">
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import tenant from "@/tenant.json"
const currentTenantId = ref(tenant.instances[0].id)
const currentTenant = computed(() => tenant.instances.filter(instance => instance.id === currentTenantId.value)[0])
</script>

<template>
	<div class="w-full flex items-center gap-2">
		<DropdownMenu>
			<DropdownMenuTrigger as-child>
				<Button variant="outline" class="h-fit w-full p-1.5 justify-start">
					<div class="h-full w-full pr-2 gap-2 flex items-center justify-between">
						<div class="w-10 h-10 flex items-center justify-center rounded bg-gray-200">
							<Icon name="mdi:office-building" size="20" />
						</div>
						<div class="flex flex-1 flex-col text-left">
							<p class="text-sm font-medium">{{ tenant.name }}</p>
							<p class="text-xs text-gray-500">{{ currentTenant.name }}</p>
						</div>
						<Icon name="mdi:chevron-down" />
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>{{ tenant.name }}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup v-model="currentTenantId">
					<DropdownMenuRadioItem v-for="instance in tenant.instances" :key="instance.id" :value="instance.id">
						{{ instance.name }}
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
</template>