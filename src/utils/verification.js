import request from '@/utils/request.js'

/**
 * 验证用户登录有效性
 * @returns {Promise<boolean>}
 */
function verify() {
  return request
    .post('/auth/verification')
    .then((response) => {
      console.log(response)
      return true
    })
    .catch((error) => {
      console.log(error)
      return false
    })
}

export default verify
