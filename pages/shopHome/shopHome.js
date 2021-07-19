// pages/shopHome/shopHome.js
const app = getApp();
var common = require("../../utils/common.js");
var amapFile = require('../../utils/amap-wx.js');
var markersData = {
  latitude: '',//纬度
  longitude: '',//经度
  key: "4ada276712c47bf88a9cdc6d41248a2a"//申请的高德地图key
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuLists: [
      {
        name: "房产"
      },
      {
        name: "生活"
      },
    ],
    currentTabs: 0,
    isSearch: false,//是否显示房产搜索结果
    isSearchs: false,//生活搜索结果
    isCang:false,//是否收藏
    getUserInfoFail: true,
    isCreate: false,
    isShow: false,
    bigImage: "",
    imagePath: '',
    template: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      merchant_no: options.merchant_no ? options.merchant_no : '',//商家编号
      scene: options.scene ? options.scene : '',//小程序码参数
      member_share: options.member_share ? options.member_share : '',//分享人
    })

    console.log('小程序码',options.scene)
    // 小程序码
    if (options.scene && options.scene != '' && options.scene != undefined) {
      this.getScene()
    } 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.setData({ 
          getUserInfoFail: false,
          nickName: res.data.nickName,
          headUrl: res.data.headUrl,
        })
        that.shopDetail()// 店铺详情
        that.getHouseList()//房产
        that.getList()//生活
      },
      fail: function () {
        that.setData({ getUserInfoFail: true, })
      }
    })
    
  },
  //微信授权
  loginApp: function (data) {
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
                  success: function (response) {
                    console.log(response)
                    if (response.data.code == 200) {
                      var numMsg = response.data.data;
                      if (numMsg.member_no) {
                        //存当前时间到本地存储
                        var timestamp = (new Date()).getTime();
                        wx.setStorageSync('time', timestamp)
                        wx.setStorage({
                          key: 'idNum',
                          data: numMsg,
                        });
                        console.log("登陆成功");
                        that.setData({
                          getUserInfoFail: false,
                        })
                        that.loadInfo()//位置授权                         
                      }
                      // 小程序码
                      if (that.data.scene && that.data.scene != '' && that.data.scene != undefined) {
                        that.getScene()
                      } else {
                        that.shopDetail()// 店铺详情
                        that.getHouseList()//房产
                        that.getList()//生活
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
  loadInfo: function () {
    var page = this;
    wx.getLocation({
      success: function (res) {
        var longitude = res.longitude
        var latitude = res.latitude
        page.loadCity(longitude, latitude)
        // console.log(res);
      },
      fail: function () {
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            common.ajaxGet(
              '/api/enjoy/updateCity', {
                city: '合肥市',
                memberNo: res.data.member_no,
              },
              function (res) {

              },
            )
          }
        })
        console.log('拒绝位置授权')
      }
    })
  },
  loadCity: function (longitude, latitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: markersData.key });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '',//location的格式为'经度,纬度'
      success: function (data) {
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            common.ajaxGet(
              '/api/enjoy/updateCity', {
                city: data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province,
                memberNo: res.data.member_no,
              },
              function (res) {

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

  },
// 店铺详情
shopDetail:function(){
  var that = this;
  wx.getStorage({
    key: 'idNum',
    success: function (res) {
      wx.request({
        url: app.globalData.URL + '/api/redAndOfficeGroup/getOfficeDeatils',//api/merchantShop/merchantShopDetails
        data: {
          merchant_no: that.data.merchant_no,//88888888,//res.data.member_no,
          member_no: res.data.member_no
        },
        method: 'GET',
        header: {
          "token": res.data.token,
          'content-type': 'application/json'
        },
        success: function (res) {
          // console.log(res.data.data)
          that.setData({
            shopDetail: res.data.data
          }) 
          // 设置标题
          wx.setNavigationBarTitle({
            title: res.data.data.merchantShop.shop_name
          });
        }
      })
    }
  })
},
  showPopup() {
    this.setData({ shows: true });
  },

  onCloses() {
    this.setData({ shows: false });
  },
  //房产
  getHouseList: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/redAndOfficeGroup/mHouse',
          data: {
            merchant_no: that.data.merchant_no,//88888888,//res.data.member_no,
            member_no: res.data.member_no,
            pageIndex: 1,
            pageSize: 100,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            // console.log(res.data)

            that.setData({
              houseList: res.data.data.list
            })
            if (res.data.data.list==0){
              that.setData({
                currentTabs: 1
              })
            }
          }
        })
      }
    })
  },
