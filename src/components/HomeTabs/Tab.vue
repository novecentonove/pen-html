<template>
  <div v-show="path == selectedPath">
    <Editor v-model="content" :name="name" :path="path" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRef } from 'vue'
import { readTextFile } from '@tauri-apps/api/fs'
import Editor from '@/components/Editor/Editor.vue'
import { useFiles } from '@/stores/use-files'

const props = defineProps<{
  name: string
  path: string
}>()

const files = useFiles()

const path = toRef(props.path)

const selectedPath = computed( () => files.getSelectedPath)

const content = ref(' ')

onMounted( async () => {
  content.value = await readTextFile(props.path as string)
})

</script>