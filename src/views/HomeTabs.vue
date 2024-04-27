<template>
  <slot />    <!-- resize border  -->
  
  <div class="text-xs overflow-y-scroll">
    <div id="_tablist" class="flex">
      <div class="w-2 border-b border_color shadow-lg"></div>
      <ul class="flex w-full list-none" :class="tabList.length ? '' : 'mt-3'">
        <template v-for="file in tabList" :key="file.path" >
          <TabTitle :file="file" />
        </template>
        <li class="border-b border_color shadow-lg w-full min-h-[21px]"></li>
        <!-- Close all tabs -->
        <li class="border-b border_color shadow-lg w-5 min-h-[21px] flex" title="Close all tabs">
          <Circle @click="files.closeAllTabs" class="close_all_button w-3 h-3 mt-auto mb-2" />
        </li>
      </ul>
    </div>
    <div id="editor_section" >
      <section v-for="file in tabList" :key="file.path">
        <TabContent :name="file.name" :path="file.path" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useFiles } from '@/stores/use-files'
  import TabContent from '@/components/HomeTabs/TabContent.vue'
  import TabTitle from '@/components/HomeTabs/TabTitle.vue'
  import Circle from '@/icons/Circle.vue'

  const files = useFiles()
  const tabList = computed(() => files.getTabList)

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
  .close_all_button{
    cursor: pointer;
    color: var(--border_color);
    opacity: 0.6;
  }
  .close_all_button:hover{
    opacity: 1;
  }
</style>