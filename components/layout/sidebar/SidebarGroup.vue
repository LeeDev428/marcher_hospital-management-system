<script setup lang="ts">
import { Button } from "@/components/ui/button"

type Props = {
	label: string
	icon: string
	items: { label: string; link: string }[]
}

const props = defineProps<Props>()
const route = useRoute()
const isActive = computed(() => {
	return props.items.some((item) => route.path === item.link)
})

const buttonStyle = "flex items-center gap-2 rounded-lg transition-colors py-3 px-4 w-full justify-between"

const childStyle = computed(() => {
	return `
		flex items-center gap-2 py-1.5 px-4 ml-4 rounded-lg transition-colors text-sm
		${isActive.value ? 'bg-emerald-900 text-white' : 'text-zinc-900'}
		${isActive.value ? 'hover:bg-emerald-900' : 'hover:bg-zinc-100'}
		${isActive.value ? 'hover:text-white' : 'hover:text-zinc-900'}
	`
})

const isOpen = ref(false)
</script>

<template>
	<div>
		<Button variant="ghost" :class="buttonStyle" @click="isOpen = !isOpen">
			<div class="flex items-center gap-2">
				<Icon :name="icon" size="18" />
				<span>{{ label }}</span>
			</div>
			<Icon :name="isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'" size="18" />
		</Button>
		<div v-if="isOpen" class="flex flex-col gap-1 mt-1">
			<NuxtLink 
				v-for="item in items" 
				:key="item.label" 
				:to="item.link" 
				:class="childStyle"
			>
				<span>{{ item.label }}</span>
			</NuxtLink>
		</div>
	</div>
</template> 