<script>
import { defineComponent } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import verify from '@/utils/verification.js'

/**
 * **HomeView.vue**
 * 主页视图
 * - 功能：展示欢迎页面，引导用户开始使用
 * - 引用：`auth.js`, `verification.js`
 */
export default defineComponent({
  name: 'HomeView',

  methods: { useAuthStore },

  /* 页面创建时验证用户登录有效性 */
  created() {
    verify().then((status) => {
      if (!status) {
        useAuthStore().logout()
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
  <div class="px-6 py-20">
    <div class="text-surface-700 text-center flex flex-col items-center gap-4">
      <div class="text-primary font-bold text-4xl leading-tight">聊效管家</div>
      <div class="text-surface-800 dark:text-surface-0 font-bold text-6xl leading-tight">让我们重塑您的在线聊天模式</div>
      <div class="text-surface-700 dark:text-surface-100 text-2xl leading-normal">基于在线大模型的一站式聊天对象性格分析助手</div>
      <router-link :to="useAuthStore().loginStatus ? '/home/groups' : '/login'">
        <Button label="开始使用" icon="pi pi-bolt" rounded class="mt-4" />
      </router-link>
    </div>
  </div>
</template>

<style scoped></style>
