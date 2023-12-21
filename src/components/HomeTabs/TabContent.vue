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
    try {
      content.value = await readTextFile(props.path as string) || '<p></p>'
    } catch(e){
      content.value = '<p><span style="color:red">Error: file not existing</span></p>'
      console.log(e)
    }
  })

</script>