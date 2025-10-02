<script setup lang="ts">
import { useFileStore } from "@/stores/app"
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import OCRCanvas from "./OCRCanvas.vue"

const fileStore = useFileStore()

const dialogOpen = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const onDialogTrigger = (value: boolean) => {
	dialogOpen.value = value
}

const onSubmit = async () => {
	if (!fileInput.value) return
	const file = fileInput.value.files?.[0]

	if (!file) return
	const uploaded = await fileStore.uploadFile(file)

	if (!uploaded) return
	await fileStore.getFile(uploaded)
}
</script>

<template>
	<Dialog :open="dialogOpen" @update:open="onDialogTrigger">
		<DialogTrigger as-child>
			<Button variant="outline" class="w-fit">
				<Icon name="mdi:camera" />
				Import
			</Button>
		</DialogTrigger>
		<DialogContent class="max-h-[90vh] max-w-[90vw]">
			<DialogHeader>
				<DialogTitle>Data Import</DialogTitle>
			</DialogHeader>
			<DialogDescription>
				Import text from image using OCR.
			</DialogDescription>
			<div class="h-full w-full overflow-y-auto">
				<div class="h-full w-full p-4 flex flex-col gap-4 rounded-lg">
					<div class="flex flex-col gap-2 items-center justify-center h-full w-full">
						<div v-if="fileStore.fileUrl" class="relative w-full max-h-[70vh] flex items-center justify-center">
							<OCRCanvas :image-url="fileStore.fileUrl" />
						</div>
						<form v-else class="flex flex-col gap-2" @submit.prevent="onSubmit">
							<input ref="fileInput" type="file" accept="image/*" class="p-2 bg-white rounded-md border" />
							<Button type="submit">Import</Button>
						</form>
					</div>
				</div>
			</div>
		</DialogContent>
	</Dialog>
</template>