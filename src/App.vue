<template>

<transition name="fade">
  <div v-if="isDropping" class="fixed h-full w-full bg-black/50 z-10"></div>
</transition>

  <div class="main main_color view_color h-screen text_color" @mouseup="endDragging">
    <div class="flex">
      
      <FileDrawer id="fileD" class="fileDrawer left_panel_color flex-shrink-0 select-none" :style="`width: ${leftW}px`" />
        
      <div id="rightV" class="relative grow view_color select-none">
        <div data-tauri-drag-region class="titlebar text_color">
          <!-- <div class="ml-3 mr-auto pt-1 text-xs">
            <p>path</p>
          </div> -->
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

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import FileDrawer from '@/views/FileDrawer.vue'
  import { appWindow } from '@tauri-apps/api/window'
  import { onMounted, ref } from 'vue'
  import { useSettings } from '@/stores/use-settings'
  import { useFiles } from '@/stores/use-files'
  import WindowMinimize from '@/icons/WindowMinimize.vue'
  import WindowMaximize from '@/icons/WindowMaximize.vue'
  import WindowClose from '@/icons/WindowClose.vue'
  import HomeTabs from '@/views/HomeTabs.vue'
  // import NotSavedDialog from './components/HomeTabs/NotSavedDialog.vue'
  import FileDialog from './components/HomeTabs/FileDialog.vue'
  import { type FileType } from '@/types/FileType'
  import { listen } from '@tauri-apps/api/event'
  import { debounce, throttle } from 'lodash'
  import { allowedExt } from '@/types/AllowedExt'

  const settings = useSettings()
  const files = useFiles()
  const leftW = ref(160)

  // Check not saved
  // const trigger = ref(0)
  // const file = ref<FileType>({name: '', path: ''})
  const isDropping = ref(false)

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
    files.addAndSelectPage(file)
  })


  // todo add a promise
  const handleClose = () => {

    const notSaved = files.getNotSavedFiles

    if(notSaved.length){
      alert('file non salvati')
    } else {
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
  }





  onMounted( () => {
    settings.applySettings()
    settings.applyTheme()
  })
 </script>

<style>
.titlebar {
  width: 100%;
  height: 30px;
  user-select: none;
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

.main{
  height: 100vh;
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