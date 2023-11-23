<template>
<li
  :class="{ 'border-b shadow-lg': selectedPath != props.file.path, 'border-t border-r border-l' :selectedPath == props.file.path}" 
  class="flex shrink-0 align-middle  rounded-t border-neutral-600 cursor-pointer">
  <div class="flex justify-center items-center" @click="openFile(file)">
    <span class="pl-3" ref="tabNotSave" :id="snakeCasePath(props.file.path)"></span>
    <span class="pl-2 py-2 pr-1 font-semibold" @click="openFile(file)">{{ props.file.name }}</span>
  </div>
  <XMarkIcon @click="closeTab('check')" class="ml-1 mr-2 h-auto w-3 text-neutral-500 hover:text-red-700 transition ease-in-out duration-300" />
</li>

<Teleport to="body">
  <dialog ref="dialog" class="dialog text_color px-12 py-3 rounded-md">
    <div>
      <p class="mb-5 text-center"><span class="text-red-900">{{props.file.name}}</span> is not saved. <br>Do you want to save it?<strong id="number"></strong></p>
      <div class="dialog_b flex justify-between">
        <!-- <button @click="closeTab('save')">Save</button> -->
        <button @click="closeTab('noSave')" class="bg-red-900">Discard changes</button>
        <button @click="closeTab('cancel')" class="bg-[#303030]" ref="default_button_dialog">Cancel</button>
      </div>
    </div>
  </dialog>
</Teleport>

</template>

<script setup lang="ts">
import XMarkIcon from "@/components/Icons/XMarkIcon.vue"
import { FileType } from '@/types/FileType';
import { useFiles } from '@/stores/use-files'
import { computed, ref } from 'vue'
// @ts-ignore
import { snakeCase } from 'lodash'

type Props = {
  file: FileType
}
const props = defineProps<Props>()

const files = useFiles()
const selectedPath = computed( () => files.getSelectedPath)
// const selectedPath = toRef(files.getSelectedPath)
const tabNotSave = ref(null)
const dialog = ref(null)
// const showDialog = ref(false)
const default_button_dialog = ref(null)
const closeTab = (mode: string) => {

  switch (mode) {
    case 'check':
      // @ts-ignore
      if(tabNotSave.value.childNodes.length > 0 && tabNotSave.value.childNodes[0]?.tagName?.toLowerCase() === 'span'){
          // @ts-ignore
          dialog.value.showModal()
          // @ts-ignore
          default_button_dialog.value.focus()

      } else {
        files.closeTab(props.file.path) 
      }
      break
      return
    case 'noSave':
      console.log('qia')
      files.closeTab(props.file.path) 
      // @ts-ignore
      dialog.value.close()
      break;
      return
    case 'cancel':
      // @ts-ignore
      dialog.value.close()
      break;
      return
    default:
      // @ts-ignore
      dialog.value.close()
     break;
     return
  }
}

const openFile = async (file: FileType | null) => {
    if(file){
      const allowedExt = ['html'];
      const ext = file.name.split('.').pop();

      if(allowedExt.includes(ext ?? '')) {
        files.setSelectedPath(file.path)
      }
    }
  }

  const snakeCasePath = (path: string) => {
    return snakeCase(path)
  }
</script>

<style>
.dialog {
  min-width: 425px;
  max-width: 600px;
}
.dialog_b button{
  width: 100%;
    padding: 10px 10px;
    margin: 0 8px;
    border-radius: 5px;
    /* background-color: #303030; */
}
</style>