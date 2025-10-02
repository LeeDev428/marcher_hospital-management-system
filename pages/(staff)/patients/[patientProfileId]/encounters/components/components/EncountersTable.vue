<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import InpatientTable from "./InpatientTable.vue"
import OutpatientTable from "./OutpatientTable.vue"
</script>

<template>
	<div class="h-full w-full flex flex-col gap-4">
		<Tabs default-value="inpatient">
			<TabsList class="mb-4 gap-1">
				<TabsTrigger value="inpatient" class="hover:bg-zinc-200"
					>Inpatient</TabsTrigger
				>
				<TabsTrigger value="outpatient" class="hover:bg-zinc-200"
					>Outpatient</TabsTrigger
				>
			</TabsList>
			<TabsContent value="inpatient">
				<InpatientTable />
			</TabsContent>
			<TabsContent value="outpatient">
				<OutpatientTable />
			</TabsContent>
		</Tabs>
	</div>
</template>
