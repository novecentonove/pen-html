<template>
  <div class="home_tab_list">
    <ul class="inline-flex px-1 w-full border-b">
      <li v-for="(file, i) in openFiles" :key="i" @click="selectedPath = file.path"
        :class="{ 'border-b': selectedPath != file.path}" 
        class="cursor-pointer bg-white px-4 text-gray-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px">
        {{file.name}}
      </li>
    </ul> 
    <!-- <transition-group tag="ul" mode="out-in" name="list" appear> -->
      <span v-for="file in openFiles" :key="file.path">
        <Tab :name="file.name" :path="file.path">{{ file.content }}</Tab>
      </span>
    <!-- </transition-group> -->
  </div>
</template>

<script setup lang="ts">
  import { useFiles } from '@/stores/use-files.ts'
  import { computed, provide, ref, watch } from 'vue';
  import TabsWrapper from './TabsWrapper.vue'
  import Tab from './Tab.vue'

  const store = useFiles()
  const openFiles = computed(() => store.getOpenFiles)
  const clickedFromDrawer = computed(() => store.getClickDrawerFile)

  const selectedPath = ref(store.openFiles[0] ? store.openFiles[0].path : null)

  provide('selectedPath', selectedPath)

  watch(store.getOpenFiles, (file) => {
    selectedPath.value = file[file.length-1].path
  })

  watch(clickedFromDrawer, (file) => {
    selectedPath.value = file.path
  })

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