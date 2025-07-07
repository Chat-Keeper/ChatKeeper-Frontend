import request from '@/utils/request.js'

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
