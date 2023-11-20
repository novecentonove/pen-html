<template>
  <div class="text-xs overflow-y-scroll">
    <ul class="flex w-full list-none">
      <li v-for="(file, i) in openFiles" :key="i" @click="openFile(file)"
        :class="{ 'border-b shadow-lg': selectedPath != file.path, 'border-t border-r border-l' :selectedPath == file.path}" 
        class="flex shrink-0 align-middle pl-4 py-2 pr-2 font-semibold rounded-t border-gray-600 cursor-pointer">
        {{ file.name }}
        <XMarkIcon @click="closeTab(selectedPath)" class="ml-3 h-auto w-3 text-gray-500" />
      </li>
      <li class="border-b border-gray-600 shadow-lg w-full min-h-[21px]"></li>
    </ul> 
    <section v-for="file in openFiles" :key="file.path">
      <Tab :name="file.name" :path="file.path" />
    </section>
  </div>
</template>

<script setup lang="ts">
  import { useFiles } from '@/stores/use-files.ts'
  import { computed } from 'vue'
  import Tab from '@/components/HomeTabs/Tab.vue'
  import XMarkIcon from "@/components/Icons/XMarkIcon.vue"
  import { FileType } from '@/types/FileType'

  const files = useFiles()
  const openFiles = computed(() => files.getOpenFiles)

  const selectedPath = computed( () => files.getSelectedPath)

  const closeTab = (path: string) => {
    files.closeTab(path)
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

</script>

<style>

.list-enter-from{
  opacity: 0;
}
.list-enter-to{
  opacity: 1;
}
.list-enter-active{
  transition: all 0.3s ease-out;
  position: absolute
}
.list-leave-from{
  opacity: 1;
}
.list-leave-to{
  opacity: 0;
}
.list-leave-active{
  transition: all 0.3s ease-out;
  position: absolute /* DA USARE PER LIST MOVE */
}

/* spostamento da uno stato e l'altro*/
.list-move{
  transition: all 0.3s ease-out;
}

</style>