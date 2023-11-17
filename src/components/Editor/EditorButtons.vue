<template>
  <div ref="el" class="absolute flex bottom-2 left-2 z-10 h-10 w-[444px]">
    <div @click="toggle = !toggle" class="buttons_bar z-10 rounded-l-lg cursor-pointer inline-flex items-center justify-center pl-2 pr-2 h-10">
      <Right :size="15" />
    </div>
    <div class="buttons_bar z-10 cursor-pointer inline-flex items-center justify-center pl-2 pr-2 h-10">
      <Drag :size="15" />
    </div>

    <!-- <transition name="slide"> -->
      <div v-if="toggle" class="buttons_bar h-10 flex z-10 rounded-r-lg">
        <section  class="toggle_section inline-flex items-center flex-wrap gap-x-4 p-1 rounded-r-lg [&>button]:p-1">
          <button @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
          <IconBold :size="15" />
          </button>
          <button @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
            <IconItalic :size="15" />
          </button>
          <button @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
            <IconStrike :size="15" />
          </button>
          <button @click="editor.chain().focus().toggleCode().run()" :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
            <IconCode :size="15" />
          </button>
          <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
            <IconCodeBlock :size="15" />
          </button>
          <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
            <IconUl :size="15" />
          </button>
          <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
            <IconOl :size="15" />
          </button>
          <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
            <IconQuote :size="15" />
          </button>
          <button @click="editor.chain().focus().unsetAllMarks().run()">
            <IconClear :size="15" />
          </button>
          <button @click="editor.chain().focus().clearNodes().run()">
            <IconClearAll :size="15" />
          </button>
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
        </section>
      </div>
    <!-- </transition> -->
  </div>
</template>

<script setup lang="ts">
import IconBold from 'vue-material-design-icons/FormatBold.vue';
import IconItalic from 'vue-material-design-icons/FormatItalic.vue';
import IconStrike from 'vue-material-design-icons/FormatStrikethroughVariant.vue';
import IconCodeBlock from 'vue-material-design-icons/CodeBraces.vue';
import IconCode from 'vue-material-design-icons/CodeBrackets.vue';
import IconOl from 'vue-material-design-icons/FormatListNumbered.vue';
import IconUl from 'vue-material-design-icons/FormatListBulleted.vue';
import IconQuote from 'vue-material-design-icons/FormatQuoteOpen.vue';
import IconClear from 'vue-material-design-icons/ClipboardOutline.vue';
import IconClearAll from 'vue-material-design-icons/ClipboardMinusOutline.vue';
import Drag from 'vue-material-design-icons/Drag.vue';
import Right from 'vue-material-design-icons/ChevronRight.vue';

import { ref } from 'vue'
// import { useDraggable } from '@vueuse/core'
// import { useDraggable as Draggable} from '@vueuse/components'
type Props = { 
  editor:  Object | null
}
const props = defineProps<Props>()
const editor = props.editor
const toggle = ref(false)

const el = ref<HTMLElement | null>(null)

// const { x, y, style } = useDraggable(el, {
//   initialValue: { x: 200, y: 750 },
// })

</script>

<style>
.buttons_bar{
  background-color: #131313;
}
.slide-enter-active {
  transition: all 0.1s ease-in;
}

.slide-leave-active {
  transition: all 0.1s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-50px);
  opacity: 0;
}
</style>