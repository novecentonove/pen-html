<template>
<li
  :class="{ 'border-b shadow-lg': selectedPath != props.file.path, 'border-t border-r border-l' :selectedPath == props.file.path}" 
  class="flex shrink-0 align-middle  rounded-t border_color cursor-pointer">
  <div class="flex justify-center items-center" @click="openFile(file)">
    <span class="pl-3" :id="snakeCasePath(props.file.path)"></span>
    <span class="pl-0.5 py-2 pr-1 font-semibold" @click="openFile(file)">{{ fileName }}</span>
  </div>
  <XMarkIcon @click="closeTab" class="ml-1 mr-2 h-auto w-3 text-neutral-500 hover:text-red-700 transition ease-in-out duration-300" />
</li>

<Teleport to="body">
  <NotSavedDialog :file-to-close="file" :trigger="trigger" />
</Teleport>

</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import XMarkIcon from "@/components/Icons/XMarkIcon.vue"
  import NotSavedDialog from "./NotSavedDialog.vue"
   import { type FileType } from '@/types/FileType'
  import { useFiles } from '@/stores/use-files'
  // @ts-ignore
  import { snakeCase } from 'lodash'
  
  type Props = {
    file: FileType
  }

  const props = defineProps<Props>()

  const files = useFiles()
  const selectedPath = computed( () => files.getSelectedPath)
  const trigger = ref(0)
  
  const fileName = computed( () => {
    const name = props.file.name
    const ext = name.split('.').pop()
    if(ext === 'html') return name.substring(0, name.lastIndexOf('.')) || name
    return name
  })

  const openFile = async (file: FileType | null) => {
    if(file){
      const allowedExt = ['html'];
      const ext = file.name.split('.').pop();

      if(allowedExt.includes(ext ?? '')) {
        files.setSelectedPath(file.path)
      }
    }
  }

  const closeTab = () => {
    trigger.value++
  }

  const snakeCasePath = (path: string) => {
    return snakeCase(path)
  }
</script>

<style>
  .dialog {
    min-width: 425px;
    max-width: 600px;
    border: 1px solid #202020;
  }
  .dialog_b button{
    width: 100%;
      padding: 8px 10px;
      margin: 0 8px;
      border-radius: 5px;
  }
</style>