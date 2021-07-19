import barcode from './barcode';
// 插件内部是根据width, height参数的rpx值来进行绘画
// 把数字转换成条形码
function toBarcode(canvasId, code, width, height) {
  barcode.code128(wx.createCanvasContext(canvasId), code, width, height);
}
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  toBarcode: toBarcode
}
