<template>
  <div class="overflow-y-scroll px-12 mt-12 ml-[2%] mr-10 text-md leading-6 select-text">
    <p>Welcome to PEN-HTML</p>
    <br>
    <p><b>Getting started</b><br>
      <br>
      1 - Create a default folder on your pc to store your notes. <br>
      2 - Add a <b>todo.html</b> file and a <b>todo.txt file.</b> <br>
      <br>
      You can start by going to <b><i>settings </i></b> <span class="text-neutral-600">(<i>bottom left button <IconSettings class="inline" title="Settings" width="1.1em" />)</i></span> and set up your <u>base folder.</u> <br>
    </p>
    <br>

    <p>
      <i>SUPPORTED EXTENSIONS:</i>
      html, txt, css, md<br>
      <br>
      There are 2 types of editors: <br>
      1 - for txt, css, md files there is a basic editor. <br>
      2 - for <b>html</b> files <u>(recommended for notes)</u> you can customize and format the text.<br>
    </p>
    <br>
    <br>
    <p>
      - You can use <b><i>CTRL-S</i></b> or <b><i>CMD-S</i></b> to save<br>
      - You can drag file into editor. (if extension is supported)
    </p>

  </div>
</template>

<script setup lang="ts">
import IconSettings from '@/icons/Settings.vue'
</script>