<template>
  <div class="flex items-center w-full" @click="openFile">
    <TextFileIcon :size="12" class="mr-1" />
    <span class="w-full" :class="isOpenable ? '' : 'opacity-50'">{{ fileName }}</span>
  </div>
</template>

<script setup lang="ts">
import { type FileType } from '@/types/FileType'
import { useFiles } from '@/stores/use-files'
import { computed } from 'vue'
import { allowedExt } from '@/types/AllowedExt'
// @ts-ignore
import TextFileIcon from 'vue-material-design-icons/TextLong.vue'

type Props = { 
  file:  FileType | null,
}

const props = defineProps<Props>()
const files = useFiles()

const isOpenable = computed( () => {
  const ext = props.file?.name.split('.').pop()
  return allowedExt.includes(ext ?? '') ? true : false
})

const openFile = async () => {
  if(isOpenable && props.file){
      files.addPage(props.file)
    // files.setSelectedPath(props.file.path)
  }
}

const fileName = computed( () => {
    const name = props?.file?.name
    if(name){
      const ext = name.split('.').pop()
      if(ext === 'html') return name.substring(0, name.lastIndexOf('.')) || name
      return name
    }
    return ''
  })

</script>