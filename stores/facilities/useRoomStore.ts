import { defineStore } from "pinia"
import type { TableRoom, CreateRoom, UpdateRoom } from "@/types/facilities"
import { useToast } from "@/composables/useToast"

export const useRoomStore = defineStore("room", {
	state: () => ({
		loading: true,
		rooms: [] as TableRoom[],
		room: null as CreateRoom | UpdateRoom | null,
	}),

	actions: {
		async getRooms() {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.facilities.rooms.getRooms.query()

				if (success && data) {
					this.rooms = data
					this.loading = false
					return {
						success,
						message,
						data,
					}
				}
			} catch (error) {
				this.loading = false
				console.log(error)
				useToast(
					"error",
					"Rooms",
					"Failed to fetch rooms.",
				)
			}
		},

		async getRoom(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.facilities.rooms.getRoom.query({ id })

				if (success && data) {
					this.room = data
					this.loading = false
					return {
						success,
						message,
						data,
					}
				}

				this.loading = false
				return {
					success,
					message,
					data,
				}
			} catch (error) {
				this.loading = false
				console.log(error)
				useToast(
					"error",
					"Room",
					"Failed to fetch room.",
				)
			}
		},

		async createRoom(room: CreateRoom) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.facilities.rooms.createRoom.mutate(room)

				if (success && data) {
					this.room = data
					this.loading = false
					useToast(
						"success",
						"Room",
						"Room created successfully.",
					)
					await navigateTo("/facilities")
				}

				this.loading = false
				useToast(
					"error",
					"Room",
					message,
				)
			} catch (error) {
				this.loading = false
				console.log(error)
				useToast(
					"error",
					"Room",
					"Failed to create room.",
				)
				console.log("toast")
			}
		},

		async updateRoom(room: UpdateRoom) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.facilities.rooms.updateRoom.mutate(room)

				if (success && data) {
					this.room = data
					this.loading = false
					useToast(
						"success",
						"Room",
						"Room updated successfully.",
					)
					await navigateTo("/facilities")
				}

				this.loading = false
				return {
					success,
					message,
					data,
				}
			} catch (error) {
				this.loading = false
				console.log(error)
				useToast(
					"error",
					"Room",
					"Failed to update room.",
				)
			}
		},

		async deleteRoom(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.facilities.rooms.deleteRoom.mutate({ id })

				if (success && data) {
					this.rooms = this.rooms.filter((room) => room.id !== id)
					this.loading = false
					useToast(
						"success",
						"Room",
						"Room deleted successfully.",
					)
				}

				this.loading = false
				return {
					success,
					message,
					data,
				}
			} catch (error) {
				this.loading = false
				console.log(error)
				useToast(
					"error",
					"Room",
					"Failed to delete room.",
				)
			}
		},
	},
})
