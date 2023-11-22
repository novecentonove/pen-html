<template>
  <div v-if="editor" class="buttons_bar flex items-center flex-no-wrap gap-x-2 p-1  rounded-lg">
    <button @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
      <IconBold :size="size" />
    </button>
    <button @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
      <IconItalic :size="size" />
    </button>
    <button @click="editor.chain().focus().toggleCode().run()" :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
      <IconCode :size="size" />
    </button>
    <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
      <IconCodeBlock :size="size" />
    </button>
    <button @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
      <IconStrike :size="size" />
    </button>
    <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
      <IconUl :size="size" />
    </button>
    <button v-for="(color, i) in colors" :key="i" @click="editor.chain().focus().setColor(color).run()">
      <div class="w-3 h-3" :style="`background-color: ${color}`"></div>
    </button>
    <button @click="editor.chain().focus().unsetColor().run()">
      <div class="w-3 h-3 border border-gray-400"></div>
    </button>

    <!-- TODO -->
    <!-- <div class="flex gap-x-2 items-center" @mouseover="showExtraButton = true" @mouseleave="showExtraButton = false">
      <IconRight :size="15" class="p-1" />
      <transition name="slide_right">
        <div v-if="showExtraButton" class="flex gap-x-2">
          <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
            <IconOl :size="size" />
          </button>
          <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
            <IconQuote :size="size" />
          </button>
          <button @click="editor.chain().focus().unsetAllMarks().run()">
            <IconClear :size="size" />
          </button>
        </div>
      </transition>
    </div> -->

    <!-- <button ">
      <IconClear :size="size" />
    </button> -->
    <div>

    </div>
    <!-- <button @click="editor.chain().focus().clearNodes().run()">
      <IconClearAll :size="size" />
    </button> -->
    <!-- <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
      paragraph
    </button> -->
    <!-- <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
      h1
    </button>
    <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
      h2
    </button>
    <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
      h3
    </button>
    <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
      h4
    </button>
    <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
      h5
    </button>
    <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
      h6
    </button> -->
    <!-- <button @click="editor.chain().focus().setHorizontalRule().run()">
      horizontal rule
    </button> -->
    <!-- <button @click="editor.chain().focus().setHardBreak().run()">
      hard break
    </button> -->
    <!-- <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
      undo
    </button>
    <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
      redo
    </button> -->
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import IconBold from 'vue-material-design-icons/FormatBold.vue';
// @ts-ignore
import IconItalic from 'vue-material-design-icons/FormatItalic.vue';
// @ts-ignore
import IconStrike from 'vue-material-design-icons/FormatStrikethroughVariant.vue';
// @ts-ignore
import IconCodeBlock from 'vue-material-design-icons/CodeBraces.vue';
// @ts-ignore
import IconCode from 'vue-material-design-icons/CodeBrackets.vue';
// @ts-ignore
import IconOl from 'vue-material-design-icons/FormatListNumbered.vue';
// @ts-ignore
import IconUl from 'vue-material-design-icons/FormatListBulleted.vue';
// @ts-ignore
import IconQuote from 'vue-material-design-icons/FormatQuoteOpen.vue';
// @ts-ignore
import IconClear from 'vue-material-design-icons/ClipboardOutline.vue';
// import IconClearAll from 'vue-material-design-icons/ClipboardMinusOutline.vue';
// import Drag from 'vue-material-design-icons/Drag.vue';

// @ts-ignore
import IconRight from 'vue-material-design-icons/ChevronRight.vue';
import { Editor, } from '@tiptap/vue-3'
import { ref } from 'vue';

type EditorVar = Editor | null

type Props = { 
  editor:  EditorVar | null
}
const props = defineProps<Props>()
const editor = props.editor
const size = 18

const showExtraButton = ref(false)

const colors: string[] = ['#e2c42c', '#2ca1e2', '#988bd5'];
</script>

<style scoped>

button {
  padding: 0.2rem;
  border-radius: 0.2rem;
}
button:hover {
  background-color: #524e4e;
}
.buttons_bar{
  /* min-width: 405px; */
  background-color: #131313;
  border: 1px solid #3b3b3b;
}
.is-active{
  background-color: #524e4e;
  border-radius: .2rem;
}

.slide_right-enter-active {
  transition: all 0.2s;
}

.slide_right-leave-active {
  transition: all 0.2s;
}

.slide_right-enter-from,
.slide_right-leave-to {
  transform: translatex(-100%);
  opacity: 0;
}
</style>