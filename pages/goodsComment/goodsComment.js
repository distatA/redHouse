// pages/goodsComment/goodsComment.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moren: 0,
    num: 0,
    oldValue: "",
    kolstar:5,
    noName: 0,//0不匿名 1 匿名
    isView:false,
    value: 0,
    value2: 0,
    value3: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // numbers: '2019090215095752172d26b65ovLaj',
      numbers: options.member_no ? options.member_no : '',
      name:options.name,
      img:options.img,
      spu_no: options.spu ? options.spu:'',
      sku_no: options.sku ? options.sku:'',
      status: options.status ? options.status :0,//1房产
    })
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
          token:res.data.token
        })
      }
    })
  },
  //点赞评价
  onChange1(event) {//红人
    this.setData({
      value1: event.detail
    });
  },
  onChange2(event) {//商品
    this.setData({
      value2: event.detail
    });
  },
  onChange3(event) {//优惠
    this.setData({
      value3: event.detail
    });
  },
  // 匿名
  changeMoren: function () {
    if (this.data.moren == 0) {
      this.setData({
        moren: 1,
        noName:1,
      })
    } else {
      this.setData({
        moren: 0,
        noName:0
      })
    }

  },
  // 鼠标获取焦点
  bindTextAreaBlur: function (e) {
    var value = common.trim(e.detail.value);
    if (value.length > 300) {
      wx.showToast({
        title: '输入超过300了',
        icon: 'none'
      })
    }
    this.setData({
      textValue: value,
      num: value.length
    })
  },
  // 评论商品信息
  getGoods: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/myOrder/myOrderDetails',
          data: {
            myOrderNo: that.data.numbers,
            member_no: res.data.member_no,
            type: 50,//支付成功
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (response) {
            // console.log(response);
            var sum = 0;//总价
            var goodsOrderProduct = response.data.data.goodsOrderProductList;
       
            that.setData({
              goodsOrderProduct: response.data.data.goodsOrderProductList[0],//商品详情
              merchant_no: response.data.data.merchantShop.merchant_no,//商家编号
              token: res.data.token
            })

          }
        })
      },
    })
  },
  // 发布
  submit: function () {
    var value = this.data.textValue
    var type = this.data.type
    var that = this;
    value = common.trim(value);
    if (value == "") {
      wx.showToast({
        title: '评论不得为空',
        icon: 'none'
      })
      return false;
    }
    if (value.length > 300) {
      wx.showToast({
        title: '输入超过300了',
        icon: 'none'
      })
      return false;
    }
    if (value) {
      var oldValue = this.data.oldValue;
      var noteId = this.data.noteId;
      var type = this.data.type;
      var goodsOrderRefuseImageList = [];
      var imgList = that.data.imgList ? that.data.imgList : '';
      var imgList2 = that.data.imgList2 ? that.data.imgList2 : '';
      var imgList3 = that.data.imgList3 ? that.data.imgList3 : '';
      // 判断是否上传图片

      if ((imgList && imgList != '') && (imgList2 && imgList2 != '') && (imgList3 && imgList3 != '')) {

        goodsOrderRefuseImageList.push({ imageUrl: imgList }, { imageUrl: imgList2 }, { imageUrl: imgList3 })
      } else if ((imgList && imgList != '') && (imgList2 && imgList2 != '')) {
        goodsOrderRefuseImageList.push({ imageUrl: imgList }, { imageUrl: imgList2 })
      } else if (imgList && imgList != '') {
        goodsOrderRefuseImageList.push({ imageUrl: imgList })
      }
      if (value == oldValue) {
        wx.showToast({
          title: '请勿提交重复数据！',
          icon: 'none'
        })
        return false;
      }
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          common.ajaxGet(
            '/api/check/context',
            {
              context: value,
              memberNo: res.data.member_no
            },
            function (data) {
              if (data.code == 200) {
                common.ajaxPost('/api/goodsComment/publishComment',
                  {
                    goodsCommentImageList: goodsOrderRefuseImageList,
                    spu_no: that.data.spu_no,
                    sku_no: that.data.sku_no,
                    comment: value,
                    member_no: res.data.member_no,
                    sku_score: that.data.value2,
                    red_score: that.data.value1,
                    discounts_score: that.data.value3,
                    noName: that.data.noName,//1匿名
                    nick_name: res.data.nickName,
                    headUrl: res.data.headUrl,
                    status: that.data.status
                  },
                  function (res) {
                    console.log(res)
                    if (res.code != 200) {
                      wx.showToast({
                        title: '提交失败，请重试！',
                        icon: 'none'
                      })
                    } else if (res.code == 200) {
                      that.setData({
                        oldValue: value
                      })
                      wx.showToast({
                        title: '发表成功',
                        icon: 'success',
                        success: function () {
                          setTimeout(function () {
                            wx.navigateBack({
                              delta: 1
                            })
                          }, 1000)
                        }
                      })
                    }
                  })
              } else {
                wx.showToast({
                  title: data.message,
                  icon: 'none'
                })
              }
            })
          
        }
      })
    } else {
      wx.showToast({
        title: '请先输入内容',
        icon: 'none'
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  // 上传图片
  uploadImg: function () {
    let _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        var tempFilesSize = res.tempFiles[0].size
        console.log(tempFilesSize)
        if (res.tempFiles[0].size <= 1048576) {
          wx.showLoading({
            title: '图片上传中...',
          });
          //图片压缩接口，需要真机才能
          wx.compressImage({
            src: tempFilePaths[0], // 图片路径
            quality: 80, // 压缩质量
            success: function (res) {
              wx.uploadFile({
                url: common.getHeadStr() + '/api/upload/uploadFile',
                filePath: res.tempFilePath,
                name: 'file',
                header: {
                  "token": _this.data.token,
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log(res)
                  var fa = JSON.parse(res.data)
                  if (fa.code == 200) {
                    _this.setData({
                      // headImgUrl: fa.data,
                      imgList: common.getHeadImg() + fa.data,//拼接域名
                    });
                    console.log(common.getHeadImg() + fa.data)
                  }
                },
                complete: function () {
                  wx.hideLoading();
                }
              })

            }
          })

        } else {
          wx.showToast({
            title: '上传图片过大',
            icon: 'none'
          })
        }
      }
    })
  },
  uploadImg2: function () {
    let _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        var tempFilesSize = res.tempFiles[0].size
        console.log(tempFilesSize)
        if (res.tempFiles[0].size <= 1048576) {
          wx.showLoading({
            title: '图片上传中...',
          });
          //图片压缩接口，需要真机才能
          wx.compressImage({
            src: tempFilePaths[0], // 图片路径
            quality: 80, // 压缩质量
            success: function (res) {
              wx.uploadFile({
                url: common.getHeadStr() + '/api/upload/uploadFile',
                filePath: res.tempFilePath,
                name: 'file',
                header: {
                  "token": _this.data.token,
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log(res)
                  var fa = JSON.parse(res.data)
                  if (fa.code == 200) {
                    _this.setData({
                      // headImgUrl: fa.data,
                      imgList2: common.getHeadImg() + fa.data,//拼接域名
                    });
                  }
                },
                complete: function () {
                  wx.hideLoading();
                }
              })

            }
          })

        } else {
          wx.showToast({
            title: '上传图片过大',
            icon: 'none'
          })
        }
      }
    })
  },
  uploadImg3: function () {
    let _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        var tempFilesSize = res.tempFiles[0].size
        console.log(tempFilesSize)
        if (res.tempFiles[0].size <= 1048576) {
          wx.showLoading({
            title: '图片上传中...',
          });
          //图片压缩接口，需要真机才能
          wx.compressImage({
            src: tempFilePaths[0], // 图片路径
            quality: 80, // 压缩质量
            success: function (res) {
              wx.uploadFile({
                url: common.getHeadStr() + '/api/upload/uploadFile',
                filePath: res.tempFilePath,
                name: 'file',
                header: {
                  "token": _this.data.token,
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log(res)
                  var fa = JSON.parse(res.data)
                  if (fa.code == 200) {
                    _this.setData({
                      // headImgUrl: fa.data,
                      imgList3: common.getHeadImg() + fa.data,//拼接域名
                    });
                  }
                },
                complete: function () {
                  wx.hideLoading();
                }
              })

            }
          })

        } else {
          wx.showToast({
            title: '上传图片过大',
            icon: 'none'
          })
        }
      }
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})