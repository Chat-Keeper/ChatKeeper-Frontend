import { defineStore } from 'pinia'

/**
 * 令牌以及登陆状态管理
 * @type {StoreDefinition<'auth', {loginStatus: boolean, rememberUser: boolean, userId: null, username: null, token: null}, {}, {login(*, *, *): void, logout(): void}>}
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    loginStatus: false,
    rememberUser: false,
    userId: null,
    username: null,
    token: null,
  }),
  actions: {
    login(userId, username, token) {
      this.loginStatus = true
      this.userId = userId
      this.username = username
      this.token = token
    },
    logout() {
      this.loginStatus = false
      this.userId = null
      this.token = null
      if (!this.rememberUser) {
        this.username = null
      }
    },
  },
  persist: {
    paths: ['loginStatus', 'rememberUser', 'userId', 'username', 'token'],
  },
})
