<template>
	<div class="container mx-auto p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Particulars Catalogue</h1>
				<p class="text-muted-foreground">Manage billing items and services</p>
			</div>
			<Button @click="openCreateDialog">
				<Plus class="mr-2 h-4 w-4" />
				Add Particular
			</Button>
		</div>

		<!-- Filters -->
		<Card>
			<CardHeader>
				<CardTitle>Filters</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="grid gap-4 md:grid-cols-3">
					<div>
						<Label>Search</Label>
						<Input v-model="filters.search" placeholder="Search name..." @input="loadParticulars" />
					</div>
					<div>
						<Label>Type</Label>
						<Select v-model="filters.type" @update:modelValue="loadParticulars">
							<SelectTrigger>
								<SelectValue placeholder="All types" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ALL">All</SelectItem>
								<SelectItem value="PRESCRIPTION">Prescription</SelectItem>
								<SelectItem value="LABORATORY">Laboratory</SelectItem>
								<SelectItem value="RADIOLOGY">Radiology</SelectItem>
								<SelectItem value="OPERATION">Operation</SelectItem>
								<SelectItem value="PROCEDURE">Procedure</SelectItem>
								<SelectItem value="OTHER">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label>Status</Label>
						<Select v-model="filters.isActive">
							<SelectTrigger>
								<SelectValue placeholder="All" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ALL">All</SelectItem>
								<SelectItem value="true">Active</SelectItem>
								<SelectItem value="false">Inactive</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Particulars Table -->
		<Card>
			<CardHeader>
				<CardTitle>Catalogue Items ({{ particulars.length }})</CardTitle>
			</CardHeader>
			<CardContent>
				<div v-if="loading" class="flex justify-center py-8">
					<div class="text-muted-foreground">Loading...</div>
				</div>
				<div v-else-if="particulars.length === 0" class="text-center py-8 text-muted-foreground">
					No particulars found
				</div>
				<div v-else class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b">
								<th class="text-left p-3">Name</th>
								<th class="text-left p-3">Type</th>
								<th class="text-left p-3">Description</th>
								<th class="text-right p-3">Cost</th>
								<th class="text-center p-3">Status</th>
								<th class="text-center p-3">Actions</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in particulars" :key="item.id" class="border-b hover:bg-muted/50">
								<td class="p-3 font-medium">{{ item.name }}</td>
								<td class="p-3">
									<Badge variant="outline">{{ item.type }}</Badge>
								</td>
								<td class="p-3 text-sm text-muted-foreground">{{ item.description || "-" }}</td>
								<td class="p-3 text-right font-semibold">₱{{ formatCost(item.cost) }}</td>
								<td class="p-3 text-center">
									<Badge :variant="item.isActive ? 'default' : 'secondary'">
										{{ item.isActive ? "Active" : "Inactive" }}
									</Badge>
								</td>
								<td class="p-3 text-center">
									<div class="flex justify-center gap-2">
										<Button @click="openEditDialog(item)" size="sm" variant="outline">Edit</Button>
										<Button
											@click="toggleStatus(item)"
											size="sm"
											:variant="item.isActive ? 'secondary' : 'default'"
										>
											{{ item.isActive ? "Deactivate" : "Activate" }}
										</Button>
										<Button @click="deleteParticular(item.id)" size="sm" variant="destructive">
											Delete
										</Button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>

		<!-- Create/Edit Dialog -->
		<Dialog v-model:open="showDialog">
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{{ isEditing ? "Edit" : "Add" }} Particular</DialogTitle>
					<DialogDescription>
						{{ isEditing ? "Update" : "Create a new" }} billing catalogue item
					</DialogDescription>
				</DialogHeader>
				<form @submit.prevent="saveParticular" class="space-y-4">
					<div>
						<Label>Type*</Label>
						<Select v-model="form.type" required>
							<SelectTrigger>
								<SelectValue placeholder="Select type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="PRESCRIPTION">Prescription</SelectItem>
								<SelectItem value="LABORATORY">Laboratory</SelectItem>
								<SelectItem value="RADIOLOGY">Radiology</SelectItem>
								<SelectItem value="OPERATION">Operation</SelectItem>
								<SelectItem value="PROCEDURE">Procedure</SelectItem>
								<SelectItem value="OTHER">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label>Name*</Label>
						<Input v-model="form.name" placeholder="Item name" required />
					</div>

					<div>
						<Label>Description</Label>
						<Textarea v-model="form.description" placeholder="Optional description" />
					</div>

					<div>
						<Label>Cost (₱)*</Label>
						<Input v-model.number="form.cost" type="number" min="0" step="0.01" required />
					</div>

					<div class="flex items-center gap-2">
						<input type="checkbox" v-model="form.isActive" id="isActive" class="h-4 w-4" />
						<Label for="isActive" class="cursor-pointer">Active</Label>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" @click="showDialog = false">Cancel</Button>
						<Button type="submit" :disabled="submitting">
							{{ submitting ? "Saving..." : isEditing ? "Update" : "Create" }}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Plus } from "lucide-vue-next"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import { Badge } from "~/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"

