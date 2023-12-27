<template>

<Teleport :to="`#${snakeCasePath}`">
    <TitleTabAttributes
      :saved="saved"
      :name="name"
      :path="path"
      :snake-case-path="snakeCasePath"
     />
  </Teleport>
  <div v-if="openFile?.isError" class="editor_font editor_font_size px-12 mt-6">
    <p>An errror occurred</p>
    <p v-if="openFile.error">{{ openFile.error }}</p>
  </div>
  <div v-else @keyup.ctrl.s="saveFile" @click.prevent.self="doFocus" class="plain_text editor_font px-12 mt-6">
    <textarea ref="text_area" v-model="content" @keyup.ctrl.z.exact="undo" @keyup.ctrl.shift.z.exact="redo" class="text_area editor_font editor_font_size bg-transparent w-full" style="height: 80vh;"></textarea>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref, watch } from 'vue'
import { useFiles } from '../../stores/use-files'
import TitleTabAttributes from './TitleTabAttributes.vue'
import { snakeCase} from 'lodash'
import { writeFile } from '@tauri-apps/api/fs'
import { useRefHistory } from '@vueuse/core'

type Props = {
  modelValue: string,
  name: string,
  path: string,
  onSelectedPath: number
}

const props = defineProps<Props>()

const files = useFiles()
const text_area:Ref<HTMLDivElement|null> = ref(null)
const content = ref(props.modelValue)
const saved = ref(true)
const lastFileContent = ref('')
const snakeCasePath = computed( (): string => snakeCase(props.path))
const openFile = files.getOpenFile(props.path)

// @ts-ignore
const { history, undo, redo } = useRefHistory(content)

const doFocus = () => {
  if(text_area.value){
    text_area.value.focus()
    console.log('dofocus')
  }
  console.log('focus')
}

const saveFile = async () => {

  try {
    await writeFile(
      {
        contents: content.value ?? '',
        path: props.path,
      }
    )
    files.triggerFileIsSaved()
    lastFileContent.value = content.value
    saved.value = true
  } catch (e) {
    console.log(e)
  }
}

watch(content, (value: string) => {
  saved.value = value === lastFileContent.value
}, { immediate: false })

watch(saved, (bool) => {
    files.toggleUnsavedFiles({path: props.path, savedFile: bool})
})

watch(() => props.onSelectedPath, () => doFocus())

onMounted( () => {
  doFocus()
  console.log('openfile', openFile)
})

</script>

<style>
.plain_text textarea {
    border: none;
    overflow: auto;
    outline: none;
    resize: none;
}
</style>