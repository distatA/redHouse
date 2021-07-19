// pages/applyOrderDetail/applyOrderDetail.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    arr: [
      '选择申请原因',
    ],
    index: 0,
    phone: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    //var readNum = (options.price * options.nums + 
    this.setData({
      type: options.type,//1退款（无需退货） 2退货退款
      numbers: options.my_order_no,//订单号
      name: options.name,
      img: options.img,
      price: options.price,
      nums: options.num,
      specification: options.specification,
      sku: options.sku,
      spu: options.spu,
      status: options.status,
      merchantno: options.merchantno,
      image: options.image,
      shopname: options.shopname,
      types: options.types ? options.types : 2,//1房产
      total_money: options.price
    })
  }, //           

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getReason()// 申请原因
    this.getGoods()// 退款商品信息

    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.setData({
          token: res.data.token
        })
      }
    })
  },
  // 退款商品信息
  getGoods: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/myOrder/myOrderDetails',
          data: {
            myOrderNo: that.data.numbers,
            spu_no: that.data.spu,
            member_no: res.data.member_no,
            type: that.data.status,//支付成功
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (response) {
            // console.log(response);
            if (response.data.code == 200) {
              var sum = 0;//总价
              var goodsOrderProduct = response.data.data.goodsOrderProductList;
              for (var i = 0; i < goodsOrderProduct.length; i++) {
                var mm = goodsOrderProduct[i].total_money * goodsOrderProduct[i].num;
                sum += mm;
              }
              that.setData({
                goodsOrderProduct: response.data.data.goodsOrderProductList,//商品详情
                merchant_no: response.data.data.merchantShop.merchant_no,//商家编号
                sum: sum
              })
            }

          }
        })
      },
    })
  },
  // 申请原因
  getReason: function () {
    var that = this;
    if (that.data.types == 1) {
      var itemName = '房产退款理由'
    } else {
      var itemName = '退款理由'
    }

    common.ajaxPost(
      '/api/itemAndDetail/getItemDetail', { itemName: itemName },
      function (res) {
        if (res.code == 200) {

          var list = that.data.arr;
          for (var i = 0; i < res.data.length; i++) {
            list.push(res.data[i].item_detail)

          }
          // console.log(list)
          that.setData({
            arr: list
          })
          // console.log(that.data.arr)
        }
      }
    )
  },
  // 选择原因
  bindPickerChange: function (e) {
    console.log(e)
    this.setData({
      index: e.detail.value
    })
  },
  //提交申请
  tijiao: common.throttle(function () {
    var that = this;
    var value = that.data.textValue
    var phone = that.data.phone;
    var goodsOrderRefuseImageList = [];
    var imgList = that.data.imgList ? that.data.imgList : '';
    var imgList2 = that.data.imgList2 ? that.data.imgList2 : '';
    var imgList3 = that.data.imgList3 ? that.data.imgList3 : '';
    // 判断是否上传图片

    if ((imgList && imgList != '') && (imgList2 && imgList2 != '') && (imgList3 && imgList3 != '')) {

      goodsOrderRefuseImageList.push({ image_url: imgList }, { image_url: imgList2 }, { image_url: imgList3 })
    } else if ((imgList && imgList != '') && (imgList2 && imgList2 != '')) {
      goodsOrderRefuseImageList.push({ image_url: imgList }, { image_url: imgList2 })
    } else if (imgList && imgList != '') {
      goodsOrderRefuseImageList.push({ image_url: imgList })
    }
    else if (imgList || imgList2 || imgList3) {
      goodsOrderRefuseImageList.push({ image_url: (imgList || imgList2 || imgList3) })
    }

    // console.log(goodsOrderRefuseImageList)

    value = common.trim(value);
    if (that.data.index == 0) {
      wx.showToast({
        title: '请选择申请原因',
        icon: 'none'
      })
      return false;
    }
    if (value == "") {
      wx.showToast({
        title: '评论不得为空',
        icon: 'none'
      })
      return false;
    }

    if (value.length > 50) {
      wx.showToast({
        title: '输入超过50了',
        icon: 'none'
      })
      return false;
    }
    if (phone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false;
    }
    // console.log(common.check_phone(phone))
    if (!common.check_phone(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return false;
    }
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        if (that.data.status == 20 || that.data.status == 70) {//仅退款
          common.ajaxPost(
            '/api/refuse/moneyRefuse',
            {
              goodsOrderRefuseImageList: goodsOrderRefuseImageList,
              member_no: res.data.member_no,
              my_order_no: that.data.numbers,
              money: that.data.sum,
              refuse_detail: value,//申请说明
              refuse_reason_id: that.data.index,//申请理由
              refuse_tel: phone,//手机号
              refuse_type: that.data.type,//申请类型
              sku_no: that.data.sku,
              merchant_no: that.data.merchant_no,
              spu_no: that.data.spu,
              merchant_shop_name: that.data.shopname,
              merchant_image: that.data.image
            },
            function (res) {
              if (res.code == 200) {
                wx.navigateTo({
                  url: '/pages/backSubmit/backSubmit?id=' + res.data + '&status=' + that.data.status,
                })

              } else {
                wx.showToast({
                  title: res.message,
                  icon: 'none'
                })
              }
            }
          )
        } else {//退货退款
          common.ajaxPost(
            '/api/refuse/goodsRefund',
            {
              goodsOrderRefuseImageList: goodsOrderRefuseImageList,
              member_no: res.data.member_no,
              my_order_no: that.data.numbers,
              money: that.data.sum,
              refuse_detail: value,//申请说明
              refuse_reason_id: that.data.index,//申请理由
              refuse_tel: phone,//手机号
              refuse_type: that.data.type,//申请类型
              sku_no: that.data.sku,
              merchant_no: that.data.merchant_no,
              spu_no: that.data.spu,
              merchant_shop_name: that.data.shopname,
              merchant_image: that.data.image
            },
            function (res) {
              if (res.code == 200) {
                wx.navigateTo({
                  url: '/pages/backSubmit/backSubmit?id=' + res.data + '&status=' + that.data.status,
                })

              }
            }
          )
        }

      }
    })
  }, 1000),
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
  // 手机号码
  getPhone: function (e) {
    // console.log(e.detail.value)
    this.setData({
      phone: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  // 上传图片
  uploadImg: function () {
    let _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res, '1');
        let tempFilePaths = res.tempFilePaths;
        var tempFilesSize = res.tempFiles[0].size
        console.log(tempFilesSize)
        if (res.tempFiles[0].size <= 1048576) {
          wx.showLoading({
            title: '图片上传中...',
          });
          //图片压缩接口，需要真机才能
          // wx.compressImage({
          //   src: tempFilePaths[0], // 图片路径
          //   quality: 80, // 压缩质量
          //   success: function (res) {
          console.log(tempFilePaths[0], '地址1');
          wx.uploadFile({
            url: common.getHeadStr() + '/api/upload/uploadFile',
            filePath: tempFilePaths[0],
            name: 'file',
            header: {
              "token": _this.data.token,
              "Content-Type": "multipart/form-data",
            },
            success: function (res) {
              var fa = JSON.parse(res.data)
              console.log(fa, '返回数据');

              if (fa.code == 200) {
                _this.setData({
                  imgList: common.getHeadImg() + fa.data,//拼接域名
                });
              }
            },
            complete: function () {
              wx.hideLoading();
            }
          })

          //   }
          // })

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
        console.log(res, '2');

        let tempFilePaths = res.tempFilePaths;
        var tempFilesSize = res.tempFiles[0].size
        console.log(tempFilesSize)
        if (res.tempFiles[0].size <= 1048576) {
          wx.showLoading({
            title: '图片上传中...',
          });
          //图片压缩接口，需要真机才能
          // wx.compressImage({
          //   src: tempFilePaths[0], // 图片路径
          //   quality: 80, // 压缩质量
          //   success: function (res) {
          console.log(tempFilePaths[0], '地址2');

          wx.uploadFile({
            url: common.getHeadStr() + '/api/upload/uploadFile',
            filePath: tempFilePaths[0],
            name: 'file',
            header: {
              "token": _this.data.token,
              "Content-Type": "multipart/form-data",
            },
            success: function (res) {
              var fa = JSON.parse(res.data)
              console.log(fa, '返回数据');
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

          //   }
          // })

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
        console.log(res, '3');
        let tempFilePaths = res.tempFilePaths;
        var tempFilesSize = res.tempFiles[0].size
        console.log(tempFilesSize)
        if (res.tempFiles[0].size <= 1048576) {
          wx.showLoading({
            title: '图片上传中...',
          });
          //图片压缩接口，需要真机才能
          // wx.compressImage({
          //   src: tempFilePaths[0], // 图片路径
          //   quality: 80, // 压缩质量
          //   success: function (res) {
          console.log(tempFilePaths[0], '地址3');
          wx.uploadFile({
            url: common.getHeadStr() + '/api/upload/uploadFile',
            filePath: tempFilePaths[0],
            name: 'file',
            header: {
              "token": _this.data.token,
              "Content-Type": "multipart/form-data",
            },
            success: function (res) {
              var fa = JSON.parse(res.data)
              console.log(fa, '返回数据');
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

          //   }
          // })

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