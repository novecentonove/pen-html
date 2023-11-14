<template>
  <div class="tabs">
    <ul class="inline-flex px-1 w-full border-b">
      <li v-for="(file, i) in openFiles" :key="i" @click="selectedPath = file.path"
        :class="{ 'border-b': selectedPath != file.path}" 
        class="cursor-pointer bg-white px-4 text-gray-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px">
        {{file.name}}
      </li>
    </ul> 
    <!-- <transition-group tag="ul" mode="out-in" name="list" appear> -->
      <span v-for="file in openFiles" :key="file.path">
        <Tab :title="file.name" :path="file.path">{{ file.content }}</Tab>
      </span>
    <!-- </transition-group> -->
  </div>
</template>

<script setup lang="ts">
  import { usePages } from '@/stores/use-pages.ts'
  import { computed, provide, ref, watch } from 'vue';
  import TabsWrapper from './TabsWrapper.vue'
  import Tab from './Tab.vue'

  const store = usePages()
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