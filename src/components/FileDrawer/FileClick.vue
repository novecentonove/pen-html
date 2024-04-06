<template>
  <div class="file_click flex items-center w-full">
    <div class="flex items-center mr-auto w-full" @click="openFile" >
      <LongTextIcon class="mr-1 w-3" />
      <span class="file_li_inner cut_text" :class="isOpenable ? '' : 'opacity-50'">{{ fileName }}</span>
    </div>
    <CloseIcon width="1.5em" class="icon_close pr-2 hover:text-red-700" v-if="props.closable" @click="files.askTocloseTab(props?.file?.path || '')" />
  </div>
</template>

<script setup lang="ts">
import { type FileType } from '@/types/FileType'
import { useFiles } from '@/stores/use-files'
import { computed, onMounted } from 'vue'
import { allowedExt } from '@/types/AllowedExt'
import LongTextIcon from '@/icons/LongText.vue'
import CloseIcon from '@/icons/Close.vue'
import { parseFileName } from '@/composable/parseFileName'

type Props = { 
  file:  FileType | null,
  closable?: boolean
}

const props = defineProps<Props>()
const files = useFiles()
const fileName = parseFileName(props?.file?.name ?? '')

onMounted( () => {
  // enableAppendDir.value
})

const isOpenable = computed( () => {
  const ext = props.file?.name.split('.').pop()
  return allowedExt.includes(ext ?? '') ? true : false
})

const openFile = async () => {
  if(isOpenable && props.file){
      files.addAndSelectPage(props.file)
  }
}
</script>

<style>
.icon_close{
  opacity: 0;
}
.file_click:hover .icon_close{
  opacity: 0.5;
}
</style>