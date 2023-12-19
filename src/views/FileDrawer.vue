<template>
  <div id="out_click" class="relative w-full pt-[36px] flex flex-col app_font TextFileIcon-sm overflow-x-scroll">
    <slot />    <!-- drag  -->
     <div class="flex flex-col h-full pl-3">
      <div v-if="openedFiles.length">
        <p class="pb-[0.25rem] pl-[0.6rem] mb-2 border-b border_color">Open editors</p>
        <ul>
          <li v-for="file in openedFiles" class="file_li" :key="file.path">
            <TextFileIcon :size="12" class="mr-1" /><FileClick :file="file"/>
          </li>
        </ul>
      </div>
      <div class="pt-2">
        <p :title="baseDir" class="pb-[6px] mb-2 mr-4 border-b border_color"></p>
        <FileList :files="filesAndDir"/>
        <div v-if="baseDir" @click="openDir('base')" class="ml-2 open_dir"></div>
      </div>

      <div v-if="enableAppendDir && appendedDir" class="pt-2">
        <p :title="appendedDir" class="pb-[6px] mb-2 mr-4 border-b border_color"></p>
        <FileList :files="filesAndDirAppended"/>
        <div v-if="filesAndDirAppended" @click="openDir('appendedDir')" class="ml-2 open_dir"></div>
      </div>

      <div v-if="getEnableAppendFile && Object.keys(settings.getfileToAppend).length">
        <p class="pb-[6px] mb-2 border-b border_color mr-4"></p>
        <ul>
          <li class="file_li">
            <TextFileIcon :size="12" class="mr-1" /><FileClick :file="fileToAppend"/>
          </li>
        </ul>
      </div>
      
      <div class="relative flex mt-auto mb-3 justify-between">
        <div class="iconSettings cursor-pointer">
          <!-- see onClickOutside-->
          <IconSettings v-if="showSettings" :size="20"/>
          <IconSettings v-else @click="toggleSettings()" :size="20"/>
        </div>
        <Toast :trigger="file_is_saved" />
      </div>
    </div>

    <transition name="slide">
      <div ref="settingsRef" v-if="showSettings" class="settings_panel_color overflow-y-scroll fixed h-full right-0 top-20 bottom-20 mb-20 z-10 w-[400px] border-t-4 border-l-4 border-neutral-900">
        <Suspense>
          <Settings />
        </Suspense>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { useFiles } from '@/stores/use-files'
  import { useSettings } from '@/stores/use-settings'
  import FileList from '@/components/FileDrawer/FileList.vue'
  import Toast from '@/components/FileDrawer/Toast.vue'
  import Settings from '@/views/Settings.vue'
  import FileClick from '../components/FileDrawer/FileClick.vue'
  // @ts-ignore
  import TextFileIcon from 'vue-material-design-icons/TextLong.vue'
  // @ts-ignore
  import IconSettings from 'vue-material-design-icons/Cog.vue'
  import { readDir } from '@tauri-apps/api/fs'
  import { open } from '@tauri-apps/api/shell'
  import { type FileType } from '@/types/FileType';
  import { onClickOutside } from '@vueuse/core'
  import { useToggle } from '@vueuse/core'

  // TODO SISTEMARE VARIABILI FILES AND DIR
  const filesAndDir = ref<FileType[] | []>([])
  const filesAndDirAppended = ref<FileType[] | []>([])
  const files = useFiles()
  const settings = useSettings()
  const settingsRef = ref(null)

  const file_is_saved = computed(() => files.getFileIsSaved)
  const openedFiles = computed( () => files.getOpenFiles)
  const baseDir = computed( () => settings.getBaseDir)
  const getEnableAppendFile = computed( () => settings.getEnableAppendFile)
  const fileToAppend = computed( () => settings.getfileToAppend)
  const enableAppendDir = computed( () => settings.getEnableAppendDir)
  const appendedDir = computed( () => settings.getAppendedDir)

  const [showSettings, toggleSettings] = useToggle()

  const closeSettings = () => showSettings.value = false
  onClickOutside(settingsRef, closeSettings)

  watch(baseDir, async (value) => {
    const content = await readDir(value as string)
    filesAndDir.value = await getLStructureDir(content)
  })

  watch(appendedDir, async (value) => {
    const content = await readDir(value as string)
    filesAndDirAppended.value = await getLStructureDir(content)
  })

  // recursive get structure // TODO : use FileType to any
  const getLStructureDir = async (content: any) => {
    for (const file of content) {
        if(typeof file.children === 'object'){
          const inside = await readDir((file.path as string))
          getLStructureDir(inside)
          file.children = (inside)
        }
      }
      // Sort alphabetically
      const alpha = content.sort( (a: any, b:any) =>a.name.localeCompare(b.name))
      // Sort DIR
      const dir =  alpha.sort( (a:any) => typeof a.children === 'object' ? -1 : 1)
      return dir
  }

  const openDir = async (type: string) => {
    let dir = ''
    switch (type) {
      case 'base':
        dir = baseDir.value as string
        break;
      case 'appendedDir':
        dir = appendedDir.value as string
        break;
    }
    if(dir){
      try{
        await open(dir)
      } catch(e){
        console.log(e)
      }
    }
  }
  
  const loadBaseDir = async (type: string) => {
      switch (type) {
        case 'base':
          if(baseDir.value){
            const contentBase = await readDir(baseDir.value as string)
            filesAndDir.value = await getLStructureDir(contentBase)
          }
          break;
        case 'appendedDir':
          if(appendedDir.value){
            const contentDir = await readDir(appendedDir.value as string)
            filesAndDirAppended.value = await getLStructureDir(contentDir)
          }
          break;
      }
  } 

  onMounted( () => {
    loadBaseDir('base')
    if(enableAppendDir.value && appendedDir.value){
      loadBaseDir('appendedDir')
    }
    setInterval(loadBaseDir, 1000*60*2)
  })

</script>

<style>
.open_dir{
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 20px;
  height: 8px;
  background-color: var(--left_panel_color);
  filter: brightness(150%);
  border-radius: 4px;
}

.file_li {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  margin-right: 0.8rem;
  /* border-radius: 0.35rem; */
  cursor: pointer;
}
.file_li:hover{
  background-color: var(--view_color);
}

.iconSettings{
    opacity: 0.15;
}

.slide-enter-active {
  transition: all 0.05s ease-in-out;
}

.slide-leave-active {
  transition: all 0.05s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translatex(100%);
  opacity: 0;
}
</style>