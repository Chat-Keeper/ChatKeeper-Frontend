import axios from 'axios'
import { useAuthStore } from '@/store/auth.js'

/**
 * 规范化请求结构封装
 * - 定义了请求地址
 * - 在请求头中插入token
 */
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 1000000,
})

request.interceptors.request.use(
  (config) => {
    const token = useAuthStore().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log(config)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default request
