<template>
  
  <Teleport v-if="editorIsReady" :to="`#${snakeCasePath}`">
    <!-- <TitleTabAttributes /> -->
    <span class="_drag_span ml-1 opacity-25" @mousedown="startDragging" @mouseup="endDragging"><DragIcon :size="14" /></span>
    <span v-if="!saved" class="pr-1">&#9679;</span>
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
import { type Ref, onBeforeUnmount, onMounted, ref, watch, computed } from 'vue'
// @ts-ignore
import { snakeCase} from 'lodash'
import { useFiles } from '../../stores/use-files'
import EditorButtons from './EditorButtons.vue'
import TitleTabAttributes from './TitleTabAttributes.vue'
import { writeFile } from '@tauri-apps/api/fs'
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu, Editor, EditorContent } from '@tiptap/vue-3'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { Highlight } from '@tiptap/extension-highlight'
import { Extension } from '@tiptap/core'
import Underline from '@tiptap/extension-underline'
// @ts-ignore
import DragIcon from 'vue-material-design-icons/DragVertical.vue'
// import TaskList from '@tiptap/extension-task-list'

const CodeBlockTab = Extension.create({
  name: 'CodeBlockTab',
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (editor?.isActive("codeBlock")) {
          return editor.commands.insertContent("\t")
        }
        return true
      }
    }
  }
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
const saved = ref(true)
const snakeCasePath = computed( () => snakeCase(props.path))
let lastFileContent = ref('<p></p>')

type EditorVar = Editor | null

let editor:EditorVar = null


let editor_section: HTMLElement | null = null
let file_drawer: HTMLElement | null = null
let _tab_title_els: NodeList | null = null

const getText = () => {
  if(editor !== null){
    const htmlContent = editor.getHTML();
    return htmlContent
  }
}

const saveFile = async () => {

  const allowedExt = ['html'];
  const ext = props.path.split('.').pop();

  if(!allowedExt.includes(ext ?? '')){
    alert('File extension is not html, I cant save the file -- create dialog')
    return
  }

  const content = getText()
  try {
    await writeFile(
      {
        contents: content ?? '',
        path: props.path,
      }
    )
    files.fileIsSafeTrigger()
    if(editor){
      lastFileContent.value = editor.getHTML()
      saved.value = true
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

// TAb dragging
const startDragging = () => {
    document.addEventListener('mousemove', handleDragging)
    files.setTabToDrag(props.path)
}

const handleDragging = (e: MouseEvent) => {
    // reload _tab_title_els
    _tab_title_els = document.querySelectorAll('._tab_title_el')

    if(file_drawer && editor_section && _tab_title_els){
      const el = document.elementFromPoint(e.clientX, e.clientY)
      const thisTab: HTMLElement | null = document.querySelector(`#${snakeCasePath.value}`)
      if(thisTab){
        // @ts-ignore
        thisTab.parentElement.parentElement.style.backgroundColor = '#000000'
        // @ts-ignore
        thisTab.parentElement.parentElement.style.opacity = '0.5'
      }

      _tab_title_els.forEach((tab: any)=> {
        if(tab.contains(el)){
          tab.style.color = 'var(--border_color)'
          tab.parentElement.querySelector('._drag_span').style.opacity = 1
        } else {
          tab.style.color = 'inherit'
        }
      })

      if(file_drawer.contains(el) || editor_section.contains(el)) {
        document.removeEventListener('mousemove', handleDragging)
        resetStyleTab()
      }
    }
  }

  const endDragging = (e: MouseEvent) => {

    const tabToMove = files.getTabToDrag
    const el = document.elementFromPoint(e.clientX, e.clientY)
    _tab_title_els = document.querySelectorAll('._tab_title_el')

    if(file_drawer && editor_section && _tab_title_els){
      _tab_title_els.forEach((tab: any, i) => {
        if(tab.parentElement.contains(el)){
          files.reArrangeFiles(tabToMove, i)
        }
      })
    } else {
      // console.log('out of if')
    }

    resetStyleTab()

    document.removeEventListener('mousemove', handleDragging)  
  }

  const resetStyleTab = () => {
    _tab_title_els = document.querySelectorAll('._tab_title_el')

    _tab_title_els.forEach((tab: any) => {
      tab.style.color = 'inherit'
      tab.parentElement.parentElement.style.backgroundColor = 'transparent'
      tab.parentElement.parentElement.style.opacity = '1'
    })
  }

watch(() => props.modelValue, (value: {}) => {
  if(editor){
    const htmlEditor = editor.getHTML() 
    saved.value = lastFileContent.value == htmlEditor

    // HTML
    // ??
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

watch(saved, (bool) => {
    files.toggleUnsavedFiles({path: props.path, savedFile: bool})
})

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

        CodeBlockTab,
        
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
        // HTML
        emit('update:modelValue', editor?.getHTML())
        // JSON
        // this.$emit('update:modelValue', this.editor.getJSON())
      },
  })

  doFocus()
  editorIsReady.value = true
  // Drag elements
  editor_section = document.querySelector('#editor_section')
  file_drawer = document.querySelector('#fileD')
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
  white-space: pre;
  word-break: break-word;
}

@media screen and (min-width: 1001px) {
  .tiptap {
    max-width: 80%;
  }
}

.tiptap  {
  height: 100vh;
  overflow-y: scroll;
  margin: 30px auto;
  padding-right: 40px;
  word-break: break-word;
}

</style>


