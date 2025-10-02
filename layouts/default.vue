<script setup lang="ts">
import { useTitle } from "@vueuse/core"

const props = defineProps<{
	title?: string
}>()

onMounted(() => {
	if (props.title) {
		useTitle(props.title)
	}
})
</script>

<template>
	<div class="min-h-screen w-full bg-[#ebece8]">
		<slot />
	</div>
</template>