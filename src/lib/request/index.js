import axios from './axios'
import ElementUI from 'element-ui'
// import qs from 'qs'
const CancelToken = axios.CancelToken

const pending = new Map()
const getRequestIdentify = (config, isReuest = false) => {
  let url = config.url
  if (isReuest) {
    url = config.baseURL + config.url.substring(1, config.url.length)
  }
  return config.method === 'get' ? encodeURIComponent(url + JSON.stringify(config.params)) : encodeURIComponent(config.url + JSON.stringify(config.data))
}
const removePending = (key, isRequest = false) => {
  if (pending[key] && isRequest) {
    pending[key]('请求中，请勿频繁操作')
  }
  delete pending[key]
}
// let cancel = {}
// let promiseArr = {}
// 创建axios实例
const service = axios.create({
  // cancelToken: new axios.CancelToken(c => {
  //   cancel = c
  // }),
  // baseURL: '/api/', // api的base_urls
  timeout: 60000 // 请求超时时间
})

/**
 * 实例配置
 */
// request拦截器
service.interceptors.request.use(config => {
  // 请求去重
  // if (config.method !== 'get') {
  //   let requestData = getRequestIdentify(config, true)
  //   removePending(requestData, true)
  //   config.cancelToken = new CancelToken((c) => {
  //     pending[requestData] = c
  //   })
  // }
  // 让每个请求携带自定义token 请根据实际情况自行修改
  const token = window.localStorage.getItem('token')
  const merchId = getMerchId()
  console.info(merchId, 'merchId....')
  if (merchId) {
    config.headers['merchId'] = merchId
  }
  if (token && token.length > 0) {
    config.headers['Authorization'] = token
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    // let requestData = getRequestIdentify(response.config)
    // removePending(requestData)
    const res = response.data
    // 文件下载时特殊处理
    if (response.request.responseType === 'blob') {
      return res
    }
    switch (res.code) {
      case '401':
        window.localStorage.removeItem('userInfo')
        window.localStorage.removeItem('token')
        location.reload()
        break
      case '200':
        return res
      case '201':
        return res
      case '500':
        res.msg ? ElementUI.Message.error(res.msg) : ElementUI.Message.error('网络异常')
        // ElementUI.Message.error('网络异常')
        return Promise.reject(res)
      default:
        ElementUI.Message.error(res.msg || '服务异常')
        return Promise.reject(res)
    }
  },
  error => {
    if (error && error.response) {
      // const config = error.response.config
      // const key = Object.assign({}, {
      //   url: config.url,
      //   method: config.method
      // }, config.data)
      // const keyString = qs.stringify(key)

      // requestMap.set(keyString, false)
      switch (error.response.status) {
        case 400:
          error.message = '错误请求'
          break
        case 401:
          error.message = '未授权，请重新登录'
          window.localStorage.removeItem('token')
          window.sessionStorage.removeItem('currentMerch')
          window.sessionStorage.removeItem('userProject')
          window.localStorage.removeItem('currentMerch')
          window.localStorage.removeItem('userInfo')
          window.sessionStorage.removeItem('tabs')
          window.localStorage.removeItem('count')
          window.sessionStorage.removeItem('nowTab')
          window.location.href = '/#/login'
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
      error.message = error.message || '连接到服务器失败'
    }
    ElementUI.Message.error(error.message)
    return Promise.reject(error)
  }
)

export default service
