<template>
  <div data-tauri-drag-region class="titlebar text_color">
    <div class="mx-auto pt-1">
      <p>pen</p>
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
  <div class="main text_color overflow-x-hidden">
    <div class="flex">
      <FileDrawer class="fileDrawer w-64"/>
      <div class="router_view w-full">
        <RouterView />
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
  import WindowMinimize from 'vue-material-design-icons/WindowMinimize.vue';
  import WindowMaximize from 'vue-material-design-icons/WindowMaximize.vue';
  import WindowClose from 'vue-material-design-icons/WindowClose.vue';

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
.titlebar {
  height: 30px;
  background-color: #282c34;
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
  background: #5bbec3;
}

.fileDrawer, .main{
  height: 100vh;
  max-height: calc(100vh - 32px);
}

.fileDrawer {
  background-color: #21252b;
}

.main{
  background-color: #282c34;
}

</style>