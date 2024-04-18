<template>

<Teleport v-if="true" :to="`#${snakeCasePath}`">
  <TitleTabAttributes
    :unsaved="false"
    :name="props.name"
    :path="props.path"
    :snake-case-path="snakeCasePath"
    />
</Teleport>

<div class="settings overflow-y-scroll px-12 mt-6 ml-[2%] mr-10">

  <div class="text-right">
    <p class="text-xs opacity-50">Pen html - v. {{ appVersion }}</p>
    <p class="relative mt-2 cursor-pointer underline" @click="files.addAndSelectPage(howToFile)">How it works</p>
  </div>

  <div class="max-w-[450px] ml-[5%] mb-6 font_colors flex flex-col gap-6">
    <div class="input_section flex flex-col">
      <label>
        Base Folder<br>
        <span class="opacity-50">Your html folder for your notes</span>
      </label>
      <button :title="settings.getBaseDir" class="buttonFolder border h-8 cursor-pointer" @click="readFileDir('base')">{{shortBaseFilesDir || 'Please select a directory'}}</button>
    </div>

    <div class="input_section flex flex-col">
      <label>
        <input v-model="enableAppendDir" @change="settings.setEnableAppendDir(enableAppendDir)" class="accent-slate-900" type="checkbox">
        Add extra Folder<br>
        <div class="flex justify-between">
          <span class="opacity-50">Your extra html folder for your notes</span>
        </div>
      </label>
      <button :title="settings.getAppendedDir" class="buttonFolder border h-8 cursor-pointer" @click="readFileDir('append')">{{shortBaseAppededDir || 'Please select a directory'}}</button>
    </div>

    <div class="input_section flex flex-col">
      <label>
        <input v-model="enableAppendFile" @change="settings.setEnableAppendFile(enableAppendFile)" class="accent-slate-900" type="checkbox">
        Add extra file<br>
        <div class="flex justify-between">
          <span class="opacity-50">Your extra file for your notes</span>
        </div>
      </label>
      <button :title="settings.getfileToAppend.path" class="buttonFolder border h-8 cursor-pointer" @click="readFile">{{shortBaseAppededFile || 'Please select a file'}}</button>
    </div>

    <div class="input_section flex">
      <input v-model="showSelectedFolder" @change="settings.setShowSelectedFolder(showSelectedFolder)" id="show_folder_name" type="checkbox" class="accent-slate-900 mr-1">
      <label for="show_folder_name"> Show selected folders
        <p class="opacity-50">The content on your folder wil be wrapped <!--(you need to reaload to take effect) --></p>
      </label>
    </div>

    <!-- Colors and theme-->
    <div class="border_section mt-12 -ml-4 pl-4">
      <label>Colors and theme</label>
      <div class="input_section flex flex-col">
        <label>Text color</label>
        <div class="mt-2 flex justify-between">
          <div v-for="(color, i) in textColors" 
          :title="color.name" 
          :key="i" 
          class="w-10 h-10" 
          :style="`background-color:${color.value}; ${selectedTextColors === color.value ? 'border: 2px solid darkred' : ''}`" 
          @click="selectTextColors(color.value)"
          />
        </div>
      </div>

      <div class="input_section flex flex-col mb-1">
        <label>Theme</label>
        <select v-if="themeSettings" v-model="selectedTheme" @change="selectTheme">
          <option v-for="(theme, i) in themeSettings" :key="i" :value="theme.name">{{theme.name}}</option>
        </select>
      </div>

    </div>

    <!-- APP -->
    <div class="border_section mt-12 -ml-4 pl-4">
      <label>App</label>
      <div class="flex flex-col">
        <label class="mt-2">Font family <span class="text-xs py-2 opacity-50">Eg: 'Arial', 'Droid Sans Mono', monospace</span></label>
        <input type="text" v-model="selectedAppFont" @change="selectFont('app')">
      </div>

      <div class="input_section relative flex flex-col">
        <label>Font size <span class="text-xs py-2 opacity-50">(Rem)</span><i>(todo)</i></label>
          <input disabled type="text" pattern="^\d+(\.\d+)?$">
          <div class="absolute right-1 bottom-1 h-[22px] flex flex-col justify-between align-middle leading-none rounded-sm">
            <div class="w-4 h-2.5 rounded-sm bg_as_border_color" style="filter: brightness(90%)"></div>
            <div class="w-4 h-2.5 rounded-sm bg_as_border_color" style="filter: brightness(75%)"></div>
          </div>
      </div>

      <div class="input_section relative flex flex-col">
        <label>Line height <span class="text-xs py-2 opacity-50">(Rem)</span><i>(todo)</i></label>
        <input disabled type="text" pattern="^\d+(\.\d+)?$">
        <div class="absolute right-1 bottom-1 h-[22px] flex flex-col justify-between align-middle leading-none rounded-sm">
          <div class="w-4 h-2.5 rounded-sm bg_as_border_color" style="filter: brightness(90%)"></div>
          <div class="w-4 h-2.5 rounded-sm bg_as_border_color" style="filter: brightness(75%)"></div>
        </div>
      </div>
    </div>

    <!-- EDITOR -->
    <div class="border_section mt-12 -ml-4 pl-4">
      <label>Editor</label>
      <div class="flex flex-col">
        <label class="mt-2">Font family <span class="text-xs py-2 opacity-50">Eg: 'Arial', 'Droid Sans Mono', monospace</span></label>
        <input v-model="selectedEditorFont" @change="selectFont('editor')">
      </div>

      <div class="input_section relative flex flex-col">
        <label>Font size <span class="text-xs py-2 opacity-50">(Rem)</span></label>
        <input type="text" pattern="^\d+(\.\d+)?$" v-model="selectedFontSize" @change="selectFontSize($event as InputFileEvent)">
        <div class="absolute right-1 bottom-1 h-[22px] flex flex-col justify-between align-middle leading-none rounded-sm">
          <div class="w-4 h-2.5 rounded-sm bg_as_border_color" style="filter: brightness(90%)" @click="increaseFontSize('+')"></div>
          <div class="w-4 h-2.5 rounded-sm bg_as_border_color" style="filter: brightness(75%)" @click="increaseFontSize('-')"></div>
        </div>
      </div>

      <div class="input_section relative flex flex-col">
        <label>Line height <span class="text-xs py-2 opacity-50">(Rem)</span><i>(todo)</i></label>
        <input disabled type="text" pattern="^\d+(\.\d+)?$">
        <div class="absolute right-1 bottom-1 h-[22px] flex flex-col justify-between align-middle leading-none rounded-sm">
          <div class="w-4 h-2.5 rounded-sm bg_as_border_color" style="filter: brightness(90%)"></div>
          <div class="w-4 h-2.5 rounded-sm bg_as_border_color" style="filter: brightness(75%)"></div>
        </div>
      </div>
  </div>

  <div class="editor_font editor_font_size mt-4 leading-normal">
    <p>Editor text example:</p>
    <p class="mt-4">
      But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.
    </p>
  </div>

  <div class="h-12"></div>

  </div>
