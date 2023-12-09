<template>
  <div class="pt-4 px-12 overflow-y-scroll">
    <div class="settings font_colors flex flex-col">

      <label class="mt-6">Base Directory</label>
      <button class="baseDir border h-12 cursor-pointer" @click="readFileDir">{{baseFilesDir ?? 'no dir selected'}}</button>

      <label class="mtop">App Font</label>
      <input type="text" v-model="selectedAppFont" @change="selectFont('app')">
      <p class="text-xs py-2 text-neutral-500">Eg: 'Arial', 'Droid Sans Mono', monospace</p>

      <label class="mtop">Editor Font</label>
      <input v-model="selectedEditorFont" @change="selectFont('editor')">

      <label class="mtop">Text color</label>
      <div class="flex justify-between">
        <div v-for="(color, i) in textColors" 
        :title="color.name" 
        :key="i" 
        class="w-10 h-10" 
        :style="`background-color:${color.value}; ${selectedTextColors === color.value ? 'border: 2px solid darkred' : ''}`" 
        @click="selectTextColors(color.value)"
        />
      </div>

      <label class="mtop relative flex flex-col">Font size
        <input type="text" pattern="^\d+(\.\d+)?$" v-model="selectedFontSize" @change="selectFontSize($event as InputFileEvent)">
        <div class="absolute right-1 bottom-1 flex flex-col bg-black leading-none rounded-sm">
          <div class="w-4 h-3 mb-px rounded-sm bg_as_border_color" style="filter: brightness(90%)" @click="increaseFontSize('+')"></div>
          <div class="w-4 h-3 rounded-sm bg_as_border_color" style="filter: brightness(75%)" @click="increaseFontSize('-')"></div>
        </div>
      </label>

      <label class="mtop">Theme</label>
      <select v-if="themeSettings" v-model="selectedTheme" @change="selectTheme">
        <option v-for="(theme, i) in themeSettings" :key="i" :value="theme.name">{{theme.name}}</option>
      </select>

    </div>
  </div>
</template>

<script setup lang="ts">
  import { open } from '@tauri-apps/api/dialog'
  import { computed, toRef} from 'vue'
  import { useSettings } from '@/stores/use-settings'
  // @ts-ignore
  import Left from 'vue-material-design-icons/ChevronLeft.vue'
  import { readDir } from '@tauri-apps/api/fs';
    // @ts-ignore
  import { themeSettings } from '@/utils/themeSettings.js'
  
  const settings = useSettings()
  const selectedAppFont = toRef(settings.getAppFont)
  const selectedEditorFont = toRef(settings.getEditorFont)
  const selectedTextColors = computed( () => settings.getFontColor)
  const selectedFontSize = toRef(settings.getEditorFontSize)
  const baseFilesDir = toRef(settings.getBaseDir)
  const selectedTheme = toRef(settings.getTheme)

  const textColors = [
    { name: 'White', value: '#fff' },
    { name: 'Light Gray', value: '#d3d3d3' },
    { name: 'Gray', value: '#b0b0b0' },
    { name: 'Stormy Sky', value: '#909090' },
    { name: 'Cold', value: '#9fa7b6' },
    { name: 'Warm', value: '#bbb5a4' }
  ]

  // const reload = async () => await relaunch()
  interface InputFileEvent extends Event {
      target: HTMLInputElement
  }

  const selectTheme = () => {
    settings.setTheme(selectedTheme.value)
    settings.applyTheme()
  }

  const selectFont = (type:string) => {

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

  const selectTextColors = (color: string) => {
    console.log(color)
    settings.setFontColor(color)
    document.documentElement.style.setProperty('--text_color', color)
  }

  const selectFontSize = (e: InputFileEvent) => {

    if(!e.target.validity.valid){
      return
    }

    const size = Number(+e.target.value)
    settings.setEditorFontSize(size)
    document.documentElement.style.setProperty('--editor_font_size', `${e.target.value}px`)
  }

  const increaseFontSize = (type: string) => {
    const increase = 0.01
    if(type === '+'){
      selectedFontSize.value = +(selectedFontSize.value+increase).toFixed(3)
    } else if (type === '-'){
      selectedFontSize.value = +(selectedFontSize.value-increase).toFixed(3)
    }
    document.documentElement.style.setProperty('--editor_font_size', `${selectedFontSize.value}rem`)
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

</script>


<style>
.settings input,
.settings select {
  appearance: none;
  -webkit-appearance: none;
  height: 30px;
  padding-left: 0.5em;
  border-radius: 0.2em;
  border: 1px solid var(--border_color);
  background-color: var(--view_color);
  margin: 0.1rem;
  /* filter: brightness(190%); */
}

.settings .mtop {
  margin-top: 30px;
}

.baseDir{
  border: 1px solid var(--border_color);
  background-color: var(--view_color);
}

input:invalid {
  background-color: brown;
}


</style>