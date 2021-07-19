var app = getApp();

var getChatUrl = '';//线上（在线聊天地址）
var headStr = '';
var headImg = 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/';//图片地址

var isProductEnv = true;//是否是正式环境
if (isProductEnv) {
  headStr = 'https://58hongren.com';   //线上地址
  getChatUrl = 'wss://58hongren.com/ws';
} else {
  //本地测试
  // 47.111.107.98
  // 192.168.110.237
  headStr = 'http://47.111.109.201/'; //测试地址
  getChatUrl = 'wss://58hongren.com/ws';
}
var getHeadStr = function () { return headStr; }
var getHeadImg = function () { return headImg }
var ajaxPost = function (url, object, successback) {
  wx.getStorage({
    key: 'idNum',
    success: function (res) {
      wx.request({
        url: headStr + url, //仅为示例，并非真实的接口地址w
        method: 'POST',
        data: object,
        header: {
          "token": res.data.token,
          'content-type': 'application/json'// 默认值
        },
        // header: { 'content-type': 'application/json' },
        success: function (res) {
          if (!(res.data && res.data.result) && res.data.resultMsg) {
            if (res.data.resultCode != '22222') {
              wx.showToast({
                title: res.data.resultMsg,
                icon: 'none',
                duration: 2000
              })
            }
          }
          if (res.data.code === 401) {
            console.log(res.data);
            wx.clearStorageSync()
            wx.showToast({
              title: res.data.message,
              icon: 'none',
            })
            setTimeout(() => { wx.switchTab({ url: '/pages/personal/personal' }) }, 1000)
          }
          successback(res.data);
        },
        fail: function (res) {
          // console.log(res)
          successback();
        }
      })
    }
  })
}
var ajaxGet = function (url, object, successback) {
  wx.getStorage({
    key: 'idNum',
    success: function (res) {
      // console.log(res)
      wx.request({
        url: headStr + url, //仅为示例，并非真实的接口地址
        method: 'GET',
        data: object,
        header: {
          "token": res.data.token,
          'content-type': 'application/json'// 默认值
        },
        success: function (res) {
          // console.log(res)
          if (!(res.data && res.data.result) && res.data.resultMsg) {
            wx.showToast({
              title: res.data.resultMsg,
              icon: 'none',
              duration: 2000
            })
          }
          if (res.data.code === 401) {
            console.log(res.data);
            wx.clearStorageSync()
            wx.showToast({
              title: res.data.message,
              icon: 'none',
            })
            setTimeout(() => { wx.switchTab({ url: '/pages/personal/personal' }) }, 1000)
          }
          successback(res.data);
        },
        fail: function (res) {
          // console.log(res)
          successback();
        }
      })
    }
  })
}
// Q封装请求
const axios = function (params, method = 'GET') {
  return new Promise((resolve, reject) => {
    wx.request({
      // 解构出调用axios时传进来的数据 
      ...params,
      method,
      url: headStr + params.url,
      header: {
        'content-type': 'application/json',
          "token": app.globalData.token,
      },
      success: (res) => {
          resolve(res);
         if (res.data.code === 401) {
          console.log(res.data);
          wx.clearStorageSync()
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })
          setTimeout(() => { wx.switchTab({ url: '/pages/personal/personal' }) }, 1000)
        } 
        else if(res.data.code !== 200  ) {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          });1
        }
      },
      fial: (err) => {
        // 提示 
        wx.showToast({
          title: '数据获取失败',
          icon: 'none',
        });
        reject(err);
      },
    });
  });
};
// 创建Socket
function webSocket() {
  SocketTask = wx.connectSocket({
    url: url,
    data: 'data',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: 'post',
    success: function (res) {
      console.log('WebSocket连接创建', res)
    },
    fail: function (err) {
      wx.showToast({
        title: '网络异常！',
      })
      console.log(err)
    },
  })
}
//通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
function sendSocketMessage(msg) {
  var that = this;
  console.log('通过 WebSocket 连接发送数据', JSON.stringify(msg))
  SocketTask.send({
    data: JSON.stringify(msg)
  }, function (res) {
    console.log('已发送', res)
  })
}
// 模板信息通知
function userFrom(object, successback) {
  wx.getStorage({
    key: 'idNum',
    success: function (res) {
      wx.request({
        url: headStr + '/api/wxMessgae/pushLike', //仅为示例，并非真实的接口地址
        method: 'POST',
        data: object,
        header: {
          "token": res.data.token,
          "Content-Type": "application/json"
        },
        success: function (res) {
          if (!(res.data && res.data.result) && res.data.resultMsg) {
            if (res.data.resultCode != '22222') {
              wx.showToast({
                title: res.data.resultMsg,
                icon: 'none',
                duration: 2000
              })
            }
          }
          successback(res.data);
        },
        fail: function (res) {
          successback();
        }
      })
    }
  })
}
/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lon
 * @param bd_lat
 * @returns {*[]}
 */
