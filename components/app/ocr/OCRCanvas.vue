<script setup lang="ts">
import { useOCRStore } from "@/stores/app"
import { useFileStore } from "@/stores/app"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ocrStore = useOCRStore()
const fileStore = useFileStore()
const canvas = ref<HTMLCanvasElement | null>(null)

let drawing = false
let startX = 0
let startY = 0

// Add dragging state
let dragging = false
let dragIndex = -1
let dragOffsetX = 0
let dragOffsetY = 0

// Add maximum display dimensions - increased for better visibility
const MAX_DISPLAY_WIDTH = Math.min(1200, window.innerWidth * 0.8)
const MAX_DISPLAY_HEIGHT = Math.min(900, window.innerHeight * 0.7)

// Store both actual and display dimensions
const actualImageSize = ref({ width: 0, height: 0 })
const displayImageSize = ref({ width: 0, height: 0 })

const selectedRectIndex = ref<number | null>(null)
// Add preview rectangle state
const previewRect = ref<{ left: number; top: number; width: number; height: number } | null>(null)

const props = defineProps<{
	imageUrl: string
}>()

// Load and draw the image on canvas
const loadImage = async (fileUrl: string) => {
	if (!canvas.value) return
	const ctx = canvas.value.getContext("2d")
	const img = new Image()
	img.src = fileUrl
	img.onload = () => {
		// Store actual image dimensions
		actualImageSize.value = { width: img.width, height: img.height }
		
		// Calculate display dimensions while maintaining aspect ratio
		const aspectRatio = img.width / img.height
		let displayWidth = img.width
		let displayHeight = img.height
		
		// Scale down if image is too large
		if (displayWidth > MAX_DISPLAY_WIDTH) {
			displayWidth = MAX_DISPLAY_WIDTH
			displayHeight = displayWidth / aspectRatio
		}
		
		if (displayHeight > MAX_DISPLAY_HEIGHT) {
			displayHeight = MAX_DISPLAY_HEIGHT
			displayWidth = displayHeight * aspectRatio
		}
		
		// Store display dimensions
		displayImageSize.value = { width: displayWidth, height: displayHeight }
		
		// Set canvas internal dimensions to match actual image (for coordinate accuracy)
		canvas.value!.width = img.width
		canvas.value!.height = img.height
		
		// Set canvas display size via CSS
		canvas.value!.style.width = `${displayWidth}px`
		canvas.value!.style.height = `${displayHeight}px`
		
		ctx?.drawImage(img, 0, 0)
	}
}

// Update the scale factors function to use display size
const getScaleFactors = () => {
	if (!canvas.value || !actualImageSize.value.width || !actualImageSize.value.height) {
		return { scaleX: 1, scaleY: 1 }
	}
	
	// Use the actual display size instead of getBoundingClientRect
	const scaleX = actualImageSize.value.width / displayImageSize.value.width
	const scaleY = actualImageSize.value.height / displayImageSize.value.height
	
	return { scaleX, scaleY }
}

// Update getMouseCoords to use display dimensions
const getMouseCoords = (e: MouseEvent) => {
	if (!canvas.value) return { x: 0, y: 0 }
	const rect = canvas.value.getBoundingClientRect()
	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	}
}

// Convert display coordinates to image coordinates
const displayToImageCoords = (displayRect: { left: number; top: number; width: number; height: number }) => {
	const { scaleX, scaleY } = getScaleFactors()
	return {
		left: displayRect.left * scaleX,
		top: displayRect.top * scaleY,
		width: displayRect.width * scaleX,
		height: displayRect.height * scaleY,
	}
}

// Convert image coordinates to display coordinates
const imageToDisplayCoords = (imageRect: { left: number; top: number; width: number; height: number }) => {
	const { scaleX, scaleY } = getScaleFactors()
	return {
		left: imageRect.left / scaleX,
		top: imageRect.top / scaleY,
		width: imageRect.width / scaleX,
		height: imageRect.height / scaleY,
	}
}

// Handle dragging logic
const handleDrag = (e: MouseEvent) => {
	if (!dragging || dragIndex < 0) return
	
	const { x: currX, y: currY } = getMouseCoords(e)
	const newDisplayLeft = currX - dragOffsetX
	const newDisplayTop = currY - dragOffsetY
	
	const currentRect = ocrStore.rectangles[dragIndex]
	const displayRect = imageToDisplayCoords(currentRect.rectangle)
	
	const newDisplayRect = {
		left: newDisplayLeft,
		top: newDisplayTop,
		width: displayRect.width,
		height: displayRect.height,
	}
	
	// Convert back to image coordinates before storing
	const newImageRect = displayToImageCoords(newDisplayRect)
	
	ocrStore.updateRectangle(dragIndex, {
		field: currentRect.field,
		rectangle: newImageRect
	})
}

