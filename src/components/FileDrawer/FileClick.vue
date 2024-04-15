<template>
  <div class="file_click flex items-center w-full">
    <div class="flex items-center mr-auto w-full" @click="openFile" @contextmenu.prevent="contextMenu($event)">
      <LongTextIcon class="mr-1 w-3" />
      <input id="rename_input" v-if="doRename" type="text"  class="bg-inherit focus:border-blue-500" :class="{attention: attentionExistsFileName}" v-model="m_file_name" @blur="rename" @keyup.esc="abortRename" @keyup.enter="rename">
      <span v-else class="_filename file_li_inner cut_text" :class="isOpenable ? '' : 'opacity-50'">{{ fileName }}</span>
    </div>
    <CloseIcon width="1.5em" class="icon_close pr-2 hover:text-red-700" v-if="props.closable" @click="files.askTocloseTab(props?.file?.path || '')" />
  </div>
</template>

<script setup lang="ts">
import { readDir, renameFile, exists, BaseDirectory, removeFile} from '@tauri-apps/api/fs';
import { type FileType } from '@/types/FileType'
import { useFiles } from '@/stores/use-files'
import { computed, onMounted, ref  } from 'vue'
import { allowedExt } from '@/types/AllowedExt'
import LongTextIcon from '@/icons/LongText.vue'
import CloseIcon from '@/icons/Close.vue'
import { parseFileName } from '@/composable/parseFileName'
import { showMenu } from "tauri-plugin-context-menu"

type Props = { 
  file:  FileType | null,
  closable?: boolean
}

const props = defineProps<Props>()
const files = useFiles()

const fileName = parseFileName(props?.file?.name ?? '')
const m_file_name = ref(props?.file?.name )
const doRename = ref(false)
const existingFiles = ref<string[]>([]);
const deleteEvent = ref({})

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
  if(props.closable){
    return
  }
  // Determina la posizione del menu in base all'evento click
  const position = { x: event.clientX, y: event.clientY };

  deleteEvent.value = event
  // Definisci gli elementi del menu (adatta e personalizza come necessario)
  const items = [
    { label: 'Rename',  event: acivateRenameFile },
    { label: 'Delete',  event: acivateDeleteFile},
    { label: '---' }, // Separatore
    { label: 'Esci', event: () => window.close() }
  ];

  showMenu({ items, pos: position });
};

onMounted( () => {
  // console.log('AppData', BaseDirectory.AppData)
})

const acivateRenameFile = async () => {
  doRename.value = true
  setTimeout(() => {
    const rename_input = document.querySelector('#rename_input')
    if(rename_input){
      // @ts-ignore
      rename_input.focus()
    }
  }, 200);

  const path = props?.file?.path ?? ''
  const res = await readDir(getPathFromString(path) as string)
  const fileList = res.map(file => file.name)

  fileList.forEach((el) => {
    // @ts-ignore
    existingFiles.value.push(el)
  });
}

const rename = async () => {

  if(!doRename.value){
    return
  }

  if(attentionExistsFileName.value){
    abortRename()
    return
  }
  const dir = props?.file?.path

  if(dir){

    const oldName = props?.file?.path ?? ''
    const newName = `${getPathFromString(props?.file?.path)}/${m_file_name.value }`

    if(oldName !== newName){
      const doExists = await exists(newName, { dir: BaseDirectory.AppData })

      if(!doExists){
        await renameFile(oldName, newName)
      }

      files.renameOpenTab(oldName, newName)
    }

    doRename.value = false
    files.setTriggerReloadAllDirs()
    
  }
}

const abortRename = () => {
  doRename.value = false
  m_file_name.value = props?.file?.name
}

const getPathFromString = (path: string) => {
  const lastIndex = path.lastIndexOf('/')
  return path.slice(0, lastIndex)
}

const attentionExistsFileName = computed( () => {
  if(m_file_name.value){
    return existingFiles.value.some(file => {
      if(file !== props?.file?.name){
        return file === m_file_name.value
      }
    })
  }
  return false
})

const acivateDeleteFile = async () => {
  // @ts-ignore
  // debugger
  // const fileFromEvent = deleteEvent.value.target.querySelector('._filename').innerHTML
  // if(fileFromEvent){
  //   console.log('event ', fileFromEvent, props?.file?.name)
  // }
  console.log(props?.file?.name)

  // BUG context extension. Non funziona bene con i file
  return
  alert('info')
  const path = props?.file?.path
  if(path){
    // await removeFile(props.file.path, { dir: BaseDirectory.AppConfig })
    console.log(path)
    files.setTriggerReloadAllDirs()
    files.destroyTab(path)
  }
}
</script>

<style>
.icon_close{
  opacity: 0;
}
.file_click:hover .icon_close{
  opacity: 0.5;
}
.attention{
  background-color: #3D0606;
}
</style>