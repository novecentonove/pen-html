<template>
  <div class="pt-4 px-12 overflow-y-scroll">
    <!-- <div>
      <Left />
    </div> -->
    <div class="flex flex-col [&>input]:text-neutral-800 [&>select]:text-neutral-800 [&>select]:mb-2 [&>*]:w-full">

      <label class="mt-6">Base Dir</label>
      <button class="border border-neutral-500" @click="readFileDir">{{baseFilesDir ?? 'no dir selected'}}</button>

      <!-- <label class="mt-6">Base Font Dir</label>
      <button class="border border-neutral-500" @click="readFontDir">{{baseFontsDir ?? 'no dir selected'}}</button> -->

      <label class="mt-6">App Font</label>
      <select v-if="baseFontsDir" v-model="selectedAppFont" @change="selectFont('app')">
        <option v-for="(font, i) in fontFamilies" :key="i" :value="font.name">{{font.name}}</option>
      </select>
      <p v-else>Please select your fonts folder</p>

      <label class="mt-6">Editor Font</label>
      <select v-model="selectedEditorFont" @change="selectFont('editor')">
        <option v-for="(font, i) in fontFamilies" :key="i" :value="font.name">{{font.name}}</option>
      </select>

      <label class="mt-6">Text color</label>
      <div class="flex gap-4">
        <div v-for="(color, i) in textColors" 
        :title="color.name" 
        :key="i" 
        class="w-8 h-8" 
        :style="`background-color:${color.value}; ${selectedTextColors === color.value ? 'border: 2px solid orange' : ''}`" 
        @click="selectTextColors(color.value)"
        />
      </div>
      <!-- <select v-model="selectedTextColors" @change="selectTextColors($event as InputFileEvent)">
        <option v-for="(color, i) in textColors" :key="i" :value="color.value">
          <div class="w-2 h-2" :style="`background-color:${color.value}`"></div>
          {{color.name}}
        </option>
      </select> -->

      <label class="mt-6">Font size</label>
      <input type="number" v-model="selectedFontSize" @change="selectFontSize($event as InputFileEvent)">

      <!-- <label class="mt-6">App Font test</label>
      <select v-if="baseFontsDir" v-model="selectedAppFont" @change="selectFont($event as InputFileEvent, 'test')">
        <option v-for="(font, i) in fontFamilies" :key="i" :path="font.path" :value="font.name">{{font.name}}</option>
      </select> -->

    </div>


    <!-- <div class="mt-10">
      app_font: {{ selectedAppFont }} <br>
      editor_font: {{ selectedEditorFont }} <br>
      color_font: {{ selectedTextColors }} <br>
      font_size: {{ selectedFontSize }} <br>
      baseFontsDir: {{ baseFontsDir }}
    </div> -->
    
    <!-- <div class="mt-10">
      <label>Font size test</label>
      <p :style="`font-size:${selectedFontSize}px`">
        But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?
      </p>
    </div> -->

  </div>
</template>

<script setup lang="ts">
import { open } from '@tauri-apps/api/dialog'
import { computed, ref, toRef} from 'vue'
import { useSettings } from '@/stores/use-settings'
// import { relaunch } from '@tauri-apps/api/process'
// @ts-ignore
import Left from 'vue-material-design-icons/ChevronLeft.vue'
import { readDir } from '@tauri-apps/api/fs';

const settings = useSettings()
const selectedAppFont = toRef(settings.getAppFont)
const selectedEditorFont = toRef(settings.getEditorFont)
const selectedTextColors = computed( () => settings.getFontColor)
const selectedFontSize = toRef(settings.getEditorFontSize)
const baseFilesDir = toRef(settings.getBaseDir)
const baseFontsDir = toRef(settings.getBaseFontDir)
// const baseFontsLists = ref([])

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
  {
    name: 'Segoe UI',
  },
  
])

const textColors = ref(
  [
  { name: 'White', value: '#fff' },
  { name: 'Light Gray', value: '#d3d3d3' },
  { name: 'Gray', value: '#b0b0b0' },
  { name: 'Stormy Sky', value: '#909090' },
  { name: 'Cold', value: '#9fa7b6' },
  { name: 'Warm', value: '#bbb5a4' }
])

// const reload = async () => await relaunch()
interface InputFileEvent extends Event {
    target: HTMLInputElement
}

const selectFont = (type:string) => {

  // let path = ''
  // const name = selectedAppFont.value
  // // @ts-ignore
  // if(e.target.options.selectedIndex > -1){
  //   // @ts-ignore
  //   path = (e.target.options[e.target.options.selectedIndex].getAttribute('path'))
  // }

  

  switch (type) {
    case 'app':

      settings.setAppFont(selectedAppFont.value)
      // loadFonts({name, path})
      // console.log('check', document.fonts.check('12px' + name))
      document.documentElement.style.setProperty('--app_font', selectedAppFont.value)
      break;
    case 'editor':
      settings.setEditorFont(selectedEditorFont.value)
      // loadFonts({name, path})
      document.documentElement.style.setProperty('--editor_font', selectedEditorFont.value)
      break;
  }
}

// const loadFonts = async (font) => {
//   const ff = new FontFace(font.name, `url(${font.path})`, {
//     style: "normal",
//     weight: "400",
//   });

//   await ff.load();
//   document.fonts.add(ff);
// }


const selectTextColors = (color: string) => {
  console.log(color)
  settings.setFontColor(color)
  document.documentElement.style.setProperty('--text_color', color)
}

const selectFontSize = (e: InputFileEvent) => {
  const size = Number(+e.target.value)
  settings.setEditorFontSize(size)
  document.documentElement.style.setProperty('--editor_font_size', `${e.target.value}px`)
}

const readFileDir = async () => {
  try{
      const selecteDir = await open({
        multiple: false,
        title: 'Open Dir',
        directory: true
      });
      if(selecteDir){
        settings.setBaseDir(selecteDir as string)
      }
  } catch(e){
      console.error(e)
  }
}

// const readFontDir = async () => {
//   try{
//       const selecteDir = await open({
//         multiple: false,
//         title: 'Open Dir',
//         directory: true
//       });
//       if(selecteDir){
//         settings.setBaseFontDir(selecteDir as string)
//       }
//   } catch(e){
//       console.error(e)
//   }
// }

const getLStructureDir = async (content: any) => { 
  for (const file of content) {
      if(typeof file.children === 'object'){
        const inside = await readDir((file.path as string))
        getLStructureDir(inside)
        file.children = (inside)
      }
    }
    return content
}

// onMounted( async () => {
//   // Read font dir
//   if(baseFontsDir.value){
//     const content = await readDir(baseFontsDir.value as string)
//     const structureList = await getLStructureDir(content)
//     if (structureList) {
//       let flattened = structureList.map( el => {
//         const ext = el.name.split('.').pop()
//         if(ext == 'ttf') return el
//       })
//       baseFontsLists.value = flattened
//     }
//   }
// })

// const logFontData = async () => {
//   try {
//     const availableFonts = await window.queryLocalFonts();
//     for (const fontData of availableFonts) {
//       console.log(fontData.postscriptName);
//       console.log(fontData.fullName);
//       console.log(fontData.family);
//       console.log(fontData.style);
//     }
//   } catch (err) {
//     console.error(err.name, err.message);
//   }
// }


</script>
