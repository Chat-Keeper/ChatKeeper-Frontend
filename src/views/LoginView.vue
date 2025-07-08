<script>
import { defineComponent } from 'vue'
import request from '@/utils/request.js'
import { useAuthStore } from '@/store/auth.js'

/**
 * **LoginView.vue**
 * 登录视图
 * - 功能：提供登录页面
 * - 引用：`request.js`, `auth.js`
 */
export default defineComponent({
  name: 'LoginView',

  data() {
    return {
      username: '',
      password: '',
    }
  },

  methods: {
    useAuthStore,

    /* 用户登录方法 */
    login() {
      request
        .post('/auth/login', {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          console.log(response)
          if (response.data.code === 200) {
            useAuthStore().login(response.data.data.user_id, response.data.data.username, response.data.data.token)
            console.log(response.data.msg)
            this.$router.push('/home')
            this.$toast.add({
              severity: 'success',
              summary: '登录成功',
              detail: '欢迎你，' + response.data.data.username + '！',
              life: 3000,
            })
          } else if (response.data.code === 400) {
            this.password = ''
            this.$toast.add({
              severity: 'error',
              summary: '登录失败',
              detail: '用户名或密码错误',
              life: 3000,
            })
          } else {
            this.password = ''
            this.$toast.add({
              severity: 'error',
              summary: '登录失败',
              detail: '未知错误，请重试',
              life: 3000,
            })
          }
        })
        .catch((error) => {
          console.log(error)
          this.$toast.add({
            severity: 'error',
            summary: '服务器响应异常',
            detail: '请联系管理人员',
            life: 3000,
          })
        })
    },
  },

  created() {
    this.username = useAuthStore().username
  },
})
</script>

<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
    <div class="bg-surface-0 dark:bg-surface-900 p-10 md:p-12 md:px-14 shadow-sm rounded-2xl max-w-lg mx-auto flex flex-col gap-8">
      <div class="flex flex-col items-center gap-6">
        <div class="flex items-center gap-4">
          <Avatar icon="pi pi-prime" class="bg-transparent" size="xlarge" />
        </div>
        <div class="flex flex-col items-center gap-3 w-full">
          <div class="text-surface-900 dark:text-surface-0 text-3xl font-semibold leading-tight text-center w-full">欢迎回来</div>
          <div class="text-center w-full">
            <span class="text-surface-700 dark:text-surface-200 leading-normal">没有账号？</span>
            <router-link to="/signup" class="text-primary font-medium ml-1 hover:text-primary-emphasis">现在创建一个！</router-link>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-6 w-full">
        <div class="flex flex-col gap-2 w-full">
          <label for="username" class="text-surface-900 dark:text-surface-0 font-medium leading-normal">用户名/Username</label>
          <InputText v-model="username" id="username" type="text" placeholder="请输入您的用户名" class="w-full p-3 shadow-sm rounded-lg" />
        </div>
        <div class="flex flex-col gap-2 w-full">
          <label for="password" class="text-surface-900 dark:text-surface-0 font-medium leading-normal">密码/Password</label>
          <InputText v-model="password" id="password" type="password" placeholder="请输入您的密码" class="w-full p-3 shadow-sm rounded-lg" />
        </div>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-0">
          <div class="flex items-center gap-2">
            <Checkbox v-model="useAuthStore().rememberUser" id="remember-user" :binary="true" />
            <label for="remember-user" class="text-surface-900 dark:text-surface-0 leading-normal">记住我</label>
          </div>
          <router-link to="/" class="text-primary font-medium hover:text-primary-emphasis">忘记密码了？</router-link>
        </div>
      </div>
      <Button @click="login()" label="登录" icon="pi pi-user" class="w-full py-2 rounded-lg flex justify-center items-center gap-2">
        <template #icon>
          <i class="pi pi-user !text-base !leading-normal" />
        </template>
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
