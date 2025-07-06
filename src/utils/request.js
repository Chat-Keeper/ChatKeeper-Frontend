import axios from 'axios'
import { useAuthStore } from '@/store/auth.js'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 200000,
})

request.interceptors.request.use(
  config => {
    const token = useAuthStore().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log(config)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default request