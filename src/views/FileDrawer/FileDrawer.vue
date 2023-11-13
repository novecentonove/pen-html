<template>
  <div>
    <button @click="readFileContents">choose dir</button>
    <FileList :files="filesAndDir"/>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { readTextFile, readDir } from '@tauri-apps/api/fs';
import { open } from '@tauri-apps/api/dialog'
import FileList from './FileList.vue'

// const content = ref<Array<string>>([])
const pathDir = ref<string>('/home/dav/test')
const filesAndDir = ref([])
// const files = computed( () => filesAndDir.value)

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
        // if(!selecteDir) return
        // content.value = await readTextFile(selecteDir as string)
    } catch(e){
        console.error(e)
    }
}
</script>

