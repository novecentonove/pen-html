<template>
  <li
    :id="snakeCasePath"
    :class="{
      'border-b shadow-lg inactive': activeTab !== props.file.path,
      'border-t border-r border-l' :activeTab === props.file.path
    }" 
    class="_tab_title_el flex shrink-0 justify-center items-center align-middle pt-[10px] py-[6px] rounded-t border_color cursor-pointer select-none"
    ref="thisTab"
    @mousedown="startDragging" 
    @mouseup="endDragging"
    @click="setActiveTab($event, props.file.path)"
  >
  <!-- <div class="flex"  > -->

    <div class="ml-[8px] mr-[2px]" style="font-size: 0.5rem" :class="fileIsSaved ? 'opacity-0' : 'opacity-100'">&#9679</div>
      <div class="ml-1 flex justify-center items-center app_font font-semibold transition duration-200">
        {{ fileName }}
    </div>

  <!-- </div> -->

  <CloseIcon ref="closeIcon" @click="files.askTocloseTab(props?.file?.path || '')" :class="{ 'inactive': activeTab != props.file.path}" class="ml-2 mr-3 h-auto w-3 text-neutral-500 hover:text-red-700 transition ease-out duration-300" />
</li>

</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import CloseIcon from '@/icons/Close.vue'
  import { type FileType } from '@/types/FileType'
  import { useFiles } from '@/stores/use-files'
  import { throttle, snakeCase} from 'lodash'
  import { parseFileName } from '@/composable/parseFileName'

  type Props = {
    file: FileType
  }

  const props = defineProps<Props>()
  const files = useFiles()

  const activeTab = computed( () => files.getActiveTab)
  const fileIsSaved = computed( () => files.isThisTabSaved(props.file.path))
  const closeIcon = ref(null)
  
  const snakeCasePath = computed( (): string => snakeCase(props.file.path))
  const thisTab = ref(null)
  const xStartPoint = ref(0)

  const fileName = parseFileName(props.file.name ?? '')


  const setActiveTab = (e: MouseEvent, path: string) => {
    const click = e.target
    // @ts-ignore
    if(click == closeIcon.value || click.closest('svg') ) return
    files.setActiveTab(path)
  }

  const startDragging = ( e: MouseEvent) => {
    document.addEventListener('mousemove', handleDragging)
    xStartPoint.value = e.clientX
    files.setTabToDrag(props.file.path)
  }

  const handleDragging = throttle((e: MouseEvent) => {

    const tabToMove = files.getTabToDrag

    if(!tabToMove){
      stopAndResetDrag()
      return
    }

    const el = document.elementFromPoint(e.clientX, e.clientY)
    const tablist = document.querySelector('#_tablist')

    if(tablist && !tablist.contains(el)){
      stopAndResetDrag
    }

      const moveToRight = e.clientX > xStartPoint.value ? true : false
      const _tab_title_els = document.querySelectorAll('._tab_title_el')
      const thisTab = document.querySelector(`#${snakeCase(props.file.path)}`)
      // const activeElClosest = activeEl?.closest('li')

      
      if(!thisTab) return

      // styles
      // @ts-ignore
      thisTab.style.backgroundColor = '#000000'

        if(_tab_title_els){
          _tab_title_els.forEach((tab: any)=> {
            if(tab.contains(el)){
              tab.classList.add('color_dragging')
              if(moveToRight){
                tab.classList.add('right_dragging')
              } else {
                tab.classList.add('left_dragging')
              }
            } else {
              tab.classList.remove('color_dragging')
              tab.classList.remove('right_dragging')
              tab.classList.remove('left_dragging')
            }
        })
      }
}, 100)

const endDragging = (e: MouseEvent) => {

  const tabToMove = files.getTabToDrag

  console.log('endDragging')

  if(tabToMove){
    const el = document.elementFromPoint(e.clientX, e.clientY)
    const _tab_title_els = document.querySelectorAll('._tab_title_el')

    if(_tab_title_els){
      _tab_title_els.forEach((tab: any, i) => {
        if(tab.contains(el)){
          files.reArrangeFiles(tabToMove, i)
        }
      })
    }

    stopAndResetDrag()
  } else {
    console.log(' no tab found')
  }
}

const stopAndResetDrag = () => {
  resetStyleTab()
  document.removeEventListener('mousemove', handleDragging)
  files.setTabToDrag('')
}


const resetStyleTab = throttle(() => {

  const _tab_title_els = document.querySelectorAll('._tab_title_el')

  // Reset styles
  if(_tab_title_els){
    _tab_title_els.forEach((tab: any) => {
      tab.classList.remove('color_dragging')
      tab.style.backgroundColor = 'inherit'
      tab.classList.remove('right_dragging')
      tab.classList.remove('left_dragging')
    })
  }

}, 500)


</script>

<style>
.inactive { 
  color:  color-mix(in srgb, currentColor 40%, transparent); 
}
.color_dragging {
  color: var(--border_color);
}
.right_dragging {
  border-right: 1px solid var(--border_color);
}
.left_dragging {
  border-left: 1px solid var(--border_color);
}
.settingTab{
  background-color: color-mix(in srgb, var(--border_color) 20%, transparent);
}
</style>