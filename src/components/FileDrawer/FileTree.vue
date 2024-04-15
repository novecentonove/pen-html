<template>

  <li v-if="props.children" :style="indent" class="file_li" @click="toggleChildren()">
    <FolderIcon width="0.95em" class="mr-1" /><span class="file_li_inner cut_text">{{ props?.file?.name }}</span>
  </li>

  <li v-else :style="indent" class="file_li marker:relative">
    <FileClick :file="props.file" />    
  </li>

  <FileTree v-if="children && showChildren" v-for="child in props.children" 
    :children="child.children"
    :depth="props.depth+1"
    :file="child"
  />

</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { type FileType } from '@/types/FileType'
  import FileTree from './FileTree.vue'
  import FileClick from './FileClick.vue'
  import FolderIcon from '@/icons/Folder.vue'
  import { useToggle } from '@vueuse/core'
  import { useSettings } from '@/stores/use-settings'

  const props = defineProps<{
    children?:FileType[]
    depth: number
    file: FileType
  }>()

  const settings = useSettings()
  const getShowSelectedFolder = computed( () => settings.getShowSelectedFolder)
  const [showChildren, toggleChildren] = useToggle()

  const indent = computed( () => `padding-left: ${props.depth * 10}px` )

  onMounted( () => {
    if(getShowSelectedFolder.value && props.depth == 0){
      toggleChildren()
    } 
  })
</script>