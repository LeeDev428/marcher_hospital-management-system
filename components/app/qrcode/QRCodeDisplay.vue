<script setup lang="ts">
import QRCode from "qrcode"
import { useToast } from "@/composables/useToast"

type QRCodeData = {
	entity: string
	id: string
}

const canvas = ref<HTMLCanvasElement | null>(null)
const props = defineProps<{
	data: QRCodeData
}>()

onMounted(async () => {
	if (!canvas.value) return

	try {
		QRCode.toCanvas(canvas.value, JSON.stringify(props.data))
	} catch (error) {
		console.error(error)
		useToast(
			"error",
			"QR Code",
			"Failed to generate QR Code.",
		)
	}
})
</script>

<template>
	<div class="h-fit w-fit flex items-center justify-center p-1 rounded-md shadow-md bg-white">
		<canvas ref="canvas" class="h-[100px] w-[100px]" />
	</div>
</template>