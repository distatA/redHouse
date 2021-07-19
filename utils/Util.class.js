import bmap from '../lib/bmap-wx.min'

var WxParse = require('../lib/wxParse/wxParse');

class Utils {
    constructor() {

        // this.appid = 'wxee5d68bff525b7dc';
        // this.secret = '54f5ca01615b3c36a7c2d88250ef46be';//小程序 appSecret

        this.appid = 'wxf3f6990a7b260672';
        this.secret = 'f3dcae4730633a164497655de1c04d2a';//小程序 appSecret

        // 获取小程序全局唯一后台接口调用凭据（access_token
        this.access_token = '';


    }

    /*百度地图密匙 https://api.map.baidu.com*/
    static MAP_AK = 'hYuQAXCKDbUiKMhu2k4r0BBiYnqp1AU3';
    /*基础请求路径*/
    // static BASE_URL = 'https://jxsc.hflxkj.top/house';
    static BASE_URL = 'https://gam.loushikol.com/house';


    /*实现跨页面通信 不使用app.js*/

    /*获取位置*
    * fn 回调函数
    * */
    static getLocation(fn,failfn=()=>{}) {
        let self = this;
        this.getSetting('userLocation', function (res) {

            let BMap = new bmap.BMapWX({
                ak: self.MAP_AK
            });
            // console.log(BMap)
            // 发起regeocoding检索请求
            BMap.regeocoding({
                success(res) {
                    // console.log(res)
                    fn(res)

                }, fail(res) {


                }
            });
        }, false,false,failfn);


    }

    /*
     将html转化为小程序可识别的
    * article html字符串
    * that 调用部分this的指向
    * */

    static setHtml(article, that, var_name = 'article') {

        // var article = '<div>我是HTML代码</div>';
        /**
         * WxParse.wxParse(bindName , type, data, target,imagePadding)
         * 1.bindName绑定的数据名(必填)
         * 2.type可以为html或者md(必填)
         * 3.data为传入的具体数据(必填)
         * 4.target为Page对象,一般为this(必填)
         * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
         */
        // var that = this;
        WxParse.wxParse(var_name, 'html', article, that, 5);
    }

    /*
    * 获取相关权限设置 没有相关权限强行其设置
    * set 设置的权限
    * is_must 是否必须强制授权
    * */
    static getSetting(set, fn, is_must = false,is_show_toast=true,fnFail=()=>{} ) {
        let self = this;

        wx.getSetting({
            success(res) {
                // console.log(res);
                if (res.authSetting['scope.' + set]) {
                    fn(res)
                } else {
                    wx.authorize({
                        scope: 'scope.' + set,
                        success(res) {
                            fn(res)
                            // console.log('success',res)

                        },
                        fail(res) {
                            fnFail()
                            if(is_show_toast){
                                self.showToast('请前往设置打开位置权限！');
                            }



                            // console.log('fail',res)

                            if (is_must) {
                                wx.openSetting({
                                    success(res) {
                                        // console.log(res.authSetting)
                                        // res.authSetting = {
                                        //   "scope.userInfo": true,
                                        //   "scope.userLocation": true
                                        // }
                                        // console.log('s',res)
                                        // self.getSetting(set)
                                    }, fail(res) {
                                        // console.log('f',res)
                                    }

                                })
                            }

                        }
                    })
                    // wx.openSetting({
                    //     success(res) {
                    //         // console.log(res.authSetting)
                    //         // res.authSetting = {
                    //         //   "scope.userInfo": true,
                    //         //   "scope.userLocation": true
                    //         // }
                    //         console.log(res)
                    //     }, fail(res) {
                    //         console.log(res)
                    //     }
                    //
                    // })
                }

            },
            fail(res) {

            }
        })

    }

    // 获取小程序全局唯一后台接口调用凭据（access_token
    getAccessToken(fn) {
        let self = this;
        wx.request({
            method: 'GET',
            url: 'https://api.weixin.qq.com/cgi-bin/token?' +
                'grant_type=client_credential' +
                '&appid=' + self.appid +
                '&secret=' + self.secret,

            success(res) {

                let access_token = res.data.access_token;
                self.access_token = access_token;
                fn(access_token);

                return false;
                /*wx.request({
                    method: "POST",
                    // header: {
                    //     'content-type': 'image/jpeg' // 默认值
                    // },
                    data: {

                        scene: decodeURIComponent(1)
                    },
                    url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + access_token
                    , success(res) {
                        console.log(res);
                        self.setData({
                            src: 'data:image/jpeg;base64,' + res.data
                        })

                    }
                })*/
            }
        })

    }

