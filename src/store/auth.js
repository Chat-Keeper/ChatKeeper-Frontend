import {defineStore} from 'pinia'

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
    }
  },
  persist: {
    paths: ['loginStatus', 'rememberUser', 'userId', 'username', 'token']
  }
})