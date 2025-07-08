<script>
import { defineComponent } from 'vue'

/**
 * **App.vue**
 * 路由根节点
 */
export default defineComponent({
  name: 'App',
  mounted() {
    const sysMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark-mode-selector', sysMode)
  },
})
</script>

<template>
  <router-view />
</template>

<style scoped></style>