    /*获取二维码*/
    /*getQRcode(type = 1, fn) {
        if (type === 1) {
            this.getAccessToken((access_token) => {
                wx.request({
                    method: 'POST',
                    data: {path: 'hxq'},
                    url: 'https://api.weixin.qq.com/wxa/getwxacode?access_token=' + access_token,
                    success(res) {
                        console.log(res)
                        // fn(res.data);
                    }
                })
            })

        }


    }*/

    /*获取用户于系小程序唯一id*
    * fn 回调函数
    * */
    getUnique(fn) {
        wx.login({
            success(res) {
                // 用户登录凭证（有效期五分钟
                if (res.code) {
                    // 发起网络请求

                    wx.request({
                        method: 'GET',
                        url: 'https://api.weixin.qq.com/sns/jscode2session?' +
                            'appid=wxee5d68bff525b7dc' +
                            '&secret=54f5ca01615b3c36a7c2d88250ef46be&' +
                            'js_code=' + res.code
                            + '&grant_type=authorization_code',

                        success(res) {
                            // console.log(res)
                            fn(res.data);
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    }

    /*获取登录code*/
    getLoginCode(fn) {
        let self = this;
        wx.login({
            success(res) {
                if (res.code) {
                    // 发起网络请求
                    fn(res.code)
                } else {
                    self.showToast('登录失败')

                }
            }
        })
    }

    /*对应的权限 是否获取*/
    static isGetQX(set, fn = () => {
    }) {
        wx.getSetting({
            success(res) {

                if (res.authSetting['scope.' + set]) {
                    fn(res.authSetting['scope.' + set]);


                } else {


                }

            },
            fail(res) {

            }
        })
    }

    /*
    * content
    * type 1无icon 2 success 3 loading
    * *toast操作*/
    /*弹出提示框*/
    static showToast(title = '', type = 1) {
        if (type === 3) {
            wx.showLoading({
                title
            })
        } else {
            wx.showToast({
                title: title,
                icon: type === 1 ? 'none' : "success",
                mask: false,
                duration: 1600
            })
        }

    }

    /*请求*/

    //常用的请求
    static post(
        url,
        postData,
        doSuccess = () => {
        },
        is_showTaost = true,
        doComplete = () => {
        }) {

        let self = this;
        // console.log(is_showTaost)
        if (is_showTaost) {
            this.showToast('加载中。。。', 3);
        }

        // let userInfo = wx.getStorageSync("userInfo");
        let token = wx.getStorageSync("token");
        wx.request({
            url: self.BASE_URL + url,
            data: postData,
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'token': token
            },
            method: 'POST',
            success: function (res) {

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
                        if (is_showTaost) {
                            wx.hideLoading();
                        }

                    } else if (result.code == 403) {
                        wx.reLaunch({
                            url: '/pages/index/index'
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
            fail: function () {
                wx.hideLoading();
                wx.redirectTo({
                    url: '/pages/error/error?error=' + '请求失败，请联系平台管理员'
                })
            },
            complete: function () {
                if (typeof doComplete == "function") {
                    doComplete();
                }
            }
        })
    }

    // 上传图片
    static uploadImg(count = 1, use_type = 'invitation', file_type = 'images', fn) {
        let self = this;
        wx.chooseImage({
            count: count,
            // sizeType: ['original', 'compressed'],
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // console.log(1,res);
                // return false;

                let tempFiles = res.tempFilePaths;
                //
                //
                // let upImgs = [...self.data.upImgs];
                // // tempFilePath可以作为img标签的src属性显示图片
                tempFiles.forEach((v) => {
                    self.upload(
                        v,
                        use_type,
                        file_type,
                        (res) => {
                            fn(res)


                        }
                    )
                })


            },
            fail(res) {
                console.log('fail,', res)

            }
        })
    }

    /*上传文件*/
    static upload(path, module = 'invitation', fileType = 'images', doSuccess) {
        let self = this;
        let token = wx.getStorageSync("token");
        wx.showLoading({
            title: '上传中',
            mask: true,
            success: r => {
                const uploadTask = wx.uploadFile({
                    url: self.BASE_URL + '/api/file/upload',
                    filePath: path,
                    name: 'file',
                    header: {
                        'token': token
                    },
                    formData: {
                        module,
                        fileType
                    },
                    success: function (res) {
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
                    fail: function () {
                        wx.redirectTo({
                            url: '/pages/error/error?error=' + '请求失败，请联系平台管理员'
                        })
                    },
                })
            }
        })
    }

    /*获取location.search 返回对象*/
    static getLocationObj(url) {
        let obj = {};
        url = url.split('?')[1];
        let arr = url.split("&");
        obj = arr.map(function (v) {
            let key = v.split('=')[0];
            let value = v.split('=')[1];
            return {key: value};
        });

        return obj;


    }

    /*字段检查
    *   let re = Utils.checkParams(data, [
            {key: 'name', rule: 'required', tip: '请输入姓名！'}
            , {key: 'mobile', rule: 'tel', tip: '请检查电话是否合法！'}
            , {key: 'region', rule: 'required', tip: '请输入所在地区！'}
            , {key: 'address', rule: 'required', tip: '请输入详细地址！'}
            , {key: 'postcode', rule: 'required', tip: '请输入邮政编码！'}

        ]);
        返回值 是否通过检测
    * */
    static checkParams(data, rules) {
        function check(data_one, rule) {


            switch (rule) {
                case 'required':

                    if (!data_one) {
                        return false;
                    }
                    break;
                case 'password':
                    let re = /\d{6}/.test(data_one);


                    if (!re) {
                        return false;
                    }
                    break;
                case 'tel':

                    if (data_one.length != 11) {
                        return false;
                    }
                    break;
                //请检查统一社会信用代码是否正确
                case 'xyCode':

                    if (data_one.length != 18) {
                        return false;
                    }
                    break;
                case 'idcard':

                    if (!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(data_one))) {
                        return false;
                    }
                    break;
                default:
                    if (!data_one.length) {
                        return false;
                    }
                    break;
            }
            return true;


        }

        for (let i = 0, len = rules.length; i < len; i++) {
            /*
            * re 验证是否通过
            * */
            let re = check(data[rules[i].key], rules[i].rule);

            if (!re) {
                this.showToast(rules[i].tip || '请检查字段是否填写完整！');

                return false;

            }

        }
        return true;

    }

    /*
    *返回上一页
     *  */
    static goBack(num = 1) {
        wx.navigateBack({
            delta: num
        })
    }

    /*将字符串 分割成多段字符数相同的数组*/
    static strSlice(str, len) {
        let arr = [];
        let i = 0;

        while (str.substr(i * len, len).length) {
            arr.push(str.substr(i * len, len))
            i++;

        }

        return arr;


    }

    /*将字符串截取成指定长度字符串 */
    static strJq(str, len) {
        if (str.length < len) {
            return str;
        } else {
            return str.slice(0, len) + "..."
        }
    }

    /*分享文章到微信*/
    static shareArticle(title, imageUrl, path, options) {
        // options{id,type}
        let str = '';
        for (let i in options) {
            str += '&' + i + '=' + options[i]
        }
        path = path + str.slice(1);
        return {
            title,
            path,
            imageUrl
        }

    }

    /*跳到分享截图页面*/
    static goShare(options) {
        // options {name,id,type}


        let str = '';
        for (let i in options) {
            str += '&' + i + '=' + options[i]
        }
        let url = "/pages/shequ_menu/fxpyq/fxpyq?" + str.slice(1);


        wx.navigateTo({
            url: url
        })


    }

    // 预览图片
    static watchImg(curr_index, imgs, type = 0) {
        if (type) {
            wx.previewImage({
                current: curr_index, // 当前显示图片的http链接
                // urls: [img] // 需要预览的图片http链接列表
                urls: imgs  // 需要预览的图片http链接列表
            })
        } else {
            wx.previewImage({
                current: imgs[curr_index], // 当前显示图片的http链接
                // urls: [img] // 需要预览的图片http链接列表
                urls: imgs  // 需要预览的图片http链接列表
            })
        }


    }

    /*获取用户信息*/
    static getUserInfo(fn) {
        Utils.post(
            '/api/member/myInfo',
            {},
            (res) => {
                fn(res)

            }
        )
    }


}

export default Utils;