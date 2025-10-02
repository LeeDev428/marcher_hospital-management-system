<script setup lang="ts">
import QrScanner from "qr-scanner"
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/composables/useToast"

type QRCodeData = {
	entity: string
	id: string
}

let qrScanner: QrScanner | null = null
const dialogOpen = ref(false)
const video = ref<HTMLVideoElement | null>(null)
const onDecode = async (result: QrScanner.ScanResult) => {
	if (!qrScanner) return

	try {
		const parsedData = JSON.parse(result.data) as QRCodeData
		
		if (!parsedData.entity || !parsedData.id) {
			useToast(
				"error",
				"QR Code",
				"Invalid QR Code."
			)
			qrScanner.stop()
			dialogOpen.value = false
			return
		}

		if (parsedData.entity === "patient") {
			await navigateTo(`/patients/${parsedData.id}`)
		}

		if (parsedData.entity === "facility") {
			await navigateTo(`/facilities/${parsedData.id}`)
		}

		if (parsedData.entity === "staff") {
			await navigateTo(`/staff/${parsedData.id}`)
		}

		qrScanner.stop()
		dialogOpen.value = false
	} catch (error) {
		console.error(error)
		useToast(
			"error",
			"QR Code",
			"Invalid QR Code."
		)
		qrScanner.stop()
		dialogOpen.value = false
	}
}

const onDialogTrigger = async (open: boolean) => {
	dialogOpen.value = open
	if (!open) {
		if (!qrScanner) return

		qrScanner.stop()
		qrScanner = null
		return
	}

	// Wait for the dialog to fully open and the video element to be mounted
	await nextTick()
	
	// Add a small delay to ensure the dialog is fully rendered
	await new Promise(resolve => setTimeout(resolve, 100))

	if (!video.value) {
		useToast(
			"error",
			"QR Code",
			"Failed to start QR code scanner. Please try again."
		)
		dialogOpen.value = false
		return
	}

	if (!(await QrScanner.hasCamera())) {
		useToast(
			"error",
			"QR Code",
			"No camera found."
		)
		dialogOpen.value = false
		return
	}

	qrScanner = new QrScanner(video.value, onDecode, {
		returnDetailedScanResult: true,
	})

	qrScanner.start()
}
</script>

<template>
	<Dialog :open="dialogOpen" @update:open="onDialogTrigger">
		<DialogTrigger as-child>
			<Button variant="outline" size="icon">
				<Icon name="mdi:qrcode" class="text-xl" />
			</Button>
		</DialogTrigger>
		<DialogContent class="max-h-[90vh] max-w-[90vw]">
			<DialogHeader>
				<DialogTitle>QR Code Scanner</DialogTitle>
			</DialogHeader>
			<DialogDescription>
				Scan a QR code.
			</DialogDescription>
			<div class="h-full w-full flex flex-col gap-4 rounded-lg overflow-hidden">
				<video ref="video" class="h-full w-full object-cover" />
			</div>
		</DialogContent>
	</Dialog>
</template>