<template>
  <div class="overflow-y-scroll">
    <div>
      <router-link class="mt-auto" to="/"><Left /></router-link>
    </div>
    <div class="flex flex-col [&>select]:mb-2 [&>*]:w-64">
      <label>App Font</label>
      <select v-model="selectedAppFont" @change="selectFont($event, 'app')">
        <option v-for="(font, i) in fontFamilies" :key="i" :value="font.name">{{font.name}}</option>
      </select>

      <label>Editor Font</label>
      <select v-model="selectedEditorFont" @change="selectFont($event, 'editor')">
        <option v-for="(font, i) in fontFamilies" :key="i" :value="font.name">{{font.name}}</option>
      </select>

      <label>Text color</label>
      <select v-model="selectedTextColors" @change="selectTextColors($event)">
        <option v-for="(color, i) in textColors" :key="i" :value="color.value">
          <!-- <div class="w-2 h-2" :style="`background-color:${color.value}`"></div> -->
          {{color.name}}
        </option>
      </select>

      <label>Font size</label>
      <input type="number" v-model="selectedFontSize" @change="selectFontSize($event)">

      <label class="mt-6">Base Dir</label>
      <button @click="readFileContents">{{baseDir}}</button>

      <div class="mt-10">
        app_font: {{ selectedAppFont }} <br>
        editor_font: {{ selectedEditorFont }} <br>
        color_font: {{ selectedTextColors }} <br>
        font_size: {{ selectedFontSize }}
      </div>
    </div>
      <div class="mt-10">
        <label>Font size test</label>
        <p :style="`font-size:${selectedFontSize}px`">
          But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?
        </p>
      </div>

  </div>



</template>

<script setup lang="ts">
import { readDir } from '@tauri-apps/api/fs'
import { open } from '@tauri-apps/api/dialog'
import { onMounted, ref, nextTick, toRef, computed} from 'vue'
import { useSettings } from '@/stores/use-settings.ts'
import { relaunch } from '@tauri-apps/api/process'
import Left from 'vue-material-design-icons/ChevronLeft.vue'

const settings = useSettings()
const selectedAppFont = computed( () => settings.getAppFont)
const selectedEditorFont = computed( () => settings.getEditorFont)
const selectedTextColors = computed( () => settings.getFontColor)
const selectedFontSize = computed( () => settings.getEditorFontSize)
const baseDir = computed( () => settings.getBaseDir)

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

const fontFamilies = ref([
  {
    name: 'Consolas',
  },
  {
    name: 'Arial',
  },
  {
    name: 'DejaVu Sans',
  },
])

const textColors = ref(
  [
  { name: 'Notion', value: '#d3d3d3' },
  { name: 'NotionDark', value: '#b0b0b0' },
  { name: 'Stormy Sky', value: '#909090' },
  { name: 'Pewter', value: '#989898' },
  { name: 'Silver Bullet', value: '#A0A0A0' },
  { name: 'Mist', value: '#A8A8A8' },
  { name: 'Steel', value: '#A9A9A9' },
  { name: 'Silverado', value: '#B0B0B0' },
  { name: 'Moonstone', value: '#B8B8B8' },
  { name: 'Cobblestone', value: '#BEBEBE' },
  { name: 'Quicksilver', value: '#C0C0C0' },
  { name: 'Cloudy', value: '#C8C8C8' },
  { name: 'Silver Lining', value: '#D0D0D0' },
  { name: 'Platinum', value: '#D3D3D3' },
  { name: 'Lunar', value: '#D8D8D8' },
  { name: 'Dove', value: '#DCDCDC' },
  { name: 'Alabaster', value: '#E0E0E0' },
  { name: 'Pearl', value: '#E8E8E8' },
  { name: 'Fog', value: '#F0F0F0' },
  { name: 'Linen', value: '#F5F5F5' },
  { name: 'Whisper', value: '#F8F8F8' },
  { name: 'Whiteout', value: '#FFFFFF' },
  { name: 'Cold', value: '#9fa7b6' }

])

const reload = async () => await relaunch()

const selectFont = (e, type) => {
  switch (type) {
    case 'app':
      settings.setAppFont(e.target.value)
      document.documentElement.style.setProperty('--app_font', e.target.value)
      break;
    case 'editor':
      settings.setEditorFont(e.target.value)
      document.documentElement.style.setProperty('--editor_font', e.target.value)
      break;
  }
}

const selectTextColors = (e) => {
  settings.setFontColor(e.target.value)
  document.documentElement.style.setProperty('--text_color', e.target.value)
}

const selectFontSize = (e) => {
  settings.setEditorFontSize(e.target.value)
  document.documentElement.style.setProperty('--editor_font_size', `${e.target.value}px`)
}

const readFileContents = async () => {
  try{
      const selecteDir = await open({
        multiple: false,
        title: 'Open Dir',
        directory: true
      });
      settings.setBaseDir(selecteDir)
  } catch(e){
      console.error(e)
  }
}

</script>
