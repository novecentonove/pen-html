<template>
  <div class="main">
    <div class="flex">
      <FileDrawer class="fileDrawer w-64"/>
      <!-- <RouterView /> -->
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
        <HomeTabs />
        </div>
    </div>
    </div>
  </div>
<!-- <nav>
  <RouterLink to="/">Home</RouterLink>
  <RouterLink to="/about">About</RouterLink>
</nav> -->
</template>

<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
  import FileDrawer from '@/views/FileDrawer/FileDrawer.vue';
  import HomeTabs from '@/views/Tabs/HomeTabs.vue';
  import { appWindow } from '@tauri-apps/api/window'
import { onMounted } from 'vue';

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

  
</script>

<style>
.fileDrawer{
  background-color: #21252b;
  color: #9d9fa1;
}
.editorView{
  height: 100vh;
  max-height: 100vh;
  background-color: #282c34;
  color: #9d9fa1;
}
</style>