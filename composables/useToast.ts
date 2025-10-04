import { toast } from "vue-sonner"

type ToastType = "success" | "error" | "info"

export const useToast = (type: ToastType, title: string, description?: string) => {
	switch (type) {
		case "success":
			toast.success(title, {
				description,
				closeButton: true,
				duration: 5000
			})
			break
		case "error":
			toast.error(title, {
				description: description ?? "An unknown error occurred.",
				closeButton: true,
				duration: 5000
			})
			break
		case "info":
			toast.info(title, {
				description,
				closeButton: true,
				duration: 5000
			})
			break
	}
}