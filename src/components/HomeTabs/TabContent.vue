<template>
  <div v-show="path == activeTab">
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
  import { settingFile } from '@/types/SettingFile'
  import Settings from '@/views/Settings.vue'
  import { howToFile } from '@/types/HowToFile'
  import HowTo from '@/views/HowTo.vue'
  import { readTextFile } from '@tauri-apps/api/fs'


  type Current = 'HtmlEditor' | 'TextEditor' | 'Settings' | 'HowTo'
  const props = defineProps<FileType>()
  const files = useFiles()
  const path = toRef(props.path)
  const activeTab = computed( () => files.getActiveTab)
  const content = ref('')
  const editorComponent:any = {HtmlEditor, TextEditor, Settings, HowTo}
  const onSelectedPath = ref(0)
  const current = ref<Current>('HtmlEditor')
  const componentIsReady = ref(false)


  watch(activeTab, () => {
    if(path.value == activeTab.value){
      onSelectedPath.value++
    }
  })

  onMounted( async () => {
    try {
      let ext = props.path.split('.').pop()

      if(props.path === settingFile.path){
        ext = 'settings'
      } else if(props.path === howToFile.path){
        ext = 'howto'
      }
      
      let systemFile = false

      let defaultIfEmpty = '<p></p>'
      switch (ext) {
        case 'html':
          current.value = 'HtmlEditor'
          break
        case 'settings':
          current.value = 'Settings'
          systemFile = true
          break
        case 'howto':
          current.value = 'HowTo'
          systemFile = true
          break
        default:
          current.value = 'TextEditor'
          defaultIfEmpty = ''
          break
      }

      if(!systemFile){

        const doExists = await exists(props.path, { dir: BaseDirectory.AppData })

        if(!doExists){
            files.destroyTab(props.path)
            //TODO TOAST TO
            // files.setTriggerMiniToast(`File ${props.path} not exists`)
            console.error(`File ${props.path} not exists`, 'right')
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