<template>
  <div class="main text_color overflow-x-scroll">
    <div class="flex max-w-full">
      <FileDrawer class="fileDrawer min-w-[144px]"/>
      
      <div class="flex flex-col w-full">
        <div data-tauri-drag-region class="titlebar text_color">
          <div class="mx-auto pt-1">
            <p class="text-xs pt-0.5">pen</p>
          </div>
          <div class="titlebar-button" id="titlebar-minimize">
            <WindowMinimize :size="15" />
          </div>
          <div class="titlebar-button" id="titlebar-maximize">
            <WindowMaximize :size="15" />
          </div>
          <div class="titlebar-button" id="titlebar-close">
            <WindowClose :size="15" />
          </div>
        </div>
        <RouterView/>
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
 
  import WindowMinimize from 'vue-material-design-icons/WindowMinimize.vue';
  import WindowMaximize from 'vue-material-design-icons/WindowMaximize.vue';
  import WindowClose from 'vue-material-design-icons/WindowClose.vue';

  const settings = useSettings()

  const app_font = computed( ()=> settings.getAppFont)
  const editor_font = computed( ()=> settings.getEditorFont)
  const text_color = computed( ()=> settings.getFontColor)
  const editor_font_size = computed( ()=> settings.getEditorFontSize)

  onMounted( () => {
    document
      .getElementById('titlebar-minimize')
      .addEventListener('click', () => appWindow.minimize())
    document
      .getElementById('titlebar-maximize')
      .addEventListener('click', () => appWindow.toggleMaximize())
    document
      .getElementById('titlebar-close')
      .addEventListener('click', () => appWindow.close())

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
  height: 20px;
  user-select: none;
  display: flex;
  justify-content: flex-end;
  /* position: fixed; */
  top: 0;
  left: 0;
  right: 0;
}

.titlebar-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
}

.titlebar-button:hover {
  background: black;
}

.fileDrawer, .main{
  height: 100vh;
  max-height: calc(100vh - 30px);
  /* min-width: 300px; */
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