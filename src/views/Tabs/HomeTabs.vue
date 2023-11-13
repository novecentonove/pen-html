<template>
  <TabsWrapper>
    <template v-for="file in openFiles" :key="file.name">
      <Tab :file="file" />
    </template>
  </TabsWrapper>
</template>

<script setup lang="ts">
  import { usePages } from '@/stores/use-pages.ts'
  import { computed } from 'vue';
  import TabsWrapper from './TabsWrapper.vue'
  import Tab from './Tab.vue'

  const store = usePages()
  const openFiles = computed(() => store.getOpenFiles)
  
  
</script>