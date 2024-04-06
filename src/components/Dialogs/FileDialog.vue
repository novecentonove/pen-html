<template>
  <dialog ref="dialog" class="absolute top-0 dialog text_color px-12 py-8 rounded-md">
    <div>
      <p class="mb-5 text-center"><span class="text-red-900">{{ pathToShow }} </span> is not saved. <br>Do you want to save it?<strong id="number"></strong></p>
      <div class="dialog_b flex justify-between">
        <!-- <button @click="closeTab('save')">Save</button> -->
        <button ref="cancelButton" class="bg-[#4b4b4b]">Cancel</button>
        <button ref="saveButton" class="bg-red-900">save</button>
        <button ref="closeAnyWay" class="bg-[#303030]">Discard changes</button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useFiles } from '@/stores/use-files'

const files = useFiles()
const dialog = ref(null)

const saveButton = ref(null)
const closeAnyWay = ref(null)
const cancelButton = ref(null)

const pathToShow = ref('')

const triggerFileToClose = computed(() => files.getTriggerFileToClose)
// const pathToClose = computed( () => files.getFileDialogToTrigger)
// const triggerForAll = computed( () => files.getDialogTriggerForAll)
// const triggerForAllAndKeep = computed( () => files.getDialogTriggerForAllAndKeep)

// const openFiles = computed( () => files.getOpenFiles)

// TODO RIFARE tutto con await da files!!! 

// onMounted( async () => {
//   await showDialog('test')
// })

const showDialog = (path: string) => {
  if(closeAnyWay.value && dialog.value){
    return new Promise((resolve /*reject*/) => {
      pathToShow.value = path
      // @ts-ignore
      dialog.value.showModal()
      // @ts-ignore
      saveButton.value.addEventListener('click', () => {
        resolve('save'); 
      })
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

watch(triggerFileToClose, async (path) => {
  if(path != ''){
      pathToShow.value = path
      // @ts-ignore
      const res: string = await showDialog(path)
      files.resolveCloseFile(res, path)
      // @ts-ignore
      dialog.value.close()
    }
})

// watch(triggerForAll, () => {
//   closeAllTabs()
// })

// watch(triggerForAllAndKeep, () => {
//   closeAllTabs(true)
// })

// const closeTab = async (path: string, keepTabs?: boolean) => {

//   // reset trigger
//   files.setFileDialogToTrigger('')

//   return new Promise(async (resolve /*reject*/) => {
//     pathToShow.value = path
//     const res = await showDialog(path)
//     let resFromFiles = ''

//     switch (res) {
//       case 'save':
//         resFromFiles = await files.closeTab(path, 'save', keepTabs) as string
//         break;
//       case 'cancel':
//         resFromFiles = await files.closeTab(path, 'cancel') as string
//         break;
//       case 'discard':
//         resFromFiles = await files.closeTab(path, 'discard', keepTabs) as string
//         break;
//       default:
//         console.error('handler not found')
//         resFromFiles = await files.closeTab(path, 'cancel') as string
//         break;
//     }

//     // @ts-ignore
//     dialog.value.close()
//     resolve(resFromFiles)
//   })
// }

// const closeAllTabs = async (keepTabs?: boolean) => {

//   for (const file of openFiles.value) {
//     const isSaved = !files.checkIfFileIsNotSaved(file.path)
//     if(isSaved){
//       await files.closeTab(file.path)
//     } else {
//         files.setSelectedPath(file.path)
//         const res = await closeTab(file.path, keepTabs)
//         if(res == 'cancel') return
//       }
//   }
// }

</script>

<style>
.dialog {
  min-width: 425px;
  max-width: 1200px;
  border: 1px solid #202020;
}
.dialog_b button{
  white-space: nowrap;
  width: 100%;
  padding: 8px 10px;
  margin: 0 8px;
  border-radius: 5px;
}
</style>