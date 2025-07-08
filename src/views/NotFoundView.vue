<script>
import { defineComponent } from 'vue'
import verify from '@/utils/verification.js'

/**
 * **NotFoundView.vue**
 * 路由未定义视图
 * - 功能：处理未定义路由访问，导航回主页
 * - 引用：`verification.js`
 */
export default defineComponent({
  name: 'NotFoundView',

  /* 页面创建时验证用户登录有效性 */
  created() {
    verify().then((status) => {
      if (!status) {
        setTimeout(() => this.$router.push('/login'), 500)
        this.$toast.add({
          severity: 'info',
          summary: '你尚未登录',
          detail: '即将跳转登录页面……',
          life: 3000,
        })
      }
    })
  },
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
      <router-link to="/home" class="flex justify-center m-5 mt-10">
        <Button icon="pi pi-bolt" label="回主页" rounded></Button>
      </router-link>
    </div>
  </div>
</template>

<style scoped></style>
