/*
 * @Author: yangiiiiii 14122140+yangiiiiiii@user.noreply.gitee.com
 * @Date: 2024-03-28 16:10:58
 * @LastEditors: 暮安 14122148+muanananan@user.noreply.gitee.com
 * @LastEditTime: 2024-04-18 14:08:49
 * @FilePath: \com-project\src\utils\request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  crossDomain: true
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    return res

    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
  },
  error => {
    const { response } = error
    if (response) {
      // 后端返回了错误响应
      const { status, data } = response
      console.error(`Error: ${status}, Message: ${data.msg}`)
      handleErrorResponse(status, data.msg) // 处理错误
    } else {
      // 网络错误或其他问题
      console.error('Network Error')
      handleErrorResponse(500, '网络连接失败，请稍后再试')
    }
    return Promise.reject(error)
  }
)

// 错误处理函数
function handleErrorResponse(status, message) {
  switch (status) {
    case 401:
      Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
      })
      // window.location.href = "https://www.example.com"
      router.push({ path: 'login' })
      break
    case 403:
      Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
      })
      break
    case 404:
      Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
      })
      break
    default:
      Message({
        message: message || '发生未知错误',
        type: 'error',
        duration: 5 * 1000
      })
  }
}

export default service
