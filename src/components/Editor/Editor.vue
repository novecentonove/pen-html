<template>
<button @click="getText">
click
</button>
  <div class="editor_frame">
    <editor-content :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { onMounted, watch } from 'vue';
import showdown from 'showdown'

type Props = { modelValue: '' }
const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

let editor = null
const converter = new showdown.Converter();

const getText = () => {

  const htmlContent = editor.getHTML();
  const markdownContent = converter.makeMarkdown(htmlContent);
  console.log(markdownContent);
}

watch(() => props.modelValue, (value) => {
  // HTML
  const isSame = editor.getHTML() === value

  // JSON
  // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

  if (isSame) {
    return
  }

  const htmlText = converter.makeHtml(value);
  editor.commands.setContent(htmlText, false)
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
    editor.commands.focus('start')
})

//   beforeUnmount() {
//     this.editor.destroy()
//   },
// }
</script>

<style>

.ProseMirror:focus {
  outline: none;
}
.ProseMirror {
  max-height: 85vh;
  overflow: scroll;
  margin-left: 10%;
  max-width: 750px;
  /* width: 100%; */
}

.tiptap {
  padding-right: 15px;
}

/* .editor_frame {
  max-width: 800px;
  margin-left: 5%;
  margin-right: 50px;
}  */

</style>