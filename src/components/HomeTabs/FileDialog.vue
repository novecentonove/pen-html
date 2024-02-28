<template>
  <dialog ref="dialog" class="absolute top-0 dialog text_color px-12 py-8 rounded-md">
    <div>
      <p class="mb-5 text-center"><span class="text-red-900">{{ pathToShow }} </span> is not saved. <br>Do you want to save it?<strong id="number"></strong></p>
      <div class="dialog_b flex justify-between">
        <!-- <button @click="closeTab('save')">Save</button> -->
        <button ref="closeAnyWay" class="bg-red-900">Discard changes</button>
        <button ref="cancelButton" class="bg-[#303030]">Cancel</button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useFiles } from '@/stores/use-files'

const files = useFiles()
const dialog = ref(null)
const closeAnyWay = ref(null)
const cancelButton = ref(null)

const pathToShow = ref('')
const pathToClose = computed( () => files.getFileDialogToTrigger)
const triggerForAll = computed( () => files.getDialogTriggerForAll)

const openFiles = computed( () => files.getOpenFiles)

const showDialog = (path: string) => {
  if(closeAnyWay.value && dialog.value){
    return new Promise((resolve /*reject*/) => {
      pathToShow.value = path
      // @ts-ignore
      dialog.value.showModal()
      // @ts-ignore
      closeAnyWay.value.addEventListener('click', () => {
        resolve('discard'); 
      })
      // @ts-ignore
      cancelButton.value.addEventListener('click', () => {
        resolve('cancel');
      })
    })
  }
}

watch(pathToClose, () => {
  if(pathToClose.value) {
    closeTab(pathToClose.value)
  }
})

watch(triggerForAll, () => {
  closeAllTabs()
})

const closeTab = async (path: string) => {
  pathToShow.value = path
  const res = await showDialog(path)

  if(res == 'discard') {
    files.closeTab(path, 'discard')
  } else if (res == 'cancel') {
    files.closeTab(path, 'cancel')
  }

  // @ts-ignore
  dialog.value.close()
  // reset trigger
  files.setFileDialogToTrigger('')
}

// TODO Spostare in files
const closeAllTabs = async () => {

  for (const file of openFiles.value) {
    const isSaved = !files.checkIfFileIsNotSaved(file.path)
    if(isSaved){
      files.closeTab(file.path)
    } else {
        files.setSelectedPath(file.path)
        const res = await showDialog(file.path)

        if(res == 'discard') files.closeTab(file.path, 'discard')
        // @ts-ignore
        dialog.value.close()
      }
  }
}

</script>

<style>
.dialog {
  min-width: 425px;
  max-width: 600px;
  border: 1px solid #202020;
}
.dialog_b button{
  width: 100%;
    padding: 8px 10px;
    margin: 0 8px;
    border-radius: 5px;
}
</style>