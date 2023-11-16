<template>
  <div class="px-4">
    <router-link class="mt-auto" to="/">back to files</router-link>
  </div>
  <div>
    <label>App Font</label>
    <select v-model="selectedAppFont" @change="selectFont($event, 'app')">
      <option v-for="(font, i) in fontFamilies" :key="i" :value="font.name">{{font.name}}</option>
    </select>

    <label>Editor Font</label>
    <select v-model="selectedEditorFont" @change="selectFont($event, 'editor')">
      <option v-for="(font, i) in fontFamilies" :key="i" :value="font.name">{{font.name}}</option>
    </select>
  </div>

  <div>
    <button @click="reload">Reload</button>
  </div>
<div>
  app_font: {{ app_font }} <br>
  editor_font: {{ editor_font }}
</div>
</template>

<script setup lang="ts">
import { readDir } from '@tauri-apps/api/fs';
import { onMounted, ref, nextTick, toRef, computed} from 'vue';
import { useSettings } from '@/stores/use-settings.ts'
import { relaunch } from '@tauri-apps/api/process';

const fontFamilies = ref([
  {
    name: 'Consolas',
  },
  {
    name: 'Arial',
  },
  {
    name: 'Segoe UI',
  },
])
const settings = useSettings()
const selectedAppFont = ref(settings.getAppFont)
const selectedEditorFont = ref(settings.getEditorFont)

// const extractFontFromDir = async (dir) => {
//   const res = await readDir(dir as string)
//   res.forEach(el => {
//     // console.log(el)
//     if(el.children != undefined){
//       extractFontFromDir(el.path)
//     } else {
//       const extension = el.name.split('.').pop()
//       const valid = ['ttf'];
//       if(extension.includes(valid)){
//         fontFamilies.value.push(el)
//       }
//     }
//   });
// }
const app_font = computed( ()=> settings.getAppFont)
const editor_font = computed( ()=> settings.getEditorFont)


const reload = async () => await relaunch()

const selectFont = async (e, type) => {

  switch (type) {
    case 'app':
      settings.setAppFont(e.target.value)
      document.documentElement.style.setProperty('--app_font', app_font.value)
      break;
    case 'editor':
      settings.setEditorFont(e.target.value)
      document.documentElement.style.setProperty('--editor_font', editor_font.value)
      break;
  }
}

</script>