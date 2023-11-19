<template>
  <li v-if="props.children" :style="indent" class="flex items-center" @click="toggleChildren">
    <Folder :size="12" class="mr-1" />{{ props.file.name }}
  </li>
  <li v-else :style="indent" class="flex items-center" >
    <Text :size="12" class="mr-1" /><FileClick :file="props.file" />
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
import FileClick from './FileClick.vue'

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

</script>
