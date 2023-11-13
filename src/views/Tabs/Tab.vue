<template>
  <!-- <div v-show="title == selectedTitle"> -->
    <div class="tab-content">{{ content }}</div>
  <!-- </div> -->
</template>

<script setup lang="ts">
import { inject } from '@vue/runtime-core'
import { onMounted, ref } from 'vue'
import { readTextFile } from '@tauri-apps/api/fs';
import FileType from '../../types/FileType';

const props = defineProps<{
  file?: FileType
}>()

// const selectedTitle = inject('selectedTitle')
const content = ref('')

onMounted( async () => {
  content.value = await readTextFile(props.file.path as string)
})

</script>