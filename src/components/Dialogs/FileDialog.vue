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
import { computed, ref, watch } from 'vue'
import { useFiles } from '@/stores/use-files'

const files = useFiles()
const dialog = ref(null)

const saveButton = ref(null)
const closeAnyWay = ref(null)
const cancelButton = ref(null)

const pathToShow = ref('')

const triggerFileToClose = computed(() => files.getTriggerFileToClose)

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

watch(triggerFileToClose, async (el) => {
  // @ts-ignore
  if(Object.keys(el).length && el.path != ''){
    
    // @ts-ignore
      pathToShow.value = el.path
      // @ts-ignore
      const res: string = await showDialog(el.path)
      // @ts-ignore
      files.resolveCloseFile(res, el.path, el.close)
      // @ts-ignore
      dialog.value.close()
    }
  },
  { deep: true }
)
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