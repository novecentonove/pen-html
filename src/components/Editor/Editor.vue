<template>
  <div class="wrapper_editor h-full relative markdown-body editor_font editor_font_size">
    <div @click="doFocus($event)">
      <div v-if="editor" @keyup.ctrl.s="saveFile">
        <editor-content :editor="editor" class="" />
      </div>
    </div>
    <EditorButtons v-if="editor" id="editor_buttons" :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
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
    // console.log('saved!')
    files.savedFileTrigger()

  } catch (e) {
    console.log(e);

  }
}

const doFocus = (e = null) => {
  if(!editor.isFocused){
    editor.commands.focus('start')
  }
  console.log('focus')
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
  overflow-y: scroll;
  margin: 30px 30px;
  width: 750px;
  padding-right: 30px;
}

@media screen and (min-width: 901px) and (max-width: 1000px) {
 .tiptap  {
    width: 75%;
    margin-left: 7%;
  }
}

@media screen and (min-width: 701px) and (max-width: 900px) {
 .tiptap  {
    width: 71%;
    margin-left: 30px;
  }
}

@media screen and (max-width: 700px) {
 .tiptap  {
    width: 60%;
    margin-left: 30px;
  }
}

.is-active{
  background-color: gray;
  border-radius: .2rem;
}

</style>


