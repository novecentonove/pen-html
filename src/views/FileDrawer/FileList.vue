<template>
  <template v-if="files?.length">
    <div v-for="file in files" :key="file.name">
      <span @click="openFile(file)">{{ file.name }}</span>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { readTextFile, readDir } from '@tauri-apps/api/fs';
import { usePages } from '@/stores/use-pages.ts'
import FileType from '@/types/FileType.ts'

const store = usePages()


const props = defineProps<{
  files?: FileType[]
}>()

const openFile = async (file: FileType) => {
  if(typeof file.children === 'object') return
  // const content = await readTextFile(file.path as string)
  store.addPage(file)
}

// {
//   "children": [],
//   "name": "Dir",
//   "path": "/home/dav/test/Dir"
// },
// {
//   "name": "file.txt",
//   "path": "/home/dav/test/file.txt"
// },
// {
//   "name": "file2.txt",
//   "path": "/home/dav/test/file2.txt"
// }
</script>