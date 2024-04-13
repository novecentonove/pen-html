<template>
  <div class="file_click flex items-center w-full">
    <div class="flex items-center mr-auto w-full" @click="openFile" @contextmenu.prevent="contextMenu($event)">
      <LongTextIcon class="mr-1 w-3" />
      <input id="rename_input" v-if="doRename" type="text" v-model="model_file_name" @blur="rename" @keyup.esc="abortRename" @keyup.enter="rename" class="bg-inherit">
      <span v-else class="file_li_inner cut_text" :class="isOpenable ? '' : 'opacity-50'">{{ fileName }}</span>
    </div>
    <CloseIcon width="1.5em" class="icon_close pr-2 hover:text-red-700" v-if="props.closable" @click="files.askTocloseTab(props?.file?.path || '')" />
  </div>
</template>

<script setup lang="ts">
import { renameFile, BaseDirectory } from '@tauri-apps/api/fs';
import { type FileType } from '@/types/FileType'
import { useFiles } from '@/stores/use-files'
import { computed, ref } from 'vue'
import { allowedExt } from '@/types/AllowedExt'
import LongTextIcon from '@/icons/LongText.vue'
import CloseIcon from '@/icons/Close.vue'
import { parseFileName } from '@/composable/parseFileName'
// import { resolveResource } from "@tauri-apps/api/path"
import { showMenu } from "tauri-plugin-context-menu"

type Props = { 
  file:  FileType | null,
  closable?: boolean
}

const props = defineProps<Props>()
const files = useFiles()
const fileName = parseFileName(props?.file?.name ?? '')
const model_file_name = ref(props?.file?.name )

//Rename
const doRename = ref(false)
// const rename_input = ref(null)

// onMounted( () => {
//   // enableAppendDir.value
// })

const isOpenable = computed( () => {
  const ext = props.file?.name.split('.').pop()
  return allowedExt.includes(ext ?? '') ? true : false
})

const openFile = async () => {
  if(isOpenable.value && props.file){
    files.addAndSelectPage(props.file)
  }
}

const contextMenu = (event: MouseEvent) => {
  // Determina la posizione del menu in base all'evento click
  const position = { x: event.clientX, y: event.clientY };

  // Definisci gli elementi del menu (adatta e personalizza come necessario)
  const items = [
    { label: 'Rename',  event: acivateRenameFile },
    { label: 'Delete', disabled: true },
    { label: '---' }, // Separatore
    { label: 'Esci', event: () => window.close() }
  ];

  showMenu({ items, pos: position });
};

const acivateRenameFile = () => {
  doRename.value = true

  setTimeout(() => {
    const rename_input = document.querySelector('#rename_input')
    
    if(rename_input){
      // @ts-ignore
      rename_input.focus()
    }
  }, 200);
}

const rename = async () => {

  if(!doRename.value){
    return
  }

  const dir = props?.file?.path

  if(dir){

    const lastIndex = dir.lastIndexOf('/')

    const directoryPath = dir.slice(0, lastIndex)
    const oldName = props?.file?.path ?? ''
    const newName = `${directoryPath}/${model_file_name.value }`

    if(oldName !== newName){
      /* const res = */ await renameFile(oldName, newName)
    }

    doRename.value = false
    files.setTriggerReloadAllDirs()
    
  }
}

const abortRename = () => {
  doRename.value = false
  model_file_name.value = props?.file?.name
}
</script>

<style>
.icon_close{
  opacity: 0;
}
.file_click:hover .icon_close{
  opacity: 0.5;
}
</style>