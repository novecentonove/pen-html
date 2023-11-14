<template>
  <div class="editor_frame">
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'

export default {
  components: {
    EditorContent,
  },

  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },

  emits: ['update:modelValue'],

  data() {
    return {
      editor: null,
    }
  },

  watch: {
    modelValue(value) {
      // HTML
      const isSame = this.editor.getHTML() === value

      // JSON
      // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

      if (isSame) {
        return
      }

      this.editor.commands.setContent(value, false)
    },
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
      ],
      editorProps: {
        attributes: {
          class: 'prose dark:prose-invert prose-sm sm:prose-base m-5 focus:outline-none',
        },
      },
      content: this.modelValue,
      onUpdate: () => {
        // HTML
        this.$emit('update:modelValue', this.editor.getHTML())

        // JSON
        // this.$emit('update:modelValue', this.editor.getJSON())
      },
    })
    this.editor.commands.focus('start')
  },

  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>

<style>

.prose {
  max-width: 100%;
  margin-right: 200px;

}
/* remove outline */
.ProseMirror:focus {
  outline: none;
}
/* set */
.ProseMirror {        
  height: 100%;
  width: 100%;
  margin: 20px;
  max-height: 82vh;
  overflow: scroll;
}

.editor_frame {
  max-width: 800px;
  margin-left: 5%;
  margin-right: 50px;
}

</style>