<template>
  <div class="file_click flex items-center w-full">
    <div class="_click_parent relative flex items-center mr-auto w-full" @click="openTab" >
      <span v-if="isTabInEditor" class="absolute right-0 mt-1"  :class="isDrop ? '_tab_in_editor' : ''"
        style="color: var(--border_color)">
          ・
      </span>
      <CircleUp ref="unmountTag" v-if="props.isDrop" title="Unmount file" width="1.5em" class="absolute -right-1 icon_close pr-2 hover:text-red-700" @click="handleUnmount" />
      <LongTextIcon class="mr-1 w-3" />
      <span class="file_li_inner cut_text" :style="''/*isTabInEditor ? 'filter: brightness(1.4)': ''*/" :class="isOpenable ? '' : 'opacity-50'">{{ fileName }}</span>
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

const openTab = async (e: MouseEvent) => {
  const click = e.target 
  if(click == unmountTag.value || click.closest('svg') ) return
  if(isOpenable.value && props.file){
    files.addAndSelectPage(props.file)
  }
}

const handleUnmount = async () => {
  await files.askTocloseTab(props?.file?.path || '')

  // Check if is not 'Canceled'
  setTimeout(() => {
    const isStilActive = files.findInTabsList(props?.file?.path || '') ? true : false
    if(isStilActive) return
    settings.unmountDropFile(props?.file?.path || '')
  }, 500);

}
</script>

<style>
.icon_close{
  opacity: 0;
}
.file_click:hover .icon_close{
  opacity: 0.5;
}
._click_parent:hover ._tab_in_editor {
  display: none;
}
</style>