definePageMeta({
	layout: "billing-staff",
})

const { $trpc } = useNuxtApp()

const loading = ref(false)
const submitting = ref(false)
const showDialog = ref(false)
const isEditing = ref(false)
const particulars = ref<any[]>([])

const filters = ref({
	search: "",
	type: "ALL",
	isActive: "ALL" as any,
})

const form = ref({
	id: "",
	type: "PRESCRIPTION" as "PRESCRIPTION" | "LABORATORY" | "PROCEDURE" | "RADIOLOGY" | "OPERATION" | "OTHER",
	name: "",
	description: "",
	cost: 0,
	isActive: true,
})

onMounted(() => {
	loadParticulars()
})

async function loadParticulars() {
	loading.value = true
	try {
		const queryFilters: any = {}
		if (filters.value.search) queryFilters.search = filters.value.search
		if (filters.value.type && filters.value.type !== "ALL") queryFilters.type = filters.value.type
		if (filters.value.isActive !== "ALL") queryFilters.isActive = filters.value.isActive === "true"

		const response = await $trpc.encounters.particulars.getParticularCatalogues.query(queryFilters)
		if (response.success && response.data) {
			particulars.value = response.data
		}
	} catch (error) {
		console.error("Failed to load particulars:", error)
		useToast("error", "Error", "Failed to load catalogue items")
	} finally {
		loading.value = false
	}
}

function openCreateDialog() {
	isEditing.value = false
	form.value = {
		id: "",
		type: "PRESCRIPTION",
		name: "",
		description: "",
		cost: 0,
		isActive: true,
	}
	showDialog.value = true
}

function openEditDialog(item: any) {
	isEditing.value = true
	form.value = {
		id: item.id,
		type: item.type,
		name: item.name,
		description: item.description || "",
		cost: item.cost,
		isActive: item.isActive,
	}
	showDialog.value = true
}

async function saveParticular() {
	submitting.value = true
	try {
		if (isEditing.value) {
			const response = await $trpc.encounters.particulars.updateParticularCatalogue.mutate(form.value)
			if (response.success) {
				useToast("success", "Success", "Particular updated successfully")
				showDialog.value = false
				await loadParticulars()
			} else {
				useToast("error", "Error", response.message || "Failed to update particular")
			}
		} else {
			const { id, ...createData } = form.value
			const response = await $trpc.encounters.particulars.createParticularCatalogue.mutate(createData)
			if (response.success) {
				useToast("success", "Success", "Particular created successfully")
				showDialog.value = false
				await loadParticulars()
			} else {
				useToast("error", "Error", response.message || "Failed to create particular")
			}
		}
	} catch (error: any) {
		useToast("error", "Error", error.message || "An error occurred")
	} finally {
		submitting.value = false
	}
}

async function toggleStatus(item: any) {
	submitting.value = true
	try {
		const response = await $trpc.encounters.particulars.updateParticularCatalogue.mutate({
			id: item.id,
			isActive: !item.isActive,
		})
		if (response.success) {
			useToast("success", "Success", `Particular ${!item.isActive ? "activated" : "deactivated"}`)
			await loadParticulars()
		} else {
			useToast("error", "Error", response.message || "Failed to update status")
		}
	} catch (error: any) {
		useToast("error", "Error", error.message || "An error occurred")
	} finally {
		submitting.value = false
	}
}

async function deleteParticular(id: string) {
	if (!confirm("Are you sure you want to delete this particular? This action cannot be undone.")) {
		return
	}

	submitting.value = true
	try {
		const response = await $trpc.encounters.particulars.deleteParticularCatalogue.mutate({ id })
		if (response.success) {
			useToast("success", "Success", "Particular deleted successfully")
			await loadParticulars()
		} else {
			useToast("error", "Error", response.message || "Failed to delete particular")
		}
	} catch (error: any) {
		useToast("error", "Error", error.message || "An error occurred")
	} finally {
		submitting.value = false
	}
}

function formatCost(cost: number) {
	return cost.toFixed(2)
}
</script>
