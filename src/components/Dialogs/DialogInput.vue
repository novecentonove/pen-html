<template>
  <dialog ref="dialogInput" class="absolute top-0 dialog text_color px-12 py-8 rounded-md">
    <div>
      <p class="mb-5 text-center">
        {{ props.activate.message }}
      </p>
      <input type="text" v-model="model">
      <div class="dialog_b flex justify-between">
        <button ref="gotIt" @click="ok" class="bg-[#4b4b4b]">ok</button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const emit = defineEmits(['action'])

type Props = { 
  activate: {
    message: string,
    trigger: number
  }
}

const props = defineProps<Props>()

const model = defineModel()
const dialogInput = ref(null)
watch( 
  props.activate, 
  () => {
    // @ts-ignore
    dialogInput.value.showModal()
  },
  { deep: true }
)

const ok = () => {
  // @ts-ignore
  dialogInput.value.close()
  emit('action', true)
}
</script>