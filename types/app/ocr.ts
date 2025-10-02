import type { Rectangle } from "tesseract.js"

export interface OCRRectangle {
	rectangle: Rectangle
	field: string
}

export interface OCRLayout {
	id: string
	name: string
	rectangles: OCRRectangle[]
	createdAt: string
}
