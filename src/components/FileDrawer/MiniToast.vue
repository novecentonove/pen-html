<template>
  <transition name="saved_file"> 
    <div v-if="show" style="font-size: 0.8rem;" class="absolute right-3 bottom-[1px] text-neutral-950 px-2 bg-orange-800 rounded-md">{{props.trigger.message || 'saved!'}}</div>
  </transition> 
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  type Props = {
    trigger: {trigger: number, message:string},
  }
  // ,
  const props = defineProps<Props>()

  const show = ref(false)

  watch(() => props.trigger, (val) => {
    // console.log(prev.trigger, val.trigger )
    // if(prev.trigger < val.trigger){
      show.value = true
      setTimeout(() => {
        show.value = false
      }, 2000)
    // }
  },
{ deep: true})
  </script>

<style>
  .saved_file-enter-active {
    transition: all 0.2s ease-in;
  }

  .saved_file-leave-active {
    transition: all 0.3s ease-out;
  }

  .saved_file-enter-from,
  .saved_file-leave-to {
    transform: translateY(10px);
    opacity: 0;
  }
  .toast_saved {
    background-color: rgb(161, 116, 20);
    padding: 0 5px;
    border-radius: 5px;
  }
</style>