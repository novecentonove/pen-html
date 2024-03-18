<template>
  <dialog ref="dialogEl" class="absolute top-0 dialog text_color px-12 py-8 rounded-md">
    <div>
      <p class="mb-5 text-center">
        {{ message.text }}
      </p>
      <div class="dialog_b flex justify-between">
        <button ref="gotIt" @click="close" class="bg-[#4b4b4b]">ok</button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDialogs } from '@/stores/use-dialogs'


const dialog = useDialogs()
const dialogEl = ref(null)
const gotIt = ref(null)

const message = computed( () => dialog.getMessage)

watch( 
  message, 
  (val) => {
    console.log(val)
    // @ts-ignore
    dialogEl.value.showModal()
  },
  { deep: true }
)

const close = () => {
  // @ts-ignore
  dialogEl.value.close()
  console.log('close')
}

</script>