// End dragging
const handleDragEnd = () => {
	if (dragging) {
		dragging = false
		dragIndex = -1
	}
}

// On mouse down, start drawing a rectangle (only if not clicking on existing rectangle)
const startDraw = (e: MouseEvent) => {
	if (!canvas.value || dragging) return
	const { x, y } = getMouseCoords(e)
	startX = x
	startY = y
	drawing = true
	previewRect.value = null // Clear any existing preview
}

// On mouse move, update temporary overlay rectangle or drag existing rectangle
const draw = (e: MouseEvent) => {
	if (!canvas.value) return
	
	const { x: currX, y: currY } = getMouseCoords(e)

	if (dragging && dragIndex >= 0) {
		handleDrag(e)
	} else if (drawing) {
		// Update preview rectangle (in display coordinates)
		previewRect.value = {
			left: Math.min(startX, currX),
			top: Math.min(startY, currY),
			width: Math.abs(currX - startX),
			height: Math.abs(currY - startY),
		}
	}
}

// On mouse up, finalize the rectangle and store it or end dragging
const endDraw = (e: MouseEvent) => {
	if (dragging) {
		handleDragEnd()
		return
	}

	if (!drawing || !canvas.value) return
	const { x: endX, y: endY } = getMouseCoords(e)

	const displayRect = {
		left: Math.min(startX, endX),
		top: Math.min(startY, endY),
		width: Math.abs(endX - startX),
		height: Math.abs(endY - startY), // Fixed: was endY - startX
	}

	// Convert to image coordinates before storing
	const imageRect = displayToImageCoords(displayRect)

	ocrStore.addRectangle({ field: "", rectangle: imageRect })
	drawing = false
	previewRect.value = null // Clear preview after finalizing
}

// Start dragging an existing rectangle
const startDrag = (e: MouseEvent, index: number) => {
	e.stopPropagation()
	if (!canvas.value) return
	
	const { x: currX, y: currY } = getMouseCoords(e)
	
	const rectData = ocrStore.rectangles[index]
	const displayRect = imageToDisplayCoords(rectData.rectangle)
	
	dragOffsetX = currX - displayRect.left
	dragOffsetY = currY - displayRect.top
	
	dragging = true
	dragIndex = index
	selectedRectIndex.value = index
}

// Select and remove rectangles
const selectRect = (index: number) => {
	selectedRectIndex.value = index
}
const removeRect = (index: number) => {
	ocrStore.removeRectangle(index)
}

const recognizeText = async () => {
	ocrStore.setImageUrl(props.imageUrl)
	await ocrStore.recognizeText()
}

// Copy to clipboard function
const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text)
		useToast("success", "Copied", "Text copied to clipboard")
	} catch (err) {
		console.error('Failed to copy text: ', err)
		useToast("error", "Copy Failed", "Failed to copy text to clipboard")
	}
}

// Clear image function
const clearImage = () => {
	fileStore.fileUrl = null
	ocrStore.imageUrl = null
	ocrStore.rectangles = []
	ocrStore.extractedText = []
}

// Layout management
const layoutName = ref('')
const selectedLayoutId = ref('')

const saveCurrentLayout = () => {
	if (layoutName.value.trim()) {
		ocrStore.saveLayout(layoutName.value)
		layoutName.value = ''
	}
}

const loadSelectedLayout = () => {
	if (selectedLayoutId.value) {
		ocrStore.loadLayout(selectedLayoutId.value)
		selectedLayoutId.value = ''
	}
}

const deleteSelectedLayout = () => {
	if (selectedLayoutId.value) {
		ocrStore.deleteLayout(selectedLayoutId.value)
		selectedLayoutId.value = ''
	}
}

// Load image
watchEffect(() => {
	if (props.imageUrl) loadImage(props.imageUrl)
})
</script>

