<template>
  <div class="main text_color">
    <div class="flex">
      <FileDrawer class="fileDrawer w-64"/>
      <div class="editorView w-full">
      <div>
        <div data-tauri-drag-region class="titlebar">
          <div class="titlebar-button" id="titlebar-minimize">
            <img
              src="https://api.iconify.design/mdi:window-minimize.svg"
              alt="minimize"
            />
          </div>
          <div class="titlebar-button" id="titlebar-maximize">
            <img
              src="https://api.iconify.design/mdi:window-maximize.svg"
              alt="maximize"
            />
          </div>
          <div class="titlebar-button" id="titlebar-close">
            <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
          </div>
        </div>
        <RouterView />
        </div>
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
  import FileDrawer from '@/views/FileDrawer/FileDrawer.vue';
  import { appWindow } from '@tauri-apps/api/window'
  import { computed, onMounted } from 'vue'
  import { useSettings } from '@/stores/use-settings'

  const settings = useSettings()

  const app_font = computed( ()=> settings.getAppFont)
  const editor_font = computed( ()=> settings.getEditorFont)
  const text_color = computed( ()=> settings.getFontColor)

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
    })
    // set fonts
    document.documentElement.style.setProperty('--app_font', app_font.value)
    document.documentElement.style.setProperty('--editor_font', editor_font.value)
    document.documentElement.style.setProperty('--text_color', text_color.value)
</script>

<style>

.fileDrawer{
  background-color: #21252b;
}
.editorView{
  height: 100vh;
  max-height: 100vh;
  background-color: #282c34;
}
</style>