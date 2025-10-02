<script setup lang="ts">
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
</script>

<template>
	<Popover>
		<PopoverTrigger as-child>
			<Button variant="outline" size="icon">
				<Icon name="mdi:bell" />
			</Button>
		</PopoverTrigger>
		<PopoverContent class="w-fit p-2.5 flex flex-col gap-2">
			<p class="text-sm font-medium">Notifications</p>
			<Tabs class="w-[350px]">
				<TabsList class="w-full">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="unread">Unread</TabsTrigger>
				</TabsList>
				<TabsContent value="all">
					<div>
						<p>All</p>
					</div>
				</TabsContent>
				<TabsContent value="unread">
					<div>
						<p>Unread</p>
					</div>
				</TabsContent>
			</Tabs>
		</PopoverContent>
	</Popover>
</template>