function bd09togcj02(bd_lon, bd_lat) {
  var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  var x = bd_lon - 0.0065;
  var y = bd_lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  var gg_lng = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return [gg_lng, gg_lat]
}

function openPosition(lat, lon, name, address) {
  console.log(lat + '.....' + lon + '.....' + name + '.....' + address)
  wx.openLocation({ //出发wx.openLocation API
    latitude: lat,
    longitude: lon,
    name: name, //打开后显示的地址名称
    address: address //打开后显示的地址汉字
  })
}

/* 防止重复点击 */
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 500
  }
  let _lastTime = null
  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    } else {
      wx.showToast({
        title: '请勿重复提交',
        icon: 'loading'
      })
    }
  }
}
/* 防止重复点击 */
function throttles(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 500
  }
  let _lastTime = null
  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    } else {
      wx.showToast({
        title: '已是最新二维码',
        icon: 'none'
      })
    }
  }
}
//验证电话号码
function check_phone(phoneNum) {
  // return /^1[0-9]{10}$/.test(phoneNum);//true
  return (/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/).test(phoneNum);//true
}

function String(x) {
  if (x === undefined) {
    return "";
  } else if (x === null) {
    return "";
  } else {
    return x.toString();
  }
}
//去除所有的html标签
function delHtmlTag(str) {
  var str = String(str);
  return str.replace(/<[^>]+>/g, "");  //正则去掉所有的html标记
}

function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
function strToJson(str) {
  var a = str.slice(1, str.length - 2).split(",");
  var c = [];
  for (var i = 0; i < a.length; i++) {
    var b = a[i].split('"');
    console.log(b);
    c[b[1]] = b[3]
  }
  return c;
}

function timestampFormat(timestamp) {
  function zeroize(num) {
    return (String(num).length == 1 ? '0' : '') + num;
  }
  var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
  var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
  var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
  var tmDate = new Date(timestamp * 1000);  // 参数时间戳转换成的日期对象
  var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
  var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();
  if (timestampDiff < 60) { // 一分钟以内
    return "刚刚";
  } else if (timestampDiff < 3600) { // 一小时前之内
    return Math.floor(timestampDiff / 60) + " 分钟前";
  } else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
    return '今天 ' + zeroize(H) + ':' + zeroize(i);
  } else {
    var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
    if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
      return '昨天 ' + zeroize(H) + ':' + zeroize(i);
    } else if (curDate.getFullYear() == Y) {
      return zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
    } else {
      return Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
    }
  }
}
function add0(m) { return m < 10 ? '0' + m : m }
function timeFormat(timestamp) {
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(timestamp);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}

