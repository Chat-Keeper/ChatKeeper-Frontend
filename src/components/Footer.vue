<script>
import { defineComponent } from 'vue'

/**
 * **Footer.vue**
 * 脚注组件
 * - 功能：显示应用版本、作者等内容
 */
export default defineComponent({
  name: 'Footer',
})
</script>

<template>
  <div class="h-20 flex justify-center bg-surface-100 dark:bg-surface-900">
    <div class="flex justify-center items-center text-gray-500 gap-2">
      <p class="font-bold">ChatKeeper v0.1.0</p>
      <p>by</p>
      <a href="https://github.com/uniqueHRX">uniqueHRX,</a>
      <a href="https://github.com/sefresf">sefresf</a>
      <p>and</p>
      <a href="https://github.com/WildBoarHenry123">WildBoarHenry123</a>
    </div>
  </div>
</template>

<style scoped></style>
