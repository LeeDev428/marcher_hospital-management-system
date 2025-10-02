import { verifyRefreshToken } from "@/util/token"
import { getFile } from "@/util/file"

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

		const fileName = getRouterParam(event, "fileName")

		if (!fileName) {
			return {
				success: false,
				message: "No file name provided",
				data: null
			}
		}

		const { success, message, data } = await getFile("files", fileName)

		if (success && data) {
			return {
				success: true,
				message: "File retrieved successfully",
				data: data
			}
		}

		return {
			success: false,
			message: "An error occurred while retrieving the file.",
			data: null
		}
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: "An error occurred while retrieving the file.",
			data: null
		}
	}
})