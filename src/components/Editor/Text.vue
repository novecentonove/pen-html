<template>
  <div class="plain_text mt-6">
    <textarea ref="text_area" class="text_area bg-transparent w-full" style="height: 80vh;">{{props.modelValue}}</textarea>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const text_area = ref(null)

type Props = {
  modelValue: string,
  name: string,
  path: string
}

const props = defineProps<Props>()
onMounted( () => {
  if(text_area.value){
    text_area.value.focus()
  }
})
</script>

<style>
.plain_text textarea {
    border: none;
    overflow: auto;
    outline: none;
    resize: none;
}
</style>