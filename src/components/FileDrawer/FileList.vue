<template>
  <template v-if="files?.length">

    <ul class="list-none text-md">
      <FileTree v-for="file in files" :file="file" :children="file.children" :depth="0"/>
    </ul>

  </template>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { readTextFile, readDir } from '@tauri-apps/api/fs';

import FileType from '@/types/FileType.ts'
import FileTree from './FileTree.vue'

import Structure from './Structure.vue'

const props = defineProps<{
  files?: FileType[]
}>()

</script>