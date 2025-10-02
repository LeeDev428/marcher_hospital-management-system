<script setup lang="ts">
import "@whoicd/icd11ect/style.css"
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const emit = defineEmits<{
	(e: "select", data: any): void
}>()
const dialogOpen = ref<boolean>(false)

let ECT: any = null
const ECTLoaded = ref<boolean>(false)
const iNo = ref(0)
const settings = {
	apiServerUrl: "https://icd11restapi-developer-test.azurewebsites.net",
	autoBind: false,
}

const onSelectEntity = (data: any) => {
	emit("select", data)
	dialogOpen.value = false
}

const onDialogTrigger = async (value: boolean) => {
	dialogOpen.value = value
	if (value) {
		ECT = await import("@whoicd/icd11ect")

		if (!ECTLoaded.value) {
			ECT.Handler.configure(settings, {
				selectedEntityFunction: onSelectEntity,
			})
			ECTLoaded.value = true
		}

		if (ECTLoaded.value) {
			ECT.Handler.bind(iNo.value)
		}
	}
}
</script>

<template>
	<Dialog :open="dialogOpen" @update:open="onDialogTrigger">
		<DialogTrigger as-child>
			<Button variant="outline">
				<Icon name="mdi:search" class="text-lg" />
				Search ICD
			</Button>
		</DialogTrigger>
		<DialogContent class="max-h-4/5 max-w-4/5 overflow-auto">
			<DialogHeader>
				<DialogTitle>ICD Database</DialogTitle>
			</DialogHeader>
			<DialogDescription>
				Search for a ICD code to add to the encounter.
			</DialogDescription>
			<div class="flex flex-col gap-2">
				<input
					type="text"
					class="ctw-input px-2 py-1 bg-white border rounded-md"
					autocomplete="off"
					placeholder="Search for a ICD code"
					:data-ctw-ino="iNo"
				/>
				<div class="ctw-window" :data-ctw-ino="iNo" />
			</div>
		</DialogContent>
	</Dialog>
</template>