//生活
getList: function (){
  var that = this;
  wx.getStorage({
    key: 'idNum',
    success: function (res) {
      wx.request({
        url: app.globalData.URL + '/api/redAndOfficeGroup/mGoods',
        data: {
          merchant_no: that.data.merchant_no,//88888888,//res.data.member_no,
          member_no: res.data.member_no,
          pageIndex:1,
          pageSize:100,
        },
        method: 'GET',
        header: {
          "token": res.data.token,
          'content-type': 'application/json'
        },
        success: function (res) {
          // console.log(res.data)
          that.setData({
            gouseList: res.data.data.list
          })
        }
      })
    }
  })
},
//输入框
  getInputValue: function (e) {
    // console.log(e)
    this.setData({
      searchValue: e.detail.value
    })
  },
  getInputValues: function (e) {
    // console.log(e)
    this.setData({
      searchValues: e.detail.value
    })
  },
  searchHandle: function () {
    this.toSearch()
  },
  searchHandles: function () {
    this.toSearchs()
  },
// 搜索
  toSearch: function () {
    var that = this;
    // wx.showLoading({
    //   title: "加载中",
    //   mask: true
    // });
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.hideLoading();
        common.ajaxGet(
          '/api/merchantShop/merchantShopGoods',
          {
            searchName: that.data.searchValue,
            merchant_no: that.data.merchant_no,//88888888,//res.data.member_no,
            type: 1,//1房产 2生活
            pageIndex: 1,
            pageSize: 100,
          },
          function (res) {
            // console.log(res)
            if (res.code == 200) {
              that.setData({
                isSearch: true,
                searchList: res.data.list
              })
              // console.log(that.data.isSearch)
            }
          }
        )
      }
    })
  },
  toSearchs: function () {
    var that = this;
    // wx.showLoading({
    //   title: "加载中",
    //   mask: true
    // });
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.hideLoading();
        common.ajaxGet(
          '/api/merchantShop/merchantShopGoods',
          {
            searchName: that.data.searchValues,
            merchant_no: that.data.merchant_no,//88888888,//res.data.member_no,
            type: 2,//1房产 2生活
            pageIndex: 1,
            pageSize: 100,
          },
          function (res) {
            if (res.code == 200) {
              that.setData({
                isSearchs: true,
                searchLists: res.data.list
              })
            }
          }
        )
      },
    })
  },
  // 菜单切换
  clickMenus: function (e) {
    // console.log(e)
    var id = e.currentTarget.dataset.current;
    this.setData({
      currentTabs: id
    })
    if(id==0){
      // this.getHouseList()//房产
      this.setData({
        isSearchs:false,
        isSearch:false
      })
    }else if(id==1){
      // this.getList()//生活
    }
    // console.log(this.data.currentTabs,id)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
//商品详情
  goodsDetail:function(e){
    var shopId = e.currentTarget.id;
    var goods_name = e.currentTarget.dataset.goods_name;
    var type = e.currentTarget.dataset.type;
    var member_share = this.data.member_share;
    if (member_share) {
      var source = 3//有分享
    } else {
      var source = 0//无分享，直接购买
    }

    if(type==1){
      wx.navigateTo({
        url: '/pages/huose/huose?shopId=' + shopId + '&goods_name=' + goods_name,
      })
    }else{
      wx.navigateTo({
        url: '/pages/home_page/good_detail/good_detail?shopId=' + shopId + '&goods_name=' + goods_name + '&source=' + source,
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  //收藏店铺
  cang: function (e) {
    var that = this;
    // var id = e.currentTarget.id;
    // wx.showLoading({
    //   title: "加载中",
    //   mask: true
    // });
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.hideLoading();
        common.ajaxPost(
          '/api/myCollection/collection',
          {
            collect_id: that.data.merchant_no,
            collect_type: 3,//'1-商品  2-笔记 3-店铺'
            member_no: res.data.member_no
          },
          function (data) {
            // console.log(data)
            if (data.code == 200) {
              if (!that.data.isCang){
                wx.showToast({
                  title: "收藏成功",
                })
                that.setData({
                  isCang: true
                })
              }else{
                wx.showToast({
                  title: "取消收藏",
                })
                that.setData({
                  isCang: false
                })
              }
              that.shopDetail()//店铺详情
            }
          }
        )
      },
    })
  },
  //收藏商品
  cang1: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    var flag = e.currentTarget.dataset.flag
    // wx.showLoading({
    //   title: "加载中",
    //   mask: true
    // });
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.hideLoading();
        common.ajaxPost(
          '/api/myCollection/collection',
          {
            collect_id: id,
            collect_type: 1,//'1-商品  2-笔记 3-店铺'
            member_no: res.data.member_no
          },
          function (data) {
            // console.log(data)
            if (data.code == 200) {
              if (flag==0) {
                wx.showToast({
                  title: "收藏成功",
                })
               
              } else {
                wx.showToast({
                  title: "取消收藏",
                })
                
              }
              if (that.data.currentTabs==0){
                that.getHouseList()//房产
              }else{
                that.getList()//生活
              }
              
            }
          }
        )
      },
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var merchant_no = that.data.merchant_no;
    var member_no = that.data.member_nos;//分享人的userid
    return {
      title: that.data.shopDetail.merchantShop.shop_name,
      path: '/pages/shopHome/shopHome?merchant_no=' + merchant_no + '&member_share=' + member_no,
      imageUrl: '',
      success: function (res) {
        console.log('分享成功')
        // 分享成功
      },
      fail: function (res) {
        console.log('分享失败')
        // 分享失败
      }
    }
  },
  // 判断是否是扫码进来
  getScene: function () {
    var that = this;
    common.ajaxGet(
      '/api/create/getScene',
      {
        scene: that.data.scene,
      }, res => {
        if (res.code == 200) {
          var arr = res.data.split('&')
          console.log(arr)
          that.setData({
            merchant_no: arr[0],//分享人的
          })
          wx.getStorage({
            key: 'idNum',
            success: function (res) {
              wx.request({
                url: app.globalData.URL + '/api/redAndOfficeGroup/getOfficeDeatils',
                data: {
                  merchant_no: arr[0],
                  member_no: res.data.member_no
                },
                method: 'GET',
                header: {
                  "token": res.data.token,
                  'content-type': 'application/json'
                },
                success: function (res) {
                  // console.log(res.data.data)
                  that.setData({
                    shopDetail: res.data.data
                  })
                  // 设置标题
                  wx.setNavigationBarTitle({
                    title: res.data.data.merchantShop.shop_name
                  });

                  that.getHouseList()//房产
                  that.getList()//生活
                }
              })
            }
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
  myCatchTouch: function () {
    console.log('stop user scroll it!');
    return;
  },
  /// 创建海报
  createPoster: function (e) {
    this.setData({ shows: false });
    var that = this
    wx.showLoading({
      title: '正在生成图片...',
    })

    this.setData({
      template: that.palette(),
    })
    setTimeout(function () {
      wx.hideLoading()
      that.setData({

        isCreate: true,
        isShow: true
      });
    }, 1000)

  },
  /// 隐藏
  catchtap: function (callback) {
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
  btnCreate: function (obj) {
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
                success: function (data) {
                  console.log("openSetting success");
                },
                fail: function (data) {
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
    
    var pageUrl = "pages/shopHome/shopHome"
    // var house_place = that.data.goodsSkuList.address_province + that.data.goodsSkuList.address_city + that.data.goodsSkuList.address_area + that.data.goodsSkuList.address_supplement;
    return ({
      width: '610rpx',
      height: '1068rpx',
      views: [{
        type: 'image',
        url: '/img/icon/bg3.png',
        css: {
          width: '610rpx',
          height: '1068rpx',
        },
      },
      {
        type: 'image',
        url: that.data.shopDetail.merchantShop.shopImage,
        css: {
          width: '50px',
          height: '50px',
          top: `60px`,
          left: `33px`,
          borderRadius: "25px"
        },
      },
      {
        type: 'text',
        text: that.data.shopDetail.merchantShop.shop_name,
        css: {
          top: `60px`,
          left: `92px`,
          width: '130px',
          maxLines: 1,
          fontWeight: '400',
          fontSize: '16px',
          color: '#000000'
        }
      },
        {
          type: 'image',
          url: '/img/icon/pinPai.png',
          css: {
            width: '60rpx',
            height: '22rpx',
            top: `65px`,
            left: `222px`,
          },
        },
      {
        type: 'text',
        text: that.data.shopDetail.merchantShop.sign,
        css: {
          top: `89px`,
          left: `92px`,
          width: '140px',
          maxLines: 1,
          fontWeight: '400',
          fontSize: '12px',
          color: '#686868'
        }
      },
        {
          type: 'image',
          url: that.data.shopDetail.merchantShop.brand_story_image,
          css: {
            width: '130px',
            height: '176px',
            top: `129px`,
            left: `26px`,
            borderRadius: "10rpx"
          },
        },
      {
        type: 'text',
        text: that.data.shopDetail.merchantShop.brand_story,
        css: {
          top: `150px`,
          left: `165px`,
          width: '110px',
          lineHeight: `18px`,
          maxLines: 8,
          fontWeight: '400',
          fontSize: '12px',
          color: '#0F0F0F'
        }
      },
      {
        type: 'image',
        url: that.data.headUrl,
        css: {
          width: '80rpx',
          height: '80rpx',
          top: `694rpx`,
          left: `22px`,
          borderRadius: "40rpx"
        },
      },
      {
        type: 'text',
        text: that.data.nickName,
        css: {
          top: `694rpx`,
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
          top: `694rpx`,
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
          top: `746rpx`,
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
        url: "https://58hongren.com/api/create/produceCodeOffice?page=" + pageUrl + "&merchant_no=" + that.data.merchant_no,
        css: {
          width: '45px',
          height: '45px',
          top: `814rpx`,
          left: `130px`
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
})