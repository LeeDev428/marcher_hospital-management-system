<script setup lang="ts">
const props = defineProps<{
	label: string
	link: string
	icon: string
	active?: boolean
}>()

const style = computed(() => {
	return `
		flex items-center gap-2 rounded-lg transition-colors py-3 px-4
		${props.active ? 'bg-emerald-900 text-white' : 'text-zinc-900'}
		${props.active ? 'hover:bg-emerald-900' : 'hover:bg-zinc-100'}
		${props.active ? 'hover:text-white' : 'hover:text-zinc-900'}
	`
})
</script>

<template>
	<NuxtLink :to="link" :class="style">
		<Icon v-if="icon" :name="icon" size="18" />
		<span>{{ label }}</span>
	</NuxtLink>
</template>