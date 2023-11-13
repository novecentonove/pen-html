<template>
  <div class="tabs">
    <ul class="flex">
      <!-- <li v-for="(name, i) in tabTitles" :key="i" @click="selectedTitle = name" :class="{ 'bg-black text-white': selectedTitle == name}" class="cursor-pointer p-2 m-0.5 bg-purple-200 rounded">
        {{name}}
      </li> -->
      <!-- <li v-for="(name, i) in tabTitles" :key="i">
        {{name}}
      </li> -->
    </ul>
      <div tag="ul" mode="out-in" name="list" appear>
        <slot />
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity'
import { provide } from '@vue/runtime-core';
import { onMounted, useSlots } from 'vue';

const slots = useSlots();
// const tabTitles = ref(slots.default().map( file => file.props.name)) //array of nodes
// const selectedTitle = ref(tabTitles.value[0])

// provide('selectedTitle', selectedTitle)

onMounted( () => {
  slots.default().map( file => {
    console.log('file', file)
  })
})


</script>

<style>

.list-enter-from{
  opacity: 0;
}
.list-enter-to{
  opacity: 1;
}
.list-enter-active{
  transition: all 0.3s ease-out;
  position: absolute
}
.list-leave-from{
  opacity: 1;
}
.list-leave-to{
  opacity: 0;
}
.list-leave-active{
  transition: all 0.3s ease-out;
  position: absolute /* DA USARE PER LIST MOVE */
}

/* spostamento da uno stato e l'altro*/
.list-move{
  transition: all 0.3s ease-out;
}

</style>