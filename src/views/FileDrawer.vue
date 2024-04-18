<template>
  <div class="flex flex-col">
    <div id="out_click" class="relative overflow-x-scroll w-full h-full pt-[36px] flex flex-col app_font">
      <div class="flex flex-col h-full pl-3">
        <div class="pt-5">
          <p class="pb-[6px] mb-2 border-b border_color"></p>
          <FileList :files="filesAndDir"/>
          <div v-if="baseDir" :title="baseDir" @click="openDir('base')" class="ml-2 open_dir"></div>
        </div>
        <div v-if="enableAppendDir && appendedDir " class="pt-2">
          <p class="pb-[6px] mb-2 mr-4 border-b border_color"></p>
          <FileList :files="filesAndDirAppended"/>
          <div v-if="filesAndDirAppended" :title="appendedDir" @click="openDir('appendedDir')" class="ml-2 open_dir"></div>
        </div>
        <div v-if="getEnableAppendFile && Object.keys(settings.getfileToAppend).length && fileToAppend.path">
          <p class="pb-[6px] mb-2 border-b border_color mr-4"></p>
          <ul>
            <li class="file_li">
              <FileClick :file="fileToAppend" :title="fileToAppend.path"/>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="relative flex items-center mt-auto mb-3 pt-3 pl-3 justify-between">
      <div class="opacity-20 cursor-pointer">
        <IconSettings title="Settings" @click="files.addAndSelectPage(settingFile)" width="1.3em" />
      </div>
      <div title="Reload all dirs" class="opacity-30 cursor-pointer mr-3" >
        <ReloadIcon width="1.3em" @click="loadAllDirs" />
      </div>
      <MiniToast :trigger="file_is_saved" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { useFiles } from '@/stores/use-files'
  import { useSettings } from '@/stores/use-settings'
  import FileList from '@/components/FileDrawer/FileList.vue'
  import MiniToast from '@/components/FileDrawer/MiniToast.vue'
  import FileClick from '../components/FileDrawer/FileClick.vue'
  import ReloadIcon from '@/icons/Reload.vue'
  import IconSettings from '@/icons/Settings.vue'
  import { readDir } from '@tauri-apps/api/fs'
  import { open } from '@tauri-apps/api/shell'
  import { watch as fs_watch } from "tauri-plugin-fs-watch-api"
  import { type FileType } from '@/types/FileType'
  import { settingFile } from '@/types/SettingFile'

  const filesAndDir = ref<FileType[] | []>([])
  const filesAndDirAppended = ref<FileType[] | []>([])
  const files = useFiles()
  const settings = useSettings()

  const file_is_saved = computed(() => files.getTriggerMiniToast)
  const baseDir = computed( () => settings.getBaseDir)
  const getEnableAppendFile = computed( () => settings.getEnableAppendFile)
  const fileToAppend = computed( () => settings.getfileToAppend)
  const enableAppendDir = computed( () => settings.getEnableAppendDir)
  const appendedDir = computed( () => settings.getAppendedDir)
  const showSelectedFolder = computed( () => settings.getShowSelectedFolder)

  onMounted( () => {
    loadAllDirs()
    startWatchingFs('base')
    startWatchingFs('appended')
  })

  // recursive get structure // TODO : use FileType to any
  const getLStructureDir = async (content: any) => {
    for (const file of content) {
        if(typeof file.children === 'object'){
          try{
            const inside = await readDir((file.path as string))
            getLStructureDir(inside)
            file.children = (inside)
          } catch(e){
            console.error(e)
          }
        }
      }

      // Remove hidden files
      const noHidden = content.filter((file:any) => !file.name.startsWith('.'))
      // Sort alphabetically
      const alpha = noHidden.sort( (a: any, b:any) =>a.name.localeCompare(b.name))
      // Sort DIR
      return alpha.sort( (a:any) => typeof a.children === 'object' ? -1 : 1)
  }

  const openDir = async (type: string) => {
    let dir = ''
    switch (type) {
      case 'base':
        dir = baseDir.value as string
        break
      case 'appendedDir':
        dir = appendedDir.value as string
        break
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
          filesAndDir.value = []
          if(baseDir.value){
            try{
              const dir_split = baseDir.value.split("/")
              const dir = dir_split[dir_split.length - 1]
              const contentBase = await readDir(baseDir.value as string)
              const inside = await getLStructureDir(contentBase)
              const content = _switch_folder_name(inside, dir)
              filesAndDir.value = content
            } catch(e){
              console.log(e)
            }
          }
          break
        case 'appendedDir':
          filesAndDirAppended.value = []
          if(appendedDir.value){
            try{
              const dir_split = appendedDir.value.split("/")
              const dir = dir_split[dir_split.length - 1]
              const contentDir = await readDir(appendedDir.value as string)
              const inside = await getLStructureDir(contentDir)
              const content = _switch_folder_name(inside, dir)
              filesAndDirAppended.value = content
            } catch(e){
              console.log(e)
            }
          }
          break
      }
  }

  const _switch_folder_name = (inside: [], dir: string) => {
    if(showSelectedFolder.value){
        return [
        {
          name: dir,
          path: baseDir.value,
          children: inside
        }
      ]
    } else {
      return inside
    }
  }

  const loadAllDirs = () => {
    loadBaseDir('base')
    if(enableAppendDir.value && appendedDir.value){
      loadBaseDir('appendedDir')
    }
  }

  // watchers
  watch(baseDir, async () => {
    loadAllDirs()
    startWatchingFs('base')
  })

  watch(appendedDir, async () => {
    loadAllDirs()
    startWatchingFs('appended')
  })

  watch(enableAppendDir, async () => {
    loadAllDirs()
    startWatchingFs('appended')
  })

  watch(showSelectedFolder, async () => loadAllDirs() )

  const startWatchingFs = async (type: string) => {

    // stop workers
    const ws = files.getActiveWatchers

    ws.forEach( w => {
      if( (w?.type === type) && w.watcher ){
        w?.watcher()
        files.removeWatcher(type)
        // console.log('rimosso watcher', type)
      }
    })

    if(type === 'base'){
      if (!baseDir.value) return;
    }
    if(type === 'appended'){
      if (!appendedDir.value || !enableAppendDir.value) return;
    }
    
    let path = '';
    switch (type) {
      case 'base':
        path = baseDir.value
        break;
      case 'appended':
        path = appendedDir.value
        break;
    }

    // Start watcher
    const watcher = await fs_watch(
      path,
      (/*event*/) => {
        loadAllDirs()
        // console.log(event)
      },
      { recursive: true }
    )

    // console.log(typeof(watcher))
    files.setActiveWatchers({watcher: watcher, type: type})

    // console.log('dopo', type, files.getActiveWatchers)

  }

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
  padding-left: 0.5rem;
  margin-right: 0.8rem;
  /* border-radius: 0.35rem; */
  cursor: pointer;
}
.file_li:hover{
  background-color: var(--view_color);
}

.file_li_inner{
  padding: 0.25rem 0.15rem;
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

.cut_text {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>