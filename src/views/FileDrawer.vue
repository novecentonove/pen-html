<template>
  <div class="relative pt-[36px] flex flex-col app_font text-sm">
     <slot />
     <div class="flex flex-col h-full pl-4">
      <div v-if="openedFiles.length">
        <p class="pb-[6px] mb-2 border-b border_color">Opened files</p>
        <ul v-for="file in openedFiles">
          <li class="cursor-pointer pl-2 mb-2 flex items-center"><Text :size="12" class="mr-1" /><FileClick :file="file"/></li>
        </ul>
      </div>
      <div class="h-full pt-2 leading-7 overflow-x-scroll">
        <p class="pb-[6px] border-b border_color"></p>
        <FileList :files="filesAndDir"/>
      </div>
      <div class="relative flex mt-auto mb-3 justify-between">
        <div>
          <IconSettings @click="toggleSettings()" :size="20"/>
        </div>
        <Toast :trigger="file_is_saved" />
      </div>
    </div>

    <div ref="settingsRef" v-if="showSettings" class="settings_panel_color fixed h-full right-0 top-20 bottom-20 mb-20 z-10 w-[400px] border-l border-t border-b border-neutral-700">
      <Settings />
    </div>

  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { useFiles } from '@/stores/use-files'
  import { useSettings } from '@/stores/use-settings'
  import FileList from '@/components/FileDrawer/FileList.vue'
  import Toast from '@/components/FileDrawer/Toast.vue'
  import Settings from '@/views/Settings.vue'
  import FileClick from '../components/FileDrawer/FileClick.vue';
  // @ts-ignore
  import Text from 'vue-material-design-icons/TextLong.vue'
  // @ts-ignore
  import IconSettings from 'vue-material-design-icons/Cog.vue';
  import { readDir } from '@tauri-apps/api/fs';
  import { type FileType } from '@/types/FileType';
  import { onClickOutside } from '@vueuse/core'
  import { useToggle } from '@vueuse/core'
  // const route = useRoute()
  // const pathDir = ref<string>('/home/dav/test')
  const filesAndDir = ref<FileType[] | []>([])
  const files = useFiles()
  const settings = useSettings()
  const settingsRef = ref(null)

  const file_is_saved = computed(() => files.getFileIsSaved)
  const openedFiles = computed( () => files.getOpenFiles)
  const baseDir = computed( () => settings.getBaseDir)

  const [showSettings, toggleSettings] = useToggle()

  const closeSettings = () => showSettings.value = false
  onClickOutside(settingsRef, closeSettings)

  watch(baseDir, async (value) => {
    const content = await readDir(value as string)
    filesAndDir.value = await getLStructureDir(content)
  })

  // recursive get structure
  // TODO : use FileType to any
  const getLStructureDir = async (content: any) => {
    for (const file of content) {
        if(typeof file.children === 'object'){
          const inside = await readDir((file.path as string))
          getLStructureDir(inside)
          file.children = (inside)
        }
      }
      return content.sort( (a:any) => typeof a.children === 'object' ? -1 : 1)
  }

  onMounted( async () => {
    if(baseDir.value){
      const content = await readDir(baseDir.value as string)
      filesAndDir.value = await getLStructureDir(content)
    }
  })

  // const settignsLink = computed( () => {
  //   if(route.path == '/') {
  //     return {
  //       to: '/settings',
  //       name: 'settings'
  //     }
  //   }
  //   return {
  //       to: '/',
  //       name: 'back to files'
  //     }
  // })

</script>