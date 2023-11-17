<template>
  <div v-if="editor" class="wrapper_editor markdown-body editor_font editor_font_size" @keyup.ctrl.s="saveFile">
    <EditorButtons :editor="editor" />
    <editor-content :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { writeFile } from '@tauri-apps/api/fs';
import EditorButtons from './EditorButtons.vue';

type Props = { 
  modelValue: '',
  name: '',
  path: ''
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

const isSame = ref(false)

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
    console.log('saved!')
  } catch (e) {
    console.log(e);
  }
}

const doFocus = () => {
  if(!editor.isFocused){
    editor.commands.focus('start')
  }
  console.log('focus')
}

watch(() => props.modelValue, (value) => {
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

/* .ProseMirror:focus {
  outline: none;
} */
.wrapper_editor {
  margin-left:20px;
}
.ProseMirror {
  max-height: 85vh;
  overflow: scroll;
  max-width: 750px;
  margin-left: auto;
  margin-right: auto;
  height: 100vh;
}

.tiptap {
  padding-right: 35px;
}

.is-active{
  background-color: gray;
  border-radius: .2rem;
}

</style>