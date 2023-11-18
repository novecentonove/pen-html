<template>
  <transition name="saved_file"> 
    <div class="absolute right-1 bottom-0 -mb-0.5 text-gray-800 px-2 bg-orange-800 rounded-md" v-if="show">saved!</div>
  </transition> 
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';


type Props = {
  trigger: number,
}
const props = defineProps<Props>()

const show = ref(true)

watch(() => props.trigger, (val) => {
  show.value = true
  setTimeout(() => {
    show.value = false
  }, 2000);
})
</script>

<style>
.saved_file-enter-active {
  transition: all 0.5s ease-in;
}

.saved_file-leave-active {
  transition: all 0.5s ease-out;
}

.saved_file-enter-from,
.saved_file-leave-to {
  transform: translatey(10px);
  opacity: 0;
}
.toast_saved {
  background-color: rgb(161, 116, 20);
  padding: 0 5px;
  border-radius: 5px;
}
</style>