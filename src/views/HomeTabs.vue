<template>
  <div class="text-xs h-full w-full">
    <ul class="flex w-full list-none">
      <li v-for="(file, i) in openFiles" :key="i"
        :class="{ 'border-b shadow-lg': selectedPath != file.path, 'border-t border-r border-l' :selectedPath == file.path}" 
        class="flex shrink-0 align-middle pl-4 py-2 pr-2 font-semibold rounded-t border-gray-600 cursor-pointer">
        <FileClick :file="file" :only-select="true" />
        <XMarkIcon @click="closeTab(selectedPath)" class="ml-3 h-auto w-3 text-gray-500" />
      </li>
      <li class="border-b border-gray-600 shadow-lg w-full min-h-[21px]"></li>
    </ul> 
    <section v-for="file in openFiles" :key="file.path">
      <Tab :name="file.name" :path="file.path">{{ file.content }}</Tab>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { useFiles } from '@/stores/use-files.ts'
  import { computed, provide, ref, watch } from 'vue'
  import Tab from '@/components/HomeTabs/Tab.vue'
  import XMarkIcon from "@/components/Icons/XMarkIcon.vue";
  import FileType from '../types/FileType';
  import FileClick from '@/components/FileDrawer/FileClick.vue'

  const files = useFiles()
  const openFiles = computed(() => files.getOpenFiles)
  const clickedFromDrawer = computed(() => files.getClickDrawerFile)

  const selectedPath = computed( () => files.getSelectedPath)

  // watch(openFiles, (file: FileType) => {
  //   if(file.length){
  //     selectedPath.value = file[file.length-1].path
  //   }
  // })

  // watch(clickedFromDrawer, (file: FileType) => {
  //   selectedPath.value = file.path
  // })

  // const setSelectedPath = (file: FileType) => {
  //   files.setSelectedPath(file.path)
  // }

  const closeTab = (path: string) => {
    files.closeTab(path)
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