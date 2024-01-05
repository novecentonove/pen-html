<template>
<li
  :class="{ 'border-b shadow-lg inactive': selectedPath != props.file.path, 'border-t border-r border-l' :selectedPath == props.file.path}" 
  class="flex shrink-0 justify-center items-center align-middle rounded-t border_color cursor-pointer select-none">
  <div class="flex justify-center items-center app_font">
    <!-- Teleport here -->
    <span :id="snakeCasePath(props.file.path)" class="_tab_title_el flex"></span>
  </div>
  <CloseIcon @click="closeTab" :class="{ 'inactive': selectedPath != props.file.path}" class="ml-1 mr-3 h-auto w-3 text-neutral-500 hover:text-red-700 transition ease-out duration-300" />
</li>

<Teleport to="body">
  <NotSavedDialog :file-to-close="file" :trigger="trigger" />
</Teleport>

</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import CloseIcon from '@/icons/Close.vue'
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

  const closeTab = () => {
    trigger.value++
  }

  const snakeCasePath = (path: string) => {
    return snakeCase(path)
  }
</script>

<style>
  .inactive { color:  color-mix(in srgb, currentColor 40%, transparent); }
</style>