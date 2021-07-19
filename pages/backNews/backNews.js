// pages/backNews/backNews.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: ['请选择物流公司'],
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      defese_no: options.defense_no,
      // defese_no:"d02ec39bd9564bafaed61c1ddfdeac38"
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
    this.getReason()//物流选择
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
//物流选择
  getReason: function () {
    var that = this;
    common.ajaxPost(
      '/api/itemAndDetail/getItemDetail', { itemName: '物流公司' },
      function (res) {
        if (res.code == 200) {
          var list = that.data.arr;
          for (var i = 0; i < res.data.length; i++) {
            list.push(res.data[i].item_detail)
          }
          that.setData({
            arr: list
          })
        }
      }
    )
  },
  // 选择物流
  bindPickerChange(e) {
    var arr = this.data.arr;
    console.log(e.detail.value)
    this.setData({
      index: e.detail.value,
    })

  },
//物流单号
  getNumber:function(e){
    this.setData({
      number: e.detail.value
    })
  },
//手机号
  getPhone:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
//备注信息
  getNews:function(e){
    this.setData({
      news: e.detail.value
    })
  },
// 提交
tijiao:function(){
  var that = this;
  var index = that.data.index;
  var number = that.data.number;
  var phone = that.data.phone;
  var news= that.data.news;
  console.log(index,number, phone, news)
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
  if(index==0){
    wx.showToast({
      title: '请选择物流',
      icon:"none"
    })
    return false;
  } 
   if (number == undefined){
    wx.showToast({
      title: '请填写物流单号',
      icon: "none"
    })
     return false;
  } 
   if (phone == undefined) {
    wx.showToast({
      title: '请填写手机号',
      icon: "none"
    })
     return false;
  }
  if (!common.check_phone(phone)) {
    wx.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    return false;
  }
  wx.getStorage({
    key: 'idNum',
    success: function(res) {
      common.ajaxPost(
        '/api/refuse/submitLogistics',
        {
          defese_no: that.data.defese_no,
          logisImageList: goodsOrderRefuseImageList,
          logistics_code: number,
          logistics_name: that.data.arr[index],
          mobile: phone,
          remark: news,
        },
        function(res){
          if(res.code==200){
            wx.showToast({
              title: '提交成功',
            })
          }
        }
      )
    },
  })
 
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