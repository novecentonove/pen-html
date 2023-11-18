<template>
  <li v-if="props.children" :style="indent" class="flex items-center" @click="toggleChildren">
    <Folder :size="12" class="mr-1" /> {{ props.file.name }}
  </li>
  <li v-else :style="indent" class="flex items-center" @click="openFile(props.file)">
    <Text :size="12" class="mr-1" /> {{ props.file.name }}
  </li>
  
  <FileTree v-if="children && showChildren" v-for="(file, i) in children" 
    :children="file.children"
    :depth="props.depth+1"
    :file="file"
  />
</template>

<script setup lang="ts">
import FileType from '@/types/FileType.ts'
import Folder from 'vue-material-design-icons/Folder.vue';
import Text from 'vue-material-design-icons/TextLong.vue';
import FileTree from './FileTree.vue'
import { computed, ref } from 'vue';
import { useFiles } from '@/stores/use-files.ts'

const store = useFiles()

const props = defineProps<{
  children?: object
  depth: number
  file: FileType
}>()


const indent = computed( () => `transform: translate(${props.depth * 10}px)` )
const showChildren = ref(false)

const toggleChildren = () => {
  showChildren.value = !showChildren.value
}

const openFile = async (file: FileType) => {
  const allowedExt = ['md', 'txt', 'html'];
  var ext = file.name.split('.').pop();
  if(allowedExt.includes(ext)) {
    store.addPage(file)
  }
}

</script>
