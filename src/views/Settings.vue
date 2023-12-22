<template>
  <div class="px-12 flex flex-col h-full">
    <div>
      <div class="settings my-6 font_colors flex flex-col gap-6">

        <div class="flex flex-col">
          <label class="mtop">Base Directory</label>
          <button class="baseDir border h-8 cursor-pointer" @click="readFileDir('base')">{{shortBaseFilesDir}}</button>
        </div>

        <div class="flex flex-col">
          <label class="mtop">
            <input v-model="enableAppendDir" @change="settings.setEnableAppendDir(enableAppendDir)" class="accent-slate-900" type="checkbox">
            Enable append Dir
          </label>
          <button class="baseDir border h-8 cursor-pointer" @click="readFileDir('append')">{{shortBaseAppededDir}}</button>
        </div>

        <div class="flex flex-col">
          <label class="mtop">
            <input v-model="enableAppendFile" @change="settings.setEnableAppendFile(enableAppendFile)" class="accent-slate-900" type="checkbox">
            Enable append file
          </label>
          <button class="baseDir border h-8 cursor-pointer" @click="readFile">{{shortBaseAppededFile}}</button>
        </div>

        <div class="flex flex-col">
          <label class="mtop">App Font</label>
          <input type="text" v-model="selectedAppFont" @change="selectFont('app')">
          <p class="text-xs py-2 text-neutral-500">Eg: 'Arial', 'Droid Sans Mono', monospace</p>
        </div>

        <div class="flex flex-col">
          <label class="mtop">Editor Font</label>
          <input v-model="selectedEditorFont" @change="selectFont('editor')">
        </div>

        <div class="flex flex-col">
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
        </div>

        <div class="flex flex-col">
          <label class="mtop relative flex flex-col">Font size
            <input type="text" pattern="^\d+(\.\d+)?$" v-model="selectedFontSize" @change="selectFontSize($event as InputFileEvent)">
            <div class="absolute right-1 bottom-1 flex flex-col bg-black leading-none rounded-sm">
              <div class="w-4 h-3 mb-px rounded-sm bg_as_border_color" style="filter: brightness(90%)" @click="increaseFontSize('+')"></div>
              <div class="w-4 h-3 rounded-sm bg_as_border_color" style="filter: brightness(75%)" @click="increaseFontSize('-')"></div>
            </div>
          </label>
        </div>

        <div class="flex flex-col">
          <label class="mtop">Theme</label>
          <select v-if="themeSettings" v-model="selectedTheme" @change="selectTheme">
            <option v-for="(theme, i) in themeSettings" :key="i" :value="theme.name">{{theme.name}}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="fixed bottom-2 right-2">
      <p class="text-xs opacity-50">Pen html - v. {{ appVersion }}</p>
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
  import { getVersion } from '@tauri-apps/api/app'

  const settings = useSettings()
  const selectedAppFont = toRef(settings.getAppFont)
  const selectedEditorFont = toRef(settings.getEditorFont)
  const selectedTextColors = computed( () => settings.getFontColor)
  const selectedFontSize = toRef(settings.getEditorFontSize)
  const selectedTheme = toRef(settings.getTheme)
  const appVersion = await getVersion()
  const enableAppendFile = toRef(settings.enableAppendFile)
  const enableAppendDir = toRef(settings.getEnableAppendDir)

  const shortBaseFilesDir = computed(() => {
    const url = settings.getBaseDir.split('/')

    if(url && url.length > 3){
      return '../' + url[url.length-2] + '/' + url[url.length-1]
    } else {
      return url.join('/')
    }
  })

  const shortBaseAppededDir = computed(() => {
    const url = settings.getAppendedDir.split('/')

    if(url && url.length > 3){
      return '../' + url[url.length-2] + '/' + url[url.length-1]
    } else {
      return url.join('/')
    }
  })

  const shortBaseAppededFile = computed(() => {

    const file = settings.getfileToAppend

    if(Object.keys(file).length){
      const url = file.path.split('/')

      if(url && url.length > 3){
        return '../' + url[url.length-2] + '/' + url[url.length-1]
      } else {
        return url.join('/')
      }
    }

    return ''
  })

  const textColors = [
    { name: 'Light Gray', value: '#d3d3d3' },
    { name: 'Gray', value: '#b0b0b0' },
    { name: 'Stormy Sky', value: '#909090' },
    { name: 'Fog in Padania', value: '#6b6b6b' },
    { name: 'Cold', value: '#9fa7b6' },
    { name: 'Warm', value: '#bbb5a4' }
  ]

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
        document.documentElement.style.setProperty('--app_font', selectedAppFont.value)
        break;
      case 'editor':
        settings.setEditorFont(selectedEditorFont.value)
        document.documentElement.style.setProperty('--editor_font', selectedEditorFont.value)
        break;
    }
  }

  const selectTextColors = (color: string) => {
    console.log(color)
    settings.setFontColor(color)
    settings.applySettings()
  }

  const selectFontSize = (e: InputFileEvent) => {

    if(!e.target.validity.valid){
      return
    }

    const size = Number(+e.target.value)
    settings.setEditorFontSize(size)
    settings.applySettings()
  }

  const increaseFontSize = (type: string) => {
    const increase = 0.01
    if(type === '+'){
      selectedFontSize.value = +(selectedFontSize.value+increase).toFixed(3)
    } else if (type === '-'){
      selectedFontSize.value = +(selectedFontSize.value-increase).toFixed(3)
    }
    settings.setEditorFontSize(selectedFontSize.value)
    settings.applySettings()
  }

  const readFileDir = async (type: string) => {
    try{
        const selecteDir = await open({
          multiple: false,
          title: 'Open Dir',
          directory: true
        });
        if(selecteDir){
          switch (type) {
            case 'append':
              settings.setAppendedDir(selecteDir as string)
              break;
            case 'base':
              settings.setBaseDir(selecteDir as string)
              break;
          }
        }
    } catch(e){
        console.error(e)
    }
  }

  const readFile = async () => {
    try{
        const selecteFile = await open({
          multiple: false,
          title: 'Open file',
          directory: false
        });
        if(selecteFile){
          const name = (selecteFile as string).substring(selecteFile.lastIndexOf('/')+1);
          const val = {
            name: name,
            path: selecteFile as string
          }
          settings.setfileToAppend(val)
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
  .settings input:not([type='checkbox']),
  .settings select {
    appearance: none;
    -webkit-appearance: none;
    height: 30px;
    padding-left: 0.5em;
    border-radius: 0.2em;
    border: 1px solid var(--border_color);
    background-color: var(--view_color);
    margin: 0.1rem;
  }

  .settings .mtop {
    /* margin-top: 15px; */
  }

  .baseDir{
    border: 1px solid var(--border_color);
    background-color: var(--view_color);
  }

  input:invalid {
    background-color: brown;
  }
</style>