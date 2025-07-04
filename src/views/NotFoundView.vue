<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NotFoundView'
})
</script>

<template>
  <div class="flex justify-center items-center h-[calc(100vh-4rem)] w-full">
    <div class="flex-col items-center w-full">
      <div class="flex justify-center m-5">
        <div class="font-bold text-9xl text-primary-500">404</div>
      </div>
      <div class="flex justify-center m-5">
        <div class="font-bold text-5xl text-primary-500">哎呦！你的网页不见啦~</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>