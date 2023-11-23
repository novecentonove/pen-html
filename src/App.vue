<template>
  <div class="main main_color h-screen text_color overflow-x-scroll" @mouseup="endDragging">
    <div class="flex">
      
      <FileDrawer id="fileD" class="fileDrawer fileDrawer_color flex-shrink-0" :style="`width: ${leftW}px`" >
        <div class="absolute h-[70%] w-2 right-0 bottom-0 px-1" @mousedown="startDragging" style="cursor: col-resize" />
      </FileDrawer>

      <div id="rightV" class="grow">
        <div data-tauri-drag-region class="titlebar text_color">
          <div class="mx-auto pt-1">
            <p class="text-xs pt-0.5 text-neutral-700">pen</p>
          </div>
          <div class="titlebar-button" @click="appWindow.minimize()">
            <WindowMinimize :size="15" />
          </div>
          <div class="titlebar-button" @click="appWindow.toggleMaximize()">
            <WindowMaximize :size="15" />
          </div>
          <div class="titlebar-button" @click="handleClose">
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
  /**
  USARE STYLE binding per i font?
  veder anche per locale:
  @font-face {
    font-family: "ADELIA";
    src: url("../public/fonts/ADELIA.otf");
  }
  font-family: ADELIA
  */
  // import { RouterView } from 'vue-router'

  import FileDrawer from '@/views/FileDrawer.vue';
  import { appWindow } from '@tauri-apps/api/window'
  import { computed, onMounted, ref } from 'vue'
  import { useSettings } from '@/stores/use-settings'
  import { useFiles } from '@/stores/use-files'
 // @ts-ignore
  import WindowMinimize from 'vue-material-design-icons/WindowMinimize.vue';
  // @ts-ignore
  import WindowMaximize from 'vue-material-design-icons/WindowMaximize.vue';
  // @ts-ignore
  import WindowClose from 'vue-material-design-icons/WindowClose.vue';
  import HomeTabs from '@/views/HomeTabs.vue'
  import NotSavedDialog from './components/HomeTabs/NotSavedDialog.vue';
  import { FileType } from '@/types/FileType';

  const settings = useSettings()
  const files = useFiles()

  const app_font = computed( ()=> settings.getAppFont)
  const editor_font = computed( ()=> settings.getEditorFont)
  const text_color = computed( ()=> settings.getFontColor)
  const editor_font_size = computed( ()=> settings.getEditorFontSize)
  const leftW = ref(160)

  // Check not saved
  const trigger = ref(0)
  const file = ref<FileType>({name: '', path: ''})

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

  const fileDone = (val: any) => {
    console.log('filedone', val)
    const notSaved = files.getNotSavedFiles
    if(notSaved.length){
      handleClose()
    } else {
      appWindow.close()
    }
  }
    
  const handleClose = () => {
    console.log('handleClose')
    const notSaved = files.getNotSavedFiles
    if(notSaved.length){
        file.value = {name: 'TODO', path: notSaved[0]}
        trigger.value++
    } else {
      appWindow.close()
    }
  }

  onMounted( () => {
    // set fonts
    document.documentElement.style.setProperty('--app_font', app_font.value)
    document.documentElement.style.setProperty('--editor_font', editor_font.value)
    document.documentElement.style.setProperty('--text_color', text_color.value)
    document.documentElement.style.setProperty('--editor_font_size', `${editor_font_size.value}px`)
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

.titlebar-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
}

.titlebar-button:hover {
  background-color: black;
}

.main{
  height: 100vh;
}

.fileDrawer {
  height: 100vh;
  white-space: nowrap;
}

/* Colors */
.titlebar {
  background-color: #191919;
}

.fileDrawer_color {
  background-color: #202020;
}

.main_color{
  background-color: #191919;
}

.dialog {
  background-color: #202020;
}

</style>