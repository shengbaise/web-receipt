import axios from 'axios'

/**
 * 根配置
 */
// 异常处理
// function errorAfter (error) {
//   // 捕抓错误信息.
//   if (error.response) {
//     console.log('error.response', error.response)
//   } else if (error.request) {
//     console.log('error.request', error.request)
//     if (error.request.readyState === 4 && error.request.status === 0) {
//       // 重新请求
//     }
//   } else {
//     console.log('Error', error.message)
//   }
//   console.log(error.config)
// }

// 请求默认地址
// axios.defaults.baseURL = '/api'

// 设置默认请求头
// axios.defaults.headers = {
//   'X-Requested-With': 'XMLHttpRequest'
// }

// 请求超时
// axios.defaults.timeout = 10000

// 请求拦截器
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器即异常处理
axios.interceptors.response.use(response => {
  return response
}, error => {
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '错误请求'
        break
      case 401:
        error.message = '未授权，请重新登录'
        // window.localStorage.removeItem('token')
        // window.sessionStorage.removeItem('currentMerch')
        // window.sessionStorage.removeItem('userProject')
        // window.localStorage.removeItem('currentMerch')
        // window.localStorage.removeItem('userInfo')
        // window.sessionStorage.removeItem('tabs')
        // window.localStorage.removeItem('count')
        // window.location.href = '/#/login'
        break
      case 403:
        error.message = '拒绝访问'
        break
      case 404:
        error.message = '请求错误,未找到该资源'
        break
      case 405:
        error.message = '请求方法未允许'
        break
      case 408:
        error.message = '请求超时'
        break
      case 500:
        error.message = '服务器端出错'
        break
      case 501:
        error.message = '网络未实现'
        break
      case 502:
        error.message = '网络错误'
        break
      case 503:
        error.message = '服务不可用'
        break
      case 504:
        error.message = '网络超时'
        break
      case 505:
        error.message = 'http版本不支持该请求'
        break
      default:
        error.message = `连接错误${error.response.status}`
    }
  } else {
    error.message = '连接到服务器失败'
  }
  error.message.error(error)
  // return Promise.resolve(error)
  return Promise.resolve(error.response)
})

export default axios
