<template>
  <div class="px-4">
    <router-link class="mt-auto" to="/">back to files</router-link>
  </div>
  <div>
    <label>Font Family</label>
    <select v-model="selectedFont" @change="selectFont($event)">
      <option v-for="(font, i) in fontFamilies" :key="i" :value="font.name">{{font.name}}</option>
    </select>
  </div>

  <div>
    <button @click="reload">Reload</button>
  </div>
<div>
  font loaded: {{ font }}
</div>
</template>

<script setup lang="ts">
import { readDir } from '@tauri-apps/api/fs';
import { onMounted, ref } from 'vue';
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
const selectedFont = ref(settings.getFont)

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
const font = settings.getFont

const reload = async () => await relaunch()

const selectFont = (e) => {
  settings.setFont(e.target.value)
}

onMounted( async () => {
  try {
  //   const dir = await fontDir()
    // const res = extractFontFromDir('/home/dav/test/fonts') 
    // fontFamilies.value = res
    // const res = await readDir('/home/dav/test/fonts/Consolas/' as string)
    // console.log(res)
  } catch(e){
    console.log(e)
  }
})


</script>