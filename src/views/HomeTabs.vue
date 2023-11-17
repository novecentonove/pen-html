<template>
  <div class="text-xs h-full w-full">
    <ul class="inline-flex px-1 w-full list-none">
      <li v-for="(file, i) in openFiles" :key="i" @click="selectedPath = file.path"
        :class="{ 'border-b shadow-lg': selectedPath != file.path, 'border-t border-r border-l' :selectedPath == file.path}" 
        class="flex align-middle cursor-pointe pl-4 pr-2 font-semibold py-1.5 rounded-t border-gray-600 cursor-pointer">
        {{file.name}} 
        <XMarkIcon @click="closeTab(selectedPath)" class="ml-3 h-auto w-3 text-gray-500" />
      </li>
      <li class="border-b border-gray-600 shadow-lg w-full"></li>
    </ul> 
    <section v-for="file in openFiles" :key="file.path">
      <Tab :name="file.name" :path="file.path">{{ file.content }}</Tab>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { useFiles } from '@/stores/use-files.ts'
  import { computed, provide, ref, watch } from 'vue'
  import TabsWrapper from './TabsWrapper.vue'
  import Tab from '@/components/HomeTabs/Tab.vue'
  import  XMarkIcon from "@/components/Icons/XMarkIcon.vue";

  const store = useFiles()
  const openFiles = computed(() => store.getOpenFiles)
  const clickedFromDrawer = computed(() => store.getClickDrawerFile)

  const selectedPath = ref(store.openFiles?.[0] ? store.openFiles[0].path : null)

  provide('selectedPath', selectedPath)

  watch(store.getOpenFiles, (file) => {
    if(file.length){
      selectedPath.value = file[file.length-1].path
    }
  })

  watch(clickedFromDrawer, (file) => {
    selectedPath.value = file.path
  })

  const closeTab = (selectedPath: string) => {
    store.closeTab(selectedPath)
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