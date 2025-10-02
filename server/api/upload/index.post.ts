import { verifyRefreshToken } from "@/util/token"
import { uploadFile } from "@/util/file"

const MAX_FILE_SIZE = 25 * 1024 * 1024
const ALLOWED_FILE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/jpg",
]

export default defineEventHandler(async (event) => {
	try {
		const refreshToken = getCookie(event, "refreshToken")

		if (!refreshToken) {
			return {
				success: false,
				message: "You are not logged in.",
				data: null
			}
		}

		const decodedRefreshToken = verifyRefreshToken(refreshToken)

		if (!decodedRefreshToken) {
			return {
				success: false,
				message: "Invalid session. Please login again.",
				data: null
			}
		}

		const formData = await readMultipartFormData(event)

		if (!formData || formData.length === 0) {
			return {
				success: false,
				message: "No file uploaded",
				data: null
			}
		}

		const file = formData[0]

		if (file.data.length > MAX_FILE_SIZE) {
			return {
				success: false,
				message: "File size exceeds 25MB",
				data: null
			}
		}

		if (!file.type || !ALLOWED_FILE_TYPES.includes(file.type)) {
			return {
				success: false,
				message: `Invalid file type: ${file.type}`,
				data: null
			}
		}

		if (!file.filename) {
			return {
				success: false,
				message: "No file name provided",
				data: null
			}
		}

		const fileName = `${Date.now()}-${file.filename}`

		const { success, message, data } = await uploadFile("files", {
			data: file.data,
			name: fileName,
			type: file.type,
			size: file.data.length
		})

		return {
			success,
			message,
			data: fileName
		}
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: "An unknown error occurred while uploading the file.",
			data: null
		}
	}
})
