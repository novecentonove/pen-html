<template>
  <span @click="openFile(props.file)">{{ file.name }}</span>
</template>

<script setup lang="ts">
import FileType from '../../types/FileType';
import { useFiles } from '@/stores/use-files.ts'

const files = useFiles()

type Props = { 
  file:  FileType | null,
  onlySelect?:  boolean,
}
const props = defineProps<Props>()

const openFile = async (file: FileType) => {
  const allowedExt = ['html'];
  var ext = file.name.split('.').pop();

  if(allowedExt.includes(ext)) {
    if(!props.onlySelect){
      files.addPage(file)
    }
    files.setSelectedPath(file.path)
  }
  
}
</script>