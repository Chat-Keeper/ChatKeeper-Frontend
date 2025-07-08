<script>
import { defineComponent } from 'vue'
import request from '@/utils/request.js'
import { useAuthStore } from '@/store/auth.js'

/**
 * **LoginView.vue**
 * 注册视图
 * - 功能：提供注册页面
 * - 引用：`request.js`, `auth.js`
 */
export default defineComponent({
  name: 'SignupView',

  data() {
    return {
      username: '',
      password: '',
      passwordCheck: '',
    }
  },

  methods: {
    useAuthStore,

    /* 用户注册方法 */
    signup() {
      if (this.username === '' || this.password === '') {
        this.$toast.add({
          severity: 'warn',
          summary: '用户名或密码为空',
          detail: '请输入有效的用户名或密码',
          life: 3000,
        })
        return
      }
      if (this.password !== this.passwordCheck) {
        this.$toast.add({
          severity: 'warn',
          summary: '密码不一致',
          detail: '两次输入的密码不一致，请重试',
          life: 3000,
        })
        this.passwordCheck = ''
        return
      }
      request
        .post('/auth/signup', {
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
              summary: '注册成功',
              detail: '欢迎你，' + response.data.data.username + '！',
              life: 3000,
            })
          } else if (response.data.code === 400) {
            this.$toast.add({
              severity: 'error',
              summary: '注册失败',
              detail: '用户名已经被注册',
              life: 3000,
            })
          } else if (response.data.code === 401) {
            this.$toast.add({
              severity: 'error',
              summary: '注册失败',
              detail: '不合法的用户名',
              life: 3000,
            })
          } else {
            this.$toast.add({
              severity: 'error',
              summary: '注册失败',
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
          <div class="text-surface-900 dark:text-surface-0 text-3xl font-semibold leading-tight text-center w-full">注册账号</div>
          <div class="text-center w-full">
            <span class="text-surface-700 dark:text-surface-200 leading-normal">拥有一个账号？</span>
            <router-link to="/login" class="text-primary font-medium ml-1 hover:text-primary-emphasis">去登录！</router-link>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-6 w-full">
        <div class="flex flex-col gap-2 w-full">
          <label for="username" class="text-surface-900 dark:text-surface-0 font-medium leading-normal">用户名/Username</label>
          <InputText
            v-model="username"
            id="username"
            type="text"
            placeholder="创建你的用户名（至少5个字符）"
            class="w-full p-3 shadow-sm rounded-lg"
          />
        </div>
        <div class="flex flex-col gap-2 w-full">
          <label for="password" class="text-surface-900 dark:text-surface-0 font-medium leading-normal">密码/Password</label>
          <InputText v-model="password" id="password" type="password" placeholder="创建你的密码" class="w-full p-3 shadow-sm rounded-lg" />
          <InputText v-model="passwordCheck" id="password" type="password" placeholder="再次输入密码" class="w-full p-3 shadow-sm rounded-lg my-2" />
        </div>
      </div>
      <Button @click="signup()" label="注册" icon="pi pi-user" class="w-full py-2 rounded-lg flex justify-center items-center gap-2">
        <template #icon>
          <i class="pi pi-user !text-base !leading-normal" />
        </template>
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
