const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const app = getApp();
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}


//字符串截取
function subStr(str, size) {
    if (str.length > size) {
        return str.substring(0, size) + "..";
    } else {
        return str;
    }
}

function loadUser(fn) {
    this.post("/doctor/preview", {}, function(res) {
        fn(res);
    });
}
//获取时间：早、中、晚等描述
function getTimeStr(time) {
    let desc = '';
    if (time) {
        let hour = time.split(":")[0];
        if (hour < 6) {
            desc = '凌晨';
        } else if (hour < 9) {
            desc = '早上';
        } else if (hour < 12) {
            desc = '上午';
        } else if (hour < 14) {
            desc = '中午';
        } else if (hour < 17) {
            desc = '下午';
        } else if (hour < 19) {
            desc = '傍晚';
        } else if (hour < 22) {
            desc = '晚上';
        } else {
            desc = '夜里';
        }
    }
    return desc;
}
//常用的请求
function post(url, postData, doSuccess, doComplete) {
    let userInfo = wx.getStorageSync("userInfo");
    wx.request({
        url: app.globalData.baseUrl + url,
        data: postData,
        header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            'token': userInfo.token
        },
        method: 'POST',
        success: function(res) {
            if (res.statusCode != 200) {
                wx.showToast({
                    title: '通讯失败,请联系管理员',
                    icon: 'none',
                    mask: false,
                    duration: 1600
                })
                return;
            }
            if (typeof doSuccess == "function") {
                let result = res.data;
                if (result.code == 200) {
                    doSuccess(result);
                } else if (result.code == 403) {
                    wx.reLaunch({
                        url: '/pages/login/index'
                    })
                } else {
                    wx.showToast({
                        title: result.msg,
                        icon: 'none',
                        mask: false,
                        duration: 1600
                    })
                }
            }
        },
        fail: function() {
            wx.hideLoading();
            wx.redirectTo({
                url: '/pages/error/error?error=' + '请求失败，请联系平台管理员'
            })
        },
        complete: function() {
            if (typeof doComplete == "function") {
                doComplete();
            }
        }
    })
}
/**toast操作*/
function showToast(content, type, fn) {
    wx.hideLoading();
    if (content == undefined) { //关闭提示
        wx.hideToast();
    } else {
        var icon = '' //加载提示
        if (type == 0) { //普通提示
            icon = 'none'
        } else if (type == 1) { //成功提示
            icon = 'success'
        }
        wx.showToast({
            title: content,
            icon: icon,
            mask: false,
            duration: 1500,
            success: function() {
                if (typeof fn == "function") {
                    setTimeout(function() {
                        fn();
                    }, 500);
                }
            }
        })
    }
}
function getTady(){
    var date = new Date(); //今天
    var a = new Array("日", "一", "二", "三", "四", "五", "六");
    var week = date.getDay();
    var str = "星期" + a[week];
    let dataStr = this.dateFtt("yyyy年MM月dd", date) + " " + str;
    return dataStr;
}
function getDays() {
    let arr = new Array();
    var date = new Date(); //今天
    arr.push(this.dateFtt("yyyy-MM-dd",date));
    arr.push(this.dateFtt("yyyy-MM-dd", this.addDate(date,1)));
    arr.push(this.dateFtt("yyyy-MM-dd", this.addDate(date, 2)));
    arr.push(this.dateFtt("yyyy-MM-dd", this.addDate(date, 3)));
    arr.push(this.dateFtt("yyyy-MM-dd", this.addDate(date, 4)));
    arr.push(this.dateFtt("yyyy-MM-dd", this.addDate(date, 6)));
    arr.push(this.dateFtt("yyyy-MM-dd", this.addDate(date, 7)));
    return arr;
}
function addDate(date, days) {
    if (days == undefined || days == '') {
        days = 1;
    }
    var date = new Date(date);
    date.setDate(date.getDate() + days);
    return date;
}
function dateFtt(fmt, date) { //author: meizz
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}



function showLoad(title, fn) {
    wx.showLoading({
        title: title,
        mask: true,
        success: r => {
            if (typeof fn == "function") {
                fn();
            }
        }
    })
}
//上传图片
function upload(path, model, doSuccess) {
    let userInfo = wx.getStorageSync("userInfo");
    wx.showLoading({
        title: '上传中',
        mask: true,
        success: r => {
            const uploadTask = wx.uploadFile({
                url: app.globalData.baseUrl + '/file/upload',
                filePath: path,
                name: 'file',
                header: {
                    'token': userInfo.token
                },
                formData: {
                    model: model
                },
                success: function(res) {
                    var result = JSON.parse(res.data);
                    if (result.code == 200) {
                        wx.hideLoading();
                        doSuccess(result);
                    } else if (result.code == 403) {
                        wx.reLaunch({
                            url: '/pages/login/index'
                        })
                    } else {
                        wx.showToast({
                            title: result.msg,
                            icon: 'none',
                            mask: false,
                            duration: 1600
                        })
                    }
                },
                fail: function() {
                    wx.redirectTo({
                        url: '/pages/error/error?error=' + '请求失败，请联系平台管理员'
                    })
                },
            })
        }
    })
}
/*获取当前页url*/
function getCurrentPageUrl() {
    var pages = getCurrentPages(); //获取加载的页面
    var currentPage = pages[pages.length - 1]; //获取当前页面的对象
    var url = currentPage.route; //当前页面url
    return url;
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
    var pages = getCurrentPages(); //获取加载的页面
    var currentPage = pages[pages.length - 1]; //获取当前页面的对象
    var url = currentPage.route; //当前页面url
    var options = currentPage.options; //如果要获取url中所带的参数可以查看options
    //拼接url的参数
    var urlWithArgs = url + '?';
    for (var key in options) {
        var value = options[key];
        urlWithArgs += key + '=' + value + '&';
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);
    return urlWithArgs;
}
//选择上传图片
function uploadImage(count, doSuccess) {
    wx.chooseImage({
        count: count,
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            if (typeof doSuccess == "function") {
                doSuccess(res.tempFilePaths);
            }
        }
    })
}

//删除图片
function deleteImage(doSuccess) {
    wx.showActionSheet({
        itemList: ['删除', '设置为封面'],
        success: function(res) {
            if (res.tapIndex == 0 || res.tapIndex == 1) {
                if (typeof doSuccess == "function") {
                    doSuccess(res);
                }
            }
        },
        fail: function(res) {
            console.log(res.errMsg)
        }
    })
}

function ifNull(value, desc) {
    if (value) {
        return false;
    } else {
        this.showToast(desc, 0);
        return true;
    }
}

//强制授权
function getPermission(typeName, callback) {

    var that = this;
    wx.getSetting({
        success: res => {
            if (res.authSetting[typeName] == undefined) {
                return;
            } else if (res.authSetting[typeName]) { //用户已同意授权
                callback();
            } else { //用户拒绝授权
                wx.openSetting({
                    success: (res) => {
                        getPermission(typeName, callback);
                    }
                })
            }
        }
    })
}

module.exports = {
    formatTime: formatTime,
    post: post,
    showLoad: showLoad,
    getTimeStr: getTimeStr,
    showToast: showToast,
    subStr: subStr,
    upload: upload,
    getTady: getTady,
    getDays: getDays,
    addDate: addDate,
    dateFtt: dateFtt,
    ifNull: ifNull,
    loadUser: loadUser,
    uploadImage: uploadImage,
    deleteImage: deleteImage,
    getCurrentPageUrl: getCurrentPageUrl,
    getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs
}