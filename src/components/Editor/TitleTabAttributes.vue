<template>
    <span class="_drag_span ml-1 opacity-25" @mousedown="startDragging" @mouseup="endDragging"><DragIcon :size="14" /></span>
    <span v-if="!saved" class="pr-1">&#9679;</span>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
// @ts-ignore
import DragIcon from 'vue-material-design-icons/DragVertical.vue'

type Props = {
  saved: boolean,
  name: string,
  path: string,
  snakeCasePath: string
}

const props = defineProps<Props>()

let editor_section: HTMLElement | null = null
let file_drawer: HTMLElement | null = null
let _tab_title_els: NodeList | null = null

import { useFiles } from '../../stores/use-files'
const files = useFiles()

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
      const thisTab: HTMLElement | null = document.querySelector(`#${props.snakeCasePath}`)
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

  onMounted( () => {
    // Drag elements
    editor_section = document.querySelector('#editor_section')
    file_drawer = document.querySelector('#fileD')
  })

</script>