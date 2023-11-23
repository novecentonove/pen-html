<template>
  <Teleport to="body">
    <dialog ref="dialog" class="absolute top-0 dialog text_color px-12 py-3 rounded-md">
      <div>
        <p class="mb-5 text-center"><span class="text-red-900">{{ fileToClose.name }} </span> is not saved. <br>Do you want to save it?<strong id="number"></strong></p>
        <div class="dialog_b flex justify-between">
          <!-- <button @click="closeTab('save')">Save</button> -->
          <button @click="closeTab('noSave')" class="bg-red-900">Discard changes</button>
          <button @click="closeTab('cancel')" class="bg-[#303030]" ref="default_button_dialog">Cancel</button>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFiles } from '@/stores/use-files'
import { FileType } from '@/types/FileType';

const emit = defineEmits(['fileDone'])

type Props = {
  fileToClose: FileType
  trigger: number
}

const files = useFiles()
const props = defineProps<Props>()
const dialog = ref(null)

// const showDialog = ref(false)
const default_button_dialog = ref(null)
const getNotSavedFiles = computed( () => files.getNotSavedFiles)

watch(() => props.trigger, () => {
  closeTab('check')
})

const closeTab = (mode: string) => {
console.log('closeTab not saved', props.trigger)

  const pathToClose = props.fileToClose.path
  
  if(getNotSavedFiles.value.length < 0){
    files.closeTab(pathToClose)
    return
  }

  const isNotSaved = getNotSavedFiles.value.includes(props.fileToClose.path)

  switch (mode) {
    case 'check':
      // @ts-ignore
      if(isNotSaved){
          // @ts-ignore
          dialog.value.showModal()
          // @ts-ignore
          default_button_dialog.value.focus()

      } else {
        files.closeTab(pathToClose) 
      }
      break
      return
    case 'noSave':
      
      files.closeTab(pathToClose) 
      // @ts-ignore
      dialog.value.close()
      emit('fileDone', 'ok')
      break;
      return
    case 'cancel':
      // @ts-ignore
      dialog.value.close()
      break;
      return
    default:
      // @ts-ignore
      dialog.value.close()
    break;
    return
  }

}



</script>