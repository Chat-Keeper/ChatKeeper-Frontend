<script>
import { defineComponent } from 'vue'
import Topbar from '@/components/Topbar.vue'
import Footer from '@/components/Footer.vue'

/**
 * **AppLayout.vue**
 * 页面布局组件
 * - 功能：进行通用页面布局，布局顶栏和脚注
 * - 引用：`Topbar.vue`, `Footer.vue`
 */
export default defineComponent({
  name: 'AppLayout',

  components: { Footer, Topbar },

  methods: {
    handleBeforeUnload(event) {
      event.preventDefault()
      event.returnValue = ''
    },
  },

  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  },

  beforeUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  },
})
</script>

<template>
  <div class="min-h-screen dark:bg-surface-950">
    <Topbar class="fixed! w-full z-200"></Topbar>
    <div class="pt-16">
      <Toast class="mt-16" />
      <router-view></router-view>
    </div>
  </div>
  <Footer></Footer>
</template>

<style scoped></style>
