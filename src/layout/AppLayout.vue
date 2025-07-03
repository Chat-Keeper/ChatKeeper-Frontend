<script>
import { defineComponent } from 'vue'
import Topbar from '@/components/Topbar.vue'
import Footer from '@/components/Footer.vue'

export default defineComponent({
  name: 'AppLayout',
  components: { Footer, Topbar },
  data() {
    return {
      visible: true,
    }
  },
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
  <div class="min-h-screen">
    <Topbar class="fixed! w-full z-9999"></Topbar>
    <div class="pt-16">
      <Toast class="mt-16" />
      <router-view></router-view>
    </div>
  </div>
  <Footer></Footer>
</template>

<style scoped></style>