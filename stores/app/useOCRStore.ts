import { defineStore } from "pinia"
import { createWorker } from "tesseract.js"
import { useToast } from "@/composables/useToast"
import type { OCRRectangle, OCRLayout } from "@/types/app"

export const useOCRStore = defineStore("ocr", {
	state: () => ({
		imageUrl: null as string | null,
		rectangles: [] as OCRRectangle[],
		progress: 0,
		extractedText: [] as string[],
		layouts: [] as OCRLayout[],
	}),

	actions: {
		setImageUrl(url: string) {
			this.imageUrl = url
		},

		async addRectangle(rectangle: OCRRectangle) {
			this.rectangles.push(rectangle)
		},

		async updateRectangle(index: number, rectangle: OCRRectangle) {
			if (this.rectangles[index]) {
				this.rectangles[index] = rectangle
			}
		},

		async removeRectangle(index: number) {
			this.rectangles.splice(index, 1)
		},

		clearData() {
			this.extractedText = []
		},

		// Layout management methods
		saveLayout(name: string) {
			if (!name.trim()) {
				useToast("error", "Layout", "Please provide a layout name.")
				return
			}

			if (this.rectangles.length === 0) {
				useToast("error", "Layout", "Please add at least one rectangle before saving a layout.")
				return
			}

			const layout: OCRLayout = {
				id: Date.now().toString(),
				name: name.trim(),
				rectangles: JSON.parse(JSON.stringify(this.rectangles)), // Deep copy
				createdAt: new Date().toISOString(),
			}

			this.layouts.push(layout)
			useToast("success", "Layout", `Layout "${name}" saved successfully.`)
		},

		loadLayout(layoutId: string) {
			const layout = this.layouts.find(l => l.id === layoutId)
			if (!layout) {
				useToast("error", "Layout", "Layout not found.")
				return
			}

			this.rectangles = JSON.parse(JSON.stringify(layout.rectangles)) // Deep copy
			this.extractedText = [] // Clear extracted text when loading new layout
			useToast("success", "Layout", `Layout "${layout.name}" loaded successfully.`)
		},

		deleteLayout(layoutId: string) {
			const index = this.layouts.findIndex(l => l.id === layoutId)
			if (index === -1) {
				useToast("error", "Layout", "Layout not found.")
				return
			}

			const layoutName = this.layouts[index].name
			this.layouts.splice(index, 1)
			useToast("success", "Layout", `Layout "${layoutName}" deleted successfully.`)
		},

		async recognizeText() {
			if (!this.rectangles.length) {
				useToast(
					"error",
					"OCR",
					"Please add at least one rectangle to the image."
				)
				return
			}

			if (!this.imageUrl) {
				useToast(
					"error",
					"OCR",
					"Please upload an image to extract text from."
				)
				return
			}

			try {
				// Clear previous results
				this.extractedText = []
				this.progress = 0
				
				const worker = await createWorker("eng", 1)
					
				for (const [index, { field, rectangle }] of this.rectangles.entries()) {
					const { data } = await worker.recognize(this.imageUrl, {
						rectangle: {
							left: rectangle.left,
							top: rectangle.top,
							width: rectangle.width,
							height: rectangle.height
						}
					})

					// Store the extracted text
					this.extractedText.push(data.text.trim())
					this.progress = (index + 1) / this.rectangles.length * 100
				}

				await worker.terminate()
				
				useToast(
					"success",
					"OCR",
					`Successfully extracted text from ${this.extractedText.length} rectangle(s).`
				)
			} catch (error) {
				console.error(error)
				useToast(
					"error",
					"OCR",
					"Failed to extract text from image."
				)
			}
		},
	},
	
	persist: {
		key: "ocr",
		pick: ["layouts"]
	}
})