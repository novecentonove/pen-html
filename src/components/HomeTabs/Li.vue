<template>
<li @click="openFile(file)"
  :class="{ 'border-b shadow-lg': selectedPath != props.file.path, 'border-t border-r border-l' :selectedPath == props.file.path}" 
  class="flex shrink-0 align-middle pl-4 py-2 pr-2 font-semibold rounded-t border-gray-600 cursor-pointer">
  <span ref="tabNotSave" :id="snakeCasePath(props.file.path)"></span>{{ props.file.name }}
  <XMarkIcon @click="closeTab('check')" class="ml-3 h-auto w-3 text-gray-500" />
</li>

<Teleport to="body">
  <dialog ref="dialog" class="dialog text_color px-12 py-3 rounded-md">
    <div>
      <p class="mb-5 text-center"><span class="text-red-400">{{props.file.name}}</span> is not saved. <br>Do you want to save it?<strong id="number"></strong></p>
      <div class="dialog_b flex justify-between">
        <!-- <button @click="closeTab('save')">Save</button> -->
        <button @click="closeTab('cancel')">Cancel</button>
        <button @click="closeTab('noSave')">Close anyway</button>
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
  file: FileType,
}
const props = defineProps<Props>()

const files = useFiles()
const selectedPath = computed( () => files.getSelectedPath)
const tabNotSave = ref(null)
const dialog = ref(null)
// const showDialog = ref(false)

const closeTab = (mode: string) => {

  switch (mode) {
    case 'check':
      // @ts-ignore
      if(tabNotSave.value.childNodes.length > 0){
        // @ts-ignore
        dialog.value.showModal()
      }
      break;
    case 'noSave':
      console.log('qia')
      files.closeTab(props.file.path) 
      // @ts-ignore
      dialog.value.close()
      break;
    case 'cancel':
      // @ts-ignore
      dialog.value.close()
      break;
    default:
      // @ts-ignore
      dialog.value.close()
     break;
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
  min-width: 380px;
  max-width: 600px;
}
.dialog_b button{
  width: 100%;
    padding: 5px 10px;
    margin: 0 3px;
    border-radius: 5px;
    background-color: #303030;
}
</style>