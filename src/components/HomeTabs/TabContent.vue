<template>
  <div v-show="path == selectedPath">
    <KeepAlive>
      <Editor v-if="content" 
        v-model="content" 
        :name="name" 
        :path="path" />
    </KeepAlive>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, toRef } from 'vue'
  import { useFiles } from '@/stores/use-files'
   import { type FileType } from '@/types/FileType'
  import Editor from '@/components/Editor/Editor.vue'
  import { readTextFile } from '@tauri-apps/api/fs'

  const props = defineProps<FileType>()
  const files = useFiles()
  const path = toRef(props.path)
  const selectedPath = computed( () => files.getSelectedPath)
  const content = ref('')

  onMounted( async () => {
    content.value = await readTextFile(props.path as string) || '<p></p>'
    console.log(content.value)
  })

</script>