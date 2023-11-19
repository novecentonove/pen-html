<template>
  <div class="wrapper_editor h-full relative markdown-body editor_font editor_font_size">
    <div>

      <div v-if="editor" @keyup.ctrl.s="saveFile">
        <editor-content :editor="editor" class="" />
      </div>
    </div>

    <bubble-menu
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      v-if="editor"
    >
      <EditorButtons :editor="editor" />
    </bubble-menu>
  </div>
</template>

<script setup lang="ts">
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu, Editor, EditorContent } from '@tiptap/vue-3'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { writeFile } from '@tauri-apps/api/fs'
import EditorButtons from './EditorButtons.vue'
import { useFiles } from '@/stores/use-files'

type Props = {
  modelValue: '',
  name: '',
  path: ''
}

const files = useFiles()

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

const isSame = ref(null)

let lastFileContent = ''

let editor = null
// const converter = new showdown.Converter();

const getText = () => {
  const htmlContent = editor.getHTML();
  return htmlContent
  // return converter.makeMarkdown(htmlContent);
}

const saveFile = async () => {
  const content = getText()
  try {
    await writeFile(
      {
        contents: content,
        path: props.path,
      }
    )
    files.savedFileTrigger()

  } catch (e) {
    console.log(e)
  }
}

const doFocus = (e = null) => {
  if(!editor.isFocused){
    editor.commands.focus('start')
  }
}

watch(() => props.modelValue, (value) => {
  console.log(lastFileContent == editor.getHTML())
  // HTML
  isSame.value = editor.getHTML() === value

  // JSON
  // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

  if (isSame.value) {
    return
  }

  // const htmlText = converter.makeHtml(value);
  editor.commands.setContent(value, false)
})


onMounted( () => {
  lastFileContent = Object.assign({}, props.modelValue)

  editor = new Editor({
      extensions: [
        StarterKit,
        BubbleMenu,
      ],
      editorProps: {
        attributes: {
          class: 'prose dark:prose-invert prose-sm sm:prose-base m-5 focus:outline-none',
        },
      },
      content: props.modelValue,
      onUpdate: () => {
        // HTML
        emit('update:modelValue', editor.getHTML())

        // JSON
        // this.$emit('update:modelValue', this.editor.getJSON())
      },
    })
    doFocus()
})

onBeforeUnmount( () => {
  editor.destroy()
})

</script>

<style>
.wrapper_editor, .tiptap {
  max-height: 85vh;
  height: 85vh;
}
.tiptap  {
  max-width: 95%;
  overflow-y: scroll;
  margin: 30px 12%;
  padding-right: 40px;
  word-break: break-all;
}



</style>


