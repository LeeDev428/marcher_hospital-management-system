<script setup lang="ts">
import { TypedInput } from "@/components/app/form"
</script>

<template>
	<div class="flex flex-col gap-4">
		<TypedInput
			name="consent.documentUrl"
			label="Document URL"
			type="text"
			required
		/>
		<TypedInput
			name="consent.signature"
			label="Signature"
			type="text"
			required
		/>
	</div>
</template>
