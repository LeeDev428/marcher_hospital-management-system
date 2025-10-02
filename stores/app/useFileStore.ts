import { defineStore } from "pinia"

export const useFileStore = defineStore("file", {
	state: () => ({
		loading: false,
		fileUrl: null as string | null
	}),

	actions: {
		async uploadFile(file: File) {
			try {
				this.loading = true

				const formData = new FormData()
				formData.append("file", file)

				const { success, message, data } = await $fetch("/api/upload", {
					method: "POST",
					body: formData
				})

				if (success && data) {
					return data
				}

				this.loading = false
				return
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Files",
					"An unknown error occurred while uploading the file."
				)
				return
			}
		},

		async getFile(fileName: string) {
			try {
				this.loading = true
				const { success, message, data } = await $fetch(`/api/upload/${fileName}`, {
					method: "GET",
				})

				if (success && data) {
					this.fileUrl = data
					return true
				}

				this.loading = false
				return
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Files",
					"An unknown error occurred while retrieving the file."
				)
				return
			}
		}
	},
})