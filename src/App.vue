<template>
  <div class="main-app">
    <div class="flex">
      <FileDrawer />
      <!-- <RouterView /> -->
      <div>

      <HomeTabs />
      
    </div>
    </div>
  </div>
<!-- <nav>
  <RouterLink to="/">Home</RouterLink>
  <RouterLink to="/about">About</RouterLink>
</nav> -->
</template>

<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
  import FileDrawer from '@/views/FileDrawer/FileDrawer.vue';
  import HomeTabs from '@/views/Tabs/HomeTabs.vue';
</script>