//时间格式化函数
function myTime(value) {

  var date = new Date(value);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = month > 9 ? month : ('0' + month);
  var day = date.getDate();
  day = day > 9 ? day : ('0' + day);
  var hh = date.getHours();
  hh = hh > 9 ? hh : ('0' + hh);
  var mm = date.getMinutes();
  mm = mm > 9 ? mm : ('0' + mm);
  var ss = date.getSeconds();
  ss = ss > 9 ? ss : ('0' + ss);
  var time = year + '-' + month + '-' + day + ' ' + hh + ':' + mm + ':' + ss;
  return time;
}
//时间格式化年月日
function myTimeS(value) {
  var date = new Date(value);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = month > 9 ? month : ('0' + month);
  var day = date.getDate();
  day = day > 9 ? day : ('0' + day);
  
  var time = year + '-' + month + '-' + day 
  return time;
}
function timeFormats(timestamp) {
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(timestamp);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  return y + '-' + add0(m) + '-' + add0(d);
}

function timeDifference(timestamp) {
  var nowTime = parseInt(new Date().getTime()); //当前时间戳
  var endTime = parseInt(timestamp); //结束时间戳
  var timestampDiff = (endTime - nowTime);
  if (endTime < nowTime) {
    return false;
  } else {
    var day = Math.floor(timestampDiff / 1000 / 60 / 60 / 24);
    var hour = Math.floor(timestampDiff / 1000 / 60 / 60 % 24);
    var minutes = Math.floor(timestampDiff / 1000 / 60 % 60);
    var second = Math.floor(timestampDiff / 1000 % 60);
    var ms = Math.floor((timestampDiff % 1000) / 100);
    // ms = ms < 10 ? "0" + ms : ms
    second = second < 10 ? "0" + second : second
    minutes = minutes < 10 ? "0" + minutes : minutes
    hour = hour < 10 ? "0" + hour : hour
    var params = [{
      day: day,
      hour: hour,
      minutes: minutes,
      second: second,
      ms: ms
    }];
    return params;


  }

}
//检查输入文本，限制只能为数字并且数字最多带2位小数
function checkInputText(text) {
  var reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g;
  if (reg.test(text)) { //正则匹配通过，提取有效文本
    text = text.replace(reg, '$2$3$4');
  } else { //正则匹配不通过，直接清空
    text = '0.';
  } return text; //返回符合要求的文本（为数字且最多有带2位小数）
}


//严格验证身份证号
function validateIdCard(card) {
  //15位和18位身份证号码的正则表达式
  var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

  //如果通过该验证，说明身份证格式正确，但准确性还需计算
  if (regIdCard.test(card)) {
    if (card.length == 18) {
      var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
      var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
      var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
      for (var i = 0; i < 17; i++) {
        idCardWiSum += card.substring(i, i + 1) * idCardWi[i];
      }

      var idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置
      var idCardLast = card.substring(17);//得到最后一位身份证号码

      //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
      if (idCardMod == 2) {
        if (idCardLast == "X" || idCardLast == "x") {
          return true;
        } else {
          return false;
        }
      } else {
        //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
        if (idCardLast == idCardY[idCardMod]) {
          return true;
        } else {
          return false;
        }
      }
    }
  } else {
    return false;
  }
}

//去掉标签
module.exports = {
  ajaxPost: ajaxPost,
  ajaxGet: ajaxGet,
  bd09togcj02: bd09togcj02,
  openPosition: openPosition,
  throttle: throttle,
  check_phone: check_phone,
  delHtmlTag: delHtmlTag,
  trim: trim,
  getHeadStr: getHeadStr,
  getChatUrl: getChatUrl,
  strToJson: strToJson,
  timestampFormat: timestampFormat,
  timeDifference: timeDifference,
  validateIdCard: validateIdCard,
  timeFormat: timeFormat,
  timeFormats: timeFormat,
  userFrom: userFrom,
  getHeadImg: getHeadImg,
  throttles: throttles,
  webSocket: webSocket,
  sendSocketMessage: sendSocketMessage,
  myTime: myTime,
  checkInputText: checkInputText,
  axios,
  myTimeS
}; 
