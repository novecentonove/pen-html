<template>

  <li v-if="props.children" @contextmenu.prevent="contextMenu($event)" :style="indent" class="file_li" @click="toggleChildren()">
    <FolderIcon width="0.95em" class="mr-1" />
      <span class="file_li_inner cut_text">{{ props?.file?.name }}
    </span>
  </li>

  <li v-else :style="indent" class="file_li marker:relative">
    <FileClick :file="props.file" />    
  </li>

  <FileTree v-if="children && showChildren" v-for="child in props.children" 
    :children="child.children"
    :depth="props.depth+1"
    :file="child"
  />

<DialogInput v-model="newFileName" :activate="activate" @action="createNewFile"/>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { type FileType } from '@/types/FileType'
  import { showMenu } from "tauri-plugin-context-menu"
  import FileTree from './FileTree.vue'
  import FileClick from './FileClick.vue'
  import FolderIcon from '@/icons/Folder.vue'
  import { useToggle } from '@vueuse/core'
  import { useSettings } from '@/stores/use-settings'
  import DialogInput from '@/components/Dialogs/DialogInput.vue'
  import { writeTextFile, exists, BaseDirectory } from '@tauri-apps/api/fs'
  import { useFiles } from '@/stores/use-files'

  const props = defineProps<{
    children?:FileType[]
    depth: number
    file: FileType
  }>()

  const files = useFiles()
  const settings = useSettings()
  const getShowSelectedFolder = computed( () => settings.getShowSelectedFolder)
  const [showChildren, toggleChildren] = useToggle()
  const indent = computed( () => `transform: translate(${props.depth * 10}px)` )
  const newFileName = ref('')
  const activate = ref({
    message: 'Create a new file',
    trigger: 0
  })
  onMounted( () => {
    if(getShowSelectedFolder.value && props.depth == 0){
      toggleChildren()
    }
  })

  const contextMenu = (event: MouseEvent) => {
  const position = { x: event.clientX, y: event.clientY }
  const items = [
    { label: 'New file',  event: () => activateNewFile() },
    { label: 'Rename',  disabled: true },
    { label: 'Delete', disabled: true },
    { label: '---' }, // Separatore
    { label: 'Esci', event: () => window.close() }
  ];

  showMenu({ items, pos: position });
}

const activateNewFile = () => {
  activate.value.trigger++
}

const createNewFile = async () => {
  const dir = props.file.path
  const name = newFileName.value
  const createFile = `${dir}/${name}`

  const doExists = await exists(createFile, { dir: BaseDirectory.AppData  })
  if(!doExists){
    await writeTextFile(createFile, '', { dir: BaseDirectory.AppData })
    files.setTriggerReloadAllDirs()

    setTimeout(() => {
      files.addAndSelectPage({path: createFile, name: name})
    }, 500);
  } else {
    alert('Already existing file')
  }
}


</script>