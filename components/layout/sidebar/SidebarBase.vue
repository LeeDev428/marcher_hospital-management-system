<script setup lang="ts">
import SidebarHeader from "./SidebarHeader.vue"
import SidebarFooter from "./SidebarFooter.vue"
</script>

<template>
	<nav class="h-full w-full max-w-xs flex flex-col gap-4 p-4 shadow-md bg-white border-r border-gray-200">
		<SidebarHeader />
		<div class="h-full w-full py-4 flex flex-col gap-4 border-t border-b border-gray-200 overflow-y-auto">
			<div class="h-fit w-full flex flex-col gap-4">
				<slot />
			</div>
		</div>
		<SidebarFooter />
	</nav>
</template>