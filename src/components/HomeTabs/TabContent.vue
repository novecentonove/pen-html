<template>
  <div v-show="path == selectedPath">
    <KeepAlive>
      <component :is="editorComponent[current]"
        v-if="componentIsReady"
        v-model="content" 
        :name="name" 
        :path="path" 
        :on-selected-path="onSelectedPath"/>
    </KeepAlive>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, toRef, watch } from 'vue'
  import { useFiles } from '@/stores/use-files'
  import { type FileType } from '@/types/FileType'
  import HtmlEditor from '@/components/Editor/HtmlEditor.vue'
  import TextEditor from '@/components/Editor/TextEditor.vue'
  import { readTextFile } from '@tauri-apps/api/fs'

  type Current = 'HtmlEditor' | 'TextEditor'
  const props = defineProps<FileType>()
  const files = useFiles()
  const path = toRef(props.path)
  const selectedPath = computed( () => files.getSelectedPath)
  const content = ref('')
  const editorComponent:any = {HtmlEditor, TextEditor}
  const onSelectedPath = ref(0)
  const current = ref<Current>('HtmlEditor')
  const componentIsReady = ref(false)

  watch(selectedPath, () => {
    if(path.value == selectedPath.value){
      onSelectedPath.value++
    }
  })

  onMounted( async () => {
    try {
      const ext = props.path.split('.').pop()
      let defaultIfEmpty = '<p></p>'
      switch (ext) {
        case 'html':
          current.value = 'HtmlEditor'
          break
        default:
          current.value = 'TextEditor'
          defaultIfEmpty = ''
          break
      }
      
      content.value = await readTextFile(props.path as string) ?? defaultIfEmpty
      componentIsReady.value = true
    } catch(e: any){
      content.value = ''
      files.setOpenFileError(path.value, true, e)
      console.log(e)
    }
  })</script>