<template>
  <div class="flex flex-col app_font">
    <button @click="readFileContents">choose dir</button>
    <FileList :files="filesAndDir"/>
    <div class="relative flex justify-between mt-auto mb-3 mx-3">
      <router-link :to="settignsLink.to">
        <IconSettings :size="18"/>
      </router-link>
      <Toast :trigger="saved_file" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { readDir } from '@tauri-apps/api/fs';
import { open } from '@tauri-apps/api/dialog'
import FileList from '@/components/FileDrawer/FileList.vue'
import Toast from '@/components/FileDrawer/Toast.vue'
import IconSettings from 'vue-material-design-icons/Cog.vue';
import { useRoute } from 'vue-router'
import { useFiles } from '@/stores/use-files'

const route = useRoute()
const pathDir = ref<string>('/home/dav/test')
const filesAndDir = ref([])
const files = useFiles()

const saved_file = computed(() => files.getSavedFile)

watch(saved_file, (value) => {
  console.log('saved', value)
})

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

