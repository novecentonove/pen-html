<template>
  <span @click="openFile(props.file)">{{ file?.name }}</span>
</template>

<script setup lang="ts">
import { type FileType } from '@/types/FileType';
import { useFiles } from '@/stores/use-files'


type Props = { 
  file:  FileType | null,
  onlySelect?:  boolean,
}

const props = defineProps<Props>()

const files = useFiles()

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