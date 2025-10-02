<script setup lang="ts">
import { useTransactionStore } from "@/stores/billing"
import {
  createTransactionSchema,
  updateTransactionSchema,
  type CreateTransaction,
  type UpdateTransaction,
  transactionStatusOptions,
} from "@/types/billing"
import { TypedForm, TypedSelect, TypedInput } from "@/components/app/form"
import { Button } from "@/components/ui/button"
import { useInpatientStore,useOutpatientStore } from "~/stores/encounters"



const transactionStore = useTransactionStore()
const inpatientStore = useInpatientStore()
const outpatientStore = useOutpatientStore()

const props = defineProps<{
  transactionId?: string
}>()


const encounterOptions = ref([])

const onSubmit = async (values: CreateTransaction | UpdateTransaction) => {
  if (props.transactionId) {
    await transactionStore.updateTransaction({
      id: props.transactionId,
      ...values,
    })
  } else {
    await transactionStore.createTransaction(values)
  }
}

onMounted(async () => {
  if (props.transactionId) {
    await transactionStore.getTransaction(props.transactionId)
  }
  await inpatientStore.getInpatientEncounters()
  await outpatientStore.getOutpatientEncounters()
  encounterOptions.value = [
    ...inpatientStore.inpatientEncounters.map(encounter => ({
      label: `Inpatient: ${encounter.patientName} - ${encounter.admissionDate}`,
      value: encounter.id,
    })),
    ...outpatientStore.outpatientEncounters.map(encounter => ({
      label: `Outpatient: ${encounter.patientName} - ${encounter.visitDate}`,
      value: encounter.id,
    })),
  ]
})
</script>

<template>
 <TypedForm
    :schema="props.transactionId ? updateTransactionSchema : createTransactionSchema"
    :initial-values="props.transactionId ? transactionStore.transaction || {} : {}"
    @submit="onSubmit"
  >
    <TypedSelect 
      name="encounterId" 
      label="Encounter" 
      placeholder="Select encounter"
      :options="encounterOptions" 
    />
    <TypedSelect 
      name="status" 
      label="Status" 
      placeholder="Select status"
      :options="transactionStatusOptions" 
    />

    <div class="flex gap-2">
      <Button type="submit" variant="outline">
        <Icon name="mdi:floppy" />
        Save
      </Button>
      <Button type="button" variant="outline" @click="navigateTo('/billing/transactions')">
        <Icon name="mdi:arrow-left" />
        Back
      </Button>
    </div>
  </TypedForm>
</template>