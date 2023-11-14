<template>
  <div class="flex flex-col">
    <button @click="readFileContents">choose dir</button>
    <FileList :files="filesAndDir"/>
    <router-link class="mt-auto" to="/settings">settings</router-link>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { readDir } from '@tauri-apps/api/fs';
import { open } from '@tauri-apps/api/dialog'
import FileList from './FileList.vue'

const pathDir = ref<string>('/home/dav/test')
const filesAndDir = ref([])

onMounted( async () => {
  if(pathDir.value){
    filesAndDir.value = await readDir(pathDir.value as string)
  }
})

const readFileContents = async () => {
    try{
        const selecteDir = await open({
            multiple: false,
            title: 'Open Dir',
            directory: true
        });
        console.log(selecteDir)
        const files = await readDir(selecteDir as string)
        content.value = files
    } catch(e){
        console.error(e)
    }
}
</script>

