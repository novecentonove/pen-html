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

  <!-- @click="doFocus($event)" -->
  <div v-else class="relative flex flex-col wrapper_editor markdown-body editor_font editor_font_size mt-6 h-full px-10">
    <div class="absolute bottom-3 right-3 cursor-pointer opacity-30" @click="settings.toggleEditorWidth">
      <WidthNormalIcon title="Set width to 900" v-if="settings.getToggleEditorWidth === 700"/>
      <WidthWideIcon title="Set width to 700" v-else />
    </div>
    <div class="self-stretch overflow-y-scroll">
      <div v-if="editor">
        <editor-content
        :editor="editor"
        type="color"
        @input="editor?.chain().focus().setColor($event.target.value).run()"
        :value="editor.getAttributes('textStyle').color"
        :style="`padding: 0 calc((100% - ${settings.getToggleEditorWidth}px) / 2);`"
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
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { useSettings } from '@/stores/use-settings'
import WidthNormalIcon from '@/icons/Width-normal.vue'
import WidthWideIcon from '@/icons/Width-wide.vue'


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
const openFile = files.findInOpenFiles(props.path)
const triggerSaveFile = computed(() => files.getTriggerSaveFile)
const settings = useSettings()

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
    files.setTriggerMiniToast()
    if(editor){
      lastFileContent.value = editor.getHTML()
      unsaved.value = false
    }
  } catch (e) {
    console.log(e)
  }
}

const doFocus = (e:any = null) => {
  if(editor){
    if(e && e.target){
    const isButtomBar = (e.target.closest('.buttons_bar'))
    if(isButtomBar){
      return
    }
  }
    if(!editor.isFocused){
      editor.commands.focus('start')
    }
  }
}

watch(triggerSaveFile, async (pathToTrigger) => {
  return new Promise(async (resolve) => {
    if(pathToTrigger === props.path){
      await saveFile()
      files.resolveHandler(props.path)
      resolve(true)
    }
  })
})

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
  files.setToggleSavedFiles({path: props.path, savedFile: !bool})
})

watch(() => props.onSelectedPath, () => doFocus())

onMounted( () => {
  editor = new Editor({
      extensions: [
        // @ts-ignore
        BubbleMenu,
        StarterKit.configure({
            codeBlock: false
        }),
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
                if (editor?.isActive("listItem") === false) {
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
        Underline,
        CodeBlockLowlight.configure({
            lowlight: createLowlight(common)
        })
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
  padding-right: 25px;
}
</style>


