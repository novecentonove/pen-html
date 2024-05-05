<template>
  <div class="file_click relative flex items-center w-full">
    <LongTextIcon class="mr-1 min-w-3" />
    <div class="overflow-x-hidden flex items-center w-full mr-3" >
      <p class="file_li_inner cut_text w-full" @click="openTab" :class="isOpenable ? '' : 'opacity-50'">{{ fileName }}</p>
    </div>
    <div class="relative w-12 h-6">
      <div v-if="isTabInEditor" class="pl-2" :class="isDrop ? '_tab_in_editor' : ''"
        style="color: var(--border_color)">
          ・
      </div>
      <CircleUp ref="unmountTag" @click="handleUnmount" v-if="props.isDrop" title="Unmount file" width="1.5em" class="absolute top-1 right-1 _unoumnt hover:text-red-700" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type FileType } from '@/types/FileType'
import { useFiles } from '@/stores/use-files'
import { useSettings } from '@/stores/use-settings'
import { computed, ref } from 'vue'
import { allowedExt } from '@/types/AllowedExt'
import LongTextIcon from '@/icons/LongText.vue'
import CircleUp from '@/icons/CircleUp.vue'
import { parseFileName } from '@/composable/parseFileName'

type Props = { 
  file:  FileType | null,
  isDrop?: boolean
}

const props = defineProps<Props>()
const files = useFiles()
const settings = useSettings()
const fileName = computed( () => parseFileName(props?.file?.name ?? ''))

const isTabInEditor = computed( () => files.findInTabsList(props?.file?.path ?? ''))

const unmountTag = ref(null)

const isOpenable = computed( () => {
  const ext = props.file?.name.split('.').pop()
  return allowedExt.includes(ext ?? '') ? true : false
})

const openTab = async () => {
  if(props.file){
    files.addAndSelectPage(props.file)
  }
}

const handleUnmount = async () => {
  const res = await files.askTocloseTab(props?.file?.path || '')
  
  if(res !== 'cancel'){
    settings.unmountDropFile(props?.file?.path || '')
  }
}

</script>

<style>
._unoumnt{
  opacity: 0;
}

.file_click:hover ._unoumnt{
  opacity: 0.5;
}

.file_click:hover ._tab_in_editor {
  opacity: 0;
}
</style>