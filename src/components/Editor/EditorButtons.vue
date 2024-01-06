<template>
  <div v-if="editor" :class="!showButtons ? 'w-[270px]' : 'w-[395px]'" class="buttons_bar inline-flex flex-no-wrap items-center p-1 rounded-lg"> 
    <button title="Bold" @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
      <IconBold :width="size" />
    </button>
    <button title="Italic" @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
      <IconItalic :width="size" />
    </button>
    <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }">
      <FormatUnderline :width="size" />
    </button>
    <button title="Inline code" @click="editor.chain().focus().toggleCode().run()" :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
      <IconCode :width="size" />
    </button>
    <button title="Code block" @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
      <IconCodeBlock :width="size" />
    </button>
    <button title="Strike" @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
      <IconStrike :width="size" />
    </button>
    <button title="Ul" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
      <IconUl :width="size" />
    </button>
    <button title="Clear style" @click="editor.chain().focus().clearNodes().run()">
      <SquareOutline :width="size" />
    </button>
    <button title="Clear font color" @click="editor.chain().focus().unsetColor().run()">
      <IconClearAll :width="size" />
    </button>
    <div class="inline-flex" @mouseover="showExtraButtons(true)" @mouseleave="showExtraButtons(false)">
      <IconRight width="1.6em" class="p-0" />
      <transition name="slide_right">
        <div v-if="showButtons" class="flex [&>button]:ml-0.5">
          <button title="Ol" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
            <IconOl :width="size" />
          </button>
          <button title="Highlight" @click="editor.chain().focus().toggleHighlight({ color: 'var(--hightlight_color)' }).run()" :class="{ 'is-active': editor.isActive('highlight', { color: 'var(--hightlight_color)' }) }">
            <div class="w-2 h-1 bg-blue-400"></div>
          </button>
          <button v-for="(color, i) in colors" :key="i" :title="'Text color'" @click="editor.chain().focus().setColor(color).run()">
            <div class="w-3 h-3" :style="`background-color: ${color}`"></div>
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconBold from '@/icons/FormatBold.vue'
import IconItalic from '@/icons/FormatItalic.vue'
import IconStrike from '@/icons/FormatStrike.vue'
import IconCodeBlock from '@/icons/CodeBraces.vue'
import IconCode from '@/icons/CodeBrackets.vue'
import IconOl from '@/icons/FormatListNumbered.vue'
import IconUl from '@/icons/FormatListBulleted.vue'
import SquareOutline from '@/icons/SquareOutline.vue'
import IconClearAll from '@/icons/ClipboardMinusOutline.vue'
import IconRight from '@/icons/ChevronRight.vue'
import FormatUnderline from '@/icons/FormatUnderline.vue'
import { Editor, } from '@tiptap/vue-3'
import { ref } from 'vue'
import { debounce } from 'lodash'

type EditorVar = Editor | null

type Props = { 
  editor:  EditorVar | null
}

const props = defineProps<Props>()
const editor = props.editor
const size = '1.3em'
const colors: string[] = ['#8c7c27', '#465694', '#988bd5']

const showButtons = ref(false)
const showExtraButtons = debounce( (bool: boolean) => showButtons.value = bool, 200)
</script>

<style scoped>
button {
  padding: 0.2rem;
  border-radius: 0.2rem;
  margin-right: 3px;
}

button:hover {
  background-color: #303030;
}

.buttons_bar{
  /* min-width: 405px; */
  background-color: #131313;
  border: 1px solid #3b3b3b;
}

.is-active{
  background-color: #292929;
  border-radius: .2rem;
}

.slide_right-enter-active,
.slide_right-leave-active{
  transition: all 0.2s;
}

.slide_right-enter-from,
.slide_right-leave-to {
  transform: translatex(-100%);
  opacity: 0;
}

.buttons_bar {
  transition: width .2s;
}
</style>