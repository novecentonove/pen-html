<template>
  <div class="px-4">
    <router-link class="mt-auto" to="/">back to files</router-link>
  </div>
  <div>
    <label>Font Family</label>
    <select @change="selectFont($event)">
      <option v-for="(font, i) in fontFamilies" :key="i" :value="font.path">{{font.name}}</option>
    </select>
    https://stackoverflow.com/questions/61508409/how-to-change-tailwind-config-js-dynamically-based-on-user-settings-in-rails
  </div>

</template>

<script setup lang="ts">
import { readDir } from '@tauri-apps/api/fs';
import { fontDir } from '@tauri-apps/api/path';
import { onMounted, ref } from 'vue';

const fontFamily = ref(null)
const fontFamilies = ref([])

const extractFontFromDir = async (dir) => {
  const res = await readDir(dir as string)
  res.forEach(el => {
    // console.log(el)
    if(el.children != undefined){
      extractFontFromDir(el.path)
    } else {
      const extension = el.name.split('.').pop()
      const valid = ['ttf'];
      if(extension.includes(valid)){
        fontFamilies.value.push(el)
      }
    }
  });
}

const selectFont = (e) => {
console.log(e.target.value)
}

onMounted( async () => {
  try {
  //   const dir = await fontDir()
    const res = extractFontFromDir('/home/dav/test/fonts') 
    // fontFamilies.value = res
    // const res = await readDir('/home/dav/test/fonts/Consolas/' as string)
    // console.log(res)
  } catch(e){
    console.log(e)
  }
})


</script>