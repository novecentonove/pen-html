<template>
  <template v-if="files?.length">

    <ul class="list-none text-md">
      <FileTree v-for="file in files" :file="file" :children="file.children" :depth="0"/>
    </ul>

  </template>
</template>

<script setup lang="ts">
import FileType from '@/types/FileType.ts'
import FileTree from './FileTree.vue'

const props = defineProps<{
  files?: FileType[]
}>()

</script>