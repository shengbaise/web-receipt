import axios from 'axios'
import mpx from '@mpxjs/core'

// 创建axios实例
const service = axios.create({
  // cancelToken: new axios.CancelToken(c => {
  //   cancel = c
  // }),
  baseURL: 'http://172.16.6.11:3001/api', // api的base_urls
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
  // const token = window.localStorage.getItem('token')
  // if (token && token.length > 0) {
  //   config.headers['Authorization'] = token
  // }
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
    // if (response.request.responseType === 'blob') {
    //   return res
    // }
    switch (res.code) {
      case 401:
        // window.localStorage.removeItem('userInfo')
        // window.localStorage.removeItem('token')
        break
      case 200:
        return res
      case 201:
        return res
      case 500:
        res.msg ? console.error(res.msg) : console.error('网络异常')
        // console.error('网络异常')
        return Promise.reject(res)
      default:
        console.error(res.msg || '服务异常')
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
    console.error(error.message)
    return Promise.reject(error)
  }
)
service.defaults.adapter = function (config) {
  return new Promise((resolve, reject) => {
    var settle = require('axios/lib/core/settle')
    var buildURL = require('axios/lib/helpers/buildURL')
    mpx.request({
      method: config.method.toUpperCase(),
      url: buildURL(config.url, config.params, config.paramsSerializer),
      header: config.headers,
      data: config.data,
      dataType: config.dataType,
      responseType: config.responseType,
      sslVerify: config.sslVerify,
      complete: function complete (response) {
        response = {
          data: response.data,
          status: response.statusCode,
          errMsg: response.errMsg,
          header: response.header,
          config: config
        }

        settle(resolve, reject, response)
      }
    })
  })
}
export default service
