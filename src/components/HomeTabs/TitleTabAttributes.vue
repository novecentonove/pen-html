<template>
  <div :title="props.path" class="flex justify-center items-center">
    <div class="pl-[6px]" style="font-size: 0.6rem" :class="props.unsaved ? 'opacity-100' : 'opacity-0'">&#9679</div>
    <div class="_drag_div py-2 pr-1 pl-[6px]" @click="openFile({name: props.name, path: props.path})" @mousedown.prevent="startDragging" @mouseup.prevent="endDragging">
      <div class="_filename_tab font-semibold transition duration-200" style="font-size: 0.8rem">{{ fileName }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useFiles } from '../../stores/use-files'
import { type FileType } from '@/types/FileType'
import { parseFileName } from '@/composable/parseFileName'

type Props = {
  unsaved: boolean,
  name: string,
  path: string,
  snakeCasePath: string
}

const props = defineProps<Props>()

let editor_section: HTMLElement | null = null
let file_drawer: HTMLElement | null = null
let _tab_title_els: NodeList | null = null

const files = useFiles()
const fileName = parseFileName(props?.name ?? '')

const openFile = async (file: FileType | null) => {
  if(file){
    files.setSelectedPath(file.path)
  }
}

const startDragging = () => {
  document.addEventListener('mousemove', handleDragging)
  files.setTabToDrag(props.path)
}

const handleDragging = (e: MouseEvent) => {

  const tabToMove = files.getTabToDrag

  if(!tabToMove){
    document.removeEventListener('mousemove', handleDragging)
    resetStyleTab()
    return
  }

  // reload _tab_title_els
  _tab_title_els = document.querySelectorAll('._tab_title_el')

  if(file_drawer && editor_section && _tab_title_els){
    const el = document.elementFromPoint(e.clientX, e.clientY)
    const thisTab: HTMLElement | null = document.querySelector(`#${props.snakeCasePath}`)
    if(thisTab){
      // @ts-ignore
      thisTab.parentElement.parentElement.style.backgroundColor = '#000000'
    }

    _tab_title_els.forEach((tab: any)=> {
      if(tab.contains(el)){
        tab.style.color = 'var(--border_color)'
      } else {
        tab.style.color = 'inherit'
      }
    })

    // Stop if out of place
    if(file_drawer && editor_section && file_drawer.contains(el) || editor_section.contains(el)) {
      document.removeEventListener('mousemove', handleDragging)
      resetStyleTab()
    }
  }
}

const endDragging = (e: MouseEvent) => {

  const tabToMove = files.getTabToDrag
  
  if(tabToMove){
    const el = document.elementFromPoint(e.clientX, e.clientY)
    _tab_title_els = document.querySelectorAll('._tab_title_el')

    // parent elements contains tab
    if(file_drawer && editor_section && _tab_title_els){
      _tab_title_els.forEach((tab: any, i) => {
        if(tab.parentElement.contains(el)){
          files.reArrangeFiles(tabToMove, i)
        }
      })
    }
    document.removeEventListener('mousemove', handleDragging)
    resetStyleTab()

    files.setTabToDrag('')
  }
}

const resetStyleTab = () => {
  _tab_title_els = document.querySelectorAll('._tab_title_el')

  _tab_title_els.forEach((tab: any) => {
    tab.style.color = 'inherit'
    tab.parentElement.parentElement.style.backgroundColor = 'transparent'
  })
}

onMounted( () => {
  // Drag elements
  editor_section = document.querySelector('#editor_section')
  file_drawer = document.querySelector('#fileD')
})
</script>