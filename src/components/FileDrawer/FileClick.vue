<template>
  <span :class="isOpenable ? '' : 'opacity-50'" @click="openFile">{{ file?.name }}</span>
</template>

<script setup lang="ts">
import { type FileType } from '@/types/FileType';
import { useFiles } from '@/stores/use-files'
import { computed } from 'vue';


type Props = { 
  file:  FileType | null,
  onlySelect?:  boolean,
}

const props = defineProps<Props>()
const files = useFiles()

const allowedExt = ['html'];
const isOpenable = computed( () => {
  const ext = props.file?.name.split('.').pop();
  return allowedExt.includes(ext ?? '') ? true : false
})

const openFile = async () => {

  if(isOpenable && props.file){
    
    if(!props.onlySelect){
      files.addPage(props.file)
    }

    files.setSelectedPath(props.file.path)
  }

}


</script>