export default {
  // 获取二维码生成参数
  getQrCodeParam: {
    url: `/api/v2/dingtalk/ding/getQrCode`,
    method: 'post'
  },
  // 扫码登录
  sweepCodeLogin: {
    url: `/api/v2/erpuser/bsUser/loginByDingTalkQRCode`,
    method: 'post'
  }
}
