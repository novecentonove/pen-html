<template>
  <div class="flex flex-col app_font">
    <button @click="readFileContents">choose dir</button>
    <FileList :files="filesAndDir"/>
    <router-link class="mt-auto" :to="settignsLink.to">{{ settignsLink.name }}</router-link>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { readDir } from '@tauri-apps/api/fs';
import { open } from '@tauri-apps/api/dialog'
import FileList from '@/components/FileDrawer/FileList.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
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
      const files = await readDir(selecteDir as string)
  } catch(e){
      console.error(e)
  }
}

const settignsLink = computed( () => {
  if(route.path == '/') {
    return {
      to: '/settings',
      name: 'settings'
    }
  }
  return {
      to: '/',
      name: 'back to files'
    }
})
</script>