</div>
</template>

<script setup lang="ts">
  import { open } from '@tauri-apps/api/dialog'
  import { computed, toRef} from 'vue'
  import { useSettings } from '@/stores/use-settings'
  import { readDir } from '@tauri-apps/api/fs'
  import TitleTabAttributes from '@/components/HomeTabs/TitleTabAttributes.vue'
  // @ts-ignore
  import { themeSettings } from '@/utils/themeSettings.js'
  import { getVersion } from '@tauri-apps/api/app'
  import { snakeCase } from 'lodash';
  import { getDefaultPath } from '@/composable/getDefaultPath'
  import { useFiles } from '@/stores/use-files'
  import { howToFile } from '@/types/HowToFile'

  type Props = {
    modelValue: string
    name: string
    path: string
    onSelectedPath: number
  }

  const props = defineProps<Props>()
  const files = useFiles()
  const settings = useSettings()

  const snakeCasePath = computed( (): string => snakeCase(props.path))
  const selectedAppFont = toRef(settings.getAppFont)
  const selectedEditorFont = toRef(settings.getEditorFont)
  const selectedTextColors = computed( () => settings.getFontColor)
  const selectedFontSize = toRef(settings.getEditorFontSize)
  const selectedTheme = toRef(settings.getTheme)
  const appVersion = await getVersion()
  const enableAppendFile = toRef(settings.enableAppendFile)
  const enableAppendDir = toRef(settings.getEnableAppendDir)
  const showSelectedFolder = toRef(settings.getShowSelectedFolder)


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
    { name: 'Fog in Padania', value: '#808080' },
    { name: 'Cold', value: '#7b828e' },
    { name: 'Warm', value: '#8c887d' }
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
        break
      case 'editor':
        settings.setEditorFont(selectedEditorFont.value)
        document.documentElement.style.setProperty('--editor_font', selectedEditorFont.value)
        break
    }
  }

  const selectTextColors = (color: string) => {
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

    let path = ''
    
    switch (type) {
      case 'append':
        path = settings.getAppendedDir
        break
      case 'base':
        path = settings.getBaseDir
        break
    }

    try{
      const selecteDir = await open({
        multiple: false,
        title: 'Choose base folder',
        directory: true,
        defaultPath: await getDefaultPath(path)
      })

      if(selecteDir){
        switch (type) {
          case 'append':
            settings.setAppendedDir(selecteDir as string)
            break
          case 'base':
            settings.setBaseDir(selecteDir as string)
            break
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
        directory: false,
        defaultPath: await getDefaultPath('') // TODO
      })
      if(selecteFile){
        const name = (selecteFile as string).substring(selecteFile.lastIndexOf('/')+1)
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
  margin-top: .5rem;
}

.border_section {
 border-left: 3px solid var(--border_color);
}
.input_section{
  margin-top: 1rem;
}

.settings{
  height: calc(100vh - 111px);
}


.buttonFolder{
  margin-top: .5rem;
  border: 1px solid var(--border_color);
  background-color: var(--view_color);
}

input:invalid {
  background-color: brown;
}
</style>