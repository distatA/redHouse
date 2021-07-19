// pages/collect/collect.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu: [
      { name: '商品', num: 0 },
      { name: '笔记', num: 1 },
      { name: '店铺', num: 2 },
    ],
    goodsList:'',
    current: 0,
    JDimg: app.globalData.JDimg,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getGoods()//商品收藏
  },
  // 商品收藏
  getGoods: function () {
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
          '/api/myCollection/goodsCollection',
          {
            member_no_me: res.data.member_no,
            pageIndex: 1,
            pageSize: 50,
          },
          function (data) {
            if (data.code == 200) {
            let list = data.data.list.map(v=>{
              let params = v.searchgoodsResult.result.queryVo[0]
             v.backMoney = Number(params.price * params.commisionRatioWl / 100).toFixed(2)
             v.spu_no = params.skuId
             v.goods_name = params.wareName 
             v.first_price = params.price
             v.spu_image = params.imageUrl
             v.commisionRatioWl = params.commisionRatioWl
             v.qtty30 = params.qtty30
              return v
            })
              that.setData({
                goodsList: list
              })
            }
          }
        )
      },
      fail: function () {
        wx.hideLoading()
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

  // 笔记收藏
  getNode: function () {
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
          '/api/myCollection/noteCollection',
          {
            member_no_me: res.data.member_no,
            pageIndex: 1,
            pageSize: 100,
          },
          function (data) {
            // console.log(data)
            if (data.code == 200) {
              that.setData({
                nodeList: data.data.list
              })
            }
          }
        )
      },
      fail: function () {
        wx.hideLoading()
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
  // 点赞
  zan: function (e) {
    var like_type = e.currentTarget.dataset.like_type;
    var like_id = e.currentTarget.id;
    var flag = e.currentTarget.dataset.flag;

    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/api/NoteAndArticleComment/commentLike', {
          like_type: 1, //1-笔记  2-文章  5-评论
          like_id: like_id,
          member_no: res.data.member_no,
        },
          function (res) {
            console.log(flag)
            if (res.code == 200 && flag == 0) {
              wx.showToast({
                title: '点赞成功',
              })

            } else if (flag == 1) {
              wx.showToast({
                title: '取消点赞',
                icon: 'none'
              })

            }
            that.getNode()//红人笔记
          },
        )
      }
    })
  },
  //店铺收藏
  getShop: function () {
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
          '/api/myCollection/merchantShopCollection',
          {
            member_no_me: res.data.member_no,
            pageIndex: 1,
            pageSize: 100,
          },
          function (data) {
            // console.log(data)
            if (data.code == 200) {
              that.setData({
                shopList: data.data.list
              })
            }
          }
        )
      },
      fail: function () {
        wx.hideLoading()
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
  // 链接商品详情页
  shop: function (e) {
    let { item, goods_name, member_no } = e.currentTarget.dataset
    console.log(item);
    let choice = e.currentTarget.dataset.id;
    // 跳转京东
    if (this.data.current=== 0) {
      let data = JSON.stringify({
        skuId:item.spu_no,
        backMoney:item.backMoney,
        commisionRatioWl:item.commisionRatioWl,
        qtty30:item.qtty30,
        price : item.first_price
      })
      wx.navigateTo({ url: `../../packageA/JDdetail/index?data=${data}` })
    }
    else if (choice == 1) {//房产
      wx.navigateTo({
        url: '/pages/huose/huose?shopId=' + e.currentTarget.id + '&category_id=' + choice + '&goods_name=' + goods_name + '&member_no=' + member_no,
      })
    } else {
      wx.navigateTo({
        url: '/pages/home_page/good_detail/good_detail?shopId=' + e.currentTarget.id + '&category_id=' + choice + '&goods_name=' + goods_name + '&member_no=' + member_no,
      })
    }

  },
  //商品取消收藏
  close: function (e) {
    let that = this;
    var id = e.currentTarget.id;
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
              wx.showToast({
                title: "取消成功",
              })
              setTimeout(function () {
                that.getGoods()//商品收藏列表
              }, 1000)

            }
          }
        )
      },
    })
  },
  //笔记取消收藏
  closes: function (e) {
    var that = this;
    var id = e.currentTarget.id;
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
            collect_type: 2,//'1-商品  2-笔记 3-店铺'
            member_no: res.data.member_no
          },
          function (data) {
            // console.log(data)
            if (data.code == 200) {
              wx.showToast({
                title: "取消成功",
              })
              setTimeout(function () {
                that.getNode()//笔记收藏列表
              }, 1000)

            }
          }
        )
      },
    })
  },
  //店铺取消收藏
  close3: function (e) {
    var that = this;
    var id = e.currentTarget.id;
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
            collect_type: 3,//'1-商品  2-笔记 3-店铺'
            member_no: res.data.member_no
          },
          function (data) {
            // console.log(data)
            if (data.code == 200) {
              wx.showToast({
                title: "取消成功",
              })
              setTimeout(function () {
                that.getShop()//店铺收藏列表
              }, 1000)

            }
          }
        )
      },
    })
  },
  //查看图片
  clickImg: function (event) {
    console.log(event)
    var index = event.currentTarget.id;
    var imgArr = new Array();
    imgArr.push(index);
    // console.log(imgArr)
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
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
    var member = e.currentTarget.dataset.member;
    var time = e.currentTarget.dataset.time;
    var headUrl = e.currentTarget.dataset.headurl;
    var nickName = e.currentTarget.dataset.nickname;
    var img = e.currentTarget.dataset.img;//一张图片
    var imgs = e.currentTarget.dataset.imgs;//多张图片
    var video = e.currentTarget.dataset.video;
    var title = e.currentTarget.dataset.title;

    var spu = e.currentTarget.dataset.spu;
    var goods_name = e.currentTarget.dataset.goods_name;
    var member_no = e.currentTarget.dataset.member_no;
    var choice = e.currentTarget.dataset.choice;

    // console.log(nickName, time,img)
    wx.navigateTo({
      url: '/pages/myNote_detail/myNote_detail?noteId=' + noteId + '&headUrl=' + headUrl + "&nickName=" + nickName + '&type=' + type + '&comment=' + comment + '&like=' + like + '&read=' + read + '&flag=' + flag + '&member=' + member + '&time=' + time + '&img=' + img + '&video=' + video + '&imgs=' + imgs + '&title=' + title + '&spu=' + spu + '&goods_name=' + goods_name + '&member_no=' + member_no + '&choice=' + choice,
    })
  },
  /* 视频退出全屏时的操作 */
  fullscreenchange: function (event) {
    console.log("视频全屏的操作" + event.detail.fullScreen);
    if (event.detail.fullScreen == false) {

      var videoContext = wx.createVideoContext('houseVideo');
      videoContext.stop();
      videoContext.exitFullScreen();
    }
  },
  //上面标签的点击事件
  changetype: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id;
    var num = e.currentTarget.dataset.num;
    if (num == this.data.num) {
      return false;
    }
    this.setData({
      current: id,
      num: num
    })
    if (id == 0) {
      this.getGoods()//商品
    } else if (id == 1) {
      this.getNode()//笔记
    } else if (id == 2) {
      this.getShop()//店铺
    }
  },
  // swiper 被改变的时候调用方法
  change: function (res) {
    var _this = this;
    console.log(res);
    // 获取swiper的编号
    let current = res.detail.current;
    // 修改data中的数据
    _this.setData({
      current: current
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /* 视频退出全屏时的操作 */
  fullscreenchange: function (event) {
    console.log("视频全屏的操作" + event.detail.fullScreen);
    if (event.detail.fullScreen == false) {

      var videoContext = wx.createVideoContext('houseVideo');
      videoContext.stop();
      videoContext.exitFullScreen();
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  //商家店铺
  shopHome: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/shopHome/shopHome?merchant_no=' + id,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getGoods()//商品收藏
    wx.stopPullDownRefresh()
  },
  //弹窗
  onClose(event) {
    const { position, instance } = event.detail;
    switch (position) {
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？'
        }).then(() => {
          instance.close();
        });
        break;
    }
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

  }
})