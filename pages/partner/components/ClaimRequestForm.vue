<script setup lang="ts">
import { usePartnerClaimRequestStore, usePartnerStore } from "@/stores/partner"
import { createPartnerClaimRequestSchema, updatePartnerClaimRequestSchema } from "@/types/partner"
import type { CreatePartnerClaimRequest, UpdatePartnerClaimRequest } from "@/types/partner"
import { TypedForm, TypedInput, TypedSelect, TypedNumber, TypedTextarea } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const claimRequestStore = usePartnerClaimRequestStore()
const partnerStore = usePartnerStore()

const props = defineProps<{
  claimRequestId?: string
}>()

const partnerOptions = computed(() =>
  partnerStore.partners.map(partner => ({
    label: partner.organizationName,
    value: partner.id,
  }))
)

const statusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Processing", value: "PROCESSING" },
]

const onSubmit = async (data: CreatePartnerClaimRequest | UpdatePartnerClaimRequest) => {
  if (props.claimRequestId) {
    const result = await claimRequestStore.updateClaimRequest({
      id: props.claimRequestId,
      ...data,
    })
    if (result.success) {
      console.log("Redirecting to /partner/claim-requests")
    }
  } else {
    const result = await claimRequestStore.createClaimRequest(data)
    if (result.success) {
      console.log("Redirecting to /partner/claim-requests")
    }
  }
}

onMounted(async () => {
  await partnerStore.getPartners()
  if (props.claimRequestId) {
    await claimRequestStore.getClaimRequest({ id: props.claimRequestId })
  }
})
</script>

<template>
  <TypedForm
    :schema="props.claimRequestId ? updatePartnerClaimRequestSchema : createPartnerClaimRequestSchema"
    :initial-values="props.claimRequestId ? claimRequestStore.claimRequest || {} : {}"
    @submit="onSubmit"
  >
    <TypedSelect 
      name="partnerId" 
      label="Partner" 
      :options="partnerOptions" 
      placeholder="Select Partner" 
    />
    
    <TypedInput 
      name="branchId" 
      label="Branch ID" 
      type="text" 
      placeholder="Branch ID" 
    />
    
    <TypedInput 
      name="encounterId" 
      label="Encounter ID" 
      type="text" 
      placeholder="Encounter ID" 
    />
    
    <TypedSelect
      name="status"
      label="Status"
      :options="statusOptions"
      placeholder="Select Status"
    />
    
    <TypedTextarea
      name="description"
      label="Description"
      placeholder="Enter description"
    />
    
    <Button type="submit">
      {{ props.claimRequestId ? "Update Claim Request" : "Create Claim Request" }}
    </Button>
  </TypedForm>
</template>