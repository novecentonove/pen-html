<template>
  <div class="flex flex-col app_font">
    <div class="p-2 leading-7">
      <FileList :files="filesAndDir"/>
    </div>
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
import FileList from '@/components/FileDrawer/FileList.vue'
import Toast from '@/components/FileDrawer/Toast.vue'
import IconSettings from 'vue-material-design-icons/Cog.vue';
import { useRoute } from 'vue-router'
import { useFiles } from '@/stores/use-files'
import { useSettings } from '@/stores/use-settings'

const route = useRoute()
// const pathDir = ref<string>('/home/dav/test')
const filesAndDir = ref([])
const files = useFiles()
const settings = useSettings()

const saved_file = computed(() => files.getSavedFile)
const baseDir = computed( () => settings.getBaseDir)

watch(saved_file, (value) => {
  console.log('saved', value)
})

watch(baseDir, async (value) => {
  const content = await readDir(value as string)
  filesAndDir.value = await getLStructureDir(content)
})

// recursive get structure
const getLStructureDir = async (content) => {
  for (const file of content) {
      if(typeof file.children === 'object'){
        const inside = await readDir((file.path as string))
        getLStructureDir(inside)
        file.children = (inside)
      }
    }
    content.sort( (a,b) => typeof a.children === 'object' ? -1 : 1)
    return content
}

onMounted( async () => {
  if(baseDir.value){
    const content = await readDir(baseDir.value as string)
    filesAndDir.value = await getLStructureDir(content)
  }
})

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

