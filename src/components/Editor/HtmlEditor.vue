<template>

  <Teleport v-if="editorIsReady" :to="`#${snakeCasePath}`">
    <TitleTabAttributes
      :unsaved="unsaved"
      :name="props.name"
      :path="props.path"
      :snake-case-path="snakeCasePath"
     />
  </Teleport>

  <div v-if="openFile?.isError" class="editor_font editor_font_size mt-6 px-12">
      <p>An errror occurred</p>
      <p v-if="openFile.error">{{ openFile.error }}</p>
  </div>

  <div v-else @click.prevent.self="doFocus" class="flex flex-col wrapper_editor markdown-body editor_font editor_font_size relative mt-6 h-full px-10">
    <div class="self-stretch overflow-y-scroll">
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
import { type Ref, onBeforeUnmount, onMounted, ref, watch, computed } from 'vue'
// @ts-ignore
import { snakeCase} from 'lodash'
import { useFiles } from '../../stores/use-files'
import EditorButtons from './EditorButtons.vue'
import TitleTabAttributes from '@/components/HomeTabs/TitleTabAttributes.vue'
import { writeFile } from '@tauri-apps/api/fs'
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu, Editor, EditorContent } from '@tiptap/vue-3'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { Highlight } from '@tiptap/extension-highlight'
import { Extension } from '@tiptap/core'
import Underline from '@tiptap/extension-underline'
// import TaskList from '@tiptap/extension-task-list'

type Props = {
  modelValue: string
  name: string
  path: string
  onSelectedPath: number
}

const props = defineProps<Props>()
const files = useFiles()
const emit = defineEmits(['update:modelValue'])
const isSame = <Ref>ref(null)
const editorIsReady = ref(false)
const unsaved = ref(false)
const snakeCasePath = computed( (): string => snakeCase(props.path))
const openFile = files.getOpenFile(props.path)
let lastFileContent = ref('<p></p>')

type EditorVar = Editor | null

let editor:EditorVar = null

const getText = () => {
  if(editor !== null){
    const htmlContent = editor.getHTML()
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

    files.triggerFileIsSaved()

    if(editor){
      lastFileContent.value = editor.getHTML()
      unsaved.value = false
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
    unsaved.value = lastFileContent.value != htmlEditor

    isSame.value = htmlEditor === value

    if (isSame.value) {
      return
    }

    editor.commands.setContent(value, false)
  }
})

watch(editorIsReady, (value: boolean) => {
    setTimeout(() => {
      if(value && editor){
        lastFileContent.value = editor.getHTML()
      }
    }, 2000)
})

watch(unsaved, (bool) => {
    files.toggleUnsavedFiles({path: props.path, savedFile: !bool})
})

watch(() => props.onSelectedPath, () => doFocus())

onMounted( () => {
  editor = new Editor({
      extensions: [
        // @ts-ignore
        BubbleMenu,
        StarterKit,
        TextStyle,
        Color.configure({
          types: ['textStyle'],
        }),

        Extension.create({
          name: 'CodeBlockTab',
          // @ts-ignore
          addKeyboardShortcuts() {
            return {
              Tab: () => {
                if (editor?.isActive("codeBlock")) {
                  return editor.commands.insertContent("\t")
                }
              }
            }
          }
        }),

        Highlight.configure({
          multicolor: true,
          HTMLAttributes: {
            class: 'highlight_text',
          }
        }),
        Underline
        // TaskList
      ],
      editorProps: {
        attributes: {
          class: 'prose dark:prose-invert prose-sm sm:prose-base m-5 focus:outline-none',
        },
      },
      parseOptions: {
          preserveWhitespace: 'full'
      },
      content: props.modelValue,
      onUpdate: () => {
        emit('update:modelValue', editor?.getHTML())
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
  height: calc(100vh - 111px);
}

.tiptap {
  white-space: pre;
  word-break: break-word;
  margin: 0 auto;
  /* overflow-y: scroll; */
  padding-right: 25px;
  max-width: 700px;
}
</style>


