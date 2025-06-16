<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "App",
  mounted() {
    const sysMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark-mode-selector', sysMode)
  }
})
</script>

<template>
  <router-view/>
</template>

<style scoped>

</style>