<template>
	<div class="h-full w-full flex flex-col xl:flex-row gap-4 overflow-hidden">
		<!-- Layout Management Section -->
		<div class="w-full xl:w-80 xl:flex-shrink-0 flex flex-col">
			<div class="border rounded-lg p-4 bg-gray-50 h-full">
				<h3 class="text-lg font-semibold mb-4">Layout Management</h3>
				
				<!-- Save Layout -->
				<div class="space-y-2 mb-4">
					<label class="text-sm font-medium">Save Current Layout</label>
					<div class="flex gap-2">
						<Input 
							v-model="layoutName" 
							placeholder="Enter layout name" 
							class="flex-1"
							@keyup.enter="saveCurrentLayout"
						/>
						<Button @click="saveCurrentLayout" :disabled="!layoutName.trim()" size="sm">
							Save
						</Button>
					</div>
				</div>
				
				<!-- Load/Delete Layout -->
				<div v-if="ocrStore.layouts.length > 0" class="space-y-2">
					<label class="text-sm font-medium">Manage Saved Layouts</label>
					<div class="space-y-2">
						<Select v-model="selectedLayoutId">
							<SelectTrigger>
								<SelectValue placeholder="Select a layout" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem 
									v-for="layout in ocrStore.layouts" 
									:key="layout.id" 
									:value="layout.id"
								>
									{{ layout.name }} ({{ new Date(layout.createdAt).toLocaleDateString() }})
								</SelectItem>
							</SelectContent>
						</Select>
						<div class="flex gap-2">
							<Button @click="loadSelectedLayout" :disabled="!selectedLayoutId" variant="outline" size="sm" class="flex-1">
								Load
							</Button>
							<Button @click="deleteSelectedLayout" :disabled="!selectedLayoutId" variant="destructive" size="sm" class="flex-1">
								Delete
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Canvas Section -->
		<div class="flex-1 flex flex-col min-w-0 min-h-0">
			<!-- Canvas Area -->
			<div class="relative flex-1 overflow-auto border rounded-lg mb-4">
				<canvas
					ref="canvas"
					class="block"
					@mousedown="startDraw"
					@mousemove="draw"
					@mouseup="endDraw"
				/>

				<!-- Preview rectangle (shown while drawing) -->
				<div
					v-if="previewRect && drawing"
					class="absolute border-2 border-dashed border-yellow-500 bg-yellow-200/20 pointer-events-none"
					:style="{
						left: `${previewRect.left}px`,
						top: `${previewRect.top}px`,
						width: `${previewRect.width}px`,
						height: `${previewRect.height}px`,
					}"
				/>

				<!-- Rectangle overlays (interactive) - converted to display coordinates -->
				<div
					v-for="(rect, index) in ocrStore.rectangles"
					:key="index"
					class="absolute border-2 border-blue-500 bg-blue-200/20 cursor-move"
					:class="{ 'border-green-500 bg-green-200/20': selectedRectIndex === index }"
					:style="{
						...(() => {
							const displayRect = imageToDisplayCoords(rect.rectangle)
							return {
								left: `${displayRect.left}px`,
								top: `${displayRect.top}px`,
								width: `${displayRect.width}px`,
								height: `${displayRect.height}px`,
							}
						})()
					}"
					@mousedown="startDrag($event, index)"
					@mousemove="handleDrag"
					@mouseup="handleDragEnd"
					@click.stop="selectRect(index)"
				>
					<button
						class="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
						@click.stop="removeRect(index)"
					>
						✕
					</button>
				</div>
			</div>
			
			<!-- Canvas Controls -->
			<div class="flex gap-2 flex-shrink-0">
				<Button @click="recognizeText" class="w-fit">Recognize Text</Button>
				<Button @click="clearImage" variant="outline" class="w-fit">Clear Image</Button>
			</div>
		</div>

		<!-- Recognized Text Section -->
		<div class="w-full xl:w-80 xl:flex-shrink-0 flex flex-col min-h-0">
			<div class="border rounded-lg p-4 h-full flex flex-col">
				<h3 class="text-lg font-semibold mb-4 flex-shrink-0">Recognized Text</h3>
				
				<div class="flex-1 min-h-0 overflow-y-auto">
					<div v-if="ocrStore.extractedText.length === 0" class="text-gray-500 text-sm">
						No text recognized yet. Add rectangles and click "Recognize Text".
					</div>
					
					<div v-else class="space-y-3">
						<div 
							v-for="(text, index) in ocrStore.extractedText" 
							:key="index"
							class="border rounded p-3 bg-gray-50"
						>
							<div class="text-sm mb-2 break-words">{{ text || '(No text found)' }}</div>
							<Button 
								size="sm" 
								variant="outline"
								@click="copyToClipboard(text)"
								:disabled="!text"
							>
								<Icon name="mdi:content-copy" class="w-4 h-4 mr-1" />
								Copy
							</Button>
						</div>
					</div>
				</div>
				
				<div v-if="ocrStore.extractedText.length > 0" class="mt-4 flex-shrink-0">
					<Button @click="ocrStore.clearData()" variant="outline" class="w-full">Clear</Button>
				</div>
			</div>
		</div>
	</div>
</template>
