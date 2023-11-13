<template>
  <div v-show="props.path == selectedPath">
    <div>
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { readTextFile } from '@tauri-apps/api/fs'

const props = defineProps<{
  title: string
  path: string
}>()

const selectedPath = inject('selectedPath')

const content = ref('')

onMounted( async () => {
  content.value = await readTextFile(props.path as string)
})

</script>