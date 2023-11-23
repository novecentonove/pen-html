<template>
  <Teleport v-if="editorIsReady" :to="`#${snakeCasePath}`">
  <span v-if="!fileIsTheSame" class="pr-1">&#9679;</span>
</Teleport>

  <div class="wrapper_editor h-full relative markdown-body editor_font editor_font_size">
    <div>
      <div v-if="editor" @keyup.ctrl.s="saveFile">
        <editor-content 
        :editor="editor" 
        type="color"
        @input="editor.chain().focus().setColor($event.target.value).run()"
        :value="editor.getAttributes('textStyle').color"
        />
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
import { type Ref, onBeforeUnmount, onMounted, ref, watch, computed } from 'vue'
import { writeFile } from '@tauri-apps/api/fs'
import EditorButtons from './EditorButtons.vue'
import { useFiles } from '../../stores/use-files'
// @ts-ignore
import { snakeCase} from 'lodash'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'

Color.configure({
  types: ['textStyle'],
})

type Props = {
  modelValue: string,
  name: string,
  path: string
}

const files = useFiles()
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
const isSame = <Ref>ref(null)
const editorIsReady = ref(false)
const fileIsTheSame = ref(true)
const snakeCasePath = computed( () => snakeCase(props.path))
let lastFileContent = ref('<p></p>')

type EditorVar = Editor | null

let editor:EditorVar = null
// const converter = new showdown.Converter();

const getText = () => {
  if(editor !== null){
    const htmlContent = editor.getHTML();
    return htmlContent
  }
}

const saveFile = async () => {
  const content = getText()
  try {
    await writeFile(
      {
        contents: content ?? '',
        path: props.path,
      }
    )
    files.savedFileTrigger()
    if(editor){
      lastFileContent.value = editor.getHTML()
      fileIsTheSame.value = true
    }
  } catch (e) {
    console.log(e)
  }
}

const doFocus = () => {
  if(editor){
    if(!editor.isFocused){
      editor.commands.focus('start')
    }
  }
}

watch(() => props.modelValue, (value: {}) => {
  if(editor){
    const htmlEditor = editor.getHTML() 
    fileIsTheSame.value = lastFileContent.value == htmlEditor

    // fileIsTheSame SALVARLO IN FILES PER RIPRENDERLO QUANDO -CHIUDI L'APPLICAZIONE
    // HTML
    isSame.value = htmlEditor === value
    // JSON
    // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)
    if (isSame.value) {
      return
    }
    // const htmlText = converter.makeHtml(value);
    editor.commands.setContent(value, false)
  }
})

watch(editorIsReady, (value: boolean) => {
    setTimeout(() => {
      if(value && editor){
        lastFileContent.value = editor.getHTML()
      }
    }, 2000);
})

onMounted( () => {
  editor = new Editor({
      extensions: [
        // @ts-ignore
        BubbleMenu,
        StarterKit,
        TextStyle,
        Color
      ],
      editorProps: {
        attributes: {
          class: 'prose dark:prose-invert prose-sm sm:prose-base m-5 focus:outline-none',
        },
      },
      content: props.modelValue,
      onUpdate: () => {
        // HTML
        emit('update:modelValue', editor?.getHTML())
        // JSON
        // this.$emit('update:modelValue', this.editor.getJSON())
      },
    })

    doFocus()
    editorIsReady.value = true
})

onBeforeUnmount( () => {
  if(editor){
    editor.destroy()
  }
})

</script>

<style>
.wrapper_editor, .tiptap {
  max-height: calc(100vh - 111px);
}
.tiptap  {
  /* max-width: 95%; */
  overflow-y: scroll;
  margin: 30px 6%;
  padding-right: 40px;
  word-break: break-word;
}

@media screen and (max-width: 1000px){
  .tiptap {
    margin: 30px 0;
    padding-right: 5%;
  }
}


</style>


