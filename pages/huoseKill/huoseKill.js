// pages/huoseKill/huoseKill.js
const app = getApp();
var common = require("../../utils/common.js");
var amapFile = require('../../utils/amap-wx.js');
var wxParser = require("../../wxParser/index.js");
var markersData = {
  latitude: '', //纬度
  longitude: '', //经度
  key: "4ada276712c47bf88a9cdc6d41248a2a" //申请的高德地图key
};
var markers = {
  latitude: '', //纬度
  longitude: '', //经度
  key: "4ada276712c47bf88a9cdc6d41248a2a" //申请的高德地图key
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getUserInfoFail: true,
    current: 0,
    downs: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      shopId: options.shopId ? options.shopId : '',
      flag: options.flag ? options.flag : 0,
      // currentIndex: options.currentIndex ,
      shopNo: options.shopNo ? options.shopNo : '',
      killId: options.killId ? options.killId : '', //秒杀ID
    })
    wx.getStorage({
      key: 'idNum',
      success: function(res) {
        that.setData({
          member_nos: res.data.member_no,
          nickName: res.data.nickName, //昵称
          headUrl: res.data.headUrl, //头像
          phone: res.data.mobile ? res.data.mobile : '', //手机号码 
          getUserInfoFail: false,
        })
      },
      fail: function() {
        that.setData({
          getUserInfoFail: true,
          getStep: 1
        })
      },
    });

    // 小程序码 
    if (options.scene && options.scene != '' && options.scene != undefined && options.scene.length == 32) {
      that.getScene()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    that.getDetail() //秒杀详情

  },
  onReady() {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('down', this.data.downs)
    clearInterval(this.data.downs)
  },
  //秒杀详情
  getDetail() {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function(res) {
        wx.request({
          url: app.globalData.URL + '/api/skill/deatil',
          data: {
            id: that.data.killId,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            "Content-Type": "application/json"
          },
          success: function(res) {
            console.log(res)
            if (res.data.code == 200) {

              that.setData({
                goodsSeckills: res.data.data
              })
              let article = res.data.data.seckillDesc;
              if (article) {
                wxParser.parse({
                  bind: 'article',
                  html: article,
                  target: that
                });
              }
              // 设置标题
              wx.setNavigationBarTitle({
                title: res.data.data.goodsName
              });

              let start = res.data.data.seckillStartTime;
              let end = res.data.data.seckillEndTime;

              let now = parseInt(new Date().getTime()); //当前时间戳
              console.log(start)
              console.log(now)
              if (start > now) { //未开始
                var d = new Date(start);
                var datetime = (d.getMonth() + 1) + '月' + d.getDate() + '日' + ' ' + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + '时' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + '分';
                that.setData({
                  timeTrue: '开始时间',
                  timeTrues: 1,
                  datetime: datetime,
                  killText: '即将开始'
                })
              } else if (end < now) { //已结束
                that.setData({
                  timeTrue: '秒杀',
                  timeTrues: 2,
                  datetime: '已结束',
                  killText: '秒杀结束'
                })
              } else if (start < now && now < end) { //进行中
                that.setData({
                  timeTrues: 0,
                  timeTrue: '距结束',
                  killText: '立即秒杀'
                })
                let haveTime = (end - now) / 1000;
                var down = setInterval(() => {
                  haveTime -= 1;

                  let hour = Math.floor(haveTime / 3600);
                  let restTime = haveTime % 3600;

                  let minute = Math.floor(restTime / 60);
                  if (minute < 10) {
                    minute = '0' + minute;
                  }
                  let second = Math.floor(restTime % 60);
                  if (second < 10) {
                    second = '0' + second;
                  }
                  that.setData({
                    hour: hour,
                    minute: minute,
                    second: second,
                  });
                  if (hour == 0 && minute == 0 && second == 0) {
                    clearInterval(down);
                    that.setData({
                      hour: 0,
                      minute: 0,
                      second: 0,
                    });
                  }
                }, 1000);
                that.setData({
                  downs: down
                })

              }
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }

          }
        })
      },
    })
  },
  //微信授权
  loginApp: function(data) {
    var that = this;
    var allMsg = data.detail.userInfo;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.login({
            success: res => {
              console.log(res);
              var code = res.code;

              console.log(data);
              var member_no = that.data.member_nos ? that.data.member_nos : '';
              if (code) {

                wx.request({
                  url: app.globalData.URL + '/api/home/login',
                  data: {
                    code: code,
                    nickName: allMsg.nickName,
                    headUrl: allMsg.avatarUrl,
                    gender: allMsg.gender,
                    cityName: that.data.cityName,
                    member_no: member_no,
                  },
                  method: 'POST',
                  success: function(response) {
                    console.log(response)
                    if (response.data.code == 200) {
                      var numMsg = response.data.data;
                      if (numMsg.member_no) {

                        wx.setStorage({
                          key: 'idNum',
                          data: numMsg,
                        });
                        console.log("登陆成功");
                        that.setData({
                          getUserInfoFail: false,
                        })
                        that.loadInfo() //位置授权                         

                      }
                      // 小程序码
                      if (that.data.scene && that.data.scene != '' && that.data.scene != undefined) {
                        that.getScene()
                      } else {

                        wx.getStorage({
                          key: 'goodsSeckills',
                          success: function(res) {
                            console.log(res)
                            that.setData({
                              goodsSeckills: res.data[0]
                            })

                          },
                        })
                      }
                    } else {
                      wx.showToast({
                        title: response.data.message,
                        icon: 'none'
                      })
                    }
                  }
                })
              } else {
                console.log("登陆失败");
              }
            },
          })

        } else {
          that.setData({
            getUserInfoFail: true,
            loading: false
          })
        }
      }
    })
  },
  // 地理位置授权
  loadInfo: function() {
    var page = this;
    wx.getLocation({
      success: function(res) {
        var longitude = res.longitude
        var latitude = res.latitude
        page.loadCity(longitude, latitude)
        // console.log(res);
      },
      fail: function() {
        wx.getStorage({
          key: 'idNum',
          success: function(res) {
            common.ajaxGet(
              '/api/enjoy/updateCity', {
                city: '合肥市',
                memberNo: res.data.member_no,
              },
              function(res) {

              },
            )
          }
        })
        console.log('拒绝位置授权')
      }
    })
  },
  loadCity: function(longitude, latitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: markersData.key
    });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '', //location的格式为'经度,纬度'
      success: function(data) {
        wx.getStorage({
          key: 'idNum',
          success: function(res) {
            common.ajaxGet(
              '/api/enjoy/updateCity', {
                city: data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province,
                memberNo: res.data.member_no,
              },
              function(res) {

              },
            )
          }
        })
        wx.setStorageSync("cityName", data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province);
        // console.log(data);
        that.setData({
          cityName: data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province,
        })
      }
    });

    myAmapFun.getWeather({
      success: function(data) {
        that.setData({
          weather: data.weather.text
        })
        // console.log(data);
        //成功回调
      },
      fail: function(info) {
        //失败回调
        // console.log(info)
      }
    })
  },
  // 红人店铺
  redShop: function(e) {
    var member = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/redHome/redHome?member=' + member,
    })
  },
  // 商家店铺
  goodsShop: function(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/shopHome/shopHome?merchant_no=' + id,
    })
  },


  // 检测是否授权手机号
  checkPhone: function() {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function(res) {
        
        common.ajaxGet('/api/myMobileAuth/auth', {
            member_no: res.data.member_no,
          },
          function(data) {
            console.log(data)
            if (data.code == 200) {
              console.log(`dara: ${data.data}`)
              that.setData({
                phoneNum: data.data
              })     
              that.order()
            } else {
              that.setData({
                phoneNum: ''
              })
              that.order()
            }
          })
      }


    })
  },
  // 生成订单
  order() {
    var that = this;  
    const phone = that.data.phoneNum
    console.log(`phone  ${phone}`)
    if (phone) { //如果手机号存在就生成订单

      if (that.data.shopNo) {
        var shopNo = that.data.shopNo
      } else {
        var shopNo = ''
      }
      //生成订单
      wx.getStorage({
        key: 'idNum',
        success: function(res) {
          var memberNo = res.data.member_no;
          wx.request({
            url: app.globalData.URL + '/api/skill/create',
            data: {
              id: that.data.goodsSeckills.id,
              buyCount: 1,
              userId: memberNo,
              shopNo: shopNo,
            },
            method: 'POST',
            header: {
              "token": res.data.token,
              "Content-Type": "application/json"
            },
            success: function(response) {
              console.log(response)
              wx.hideLoading();
              if (response.data.code == 200) {
                var time = response.data.data.time;
                console.log(time)
                var numbers = response.data.data.orderId;
                var payment = that.data.goodsSeckills.seckillPrice;
                var spu = that.data.shopId;
                wx.navigateTo({
                  url: '/pages/submitOrder/submitOrder?time=' + time + '&numbers=' + numbers + '&payment=' + payment + '&types=' + 1 + '&spu=' + spu + '&status=' + 1 + '&isKill=' + true, //status:1房产
                })
              } else {
                wx.showToast({
                  title: response.data.message,
                  icon: 'none'
                })
              }

            }
          })
        },
      })
    }else{
      that.setData({
        getUserInfoFail:true,
        getStep:2
      })
    }
  },
  // 授权手机号码
  getPhoneNumber: function (e) {
    console.log(`'QaQ' ${JSON.stringify(e)} ` )
    let code = '';
     wx.login({
          success: res => {
            console.log(res)
            code =  res.code
          }
        }) 
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    var that = this;
    wx.checkSession({
      success(res) {
        // session_key 未过期，并且在本生命周期一直有效
        wx.request({
          url: app.globalData.URL + '/api/myMobileAuth/getMobile',
          data: {
            code: code,
            iv: iv,
            encryptedData: encryptedData,
          },
          method: 'GET',
          success: function (res) {
            console.log(`code ${code}`)
            console.log(res)
            if (e.detail.errMsg == 'getPhoneNumber:ok') {
              console.log('授权成功')       
              wx.setStorage({
                key: 'phone',
                data: res.data,
              })
              
              that.savePhone(res.data.data)

            } else {
              wx.showToast({
                title: '获取号码失败',
                icon: 'none'
              })
              
            }
          }
        })

      },

    })
  },
  //存储手机号
  savePhone(phone){
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        var memberNo = res.data.member_no;
        wx.request({
          url: app.globalData.URL + '/api/myMobileAuth/saveMobile',
          data: {
            member_no: memberNo,
            mobile:phone    
          },
          method: 'GET',
          success: function (response) {
            //console.log(`response ${JSON.stringify(response)} `)
            if (response.data.code == 200) {
              that.setData({
                getUserInfoFail: false
              })
              that.order()
            } else {
              wx.showToast({
                title: response.data.message,
                icon: 'none'
              })
            }
          }
        })
      }
    })
  }
 ,

  // 轮播图改变
  swiperChange: function(e) {
    var current = e.detail.current;
    if (e.detail.source == "touch" || e.detail.source == "autoplay") {
      this.setData({
        current: current
      })
    }
  },
  // 拨打电话
  calling: function(e) {

    wx.makePhoneCall({
      phoneNumber: this.data.goodsSeckills.merchantShop.mobile,
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
    })
  },
  //收藏
  cang: function(e) {
    var that = this;
    var id = e.currentTarget.id;
    wx.getStorage({
      key: 'idNum',
      success: function(res) {
        common.ajaxPost(
          '/api/myCollection/collection', {
            collect_id: id,
            collect_type: 1, //'1-商品  2-笔记 3-店铺'
            member_no: res.data.member_no
          },
          function(data) {

            if (data.code == 200) {
              if (that.data.flag == 1) {
                wx.showToast({
                  title: "取消成功",
                })
                that.setData({
                  flag: 0
                })
              } else {
                wx.showToast({
                  title: "收藏成功",
                })
                that.setData({
                  flag: 1
                })
              }
            }
          }
        )
      },
    })
  },
  // 判断是否是扫码进来
  getScene: function() {
    var that = this;
    common.ajaxGet(
      '/api/create/getScene', {
        scene: that.data.scene,

      }, res => {
        if (res.code == 200) {
          var arr = res.data.split('&')
          console.log(arr)
          that.setData({
            share_member_no: arr[0], //分享人的
            shopId: arr[1],
            member_no: arr[2], //商品关联的
          })
          var that = this;
          wx.getStorage({
            key: 'goodsSeckills',
            success: function(res) {
              console.log(res)
              that.setData({
                goodsSeckills: res.data[0]
              })

            },
          })

        }
      }
    )

  },
  onImgOK(event) {
    this.setData({
      imagePath: event.detail.path
    })
  },
  /* 弹窗的时候 阻止冒泡 */
  myCatchTouch: function() {
    console.log('stop user scroll it!');
    return;
  },
  /// 创建海报
  createPoster: function(e) {
    this.setData({
      shows: false
    });
    var that = this
    wx.showLoading({
      title: '正在生成图片...',
    })

    this.setData({
      template: that.palette(),
    })
    setTimeout(function() {
      wx.hideLoading()
      that.setData({

        isCreate: true,
        isShow: true
      });
    }, 1000)

  },
  /// 隐藏
  catchtap: function(callback) {
    this.setData({
      isShow: false
    })
    setTimeout(() => {
      this.setData({
        isCreate: false
      })
      if (callback && typeof callback == "function") {
        callback();
      }
    }, 400)
  },
  /// 保存图片
  btnCreate: function(obj) {
    wx.showLoading({
      title: "正在保存..."
    })
    wx.saveImageToPhotosAlbum({
      filePath: this.data.imagePath,
      success: res => {
        wx.hideLoading();
        this.catchtap(() => {
          wx.showToast({
            title: '保存成功'
          })
        });
      },
      fail: err => {
        wx.hideLoading();
        wx.showModal({
          title: '打开小程序相册授权',
          content: '请在设置中打开相册授权即可保存图片至相册',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success: function(data) {
                  console.log("openSetting success");
                },
                fail: function(data) {
                  console.log("openSetting fail");
                }
              });
            } else if (res.cancel) {
              _this.catchtap(() => {
                wx.showToast({
                  title: '保存失败',
                  icon: 'none'
                })
              });
            }
          }
        })
      }
    });
  },
  palette() {
    var that = this
    var firstPrice = String(that.data.houseDetail.goodsCouponList.length > 0 ? that.data.houseDetail.goodsCouponList[0].coupon_title : '  核销券')
    var pageUrl = "pages/huoseKill/huoseKill"
    var house_place = that.data.goodsSkuList.address_province + (that.data.goodsSkuList.address_city === '市辖区' ? '' : that.data.goodsSkuList.address_city) + that.data.goodsSkuList.address_area + that.data.goodsSkuList.address_supplement;
    return ({
      width: '610rpx',
      height: '1068rpx',
      views: [{
          type: 'image',
          url: '/img/icon/bg2.png',
          css: {
            width: '610rpx',
            height: '1068rpx',
          },
        },
        {
          type: 'image',
          url: that.data.goodsBurl[0].house_image,
          css: {
            width: '118px',
            height: '118px',
            top: `22px`,
            left: `24px`,
            borderRadius: "20rpx"
          },
        },
        {
          type: 'text',
          text: that.data.goods_name,
          css: {
            top: `72px`,
            left: `156px`,
            width: '130px',
            maxLines: 1,
            fontWeight: '400',
            fontSize: '14px',
            color: '#000000'
          }
        },
        {
          type: 'text',
          text: house_place,
          css: {
            top: `106px`,
            left: `156px`,
            width: '140px',
            maxLines: 2,
            lineHeight: `18px`,
            fontWeight: '400',
            fontSize: '12px',
            color: '#F32A3A'
          }
        },
        {
          type: 'text',
          text: that.data.houseDetail.share ? that.data.houseDetail.share.goods_share : that.data.houseDetail.houseVo.distribution_description,
          css: {
            top: `150px`,
            left: `24px`,
            width: '264px',
            lineHeight: `18px`,
            maxLines: 3,
            fontWeight: '400',
            fontSize: '12px',
            color: '#7B7B7B'
          }
        },
        {
          type: 'image',
          url: that.data.headUrl,
          css: {
            width: '80rpx',
            height: '80rpx',
            top: `476rpx`,
            left: `22px`,
            borderRadius: "40rpx"
          },
        },
        {
          type: 'text',
          text: that.data.nickName,
          css: {
            top: `474rpx`,
            left: `71px`,
            width: '180rpx',
            maxLines: 1,
            fontWeight: '400',
            fontSize: '32rpx',
            color: '#000000'
          }
        },
        {
          type: 'text',
          text: '为你推荐',
          css: {
            top: `478rpx`,
            left: `165px`,
            width: '160rpx',
            maxLines: 1,
            fontWeight: '400',
            fontSize: '28rpx',
            color: '#000000'
          }
        },
        {
          type: 'text',
          text: '我在第一房发现了优质好房，分享给你。',
          css: {
            top: `530rpx`,
            left: `72px`,
            width: '444rpx',
            maxLines: 1,
            fontWeight: '400',
            fontSize: '10px',
            color: '#6D6D6D'
          }
        },
        {
          type: 'image',
          url: '/img/icon/bg2_1.png',
          css: {
            width: '336rpx',
            height: '198rpx',
            top: `580rpx`,
            left: `126rpx`,
          },
        },

        {
          type: 'text',
          text: firstPrice,
          css: [{
            top: firstPrice.length < 8 ? `658rpx` : `646rpx`,
            left: firstPrice.length > 8 ? `164rpx` : `240rpx`,
            width: '260rpx',
            // textAlign:'center',
            display: 'block',
            maxLines: 2,
            lineHeight: `18px`,
            fontWeight: '400',
            fontSize: '14px',
            color: '#FFFFFF'
          }]
        },
        {
          type: 'image',
          url: "https://58hongren.com/api/create/produceCode?page=" + pageUrl + "&member_no=" + that.data.member_nos + "&shopId=" + that.data.shopId + "&shopNo=" + that.data.redShop.member_no,
          css: {
            width: '55px',
            height: '55px',
            top: `804rpx`,
            left: `125px`
          },
        },
        {
          type: 'text',
          text: '好房分享，扫码抢购',
          css: {
            bottom: `126rpx`,
            left: `86px`,
            width: '180px',
            maxLines: 1,
            fontWeight: '400',
            fontSize: '14px',
            color: '#6D6D6D'
          }
        },

      ]
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('down', this.data.downs)
    clearInterval(this.data.downs)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    var killId = that.data.killId;

    var member_no = that.data.member_nos; //分享人的userid
    return {
      title: that.data.goodsSeckills.goodsName,
      path: '/pages/huoseKill/huoseKill?killId=' + killId,
      imageUrl: '',
      success: function(res) {
        console.log('分享成功')
        // 分享成功
      },
      fail: function(res) {
        console.log('分享失败')
        // 分享失败
      }
    }
  }
})