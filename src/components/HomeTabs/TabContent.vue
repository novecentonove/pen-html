<template>
  <div v-show="path == selectedPath">
    <KeepAlive>
      <component :is="editorComponent[current]"
        v-if="content" 
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
  import HtmlEditor from '@/components/Editor/HtmlEditor.vue'
  import TextEditor from '@/components/Editor/TextEditor.vue'
  import { readTextFile } from '@tauri-apps/api/fs'

  const props = defineProps<FileType>()
  const files = useFiles()
  const path = toRef(props.path)
  const selectedPath = computed( () => files.getSelectedPath)
  const content = ref('')
  const editorComponent:any = {HtmlEditor, TextEditor}
  const current = ref('Editor')

  onMounted( async () => {
    try {
      const ext = props.path.split('.').pop()
      let defaultIfEmpty = '<p></p>'
      switch (ext) {
        case 'html':
          current.value = 'HtmlEditor'
          break;
        default:
          current.value = 'TextEditor'
          defaultIfEmpty = ' '
          break;
      }
      
      content.value = await readTextFile(props.path as string) || defaultIfEmpty
    } catch(e){
      content.value = '<p><span style="color:red">Error: file not existing or error</span></p>'
      console.log(e)
    }
  })

</script>