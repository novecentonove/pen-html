<template>
  <div class="file_click flex items-center w-full">
    <div class="flex items-center mr-auto w-full" @click="openFile" >
      <TextFileIcon :size="12" class="mr-1" />
      <span class="file_li_inner cut_text" :class="isOpenable ? '' : 'opacity-50'">{{ fileName }}</span>
    </div>
    <CloseIcon :size="14" class="icon_close pr-2 hover:text-red-700" v-if="props.closable" @click="files.closeTab(props?.file?.path || '')" />
  </div>
</template>

<script setup lang="ts">
import { type FileType } from '@/types/FileType'
import { useFiles } from '@/stores/use-files'
import { computed } from 'vue'
import { allowedExt } from '@/types/AllowedExt'
// @ts-ignore
import TextFileIcon from 'vue-material-design-icons/TextLong.vue'
// @ts-ignore
import CloseIcon from 'vue-material-design-icons/Close.vue'
import { parseFileName } from '@/composable/parseFileName'

type Props = { 
  file:  FileType | null,
  closable?: boolean
}

const props = defineProps<Props>()
const files = useFiles()
const fileName = parseFileName(props?.file?.name ?? '')

const isOpenable = computed( () => {
  const ext = props.file?.name.split('.').pop()
  return allowedExt.includes(ext ?? '') ? true : false
})

const openFile = async () => {
  if(isOpenable && props.file){
      files.addAndSelectPage(props.file)
  }
}

// const fileName = computed( () => {
//   let name = props?.file?.name
//   if(name){

//     // remove html ext
//     const ext = name.split('.').pop()
//     const nameOnly = name.substring(0, name.lastIndexOf('.')) || name
//     let parsedName = nameOnly

//     // short filemane if too long
//     if(parsedName.length > 25){
//       const start = parsedName.substring(0, 6)
//       const end = parsedName.slice(-6)
//       parsedName = `${start}...${end}`
//     }

//     if(ext === 'html'){
//       return parsedName
//     }
//     return `${parsedName}.${ext}`
//   }
//   return ''
// })

</script>

<style>
.icon_close{
  opacity: 0;
}
.file_click:hover .icon_close{
  opacity: 0.5;
}
.cut_text { 
  text-overflow: ellipsis;
  overflow: hidden; 
  white-space: nowrap;
}
</style>