<template>
  <span @click="openFile(props.file)">{{ file?.name }}</span>
</template>

<script setup lang="ts">
import { FileType } from '../../types/FileType';
import { useFiles } from '@/stores/use-files.ts'

const files = useFiles()

type Props = { 
  file:  FileType | null,
  onlySelect?:  boolean,
}
const props = defineProps<Props>()

const openFile = async (file: FileType | null) => {
  if(file){
    const allowedExt = ['html'];
    const ext = file.name.split('.').pop();

    if(allowedExt.includes(ext ?? '')) {
      if(!props.onlySelect){
        files.addPage(file)
      }
      files.setSelectedPath(file.path)
    }
  }
}
</script>