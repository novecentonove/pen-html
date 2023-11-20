<template>
  <div class="main text_color overflow-x-scroll">
    <div class="flex">
      <FileDrawer class="fileDrawer min-w-[190px]"/>
      
      <div class="flex flex-col w-full h-screen">
        <div data-tauri-drag-region class="titlebar text_color">
          <div class="mx-auto pt-1">
            <p class="text-xs pt-0.5">pen</p>
          </div>
          <div class="titlebar-button" @click="appWindow.minimize()">
            <WindowMinimize :size="15" />
          </div>
          <div class="titlebar-button" @click="appWindow.toggleMaximize()">
            <WindowMaximize :size="15" />
          </div>
          <div class="titlebar-button" @click="appWindow.close()">
            <WindowClose :size="15" />
          </div>
        </div>
        <RouterView class="px-12 pb-12"/>
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
  import { RouterView } from 'vue-router'
  import FileDrawer from '@/views/FileDrawer.vue';
  import { appWindow } from '@tauri-apps/api/window'
  import { computed, onMounted } from 'vue'
  import { useSettings } from '@/stores/use-settings'
 // @ts-ignore
  import WindowMinimize from 'vue-material-design-icons/WindowMinimize.vue';
  // @ts-ignore
  import WindowMaximize from 'vue-material-design-icons/WindowMaximize.vue';
  // @ts-ignore
  import WindowClose from 'vue-material-design-icons/WindowClose.vue';

  const settings = useSettings()

  const app_font = computed( ()=> settings.getAppFont)
  const editor_font = computed( ()=> settings.getEditorFont)
  const text_color = computed( ()=> settings.getFontColor)
  const editor_font_size = computed( ()=> settings.getEditorFontSize)

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
  /* height: calc(100vh + 40px); */
  height: 100vh;
  /* max-height: calc(100vh); */
  /* min-width: 300px; */
}
.fileDrawer {
  /* max-height: calc(100vh); */
  height: 100vh;
}

.titlebar {
  background-color: #191919;
}

.fileDrawer {
  background-color: #202020;
}

.main{
  background-color: #191919;
}


/*
initiols: 

fileDrawer #21252b;
main #282c34;

fileDrawer #1a181f

fileDrawer #0f0f0f
main #171717;
textcolor: #aec3d1
 */
</style>