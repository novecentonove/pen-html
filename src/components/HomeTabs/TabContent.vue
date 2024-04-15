<template>
  <div v-show="path == selectedPath">
    <!-- <KeepAlive> -->
      <Suspense>
        <component :is="editorComponent[current]"
          v-if="componentIsReady"
          v-model="content" 
          :name="name" 
          :path="path" 
          :on-selected-path="onSelectedPath"/>
      </Suspense>
    <!-- </KeepAlive> -->
  </div>
</template>

<script setup lang="ts">
  import { exists, BaseDirectory } from '@tauri-apps/api/fs';
  import { computed, onMounted, ref, toRef, watch } from 'vue'
  import { useFiles } from '@/stores/use-files'
  import { type FileType } from '@/types/FileType'
  import HtmlEditor from '@/components/Editor/HtmlEditor.vue'
  import TextEditor from '@/components/Editor/TextEditor.vue'
  import Settings from '@/views/Settings.vue'
  import { readTextFile } from '@tauri-apps/api/fs'

  type Current = 'HtmlEditor' | 'TextEditor' | 'Settings'
  const props = defineProps<FileType>()
  const files = useFiles()
  const path = toRef(props.path)
  const selectedPath = computed( () => files.getSelectedPath)
  const content = ref('')
  const editorComponent:any = {HtmlEditor, TextEditor, Settings}
  const onSelectedPath = ref(0)
  const current = ref<Current>('HtmlEditor')
  const componentIsReady = ref(false)
  import { settingPage } from '@/types/SettingPage'

  watch(selectedPath, () => {
    if(path.value == selectedPath.value){
      onSelectedPath.value++
    }
  })

  onMounted( async () => {
    try {
      let ext = props.path.split('.').pop()

      if(props.path === settingPage.path){
        ext = 'settings'
      }
      
      let defaultIfEmpty = '<p></p>'
      switch (ext) {
        case 'html':
          current.value = 'HtmlEditor'
          break
        case 'settings':
          current.value = 'Settings'
          break
        default:
          current.value = 'TextEditor'
          defaultIfEmpty = ''
          break
      }

      if(props.path != settingPage.path){

        const doExists = await exists(props.path, { dir: BaseDirectory.AppData })

        if(!doExists){
            files.destroyTab(props.path)
            //TODO TOAST TO
            console.error(`File ${props.path} not exists`)
            return
        }

        content.value = await readTextFile(props.path as string) ?? defaultIfEmpty
      }
      
      componentIsReady.value = true
    } catch(e: any){
      content.value = ''
      files.setOpenFileError(path.value, true, e)
      console.log(e)
    }
  })
  </script>