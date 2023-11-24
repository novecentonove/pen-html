<template>
  <li v-if="props.children" :style="indent" class="cursor-pointer flex items-center" @click="toggleChildren()">
    <Folder :size="12" class="mr-1" />{{ props.file.name }}
  </li>

  <li v-else :style="indent" class="cursor-pointer flex items-center" >
    <Text :size="12" class="mr-1" /><FileClick :file="props.file" />
  </li>

  <FileTree v-if="children && showChildren" v-for="child in props.children" 
    :children="child.children"
    :depth="props.depth+1"
    :file="child"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { type FileType } from '@/types/FileType'
  import FileTree from './FileTree.vue'
  import FileClick from './FileClick.vue'
  // @ts-ignore
  import Folder from 'vue-material-design-icons/Folder.vue';
  // @ts-ignore
  import Text from 'vue-material-design-icons/TextLong.vue';
  import { useToggle } from '@vueuse/core'

  const props = defineProps<{
    children?:FileType[]
    depth: number;
    file: FileType;
  }>();

  const indent = computed( () => `transform: translate(${props.depth * 10}px)` )
  // const showChildren = ref(false)

  const [showChildren, toggleChildren] = useToggle()
  // const toggleChildren = () => {
  //   showChildren.value = !showChildren.value
  // }
</script>
