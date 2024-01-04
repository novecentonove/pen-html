<template>
  <template v-if="files">

    <ul class="list-none text-md">
      <FileTree v-for="file in props.files" :file="file" :children="file.children" :depth="0" @close-menu="closeMenutrigger++" :close-menu="closeMenutrigger"/>
    </ul>

  </template>
</template>

<script setup lang="ts">
import { type FileType } from '@/types/FileType'
import FileTree from './FileTree.vue'
import { ref } from 'vue';

const props = defineProps<{
  files?: FileType[]
}>()

const closeMenutrigger = ref(0)
</script>