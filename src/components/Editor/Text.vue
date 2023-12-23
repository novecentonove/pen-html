<template>

<Teleport :to="`#${snakeCasePath}`">
    <TitleTabAttributes
      :saved="saved"
      :name="name"
      :path="path"
      :snake-case-path="snakeCasePath"
     />
  </Teleport>
  
  <div @keyup.ctrl.s="saveFile" class="plain_text mt-6">
    <textarea v-model="content" @keyup.ctrl.z.exact="undo" @keyup.ctrl.shift.z.exact="redo" class="text_area bg-transparent w-full" style="height: 80vh;"></textarea>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref, watch } from 'vue'
import { useFiles } from '../../stores/use-files'
import TitleTabAttributes from './TitleTabAttributes.vue'
import { snakeCase} from 'lodash'
import { writeFile } from '@tauri-apps/api/fs'
import { useRefHistory } from '@vueuse/core'

const files = useFiles()
const text_area:Ref<HTMLDivElement|null> = ref(null)
const content = ref('')
const saved = ref(false)

// @ts-ignore
const { history, undo, redo } = useRefHistory(content)

type Props = {
  modelValue: string,
  name: string,
  path: string
}

const props = defineProps<Props>()

const lastFileContent = ref('')
const snakeCasePath = computed( (): string => snakeCase(props.path))

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
})

onMounted( () => {
  if(text_area.value){
    text_area.value.focus()
  }
  content.value = props.modelValue
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