// pages/redRanking/redRanking.js
const app = getApp();
var common = require("../../utils/common.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dingwei: options.dingwei
    })
    this.getHongren()//红人榜单列表
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
    this.getIndexData() //获取轮播图
  },


  //获取轮播图
  getIndexData: function () {
    var that = this;
    wx.request({
      url: app.globalData.URL + '/api/enjoy/homeImage',
      data: {
        city: that.data.dingwei,
        bySource: 9,
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            bnrUrl: res.data.data
          })
        }
      }
    })
  },
  //红人列表
  getHongren: function (pageIndex=1) {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + 'api/enjoy/redList',
          data: {
            cityName: that.data.dingwei,
            member_no: res.data.member_no,
            pageIndex: pageIndex,
            pageSize: 15
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (response) {
            // console.log(response)
            if (response.data.code==200){
              let sort = response.data.data.list;
              let redArr = sort.slice(3, sort.length);
              that.setData({
                hongren: response.data.data.list,
                redArr: redArr,
                pages: response.data.data.pages,
                pageIndex: response.data.data.pageNum
              })
            } else if (response.data.code == 401){
              wx.clearStorageSync()//清除本地缓存
              wx.showModal({
                content: '登陆超时，请重新登陆',
                success(res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '/pages/personal/personal',
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })             
            }
          }
        })
      },
      fail: function () {
        wx.showModal({
          content: '您尚未登陆，请先登陆',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/personal/personal',
              })
            } else if (res.cancel) {
             wx.navigateBack({
               
             })
            }
          }
        })
      }
    })
  },
  // 红人店铺
  redShop:function(e){
    // console.log(e)
    var member = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/redHome/redHome?member=' + member,
    })
  },
  // 关注
  guanZhu: function (e) {
    // console.log(e)
    var that = this;
    var flag = e.currentTarget.id;
    var member = e.currentTarget.dataset.id;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(res.data.member_no);
        var nickName = res.data.nickName;
        var member_no= res.data.member_no;
        wx.request({
          url: app.globalData.URL + 'api/redAndOfficeGroup/follow',
          data: {
            member_no_me: res.data.member_no,
            member_no_other: member,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(flag)
            if (res.data.code == 200 && flag == 0) {
              wx.showToast({
                title: '关注成功',
              })
              //关注订阅消息提示
              wx.requestSubscribeMessage({
                tmplIds: ['_uzRd2nWEjpRHMywdZuK2G3IbWIzWfW7Ornx3J5c_fk'],
                success(res) {
                  common.ajaxPost(
                    '/api/wxMessgae/pushFollow',
                    {
                      memberNo: member,
                      nickName: nickName
                    },
                    function (res) {
                      console.log(res)
              
                    }
                  )
                }
              })
              var data = {
                action: 2,
                chatMsg: {
                  msg: '通过红翻区关注了你',
                  send_user_id: member_no,//发送者
                  accept_user_id: member,//接受者
                  id: '',//消息的接受
                  accept_type: 0, //0-普通会员（包括红人）  1-商家
                  send_type: 0,//0-普通会员（包括红人）  1-商家
                  sign_flag: 0,//0 未签收 1 签收
                  msgType: 3 //3新增粉丝 
                },
                extend: 1,//扩展字段
                extend_nother: ''
              }
              that.sendSocketMessage(data)
            } else if (res.data.code == 200 && flag == 1) {
              wx.showToast({
                title: '取消关注',
                icon: 'none'
              })
            } else if (res.data.code == 500){
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }
            that.getHongren()//红人列表

          }
        })
      },
    })
  },
  // 发送和接收 socket 消息
  sendSocketMessage: function (msg) {
    let that = this
    return new Promise((resolve, reject) => {
      app.sendSocketMessage(msg)
      app.globalData.callback = function (res) {
        console.log('收到服务器内容', res)
        resolve(res)
      }
    })
  },
  // 轮播图链接
  viewBanner: function (e) {
    var id = e.currentTarget.id;//1.网址2.商品3.文章 4.专题
    var appUrl = e.currentTarget.dataset.id;
    if (id == 2) {
      var arr = appUrl.split(',&')
      if (arr[1] == 1) {//房产
        wx.navigateTo({
          url: '/pages/huose/huose?shopId=' + arr[0],
        })
      } else {
        wx.navigateTo({
          url: '/pages/home_page/good_detail/good_detail?shopId=' + arr[0],
        })
      }
    } else if (id == 1) {
      wx.navigateTo({//外链
        url: '/pages/pageH/pageH?url=' + appUrl,
      })
    } else if (id == 3) {//文章
      var newArr = appUrl.split(',&');
      console.log(newArr)
      wx.navigateTo({
        url: '/pages/myNote_detail/myNote_detail?nickName=' + newArr[0] + '&headUrl=' + newArr[1] + '&sign=' + newArr[2] + '&member_no=' + newArr[3] + '&noteId=' + newArr[4] + '&read=' + newArr[5] + '&comment=' + newArr[6] + '&like=' + newArr[7] + '&type=' + newArr[8] + '&flag=' + newArr[9] + '&time=' + newArr[10],
      })
    } else if (id == 4) {//专题
      wx.navigateTo({//外链
        url: '/pages/actieve/actieve?id=' + appUrl,
      })
    } else if (id == 6) {//黑卡
      wx.navigateTo({
        url: '/pages/banCard/banCard?id=' + appUrl + '&type=' + 1,
      })
    } else if (id == 7) {//第六空间小程序
      wx.navigateToMiniProgram({
        appId: 'wx787c7dbe01af57c6',
        path: appUrl,//'pages/invitation2/invitation2?id=12',
        extraData: {
          from: '12'
        },
        envVersion: 'release',
        success(res) {
          // 打开其他小程序成功同步触发
          wx.showToast({
            title: '跳转成功'
          })
        }
      })
    }
  },
  // 笔记详情
  noteDetail: function (e) {
    console.log(e)
    var noteId = e.currentTarget.id;
    var type = e.currentTarget.dataset.type;//1-小程序发布笔记 2-小程序发布文章 3-后台发布 4后台抓取
    var comment = e.currentTarget.dataset.comment;
    var like = e.currentTarget.dataset.like;
    var read = e.currentTarget.dataset.read;
    var flag = e.currentTarget.dataset.flag;
    var headUrl = e.currentTarget.dataset.headurl;
    var nickName = e.currentTarget.dataset.nickname;
    var sign = e.currentTarget.dataset.sign;
    var member = this.data.member;
    var time = e.currentTarget.dataset.time;
    wx.navigateTo({
      url: '/pages/myNote_detail/myNote_detail?noteId=' + noteId + '&headUrl=' + headUrl + "&nickName=" + nickName + '&sign=' + sign + '&type=' + type + '&comment=' + comment + '&like=' + like + '&read=' + read + '&flag=' + flag + '&member=' + member + '&time=' + time,
    })
  },
  //商品链接
  goodsDetails: function (e) {
    console.log(e)
    var shopId = e.currentTarget.id;
    var goods_name = e.currentTarget.dataset.goods_name;
    var member_no = e.currentTarget.dataset.id;
    var comeFrom = 'home';
    var ids = e.currentTarget.dataset.ids;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        if(ids==1){//房产
          wx.navigateTo({
            url: '/pages/huose/huose?shopId=' + shopId + '&comeFrom=' + comeFrom + '&goods_name=' + goods_name + '&member_no=' + member_no,
          })
        }else{
          wx.navigateTo({
            url: '/pages/home_page/good_detail/good_detail?shopId=' + shopId + '&comeFrom=' + comeFrom + '&goods_name=' + goods_name + '&member_no=' + member_no,
          })
        }
        
      },
      fail: function () {
        wx.showModal({
          content: '您尚未登陆，请先登陆',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/personal/personal',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
    let that = this;
    var pages = this.data.pages;//总页数
    var pageIndex = this.data.pageIndex;//当前页
    if (pageIndex < pages) {
      // 显示加载图标
      // wx.showLoading({
      //   title: '玩命加载中',
      // })
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          wx.request({
            url: app.globalData.URL + 'api/enjoy/redList',
            data: {
              cityName: that.data.dingwei,
              member_no: res.data.member_no,
              pageIndex: pageIndex + 1,
              pageSize: 10
            },
            method: 'GET',
            header: {
              "token": res.data.token,
              'content-type': 'application/json'
            },
            success: function (response) {
             wx.hideLoading()
              if (response.data.code == 200) {
                let sort = response.data.data.list;
                // var sorts = that.data.hongren;
                let redArr = that.data.redArr;
                that.setData({
                  // hongren: sorts.concat(response.data.data.list),
                  redArr: redArr.concat(response.data.data.list),
                  pages: response.data.data.pages,
                  pageIndex: response.data.data.pageNum
                })
                
              }
            }
          })
        },
        
      }) 
    } else {
      wx.showToast({
        title: "我是有底线的",
        icon: "none"
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})