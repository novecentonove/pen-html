<template>
  <div class="pl-2 pt-[26px] flex flex-col app_font text-sm">
    <div v-if="openedFiles.length">
      <p class="pb-[6px] pl-2 mb-2 border-b border-gray-600">Opened files</p>
      <ul v-for="file in openedFiles">
        <li class="cursor-pointer pl-2 mb-2 flex items-center"><Text :size="12" class="mr-1" /><FileClick :file="file"/></li>
      </ul>
    </div>
    <div class="h-full p-2 leading-7 overflow-x-scroll">
      <p class="pb-[6px] border-b border-gray-600"></p>
      <FileList :files="filesAndDir"/>
    </div>
    <div class="relative pt-3 flex justify-between mt-auto mb-3 mx-3">
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
import Text from 'vue-material-design-icons/TextLong.vue'
import FileClick from '../components/FileDrawer/FileClick.vue';

const route = useRoute()
// const pathDir = ref<string>('/home/dav/test')
const filesAndDir = ref([])
const files = useFiles()
const settings = useSettings()

const saved_file = computed(() => files.getSavedFile)
const openedFiles = computed( () => files.getOpenFiles)
const baseDir = computed( () => settings.getBaseDir)

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

