/*
 * @Athor: 义妁
 * @Descripttion:
 * @Date: 2019-09-09 17:33:03
 * @LastEditors: 义妁
 * @LastEditTime: 2019-09-11 14:13:11
 */
import request from '../../lib/request'
import receipt from './receipt'

function ajax (params, options = {}) {
  if (params) {
    if (options.method === 'post') {
      options.data = params
    } else {
      options.params = params
    }
  }
  return request(options)
}

const apiMap = {
  ...receipt
}
let apis = {}
for (let k in apiMap) {
  apis[k] = function (params) {
    return ajax.bind(this, params, apiMap[k])()
  }
}

export default function install (target, options = {}) {
  target.$api = apis
  target.prototype.$api = apis
}
// export default apis
