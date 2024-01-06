<template>

  <li v-if="props.children" :style="indent" class="file_li" @click="toggleChildren()" @contextmenu.prevent="toggleMenu('dir')">
    <FolderIcon width="0.95em" class="mr-1" /><span class="file_li_inner cut_text">{{ props.file.name }}</span>
  </li>

  <li v-else ref="toggleMenuRef" :style="indent" class="file_li marker:relative" @contextmenu.prevent="toggleMenu()">
    <FileClick :file="props.file" />

    <div v-if="showMenu" class="absolute right_click_menu view_color text_color">
      <ul class="static">
        <li class="menu-item">Rename</li>
        <li class="menu-item">Delete</li>
      </ul>
    </div>
    
  </li>

  <FileTree v-if="children && showChildren" v-for="child in props.children" 
    :children="child.children"
    :depth="props.depth+1"
    :file="child"
  />

</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { type FileType } from '@/types/FileType'
  import FileTree from './FileTree.vue'
  import FileClick from './FileClick.vue'
  // @ts-ignore
  import FolderIcon from '@/icons/Folder.vue'
  import { useToggle } from '@vueuse/core'
  import { onClickOutside } from '@vueuse/core'

  const props = defineProps<{
    children?:FileType[]
    depth: number
    file: FileType
    closeMenu?: number
  }>()

  const emit = defineEmits(['closeMenu'])

  const toggleMenuRef = ref(null)
  const showMenu = ref(false)

  const toggleMenu = (type?: string) => {

    return //TODO

    if(!showMenu.value){
      emit('closeMenu')
    } 
    if(type !== 'dir'){
      setTimeout(() => {
        showMenu.value = !showMenu.value
      }, 50)
    }
      
  }

  const closeMenu = () => {
    showMenu.value = false
    return false
  }

  const [showChildren, toggleChildren] = useToggle()

  onClickOutside(toggleMenuRef, closeMenu)

  const indent = computed( () => `transform: translate(${props.depth * 10}px)` )

  watch(() => props.closeMenu, () => {
    closeMenu()
  })
</script>

<style>
.right_click_menu ul{
  /* width: 125px; */
  height: 100px;
  padding: 10px 20px;
  border: 1px solid var(--text_color);
  border-radius: 5px;
}

</style>