<template>

<transition name="fade">
  <div v-if="isDropping" class="fixed h-full w-full bg-black/50 z-10"></div>
</transition>

  <div class="h-screen w-full main_color view_color text_color" @mouseup="endDragging">
    <div class="flex">
      
      <FileDrawer id="fileD" class="fileDrawer left_panel_color flex-shrink-0 select-none" :style="`width: ${leftW}px`" />

      <div id="rightV" class="relative grow shrink-2 view_color select-none">
        <div data-tauri-drag-region class="titlebar text_color">

          <div class="titlebar_button" @click="appWindow.minimize()">
            <WindowMinimize width="1em" />
          </div>
          <div class="titlebar_button" @click="appWindow.toggleMaximize()">
            <WindowMaximize width="1em" />
          </div>
          <div class="titlebar_button" @click="handleClose">
            <WindowClose width="1em" />
          </div>
        </div>

        <HomeTabs>
          <div class="absolute h-full w-2 left-0 bottom-0 -ml-2 px-1" @mousedown="startDragging" style="cursor: col-resize" />
        </HomeTabs>
        
        <Teleport to="body">
          <FileDialog />
        </Teleport>

        <Teleport to="body">
          <Dialog />
        </Teleport>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import FileDrawer from '@/views/FileDrawer.vue'
  import { appWindow } from '@tauri-apps/api/window'
  import { getMatches } from '@tauri-apps/api/cli'
  import { listen } from '@tauri-apps/api/event'
  import { onMounted, ref } from 'vue'
  import { useSettings } from '@/stores/use-settings'
  import { useFiles } from '@/stores/use-files'
  import WindowMinimize from '@/icons/WindowMinimize.vue'
  import WindowMaximize from '@/icons/WindowMaximize.vue'
  import WindowClose from '@/icons/WindowClose.vue'
  import HomeTabs from '@/views/HomeTabs.vue'
  import FileDialog from './components/Dialogs/FileDialog.vue'
  import Dialog from './components/Dialogs/Dialog.vue'
  import { type FileType } from '@/types/FileType'
  import { debounce, throttle } from 'lodash'
  import { allowedExt } from '@/types/AllowedExt'
  import { howToFile } from '@/types/HowToFile'

  const settings = useSettings()
  const files = useFiles()
  const leftW = ref(160)
  const isDropping = ref(false)


  const handleKeyDown = (ev: any) => {
    if (ev.ctrlKey || ev.metaKey) {
      switch (ev.key) {
        case 's':
          files.saveActiveTab()
          break;
      }
    }
  }

  // Open With
  getMatches().then((matches) => {
    const path = matches.args.path.value as string
    if(path){
      const name: string = path.substring(path.lastIndexOf('/')+1)
      const ext: string = path.split('.').pop() ?? ''

      if(allowedExt.includes(ext ?? '')){
        addPagesFromDrop({name: name, path: path})
      }
    }
  })


listen('single-instance', (event: {payload: []} ) => {

  let payload: any = event.payload

  const path = payload.args[1] as string
    if(path){
      const name: string = path.substring(path.lastIndexOf('/')+1)
      const ext: string = path.split('.').pop() ?? ''

      if(allowedExt.includes(ext ?? '')){
        addPagesFromDrop({name: name, path: path})
      }
    }
})
 
  // Drop files
  const toggleDropHover = debounce((boolean = null) => {
    if(boolean === null){
      isDropping.value = !isDropping.value
    } else {
      isDropping.value = boolean
    }
  }, 200)
  
  listen('tauri://file-drop', (event: {payload: []} ) => {
    let payload: string[] = event.payload

    if(payload.length){
      payload.forEach(path => {
        const name: string = path.substring(path.lastIndexOf('/')+1)
        const ext: string = path.split('.').pop() ?? ''

        if(allowedExt.includes(ext ?? '')){
          addPagesFromDrop({name: name, path: path})
        }
      })
    }

    toggleDropHover(false)
  })

  listen('tauri://file-drop-hover', () => {
    toggleDropHover(true)
  })

  listen('tauri://file-drop-cancelled', () => {
    toggleDropHover(false)
  })

  const addPagesFromDrop = throttle((file: FileType) => {
    settings.setToDroppedFiles(file.path)
    files.addAndSelectPage(file)
  })


  const handleClose = async () => {
    await files.closeAllTabs(false)
    const notSaved = files.getNotSavedFiles

    if(!notSaved.length){
      appWindow.close()
    }
  }

  // Drag border
  const startDragging = (e: MouseEvent) => {
    document.addEventListener('mousemove', handleDragging)
    leftW.value = e.pageX
  }
  
  const endDragging = () => {
    document.removeEventListener('mousemove', handleDragging)
  }

  const handleDragging = (e: MouseEvent) => {
    if(e.pageX > 70){
      leftW.value = e.pageX
    }
    console.log('handleDragging')
  }
  
  onMounted( () => {
    settings.applySettings()
    settings.applyTheme()

    window.addEventListener('keyup', handleKeyDown)

    // Show default page
    if(!settings.getBaseDir && !settings.getAppendedDir){
      files.addAndSelectPage(howToFile)
    }
  })

 </script>

<style>
.titlebar {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: flex-end;
}

.titlebar_button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
}

.titlebar_button:hover {
  background-color: black;
}

.fileDrawer {
  height: 100vh;
  white-space: nowrap;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .4s
}
.fade-enter-from, .fade-leave-to{
  opacity: 0
}

</style>