<template>

<Teleport :to="`#${snakeCasePath}`">
    <TitleTabAttributes
      :unsaved="unsaved"
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
    <textarea ref="text_area" v-model="content" @keyup.ctrl.z.exact="undo" @keyup.ctrl.shift.z.exact="redo" class="text_area editor_font editor_font_size bg-transparent w-full" style="height: 80vh"></textarea>
  </div>
</template>

<script setup lang="ts">
import { type Ref, computed, onMounted, ref, watch } from 'vue'
import { useFiles } from '../../stores/use-files'
import TitleTabAttributes from '@/components/HomeTabs/TitleTabAttributes.vue'
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
const unsaved = ref(false)
const lastFileContent = ref('')
const snakeCasePath = computed( (): string => snakeCase(props.path))
const openFile = files.getOpenFile(props.path)

// @ts-ignore
const { history, undo, redo } = useRefHistory(content)

const doFocus = () => {
  if(text_area.value){
    text_area.value.focus()
  }
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
    unsaved.value = false
  } catch (e) {
    console.log(e)
  }
}

watch(content, (value: string) => {
  unsaved.value = value != lastFileContent.value
}, { immediate: false })

watch(unsaved, (bool) => {
    files.toggleUnsavedFiles({path: props.path, savedFile: !bool})
})

watch(() => props.onSelectedPath, () => doFocus())

onMounted( () => {
  doFocus()
})
</script>

<style>
.plain_text textarea {
  padding-right: 20px;
  line-height: 1.25rem;
  border: none;
  overflow: auto;
  outline: none;
  resize: none;
}

</style>