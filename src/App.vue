<template>

<transition name="fade">
  <div v-if="isDropHover" class="xxx fixed h-full w-full bg-black/50 z-10"></div>
</transition>

  <div class="main main_color view_color h-screen text_color overflow-x-scroll" @mouseup="endDragging">
    <div class="flex">
      
      <FileDrawer id="fileD" class="fileDrawer left_panel_color flex-shrink-0 select-none" :style="`width: ${leftW}px`" >
        <div class="absolute h-[70%] w-2 right-0 bottom-0 px-1" @mousedown="startDragging" style="cursor: col-resize" />
      </FileDrawer>

      <div id="rightV" class="grow view_color">
        <div data-tauri-drag-region class="titlebar text_color">
          <div class="mx-auto pt-1">
            <!-- <p class="text-xs pt-0.5 text-white/10">pen</p> -->
          </div>
          <div class="titlebar_button" @click="appWindow.minimize()">
            <WindowMinimize :size="15" />
          </div>
          <div class="titlebar_button" @click="appWindow.toggleMaximize()">
            <WindowMaximize :size="15" />
          </div>
          <div class="titlebar_button" @click="handleClose">
            <WindowClose :size="15" />
          </div>
        </div>

        <HomeTabs class="pb-12"/>
        
        <Teleport to="body">
          <NotSavedDialog :file-to-close="file" :trigger="trigger" @fileDone="fileDone" />
        </Teleport>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import FileDrawer from '@/views/FileDrawer.vue';
  import { appWindow } from '@tauri-apps/api/window'
  import { onMounted, ref } from 'vue'
  import { useSettings } from '@/stores/use-settings'
  import { useFiles } from '@/stores/use-files'
 // @ts-ignore
  import WindowMinimize from 'vue-material-design-icons/WindowMinimize.vue'
  // @ts-ignore
  import WindowMaximize from 'vue-material-design-icons/WindowMaximize.vue'
  // @ts-ignore
  import WindowClose from 'vue-material-design-icons/WindowClose.vue'
  import HomeTabs from '@/views/HomeTabs.vue'
  import NotSavedDialog from './components/HomeTabs/NotSavedDialog.vue'
  import { type FileType } from '@/types/FileType'
    // @ts-ignore
  import { themeSettings } from '@/utils/themeSettings.js'
  import { listen } from '@tauri-apps/api/event'
  // import { useToggle } from '@vueuse/core'
  import { debounce, throttle } from 'lodash'

  const settings = useSettings()
  const files = useFiles()
  const leftW = ref(160)

  // Check not saved
  const trigger = ref(0)
  const file = ref<FileType>({name: '', path: ''})
  const isDropHover = ref(false)

  // Drop files

  const toggleDropHover = debounce((boolean = null) => {
    if(boolean !== null){
      isDropHover.value = !isDropHover.value
    } else {
      isDropHover.value = boolean
    }
  }, 200)
  
  listen('tauri://file-drop', (event: {payload: []} ) => {
    toggleDropHover(false)

    let payload: string[] = event.payload

    if(payload.length){

      payload.forEach(path => {
        const name = path.substring(path.lastIndexOf('/')+1)
        addPages({name: name, path: path})
      });
    }
  })

  listen('tauri://file-drop-hover', () => {
    toggleDropHover(true)
  })

  listen('tauri://file-drop-cancelled', () => {
    toggleDropHover(false)
  })

  const addPages = throttle((file: FileType) => {
    files.addPage(file)
  })


  // Drag border

  const startDragging = (e: MouseEvent) => {
    pauseEvent(e)
    document.addEventListener('mousemove', handleDragging)
    leftW.value = e.pageX
  }
  const endDragging = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleDragging)
    pauseEvent(e)
  }

  const handleDragging = (e: MouseEvent) => {
    leftW.value = e.pageX
  }

  const pauseEvent = (e: MouseEvent) => {
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    // e.cancelBubble=true;
    // e.returnValue=false;
    return false;
  }

  // Functions

  const fileDone = () => {
    const notSaved = files.getNotSavedFiles
    if(notSaved.length){
      handleClose()
    } else {
      appWindow.close()
    }
  }
    
  const handleClose = () => {
    const notSaved = files.getNotSavedFiles
    if(notSaved.length){
        file.value = {name: 'TODO', path: notSaved[0]}
        trigger.value++
    } else {
      appWindow.close()
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